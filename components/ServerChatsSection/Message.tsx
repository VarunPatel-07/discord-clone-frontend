import React, { useContext } from "react";

import { Context } from "@/context/ContextApi";

import { useDebounce } from "@/hooks/debounceHook";
import { getCookie } from "cookies-next";

import MessageProfile from "./MessageProfile";

interface MessageProps {
  id: string;
  content: string;
  FileURL: string;
  IsEdited: boolean;
  IsDeleted: boolean;
  DeletedBy: string | null;
  Is_Reply: boolean;
  memberId: string;
  channelId: string;
  replyingMessage: string | null;
  replyingToUser_MemberId: string | null;
  replyingMessageMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;
  member: Member;
  channel: Channel;
  replyingToUser: Member;
}

interface Member {
  id: string;
  role: string;
  userId: string;
  serverId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

interface User {
  id: string;
  FullName: string;
  Email: string;
  UserName: string;
  Password: string;
  Is_Online: boolean;
  Is_Email_Verified: boolean;
  Profile_Picture: string;
  createdAt: Date;
  updatedAt: Date;
  ProfileBanner_Img: string;
  ProfileBanner_Color: string;
  ProfileBgColor: string;
  TwoFactorAuth: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: string;
  userId: string;
  serverId: string;
  createdAt: Date;
  updatedAt: Date;
  server: Server;
}

interface Server {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  usersId: string;
  ServerBannerImg: string;
  ServerBannerColor: string;
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
  members: Member[];
}

function Message({
  MessageData,
  scrollingToTheMessage,
  setScrollingToTheMessage,
}: {
  MessageData: MessageProps;
  scrollingToTheMessage: string;
  setScrollingToTheMessage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { DeleteMessageFunction, UserInformation } = useContext(Context) as any;

  const DeleteMessage_With_Debounce = useDebounce(
    async (AuthToken: string, messageId: string) => {
      await DeleteMessageFunction(AuthToken, messageId);
    },
    350
  );
  const DeleteMessage = async (message_id: string) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    DeleteMessage_With_Debounce(AuthToken, message_id);
  };

  return (
    <div className="message w-[100%] rounded  transition-all duration-300">
      <MessageProfile
        Message_Data={MessageData}
        DeleteMessage={DeleteMessage}
        MessageSendBySender={
          MessageData?.member?.user?.id === UserInformation?.id ? true : false
        }
        scrollingToTheMessage={scrollingToTheMessage}
        setScrollingToTheMessage={setScrollingToTheMessage}
      />
    </div>
  );
}

export default Message;
