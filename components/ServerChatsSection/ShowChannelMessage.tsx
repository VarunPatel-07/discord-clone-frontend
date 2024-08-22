import React, { useContext, useEffect, useRef, useState } from "react";

import { Context } from "@/context/ContextApi";

import Message from "./Message";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import UseSocketIO from "@/hooks/UseSocketIO";

import { useDebounce } from "@/hooks/debounceHook";
import { useInView } from "react-intersection-observer";

import ChatDefaultScreen from "./ChatDefaultScreen";
import SpinnerComponent from "../Loader/SpinnerComponent";
function ShowChannelMessage() {
  const BottomDiv = useRef<HTMLDivElement>(null);
  const Pathname = usePathname();
  const socket = UseSocketIO();
  const [Page, setPage] = useState(1);
  const [Limit, setLimit] = useState(10);
  const [Loading, setLoading] = useState(false);

  const [ChannalMessages, setChannalMessages] = useState([] as Array<object>);
  const [Previous_ChannelId, setPrevious_ChannelId] = useState("" as string);
  const { ref, inView } = useInView();
  //
  //
  //
  const {
    CurrentChatChannelInfo,
    FetchTheMessageOFTheChannel,
    AllTheMessageOfTheChannel,
  } = useContext(Context) as any;
  //
  //

  const FetchTheMessagesWithDebounce = useDebounce(
    async (
      AuthToken,
      serverId,
      channel_id,
      Page = 1,
      Limit = 10,
      All_Data_Again: boolean
    ) => {
      const newMessages = await FetchTheMessageOFTheChannel(
        AuthToken,
        serverId,
        channel_id,
        Page,
        Limit
      );

      if (All_Data_Again) {
        setChannalMessages(newMessages);
        setLoading(false);
        return;
      }
      setChannalMessages((prevMessages) => [...prevMessages, ...newMessages]);

      setLoading(false);
    },
    350
  );

  const scrollToBottom = () => {
    BottomDiv.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [CurrentChatChannelInfo]);

  //
  useEffect(() => {
    if (CurrentChatChannelInfo?.ChatId === Previous_ChannelId) return;
    setLoading(true);
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const serverId = Pathname?.split("/")[3];
    const channel_id = CurrentChatChannelInfo?.ChatId;
    const All_Data_Again = true;

    FetchTheMessagesWithDebounce(
      AuthToken,
      serverId,
      channel_id,
      1,
      10,
      All_Data_Again
    );

    setPrevious_ChannelId(CurrentChatChannelInfo?.ChatId as string);
  }, [
    CurrentChatChannelInfo,
    FetchTheMessagesWithDebounce,
    Pathname,
    Previous_ChannelId,
  ]);
  //
  //
  //

  const FetchMoreDataFunction = async () => {
    try {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      const serverId = Pathname?.split("/")[3];
      const channel_id = CurrentChatChannelInfo?.ChatId;

      // Fetch data for the next page
      FetchTheMessagesWithDebounce(
        AuthToken,
        serverId,
        channel_id,
        Page + 1,
        Limit,
        false
      );

      // Increment page number after fetching
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.log(error);
    }
  };

  //
  //
  //
  useEffect(() => {
    if (inView) {
      FetchMoreDataFunction();
    }
  }, [inView]);
  //
  //
  //
  useEffect(() => {
    socket?.on("EmitNewMessageHasBeenSent", async (data) => {
      if (data?.success) {
        if (!AllTheMessageOfTheChannel?.HasMoreData) {
          const message = data?.data;
          setChannalMessages((prevMessages) => [...prevMessages, message]);
          scrollToBottom();
        }
      }
    });
    socket?.on("EmitMessageHasBeenEditedSuccessfully", async (data) => {
      if (data?.response?.success) {
        const updatedMessage = data?.response?.data;

        setChannalMessages((prevMessages) =>
          prevMessages.map((msg: any) =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          )
        );
      }
    });
    return () => {
      socket?.off("EmitNewMessageHasBeenSent");
      socket?.off("EmitMessageHasBeenEditedSuccessfully");
    };
  }, [socket]);
  //
  //
  //
  return (
    <div className="w-[100%] h-[100vh]  relative left-0  pb-[100px]   flex items-center justify-center">
      {Loading ? (
        <div className=" flex items-center justify-center">
          <SpinnerComponent />
        </div>
      ) : (
        <div className="w-[100%] h-[100%] flex flex-col items-start justify-end px-[15px] pt-[30px] pb-[10px] transition-opacity ">
          <ChatDefaultScreen CurrentChatChannelInfo={CurrentChatChannelInfo} />
          <div className="message-fetching transition-all duration-300 w-[100%] ">
            {ChannalMessages?.length > 0 && (
              <span className="w-[100%] h-[1px] bg-[rgba(255,255,255,0.1)] mt-[25px] mb-[30px] block"></span>
            )}

            {ChannalMessages?.length > 0 && (
              <div className="w-[100%] flex flex-col items-start justify-start gap-[8px] transition-all duration-300  ">
                {ChannalMessages?.map((message: any) => {
                  return (
                    <Message
                      key={message?.id}
                      FullName={message?.member?.user?.FullName}
                      Profile_Picture={message?.member?.user?.Profile_Picture}
                      UserName={message?.member?.user?.UserName}
                      message={message?.content}
                      Is_Edited={message?.IsEdited}
                      Time={message?.createdAt}
                      UserId={message?.member?.user?.id}
                      channel_id={message?.channel?.id}
                      message_id={message?.id}
                      AdminId={message?.channel?.userId}
                      Current_Page={Page}
                      Is_Deleted={message?.IsDeleted}
                      Is_Replied={message?.Is_Reply}
                      MessageReplies={message?.ServerGroupMessageReplies}
                    />
                  );
                })}
              </div>
            )}
            {AllTheMessageOfTheChannel?.HasMoreData ? (
              <div ref={ref}>loading...</div>
            ) : (
              ""
            )}
            <div ref={BottomDiv}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowChannelMessage;
