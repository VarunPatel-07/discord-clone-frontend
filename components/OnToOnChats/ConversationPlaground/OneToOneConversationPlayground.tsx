import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { ConversationMessageInterface } from "@/interface/ConversationMessageInterface";
import { SelectedOneToOneChatInterface } from "@/interface/SelectedOneToOneChatInterface";
import { getCookie } from "cookies-next";
import React, { useContext, useEffect, useRef, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import OneToOneMessageProfile from "../OneToOneMessageProfile";
import OneOnOneChatDefaultScreen from "../OneOnOneChatDefaultSereen";
import axios from "axios";
import { EditingMessagePreview, ReplyingMessagePreviewInterface } from "@/interface/HelperInterface";
import UseSocketIO from "@/hooks/UseSocketIO";
import { useInView } from "react-intersection-observer";
import SpinnerComponent from "@/components/Loader/SpinnerComponent";

function OneToOneConversationPlayground({
  selectedOneToOneChatInfo,
  conversationMessagesArray,
  setConversationMessagesArray,
  setEditingMessagePreviewInfoHolderState,
  setReplyingMessagePreviewInfoState,
  setLoading,
  loading,
}: {
  selectedOneToOneChatInfo: SelectedOneToOneChatInterface;
  conversationMessagesArray: Array<ConversationMessageInterface>;
  setConversationMessagesArray: React.Dispatch<React.SetStateAction<Array<ConversationMessageInterface>>>;
  setEditingMessagePreviewInfoHolderState: React.Dispatch<React.SetStateAction<EditingMessagePreview>>;
  setReplyingMessagePreviewInfoState:React.Dispatch<React.SetStateAction<ReplyingMessagePreviewInterface>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const { FetchAllTheMessageOfAnOneToOneConversation } = useContext(Context) as any;
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;

  const [conversationHasMoreData, setConversationHasMoreData] = useState(false);
  const [page, setPage] = useState(1 as number);
  const BottomDiv = useRef<HTMLDivElement>(null);

  const socket = UseSocketIO();

  const fetchTheConversationWithDebounce = useDebounce(async () => {
    const AuthToken = getCookie("User_Authentication_Token");
    const response = await FetchAllTheMessageOfAnOneToOneConversation(
      AuthToken,
      selectedOneToOneChatInfo?.id.trim(),
      page
    );
    setConversationHasMoreData(response.data?.hasMoreData);
    setConversationMessagesArray(response.data.Message);
    setLoading(false);
  }, 350);
  useEffect(() => {
    scrollToBottom();
  }, [selectedOneToOneChatInfo, conversationMessagesArray]);

  const DeleteMessageFromTheDatabase = async (conversation_id: string, message_id: string) => {
    const AuthToken = getCookie("User_Authentication_Token");
    try {
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/OneToOneMessage/deleteSpecificMessage?conversation_id=${conversation_id}&message_id=${message_id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: AuthToken,
        },
      });
      const updatedData = {
        success: response.data.success,
        Data: response?.data?.updatedMessage,
      };
      socket?.emit("oneOnOneMessageUpdated", updatedData);
      const _updatedMessage: ConversationMessageInterface = response?.data?.updatedMessage;
      setConversationMessagesArray((previous) =>
        previous.map((message) => (message?.id === _updatedMessage?.id ? _updatedMessage : message))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedOneToOneChatInfo?.id !== "") {
      setLoading(true);
      fetchTheConversationWithDebounce();
    }
  }, [selectedOneToOneChatInfo]);

  const scrollToBottom = () => {
    BottomDiv.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { ref: topRef, inView: topInView } = useInView({
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  });

  const FetchMoreDataOnScrollWithDebounce = useDebounce(async () => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const response = await FetchAllTheMessageOfAnOneToOneConversation(
      AuthToken,
      selectedOneToOneChatInfo?.id.trim(),
      page + 1
    );
    console.log("fetching more data", response.data?.Message);
    setConversationMessagesArray((previous) => [...previous, ...response.data?.Message]);
    setConversationHasMoreData(response.data?.hasMoreData);
    setPage((pre) => pre + 1);
  }, 350);

  const oneOnOneConversation = conversationMessagesArray?.reduce(
    (_messageGroup: any, message: ConversationMessageInterface) => {
      const date = format(new Date(message?.createdAt), "dd MMM yyyy");
      if (!_messageGroup[date]) {
        _messageGroup[date] = [];
      }
      _messageGroup[date].push(message);
      return _messageGroup;
    },
    {}
  );
  useEffect(() => {
    if (topInView) {
      FetchMoreDataOnScrollWithDebounce();
    }
  }, [topInView]);

  return (
    <div className="w-full h-full pt-14">
      <div className="flex flex-col items-start justify-start px-5 py-5 w-full h-full">
        {conversationHasMoreData ? (
          <div ref={topRef} className="w-[100%] flex items-center justify-center bg-red h-[20px]">
            <SpinnerComponent />
          </div>
        ) : null}
        {conversationHasMoreData ? null : (
          <div className="w-full">
            <OneOnOneChatDefaultScreen OneOnOneChatInfo={selectedOneToOneChatInfo} />
            {conversationMessagesArray.length >= 1 ? (
              <span className="w-[100%] h-[1px] bg-[rgba(255,255,255,0.1)] mt-8 mb-9 block"></span>
            ) : null}
          </div>
        )}
        <div className="flex flex-col-reverse w-full gap-1">
          {Object.entries(oneOnOneConversation)?.map(([date, messages]: [string, any]) => {
            const dateObj = new Date(date);
            let dateLabel = format(dateObj, "dd MMM yyyy");
            if (isToday(dateObj)) {
              dateLabel = "Today";
            } else if (isYesterday(dateObj)) {
              dateLabel = "Yesterday";
            }
            return (
              <div key={date} className="w-full h-full">
                <div className="date-header text-center my-[18px] text-gray-400 max-w-[90%] mx-auto">
                  <span className="w-[100%] flex items-center justify-center gap-[15px]">
                    <span className="block w-[100%] h-[1px] bg-gray-400"></span>
                    <span className="block min-w-fit">{dateLabel}</span>
                    <span className="block w-[100%] h-[1px] bg-gray-400"></span>
                  </span>
                </div>

                <div className="flex flex-col-reverse gap-2">
                  {messages?.map((message: ConversationMessageInterface) => (
                    <OneToOneMessageProfile
                      MessageInfo={message}
                      key={message?.id}
                      DeleteMessageFromTheDatabase={DeleteMessageFromTheDatabase}
                      setEditingMessagePreviewInfoHolderState={setEditingMessagePreviewInfoHolderState}
                      setReplyingMessagePreviewInfoState={setReplyingMessagePreviewInfoState}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div ref={BottomDiv}></div>
      </div>
    </div>
  );
}

export default OneToOneConversationPlayground;
