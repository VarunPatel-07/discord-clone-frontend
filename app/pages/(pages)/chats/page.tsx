"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "@/context/ContextApi";
import ChatsListingOnSideBar from "@/components/OnToOnChats/ChatsListingOnSideBar";
import UserProfile from "@/components/UserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import HumanImage from "@/public/banner.png";
import OneToOneChatFooterBar from "@/components/OnToOnChats/footerbar/oneToOneChatFooterBar";
import OneToOneConversationPlayground from "@/components/OnToOnChats/ConversationPlaground/OneToOneConversationPlayground";
import { ConversationMessageInterface } from "@/interface/ConversationMessageInterface";

function OneToOneChats() {
  const [open, setOpen] = useState(false as boolean);
  const { selectedOneToOneChatInfo, UserInformation } = useContext(Context) as any;
  const [conversationMessagesArray, setConversationMessagesArray] = useState([] as Array<ConversationMessageInterface>);
  return (
    <div className="w-[100%] h-[100%] bg-[#36393F]">
      <div className="flex w-[100%] h-[100%]">
        {/* this the list of all the conversation of the user */}
        <div className="w-[18%] h-[100%] min-w-[200px] bg-[#2a2d31] relative">
          <div className="w-[100%] h-[100%]  flex flex-col items-start justify-start">
            <div className="search-bar  shadow-[0_0px_5px_0_rgba(0,0,0,0.1)] w-[100%] bg-[#000000]  px-[12px] py-[10px] sticky top-0 left-0 border-b-[1px] border-b-[rgba(255,255,255,0.3)]">
              <div className="relative" onClick={() => setOpen((Open) => !Open)}>
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-[14px] h-[14px] text-gray-500 dark:text-gray-400">
                    <path
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      stroke="currentColor"></path>
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
                            selectedOneToOneChatInfo?.SenderId === UserInformation?.id
                              ? selectedOneToOneChatInfo?.Recever?.Profile_Picture
                              : selectedOneToOneChatInfo?.Sender?.Profile_Picture
                          }></AvatarImage>
                        <AvatarFallback className="bg-white text-black global-font-roboto font-medium text-[16px] flex flex-col items-center justify-center">
                          {selectedOneToOneChatInfo?.SenderId === UserInformation?.id
                            ? selectedOneToOneChatInfo?.Recever?.FullName.slice(0, 1)
                            : selectedOneToOneChatInfo?.Sender?.FullName.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="profile-info transition duration-100">
                      <div className="username transition duration-100">
                        <h4 className="text-white font-medium text-[15px]">
                          {selectedOneToOneChatInfo?.SenderId === UserInformation?.id
                            ? selectedOneToOneChatInfo?.Recever?.UserName
                            : selectedOneToOneChatInfo?.Sender?.UserName}
                        </h4>
                      </div>
                      <div className="typing transition duration-100">
                        <p className="text-gray-300 text-[0] capitalize">typing ..</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="message-or-call-rendering-area w-[100%] h-[100%]">
                <OneToOneConversationPlayground
                  selectedOneToOneChatInfo={selectedOneToOneChatInfo}
                  conversationMessagesArray={conversationMessagesArray}
                  setConversationMessagesArray={setConversationMessagesArray}
                />
              </div>
              <OneToOneChatFooterBar
                selectedOneToOneChatInfo={selectedOneToOneChatInfo}
                conversationMessagesArray={conversationMessagesArray}
                setConversationMessagesArray={setConversationMessagesArray}
              />
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
