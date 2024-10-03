import React, { memo, useContext, useEffect, useMemo, useRef, useState } from "react";

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
import { MessageProps } from "@/interface/MessageProps";
import { ImagesGroup } from "@/interface/ImagesGroup";
import FilePreviewStructure from "../FilePreviewStructure";

const ShowChannelMessage = memo(
  ({
    Loading,
    setLoading,
    ChannalMessages,
    setChannalMessages,
    finalSelectedImagesArray,
  }: {
    Loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    ChannalMessages: Array<MessageProps>;
    setChannalMessages: React.Dispatch<React.SetStateAction<Array<MessageProps>>>;
    finalSelectedImagesArray: any;
  }) => {
    const { selectedFinalImagesArray, selectedFilesFinalArray } = useContext(Context) as any;
    const BottomDiv = useRef<HTMLDivElement>(null);
    const MessageContainerRef = useRef<HTMLDivElement>(null);
    const LastMessageOfBatch = useRef<HTMLDivElement>(null);
    const Pathname = usePathname();
    const socket = UseSocketIO();
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);
    const [scrollingToTheMessage, setScrollingToTheMessage] = useState("" as string);

    const [Previous_ChannelId, setPrevious_ChannelId] = useState("" as string);

    const [channelHasMoreData, setChannelHasMoreData] = useState(false as boolean);
    const [isFetchingOlderData, setIsFetchingOlderData] = useState(false as boolean);

    const renderedImageGroups = new Set();

    const { ref: topRef, inView: topInView } = useInView({
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
    //
    //
    //
    const { CurrentChatChannelInfo, FetchTheMessageOFTheChannel, AllTheMessageOfTheChannel, UserInformation } =
      useContext(Context) as any;
    //
    //

    const scrollToBottomOfTheNewBatch = () => {
      if (isFetchingOlderData) {
        if (LastMessageOfBatch.current) {
          LastMessageOfBatch.current.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        scrollToBottom();
      }
    };

    const FetchTheMessagesWithDebounce = useDebounce(async (AuthToken, serverId, channel_id, Page = 1, Limit = 10) => {
      const Messages = await FetchTheMessageOFTheChannel(AuthToken, serverId, channel_id, Page, Limit);
      if (Messages) {
        const newMessages = Messages?.messages;
        if (newMessages) setChannalMessages((prevMessages) => [...prevMessages, ...newMessages]);
        setTimeout(() => {
          scrollToBottomOfTheNewBatch(); // Scroll to the last message of the newly loaded page
        }, 100);
        setChannelHasMoreData(Messages?.hasMoreData);
        setLoading(false);
      } else {
        setIsFetchingOlderData(false);
        setLoading(false);
        setChannelHasMoreData(false);
      }
    }, 500);

    const scrollToBottom = () => {
      BottomDiv.current?.scrollIntoView({ behavior: "smooth" });
    };

    //
    useEffect(() => {
      if (CurrentChatChannelInfo?.ChatId === Previous_ChannelId) {
        setChannalMessages([]);
        setPage(1);
      }
      setIsFetchingOlderData(false);
      setLoading(true);
      const AuthToken = getCookie("User_Authentication_Token") as string;
      const serverId = Pathname?.split("/")[3];
      const channel_id = CurrentChatChannelInfo?.ChatId;
      // const All_Data_Again = true;

      FetchTheMessagesWithDebounce(AuthToken, serverId, channel_id, 1, 10);

      setPrevious_ChannelId(CurrentChatChannelInfo?.ChatId as string);
    }, [CurrentChatChannelInfo, FetchTheMessagesWithDebounce, Pathname, Previous_ChannelId, setLoading]);
    //
    //
    //

    const FetchMoreDataFunction = async () => {
      try {
        setIsFetchingOlderData(true);
        const AuthToken = getCookie("User_Authentication_Token") as string;
        const serverId = Pathname?.split("/")[3];
        const channel_id = CurrentChatChannelInfo?.ChatId;

        // Fetch data for the next page
        FetchTheMessagesWithDebounce(AuthToken, serverId, channel_id, Page + 1, Limit, false);

        // Increment page number after fetching
        setPage((prevPage) => prevPage + 1);
      } catch (error) {
        // console.log(error);
      }
    };

    useEffect(() => {
      if (topInView) {
        FetchMoreDataFunction();
      }
    }, [topInView]);
    useEffect(() => {
      scrollToBottom();
    }, [CurrentChatChannelInfo, selectedFinalImagesArray]);
    //
    //
    //

    //
    //
    //
    useEffect(() => {
      socket?.on("EmitNewMessageHasBeenSent", async (data) => {
        if (data?.success) {
          const message: MessageProps = data?.data;
          // console.log(message);

          if (CurrentChatChannelInfo?.ChatId === message?.channel?.id) {
            // Check if the message already exists

            // Only add the message if it doesn't already exist
            if (ChannalMessages.every((msg) => msg.id !== message.id)) {
              setChannalMessages((prevMessages) => [message, ...prevMessages]);
              scrollToBottom(); // Scroll to bottom after adding the new message
            }
          }
        }
      });

      socket?.on("EmitMessageHasBeenEditedSuccessfully", async (data) => {
        if (data?.response?.success) {
          const updatedMessage = data?.response?.data;

          setChannalMessages((prevMessages) =>
            prevMessages.map((msg: any) => (msg.id === updatedMessage.id ? updatedMessage : msg))
          );
        }
      });

      return () => {
        socket?.off("EmitNewMessageHasBeenSent");
        socket?.off("EmitMessageHasBeenEditedSuccessfully");
      };
    }, [socket, CurrentChatChannelInfo, AllTheMessageOfTheChannel, UserInformation, ChannalMessages]);

    const groupMessage = ChannalMessages?.reduce((_groups: any, message: any) => {
      const date = format(new Date(message?.createdAt), "dd MMM yyyy");
      if (!_groups[date]) {
        _groups[date] = [];
      }
      _groups[date].push(message);
      return _groups;
    }, {});

    return (
      <div className="w-[100%] h-[100%] py-[30px] relative left-0 flex items-center justify-center">
        <div
          className="w-[100%] h-[100%] flex flex-col items-start justify-end px-[25px] pt-[30px] pb-[10px] "
          ref={MessageContainerRef}>
          {!channelHasMoreData ? (
            <>
              <ChatDefaultScreen CurrentChatChannelInfo={CurrentChatChannelInfo} />
            </>
          ) : null}
          {ChannalMessages.length > 0 ? (
            <span className="w-[100%] h-[1px] bg-[rgba(255,255,255,0.1)] mt-[25px] mb-[30px] block"></span>
          ) : null}
          <div className="message-fetching transition-all duration-300 w-[100%] ">
            {channelHasMoreData ? (
              <div ref={topRef} className="w-[100%] flex items-center justify-center bg-red h-[20px]">
                <SpinnerComponent />
              </div>
            ) : null}
            {ChannalMessages?.length > 0 ? (
              <div className="w-[100%] flex flex-col items-start justify-start gap-[8px] transition-all duration-300  ">
                <div className="w-full flex flex-col-reverse items-start justify-start gap-[8px] transition duration-150">
                  {Object.entries(groupMessage)?.map(([date, messages]: [string, any]) => {
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
                        <div className="w-[100%] flex flex-col-reverse gap-[12px]">
                          {messages?.map((message, index) => {
                            const isLastInSequence =
                              index === messages.length - 1 || messages[index + 1]?.memberId !== message.memberId;

                            const isLastMessageOfNewBatch = index === messages.length - 1;

                            return (
                              <div
                                className="w-full"
                                key={message?.id}
                                ref={isLastMessageOfNewBatch ? LastMessageOfBatch : null}>
                                <Message
                                  MessageData={message}
                                  scrollingToTheMessage={scrollingToTheMessage}
                                  setScrollingToTheMessage={setScrollingToTheMessage}
                                  isLastInSequence={isLastInSequence}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
            <div className="w-full flex flex-col gap-[8px] pt-[8px]">
              {selectedFinalImagesArray.map((file, index) => {
                const ImageUrl = URL.createObjectURL(file);
                return (
                  <div
                    key={index}
                    className="w-full min-w-[300px] aspect-square max-w-[250px] ml-auto rounded overflow-hidden relative group p-[5px] bg-gradient-to-r from-emerald-700 to-emerald-800">
                    <picture className="w-full h-full">
                      <source src={ImageUrl} />
                      <img src={ImageUrl} alt="" className="w-full h-full object-cover rounded " loading="lazy" />
                    </picture>
                    <div className="absolute top-0 left-0 w-full h-full bg-black/[0.3] flex flex-col items-center justify-center">
                      <div>
                        <SpinnerComponent />
                      </div>
                    </div>
                  </div>
                );
              })}
              {selectedFilesFinalArray.map((file: File, index) => {
                return <FilePreviewStructure key={index} pdfName={file.name} pdfSize={file.size} />;
              })}
            </div>

            <div ref={BottomDiv}></div>
          </div>
        </div>
      </div>
    );
  }
);

ShowChannelMessage.displayName = "ShowChannelMessage";
export default ShowChannelMessage;
