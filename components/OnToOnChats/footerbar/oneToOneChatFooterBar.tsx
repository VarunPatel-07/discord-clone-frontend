import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Context } from "@/context/ContextApi";
import { NotificationType } from "@/enums/enums";
import { decryptContent } from "@/helper/HelperFunctions";
import { useDebounce } from "@/hooks/debounceHook";
import UseSocketIO from "@/hooks/UseSocketIO";
import { ConversationMessageInterface } from "@/interface/ConversationMessageInterface";
import { EditingMessagePreview, ReplyingMessagePreviewInterface } from "@/interface/HelperInterface";
import { SelectedOneToOneChatInterface } from "@/interface/SelectedOneToOneChatInterface";
import axios from "axios";
import { getCookie } from "cookies-next";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FaCamera } from "react-icons/fa";
import { IoIosCloseCircle, IoMdAdd } from "react-icons/io";

function OneToOneChatFooterBar({
  selectedOneToOneChatInfo,
  conversationMessagesArray,
  setConversationMessagesArray,
  setEditingMessagePreviewInfoHolderState,
  editingMessagePreviewInfoHolderState,
  replyingMessagePreviewInfoState,
  setReplyingMessagePreviewInfoState,
}: {
  selectedOneToOneChatInfo: SelectedOneToOneChatInterface;
  conversationMessagesArray: Array<ConversationMessageInterface>;
  setConversationMessagesArray: React.Dispatch<React.SetStateAction<Array<ConversationMessageInterface>>>;
  setEditingMessagePreviewInfoHolderState: React.Dispatch<React.SetStateAction<EditingMessagePreview>>;
  editingMessagePreviewInfoHolderState: EditingMessagePreview;
  replyingMessagePreviewInfoState: ReplyingMessagePreviewInterface;
  setReplyingMessagePreviewInfoState: React.Dispatch<React.SetStateAction<ReplyingMessagePreviewInterface>>;
}) {
  const { UserInformation, replyingMessageInOneOnOneConversation, GlobalNotificationHandlerFunction } = useContext(
    Context
  ) as any;
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const [messageInputValue, setMessageInputValue] = useState("" as string);
  const [isSending, setIsSending] = useState(false);
  const HandelTheInputValueChange = (e: any) => {
    setMessageInputValue(e.target.value);
  };

  const socket = UseSocketIO();

  const sendMessageInTheSelectedConverSation = async () => {
    const AuthToken = getCookie("User_Authentication_Token");

    try {
      const formData = new FormData();
      formData.append("message", messageInputValue);
      const response = await axios({
        method: "post",
        url: `${Host}/app/api/OneToOneMessage/SendMessageInConversation/${selectedOneToOneChatInfo?.id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: AuthToken,
        },
        data: formData,
      });
      socket?.emit("NewMessageInOneOnOneConversation", response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessageWithDebounce = useDebounce(async () => {
    const _newMessage: {
      success: boolean;
      data: ConversationMessageInterface;
    } = await sendMessageInTheSelectedConverSation();
    if (_newMessage.success) {
      if (conversationMessagesArray.every((message) => message?.id !== _newMessage?.data?.id)) {
        setConversationMessagesArray((previous) => [_newMessage?.data, ...previous]);
      }
      setIsSending(false);
      setMessageInputValue("");
      inputFieldRef.current?.focus();
    } else {
      setIsSending(false);
      setMessageInputValue("");
      inputFieldRef.current?.focus();
    }
  }, 350);

  const ReplyMessageUsingDebounce = useDebounce(async () => {
    try {
      const AuthToken = getCookie("User_Authentication_Token");
      const formData = new FormData();
      formData.append("message", messageInputValue);
      formData.append("replyingMessageContent", replyingMessagePreviewInfoState?.data?.content);
      formData.append("replying_message_message_id", replyingMessagePreviewInfoState?.data?.id);
      formData.append("replyingUserUserID", replyingMessagePreviewInfoState?.data?.Sender?.id);
      const _newMessage: {
        success: boolean;
        data: ConversationMessageInterface;
      } = await replyingMessageInOneOnOneConversation(AuthToken, formData, selectedOneToOneChatInfo?.id);
      if (_newMessage.success) {
        if (conversationMessagesArray.every((message) => message?.id === _newMessage?.data?.id)) {
          setConversationMessagesArray((prev) => [_newMessage.data, ...prev]);
        }
        RemoveIsEditFunction();
        setMessageInputValue("");
        setIsSending(false);
      } else {
        RemoveIsEditFunction();
        setMessageInputValue("");
        setIsSending(false);
      }

      inputFieldRef.current?.focus();
    } catch (error) {
      GlobalNotificationHandlerFunction("", NotificationType.ERROR, "Some Error Occurred Please Try Again Letter");
      setIsSending(false);
    }
  }, 350);

  const handelReplyMessageOnSubmit = (e: any) => {
    e.preventDefault();
    setIsSending(true);
    ReplyMessageUsingDebounce();
  };

  const SubmitTheNewMessage = (e: any) => {
    setIsSending(true);
    e.preventDefault();
    sendMessageWithDebounce();
  };
  const UserInfo = UserInformation || getCookie("User__Info") ? JSON.parse(getCookie("User__Info") as string) : "";

  useEffect(() => {
    inputFieldRef.current?.focus();
  }, [
    selectedOneToOneChatInfo,
    conversationMessagesArray,
    editingMessagePreviewInfoHolderState,
    replyingMessagePreviewInfoState,
  ]);

  const RemoveIsEditFunction = () => {
    setEditingMessagePreviewInfoHolderState({
      isEditing: false,
      data: {} as ConversationMessageInterface,
    });
    setReplyingMessagePreviewInfoState({
      isReplying: false,
      data: {} as ConversationMessageInterface,
    });
  };
  useEffect(() => {
    if (editingMessagePreviewInfoHolderState?.isEditing) {
      inputFieldRef.current?.focus();
      setMessageInputValue(decryptContent(editingMessagePreviewInfoHolderState?.data?.content));
    } else {
      setMessageInputValue("");
    }
  }, [editingMessagePreviewInfoHolderState]);

  const EditMessageFunction = async (conversation_id: string, message_id: string, editedMessage: string) => {
    try {
      const AuthToken = getCookie("User_Authentication_Token");
      const formData = new FormData();
      formData.append("editedMessage", editedMessage);
      const response = await axios({
        method: "put",
        url: `${Host}/app/api/OneToOneMessage/editMessage?conversation_id=${conversation_id}&message_id=${message_id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: AuthToken,
        },
        data: formData,
      });
      socket?.emit("oneOnOneMessageUpdated", response.data);
      return response.data.Data;
    } catch (error) {
      console.log(error);
    }
  };

  const EditMessageOnSubmitWithDebounce = useDebounce(async (conversation_id: string, message_id: string) => {
    const _updatedMessage: ConversationMessageInterface = await EditMessageFunction(
      conversation_id,
      message_id,
      messageInputValue
    );
    setConversationMessagesArray((previous) =>
      previous.map((message) => (message.id === _updatedMessage?.id ? _updatedMessage : message))
    );
    RemoveIsEditFunction();
    setIsSending(false);
  }, 350);
  const EditMessageOnSubmit = (e) => {
    setIsSending(true);
    e.preventDefault();
    EditMessageOnSubmitWithDebounce(selectedOneToOneChatInfo?.id, editingMessagePreviewInfoHolderState?.data?.id);
  };

  useEffect(() => {
    socket?.on("EmitNewMessageInOneOnOneConversation", (socketData) => {
      if (!socketData?.success) return;
      const _newMessage: ConversationMessageInterface = socketData?.data;
      if (conversationMessagesArray.every((message) => message?.id !== _newMessage?.id)) {
        setConversationMessagesArray((prev) => [_newMessage, ...prev]);
      }
    });
    socket?.on("EmitOneOnOneMessageUpdated", (socketData) => {
      if (!socketData?.success) return;
      const _updatedMessage: ConversationMessageInterface = socketData?.Data;
      setConversationMessagesArray((previous) =>
        previous.map((message) => (message.id === _updatedMessage?.id ? _updatedMessage : message))
      );
    });
    return () => {
      socket?.off("EmitNewMessageInOneOnOneConversation");
      socket?.off("EmitOneOnOneMessageUpdated");
    };
  }, [socket]);

  const ReplyingOrEditingCommonComponent = (data: ConversationMessageInterface) => {
    if (data.content || data.ImageURL !== "") {
      return (
        <div className="message-container w-[100%] flex items-center justify-between transition-all duration-300 py-[4px]">
          <div className="flex items-center">
            <div className="profile">
              <Avatar className="w-[40px] h-[40px] ">
                <AvatarImage src={data?.Sender?.Profile_Picture} className="w-[100%] h-[100%]" />
                <AvatarFallback
                  className="capitalize font-medium text-[15px]"
                  style={{
                    backgroundColor: data?.Sender?.ProfileBgColor,
                  }}>
                  {data?.Sender?.FullName?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="content w-[100%] relative">
              <div className="w-[100%]  px-[8px]  rounded-b-[6px] rounded-r-[6px] cursor-pointer  relative z-[1] min-w-[100px]">
                <div className="head   flex items-center justify-start gap-[10px]">
                  <div className="username">
                    <p className="text-white global-font-roboto text-[14px] font-[400]  capitalize ">
                      {data?.Sender?.UserName}
                    </p>
                  </div>
                </div>
                <div className="message">
                  {data.content ? (
                    <p className="text-white global-font-roboto text-[15px] font-[300] line-clamp-2">
                      {data?.IsDeleted ? data?.content : decryptContent(data?.content)}
                    </p>
                  ) : data?.ImageURL !== "" ? (
                    <p className="text-white global-font-roboto text-[15px] font-[300] py-[3px] flex items-center justify-start gap-[5px]">
                      <FaCamera />
                      <span>Photo</span>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-[15px]">
            {data.ImageURL ? (
              <div className="w-[70px] h-[70px]">
                <Image
                  src={data.ImageURL}
                  alt="replying image"
                  width={70}
                  height={70}
                  className="object-cover rounded w-full h-full"></Image>
              </div>
            ) : null}
            <div className="close">
              <button
                className="w-[32px] h-[32px] flex justify-center items-center  rounded-full text-white"
                onClick={RemoveIsEditFunction}>
                <IoIosCloseCircle className="w-[32px] h-[32px]" />
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const getPlaceHolderValue = () => {
    const name =
      selectedOneToOneChatInfo?.Recever?.id === UserInfo?.id
        ? selectedOneToOneChatInfo?.Recever?.FullName
        : selectedOneToOneChatInfo?.Sender?.id === UserInfo?.id
        ? selectedOneToOneChatInfo?.Sender?.FullName
        : "";
    return replyingMessagePreviewInfoState?.isReplying ? "Enter Your Reply Hear ..." : `Type a Message To ${name}`;
  };

  return (
    <div className="input-footer w-full absolute left-0 bottom-0  border-t-[1px] border-t-[#2f2f2f]">
      {editingMessagePreviewInfoHolderState?.isEditing ? (
        <div
          className={`w-full px-[12px] py-[8px]  backdrop-blur-[10px] bg-[rgba(0,0,0,0.45)] border-b-[1px] border-b-[#2f2f2f] transition-all ${
            editingMessagePreviewInfoHolderState?.isEditing ? "visible" : "invisible"
          }`}>
          {ReplyingOrEditingCommonComponent(editingMessagePreviewInfoHolderState?.data)}
        </div>
      ) : null}
      {replyingMessagePreviewInfoState?.isReplying ? (
        <div
          className={`w-full px-[12px] py-[8px]  backdrop-blur-[10px] bg-[rgba(0,0,0,0.45)] border-b-[1px] border-b-[#2f2f2f] transition-all ${
            replyingMessagePreviewInfoState?.isReplying ? "visible" : "invisible"
          }`}>
          {ReplyingOrEditingCommonComponent(replyingMessagePreviewInfoState?.data)}
        </div>
      ) : null}
      <div className="w-[100%] shadow  flex flex-col h px-[12px] pb-[15px] pt-[6px]  backdrop-blur-[10px] bg-[rgba(0,0,0,0.45)] ">
        <div className="w-[100%] h-[100%] py-[5px] bg-[#41464f] px-[12px] rounded-[5px]">
          <div className="w-[100%] flex gap-[5px] ">
            <button className="min-w-[32px] h-[32px] flex justify-center items-center bg-gray-400 rounded-full group">
              <IoMdAdd className="text-[22px] group-hover:rotate-180 transition  duration-150    font-bold text-black" />
            </button>
            <div className="w-[100%]">
              <form
                onSubmit={
                  editingMessagePreviewInfoHolderState?.isEditing
                    ? EditMessageOnSubmit
                    : replyingMessagePreviewInfoState?.isReplying
                    ? handelReplyMessageOnSubmit
                    : SubmitTheNewMessage
                }
                className="w-[100%] h-[100%]">
                <input
                  type="text"
                  className="w-[100%] h-[100%] bg-transparent text-white focus:ring-0 focus:border-0 focus:outline-none global-font-roboto px-[5px] disabled:opacity-50"
                  placeholder={getPlaceHolderValue()}
                  value={messageInputValue}
                  onChange={HandelTheInputValueChange}
                  ref={inputFieldRef}
                  disabled={isSending}
                />
              </form>
            </div>
            <button className="min-w-[32px] h-[32px] flex justify-center items-center rounded-full group">
              <BsEmojiSmileFill className="text-[22px]  transition  duration-150    font-bold text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OneToOneChatFooterBar;
