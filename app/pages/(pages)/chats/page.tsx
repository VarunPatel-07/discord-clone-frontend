"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "@/context/ContextApi";
import ChatsListingOnSideBar from "@/components/OnToOnChats/ChatsListingOnSideBar";
import UserProfile from "@/components/UserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import HumanImage from "@/public/banner.png";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoIosCloseCircle, IoMdAdd } from "react-icons/io";

function OneToOneChats() {
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false as boolean);
  const { selectedOneToOneChatInfo, UserInformation } = useContext(
    Context
  ) as any;

  const [messageInputValue, setMessageInputValue] = useState("" as string);

  const HandelTheInputValueChange = (e: any) => {
    setMessageInputValue(e.target.value);
  };
  const SubmitTheNewMessage = (e: any) => {
    e.preventDefault();
  };
  useEffect(() => {
    inputFieldRef.current?.focus();
  }, [selectedOneToOneChatInfo]);

  return (
    <div className="w-[100%] h-[100%] bg-[#36393F]">
      <div className="flex w-[100%] h-[100%]">
        {/* this the list of all the conversation of the user */}
        <div className="w-[18%] h-[100%] min-w-[200px] bg-[#2a2d31] relative">
          <div className="w-[100%] h-[100%]  flex flex-col items-start justify-start">
            <div className="search-bar  shadow-[0_0px_5px_0_rgba(0,0,0,0.1)] w-[100%] bg-[#000000]  px-[12px] py-[10px] sticky top-0 left-0 border-b-[1px] border-b-[rgba(255,255,255,0.3)]">
              <div
                className="relative"
                onClick={() => setOpen((Open) => !Open)}
              >
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-[14px] h-[14px] text-gray-500 dark:text-gray-400"
                  >
                    <path
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      stroke="currentColor"
                    ></path>
                  </svg>
                </div>
                <input
                  required
                  placeholder="Search"
                  className="block w-full px-4 py-[5px] ps-10  text-gray-900 border border-gray-300 rounded-lg bg-gray-50  outline-none  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 fs-14 h-[25px]"
                  id="default-search"
                  type="search"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="w-[100%] h-[100%]  flex flex-col items-start justify-start pb-[115px]">
              <ChatsListingOnSideBar IsDashboard={false} />
            </div>
            <UserProfile Position="absolute bottom-0 left-0" />
          </div>
        </div>
        <div className="w-[100%] h-[100%]">
          {selectedOneToOneChatInfo.id !== undefined ? (
            <div className="one-to-one-chats-playground  w-[100%] h-[100%] flex  flex-col items-start justify-start relative">
              <div className="chats-navbar w-[100%]">
                <div className="w-[100%]  px-[15px] py-[10px]  bg-[#41464f] shadow-[0_0px_5px_0_rgba(0,0,0,0.1)] ">
                  <div className="profile h-[100%] w-[100%] flex items-center justify-start gap-[10px]">
                    <div className="profile-picture">
                      <Avatar className="w-[40px] h-[40px]">
                        <AvatarImage
                          src={
                            selectedOneToOneChatInfo?.SenderId ===
                            UserInformation?.id
                              ? selectedOneToOneChatInfo?.Recever
                                  ?.Profile_Picture
                              : selectedOneToOneChatInfo?.Sender
                                  ?.Profile_Picture
                          }
                        ></AvatarImage>
                        <AvatarFallback className="bg-white text-black global-font-roboto font-medium text-[16px] flex flex-col items-center justify-center">
                          {selectedOneToOneChatInfo?.SenderId ===
                          UserInformation?.id
                            ? selectedOneToOneChatInfo?.Recever?.FullName.slice(
                                0,
                                1
                              )
                            : selectedOneToOneChatInfo?.Sender?.FullName.slice(
                                0,
                                1
                              )}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="profile-info transition duration-100">
                      <div className="username transition duration-100">
                        <h4 className="text-white font-medium text-[15px]">
                          {selectedOneToOneChatInfo?.SenderId ===
                          UserInformation?.id
                            ? selectedOneToOneChatInfo?.Recever?.UserName
                            : selectedOneToOneChatInfo?.Sender?.UserName}
                        </h4>
                      </div>
                      <div className="typing transition duration-100">
                        <p className="text-gray-300 text-[0] capitalize">
                          typing ..
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="message-or-call-rendering-area w-[100%] h-[100%]"></div>
              <div className="input-footer w-[100%]">
                <div className="w-[100%] shadow  border-t-[1px] border-t-[#2f2f2f] flex flex-col h px-[12px] pb-[15px] pt-[6px]  backdrop-blur-[10px] bg-[rgba(0,0,0,0.45)] ">
                  {/* {(editingAMessage.Is_Editing ||
      replyingASpecificMessage?.Is_Replying) && (
      <div className="message-container w-[100%] flex items-center justify-between transition-all duration-300">
        <div className="flex items-start">
          <div className="profile">
            <Avatar className="w-[40px] h-[40px] ">
              <AvatarImage
                src={
                  editingAMessage.Is_Editing
                    ? editingAMessage?.Profile_Picture
                    : replyingASpecificMessage?.Profile_Picture
                }
                className="w-[100%] h-[100%]"
              />
              <AvatarFallback className="capitalize font-medium text-[15px]">
                {editingAMessage.Is_Editing
                  ? editingAMessage?.FullName?.split("")[0]
                  : replyingASpecificMessage?.FullName?.split(
                      ""
                    )[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="content w-[100%] relative  pt-[5px]">
            <div className="w-[100%]  px-[8px]  rounded-b-[6px] rounded-r-[6px] cursor-pointer  relative z-[1] min-w-[100px]">
              <div className="head   flex items-center justify-start gap-[10px]">
                <div className="username">
                  <p className="text-white global-font-roboto text-[14px] font-[400]  capitalize ">
                    {editingAMessage.Is_Editing
                      ? editingAMessage?.UserId ===
                        UserInformation?.id
                        ? "You"
                        : editingAMessage?.UserName
                      : replyingASpecificMessage?.UserId ===
                        UserInformation?.id
                      ? "You"
                      : replyingASpecificMessage?.UserName}
                  </p>
                </div>
              </div>
              <div className="message">
                <p className="text-white global-font-roboto text-[15px] font-[300] py-[3px]">
                  {editingAMessage.Is_Editing
                    ? editingAMessage?.Message
                    : replyingASpecificMessage?.Message}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="close">
          <button
            className="w-[32px] h-[32px] flex justify-center items-center  rounded-full text-white"
            // onClick={remove_editingAMessage_StateInfo}
          >
            <IoIosCloseCircle className="w-[32px] h-[32px]" />
          </button>
        </div>
      </div>
    )} */}
                  <div className="w-[100%] h-[100%] py-[5px] bg-[#41464f] px-[12px] rounded-[5px]">
                    <div className="w-[100%] flex gap-[5px] ">
                      <button className="min-w-[32px] h-[32px] flex justify-center items-center bg-gray-400 rounded-full group">
                        <IoMdAdd className="text-[22px] group-hover:rotate-180 transition  duration-150    font-bold text-black" />
                      </button>
                      <div className="w-[100%]">
                        <form
                          onSubmit={SubmitTheNewMessage}
                          className="w-[100%] h-[100%]"
                        >
                          <input
                            type="text"
                            className="w-[100%] h-[100%] bg-transparent text-white focus:ring-0 focus:border-0 focus:outline-none global-font-roboto px-[5px] disabled:opacity-50"
                            placeholder={`Type a message...`}
                            // value={Message === "" ? "" : Message}
                            onChange={HandelTheInputValueChange}
                            // disabled={}
                            ref={inputFieldRef}
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
            </div>
          ) : (
            <div className="w-[100%] h-[100%] flex flex-col items-center justify-between py-[30px]">
              <div className="flex flex-col items-center justify-center h-[100%]">
                <div className="image">
                  <Image src={HumanImage} alt="HumanImage" loading="lazy" />
                </div>
                <p className="text-white capitalize global-font-roboto text-[18px]">
                  select a chat to start a conversation
                </p>
              </div>
              <div className="bottom-text">
                <p className="text-gray-400 capitalize global-font-roboto text-[16px]">
                  all the message are end to end encrypted.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OneToOneChats;
