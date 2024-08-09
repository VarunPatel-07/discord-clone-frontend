import React, { useContext, useEffect, useRef, useState } from "react";

import { Context } from "@/context/ContextApi";

import Message from "./Message";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import UseSocketIO from "@/hooks/UseSocketIO";

import { useDebounce } from "@/hooks/debounceHook";
import { useInView } from "react-intersection-observer";

import ChatDefaultScreen from "./ChatDefaultScreen";
function ShowChannelMessage() {
  const BottomDiv = useRef<HTMLDivElement>(null);
  const Pathname = usePathname();
  const socket = UseSocketIO();
  const [Page, setPage] = useState(1);
  const [Limit, setLimit] = useState(10);

  const [ChannalMessages, setChannalMessages] = useState([] as Array<object>);
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
    async (AuthToken, serverId, channel_id, Page = 1, Limit = 10) => {
      console.log("fetching messages");
      const newMessages = await FetchTheMessageOFTheChannel(
        AuthToken,
        serverId,
        channel_id,
        Page,
        Limit
      );

      setChannalMessages((prevMessages) => [...prevMessages, ...newMessages]);
    },
    150
  );

  const scrollToBottom = () => {
    BottomDiv.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [CurrentChatChannelInfo]);

  //
  useEffect(() => {
    console.log(ChannalMessages.length);
    if (ChannalMessages.length <= 0) {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      const serverId = Pathname?.split("/")[3];
      const channel_id = CurrentChatChannelInfo?.ChatId;

      FetchTheMessagesWithDebounce(AuthToken, serverId, channel_id);
    }
  }, [CurrentChatChannelInfo]);
  //
  //
  //

  const FetchMoreDataFunction = async () => {
    console.log("fetching more data");
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
        Limit
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
        const AuthToken = getCookie("User_Authentication_Token") as string;
        const serverId = data?.response?.data?.channel?.serverId;
        const channel_id = data?.response?.data?.channel?.id;
        const current_page = Page;
        console.log("fetching updated messages");
        const newMessages = await FetchTheMessageOFTheChannel(
          AuthToken,
          serverId,
          channel_id,
          current_page,
          Limit
        );

        setChannalMessages(newMessages);
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
    <div className="w-[100%] min-h-[100%] h-[100%] relative transition-all duration-300  overflow-auto">
      <div className="w-[100%] h-[100%] flex flex-col items-start justify-end px-[15px] pt-[30px] pb-[10px] transition-all duration-300">
        <ChatDefaultScreen CurrentChatChannelInfo={CurrentChatChannelInfo} />
        <div className="message-fetching transition-all duration-300 w-[100%] ">
          {ChannalMessages.length > 0 && (
            <span className="w-[100%] h-[1px] bg-[rgba(255,255,255,0.1)] mt-[25px] mb-[30px] block"></span>
          )}

          {ChannalMessages.length > 0 && (
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
    </div>
  );
}

export default ShowChannelMessage;
