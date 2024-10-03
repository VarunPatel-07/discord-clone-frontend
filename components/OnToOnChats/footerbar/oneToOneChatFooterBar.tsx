import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { ConversationMessageInterface } from "@/interface/ConversationMessageInterface";
import { SelectedOneToOneChatInterface } from "@/interface/SelectedOneToOneChatInterface";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";

function OneToOneChatFooterBar({
  selectedOneToOneChatInfo,
  conversationMessagesArray,
  setConversationMessagesArray,
}: {
  selectedOneToOneChatInfo: SelectedOneToOneChatInterface;
  conversationMessagesArray: Array<ConversationMessageInterface>;
  setConversationMessagesArray: React.Dispatch<React.SetStateAction<Array<ConversationMessageInterface>>>;
}) {
  const { UserInformation } = useContext(Context) as any;
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const [messageInputValue, setMessageInputValue] = useState("" as string);
  const [isSending, setIsSending] = useState(false);
  const HandelTheInputValueChange = (e: any) => {
    setMessageInputValue(e.target.value);
  };
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
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const sendMessageWithDebounce = useDebounce(() => {
    sendMessageInTheSelectedConverSation();
    setIsSending(false);
    setMessageInputValue("");
  }, 350);
  const SubmitTheNewMessage = (e: any) => {
    setIsSending(true);
    e.preventDefault();
    sendMessageWithDebounce();
  };
  const UserInfo = UserInformation || getCookie("User__Info") ? JSON.parse(getCookie("User__Info") as string) : "";
  useEffect(() => {
    inputFieldRef.current?.focus();
  }, [selectedOneToOneChatInfo]);
  return (
    <div className="input-footer w-[100%]">
      <div className="w-[100%] shadow  border-t-[1px] border-t-[#2f2f2f] flex flex-col h px-[12px] pb-[15px] pt-[6px]  backdrop-blur-[10px] bg-[rgba(0,0,0,0.45)] ">
        <div className="w-[100%] h-[100%] py-[5px] bg-[#41464f] px-[12px] rounded-[5px]">
          <div className="w-[100%] flex gap-[5px] ">
            <button className="min-w-[32px] h-[32px] flex justify-center items-center bg-gray-400 rounded-full group">
              <IoMdAdd className="text-[22px] group-hover:rotate-180 transition  duration-150    font-bold text-black" />
            </button>
            <div className="w-[100%]">
              <form onSubmit={SubmitTheNewMessage} className="w-[100%] h-[100%]">
                <input
                  type="text"
                  className="w-[100%] h-[100%] bg-transparent text-white focus:ring-0 focus:border-0 focus:outline-none global-font-roboto px-[5px] disabled:opacity-50"
                  placeholder={`Type a Message To ${
                    selectedOneToOneChatInfo?.Recever?.id === UserInfo?.id
                      ? selectedOneToOneChatInfo?.Recever?.FullName
                      : selectedOneToOneChatInfo?.Sender?.id === UserInfo?.id
                      ? selectedOneToOneChatInfo?.Sender?.FullName
                      : ""
                  }`}
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
