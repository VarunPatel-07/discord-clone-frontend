import React, { memo, useContext, useEffect, useRef, useState } from "react";

import { Context } from "@/context/ContextApi";

import Message from "./Message";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import UseSocketIO from "@/hooks/UseSocketIO";

import { useDebounce } from "@/hooks/debounceHook";
import { useInView } from "react-intersection-observer";

import ChatDefaultScreen from "./ChatDefaultScreen";
import SpinnerComponent from "../Loader/SpinnerComponent";
import { format, isToday, isYesterday } from "date-fns";

const ShowChannelMessage = memo(
  ({
    Loading,
    setLoading,
  }: {
    Loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const BottomDiv = useRef<HTMLDivElement>(null);
    const Pathname = usePathname();
    const socket = UseSocketIO();
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);

    const [Previous_ChannelId, setPrevious_ChannelId] = useState("" as string);
    const [ChannalMessages, setChannalMessages] = useState([] as Array<object>);

    const { ref, inView } = useInView();
    //
    //
    //
    const {
      CurrentChatChannelInfo,
      FetchTheMessageOFTheChannel,
      AllTheMessageOfTheChannel,
      UserInformation,
    } = useContext(Context) as any;
    //
    //

    const FetchTheMessagesWithDebounce = useDebounce(
      async (AuthToken, serverId, channel_id, Page = 1, Limit = 10) => {
        const newMessages = await FetchTheMessageOFTheChannel(
          AuthToken,
          serverId,
          channel_id,
          Page,
          Limit
        );
        if (newMessages)
          setChannalMessages((prevMessages) => [
            ...prevMessages,
            ...newMessages,
          ]);

        setLoading(false);
      },
      500
    );

    const scrollToBottom = () => {
      BottomDiv.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [ChannalMessages]);

    //
    useEffect(() => {
      if (CurrentChatChannelInfo?.ChatId === Previous_ChannelId) {
        setChannalMessages([]);
        setPage(1);
      }
      setLoading(true);
      const AuthToken = getCookie("User_Authentication_Token") as string;
      const serverId = Pathname?.split("/")[3];
      const channel_id = CurrentChatChannelInfo?.ChatId;
      // const All_Data_Again = true;

      FetchTheMessagesWithDebounce(AuthToken, serverId, channel_id, 1, 10);

      setPrevious_ChannelId(CurrentChatChannelInfo?.ChatId as string);
    }, [
      CurrentChatChannelInfo,
      FetchTheMessagesWithDebounce,
      Pathname,
      Previous_ChannelId,
      setLoading,
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
            if (CurrentChatChannelInfo?.ChatId === message?.channel?.id) {
              setChannalMessages((prevMessages) => [...prevMessages, message]);
              scrollToBottom();
            }
          }
        }
      });
      socket?.on("EmitMessageHasBeenEditedSuccessfully", async (data) => {
        console.log("Data from socket", data);
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
    }, [
      socket,
      CurrentChatChannelInfo,
      AllTheMessageOfTheChannel,
      UserInformation,
    ]);

    const groupMessage = ChannalMessages?.reduce(
      (_groups: any, message: any) => {
        const date = format(new Date(message?.createdAt), "dd MMM yyyy");
        if (!_groups[date]) {
          _groups[date] = [];
        }
        _groups[date].push(message);
        return _groups;
      },
      {}
    );
    return (
      <div className="w-[100%] h-[100%] py-[30px] relative left-0     flex items-center justify-center">
        <div className="w-[100%] h-[100%] flex flex-col items-start justify-end px-[15px] pt-[30px] pb-[10px] transition-opacity ">
          <ChatDefaultScreen CurrentChatChannelInfo={CurrentChatChannelInfo} />
          <div className="message-fetching transition-all duration-300 w-[100%] ">
            {ChannalMessages?.length > 0 ? (
              <span className="w-[100%] h-[1px] bg-[rgba(255,255,255,0.1)] mt-[25px] mb-[30px] block"></span>
            ) : null}

            {ChannalMessages?.length > 0 ? (
              <div className="w-[100%] flex flex-col items-start justify-start gap-[8px] transition-all duration-300  ">
                {Object.entries(groupMessage)?.map(
                  ([date, messages]: [string, any]) => {
                    const dateObj = new Date(date);
                    let dateLabel = format(dateObj, "dd MMM yyyy");
                    if (isToday(dateObj)) {
                      dateLabel = "Today";
                    } else if (isYesterday(dateObj)) {
                      dateLabel = "Yesterday";
                    }
                    return (
                      <div key={date} className="w-[100%]">
                        <div className="date-header text-center my-[18px] text-gray-400 max-w-[90%] mx-auto">
                          <span className="w-[100%] flex items-center justify-center gap-[15px]">
                            <span className="block w-[100%] h-[1px] bg-gray-400"></span>
                            <span className="block min-w-fit">{dateLabel}</span>
                            <span className="block w-[100%] h-[1px] bg-gray-400"></span>
                          </span>
                        </div>
                        <div className="w-[100%] flex flex-col gap-[8px]">
                          {messages?.map((message) => {
                            console.log("Message", message);
                            return (
                              <Message
                                key={message?.id}
                                MessageData={message}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ) : null}
            {AllTheMessageOfTheChannel?.HasMoreData ? (
              <div
                ref={ref}
                className="w-[100%] flex items-center justify-center"
              >
                <SpinnerComponent />
              </div>
            ) : (
              ""
            )}
            <div ref={BottomDiv}></div>
          </div>
        </div>
      </div>
    );
  }
);

ShowChannelMessage.displayName = "ShowChannelMessage";
export default ShowChannelMessage;
