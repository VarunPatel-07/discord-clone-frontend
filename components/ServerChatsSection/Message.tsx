import React, { useContext } from "react";

import { Context } from "@/context/ContextApi";

import { useDebounce } from "@/hooks/debounceHook";
import { getCookie } from "cookies-next";

import MessageProfile from "./MessageProfile";
import { format, isToday, isYesterday } from "date-fns";

interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  isOnline: boolean;
  password: string;
  profilePicture: string;
  profileBannerImg: string;
  profileBannerColor: string;
  profileBgColor: string;
  twoFactorAuth: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Channel {
  id: string;
  name: string;
  type: "TEXT" | "VOICE" | "ANNOUNCEMENT";
  userId: string;
  serverId: string;
  createdAt: string;
  updatedAt: string;
}

interface Member {
  id: string;
  role: "ADMIN" | "MODERATOR" | "USER";
  userId: string;
  serverId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface MessageProps {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isEdited: boolean;
  isReply: boolean;
  replyingMessageId: string | null;
  replyingToUserMemberId: string | null;
  channelId: string;
  channel: Channel;
  memberId: string;
  member: Member;
  fileURL?: string;
  deletedBy: string;
}

function Message({ MessageData }: { MessageData: MessageProps }) {
  const { DeleteMessageFunction } = useContext(Context) as any;

  const DeleteMessage_With_Debounce = useDebounce(
    async (AuthToken: string, messageId: string, CurrentPage: number) => {
      await DeleteMessageFunction(AuthToken, messageId, CurrentPage);
    },
    350
  );
  const DeleteMessage = async (message_id: string, current_page: number) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    DeleteMessage_With_Debounce(AuthToken, message_id, current_page);
  };

  if (MessageData?.isReply) {
    return (
      <div className="message w-[100%]   rounded  transition-all duration-300">
        <div className="w-[100%]  flex items-start justify-between">
          <div className="w-[100%] flex flex-col items-start justify-start gap-[8px]">
            {/* this container which contain the value of the  message which is being replied */}

            <div className="  rounded group transition-all duration-300 w-[100%]">
              <MessageProfile
                AdminId={AdminId}
                Is_Deleted={Is_Deleted}
                Current_Page={Current_Page}
                FullName={FullName}
                Profile_Picture={Profile_Picture}
                UserName={UserName}
                message={message}
                Is_Edited={Is_Edited}
                Time={Time}
                UserId={UserId}
                message_id={message_id}
                channel_id={channel_id}
                DeleteMessage={DeleteMessage}
                Is_Replied={false}
                ProfileBanner_Color={ProfileBanner_Color}
                ProfileBgColor={ProfileBgColor}
                Other_ClassName={
                  "bg-[#2a2d31] hover:bg-[rgba(0,0,0,0.3)] px-[10px] py-[5px] relative   replied-message-container rounded"
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="message w-[100%] hover:bg-[rgba(0,0,0,0.3)] px-[10px] py-[5px] rounded group transition-all duration-300">
        <MessageProfile
          AdminId={AdminId}
          Is_Deleted={Is_Deleted}
          Current_Page={Current_Page}
          FullName={FullName}
          Profile_Picture={Profile_Picture}
          UserName={UserName}
          message={message}
          Is_Edited={Is_Edited}
          Time={Time}
          UserId={UserId}
          message_id={message_id}
          channel_id={channel_id}
          DeleteMessage={DeleteMessage}
          Is_Replied={Is_Replied}
          ProfileBanner_Color={ProfileBanner_Color}
          ProfileBgColor={ProfileBgColor}
        />
      </div>
    );
  }
}

export default Message;
