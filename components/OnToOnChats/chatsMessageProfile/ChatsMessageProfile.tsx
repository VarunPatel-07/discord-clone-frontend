import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Context } from "@/context/ContextApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

interface ChatsMessageProfile {
  id: string;
  SenderId: string;
  Sender: {
    id: string;
    FullName: string;
    UserName: string;
    Profile_Picture: string;
    ProfileBanner_Img: string;
    ProfileBanner_Color: string;
    ProfileBgColor: string;
  };
  ReceiverId: string;
  Recever: {
    id: string;
    FullName: string;
    UserName: string;
    Profile_Picture: string;
    ProfileBanner_Img: string;
    ProfileBanner_Color: string;
    ProfileBgColor: string;
  };
  LatestMessage: string;
}

function ChatsMessageProfile({
  ConversationsInfo,
  IsDashboard,
  User_Info,
}: {
  ConversationsInfo: ChatsMessageProfile;
  IsDashboard: boolean;
  User_Info: any;
}) {
  const { push } = useRouter();
  const { setSelectedOneToOneChatInfo } = useContext(Context) as any;
  const HandelTheStateChangeByClick = (Conversations: ChatsMessageProfile) => {
    setSelectedOneToOneChatInfo(Conversations);
  };

  const ReturnComanCode = () => {
    return (
      <div className="w-[100%] flex items-center justify-start gap-[8px]">
        <div className="profile">
          <Avatar className="w-[40px] h-[40px] flex items-center justify-center">
            <AvatarImage
              src={
                ConversationsInfo?.SenderId === User_Info?.id
                  ? ConversationsInfo.Recever.Profile_Picture
                  : ConversationsInfo.Sender.Profile_Picture
              }
            ></AvatarImage>
            <AvatarFallback
              style={{
                backgroundColor:
                  ConversationsInfo.SenderId === User_Info.id
                    ? ConversationsInfo.Recever.ProfileBgColor
                    : ConversationsInfo.Sender.ProfileBgColor,
              }}
            >
              {ConversationsInfo.SenderId === User_Info.id
                ? ConversationsInfo.Recever.FullName.slice(0, 1)
                : ConversationsInfo.Sender.FullName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="other-info">
          <div className="">
            <div className="username">
              <h4 className="text-white text-[15px] global-font-roboto font-medium">
                {ConversationsInfo.SenderId === User_Info.id
                  ? ConversationsInfo.Recever.UserName
                  : ConversationsInfo.Sender.UserName}
              </h4>
            </div>
            <div className="latestmessage">
              <p className="text-[rgba(255,255,255,0.7)] text-[13px] global-font-roboto font-light text-nowrap  text-ellipsis overflow-hidden max-w-[185px]">
                {ConversationsInfo.LatestMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {IsDashboard ? (
        <Link
          onClick={() => HandelTheStateChangeByClick(ConversationsInfo)}
          href={`/pages/chats`}
          className="chat-message-profile w-[100%] px-[12px] py-[8px]  border-y-[1px] border-y-[rgba(255,255,255,0.3)] first:border-t-[0px]  first:border-b-[1px] first:border-b-[rgba(255,255,255,0.3)]  overflow-hidden  cursor-pointer hover:bg-[rgba(255,255,255,0.2)] duration-75 block"
        >
          <ReturnComanCode />
        </Link>
      ) : (
        <div
          onClick={() => HandelTheStateChangeByClick(ConversationsInfo)}
          className="chat-message-profile w-[100%] px-[12px] py-[8px]  border-y-[1px] border-y-[rgba(255,255,255,0.3)] first:border-t-[0px]  first:border-b-[1px] first:border-b-[rgba(255,255,255,0.3)]  overflow-hidden  cursor-pointer hover:bg-[rgba(255,255,255,0.2)] duration-75 block"
        >
          <ReturnComanCode />
        </div>
      )}
    </>
  );
}

export default ChatsMessageProfile;
