import React, { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PiArrowBendRightUpBold, PiArrowBendUpRightBold } from "react-icons/pi";
import bubbleTip from "../../public/Bubble-tip.svg";
import Image from "next/image";
import { Context } from "@/context/ContextApi";
import { Edit } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { useDebounce } from "@/hooks/debounceHook";
import { getCookie } from "cookies-next";
import { FaReply } from "react-icons/fa";
import { BiReply } from "react-icons/bi";
import MessageProfile from "./MessageProfile";
import { setServers } from "dns";

function Message({
  Profile_Picture,
  FullName,
  UserName,
  message,
  Is_Edited,
  Time,
  UserId,
  message_id,
  channel_id,
  Current_Page,
  AdminId,
  Is_Deleted,
  Is_Replied,
  MessageReplies,
  ProfileBanner_Color,
  ProfileBgColor,
}: {
  Profile_Picture: string;
  FullName: string;
  UserName: string;
  message: string;
  Is_Edited: boolean;
  Time: string;
  UserId: string;
  message_id: string;
  channel_id: string;
  Current_Page: number;
  AdminId: string;
  Is_Deleted: boolean;
  Is_Replied: boolean;
  MessageReplies: any;
  ProfileBanner_Color: string;
  ProfileBgColor: string;
}) {
  const {
    UserInformation,
    DeleteMessageFunction,
    setEdit_Message_State,
    setReply_A_Specific_Message_State,
  } = useContext(Context) as any;

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

  if (Is_Replied) {
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
            {/* this is the the replies message */}
            <div className="w-[100%] flex flex-col gap-[5px] items-start justify-start">
              {MessageReplies?.map((reply: any) => {
                return (
                  <div
                    className="w-[100%] flex items-start justify-between gap-[0px] "
                    key={reply.id}
                  >
                    <span className="w-[50px] h-[40px] flex items-start justify-center border-[1.5px] border-l-[rgba(255,255,255,0.5)] border-t-0 border-b-[rgba(255,255,255,0.5)] border-r-0 mt-[-15px] ml-[30px] rounded-bl"></span>
                    <div className="hover:bg-[rgba(0,0,0,0.3)] px-[10px] py-[5px] rounded group transition-all duration-300 w-[100%]">
                      <MessageProfile
                        AdminId={AdminId}
                        Is_Deleted={reply?.Is_Deleted}
                        Current_Page={Current_Page}
                        FullName={reply?.FullName}
                        Profile_Picture={reply?.Profile_Picture}
                        ProfileBanner_Color={reply?.ProfileBanner_Color}
                        ProfileBgColor={reply?.ProfileBgColor}
                        UserName={reply?.UserName}
                        message={reply?.Message}
                        Is_Edited={reply?.Is_Edited}
                        Time={Time}
                        UserId={reply?.UserId}
                        message_id={reply?.MessageId}
                        channel_id={reply?.ChannelId}
                        DeleteMessage={DeleteMessage}
                        Is_Replied={true}
                        replayMessage_Id_To_Delete={reply.id}
                        ReplyingUser_UserName={reply?.ReplyingUser_UserName}
                        Editing_Replay={true}
                      />
                    </div>
                  </div>
                );
              })}
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
