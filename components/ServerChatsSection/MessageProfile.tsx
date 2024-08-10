import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Edit } from "lucide-react";
import React from "react";
import { MdDelete } from "react-icons/md";

function MessageProfile({
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
}) {
  const {
    UserInformation,
    DeleteMessageFunction,
    setEdit_Message_State,
    setReply_A_Specific_Message_State,
  } = useContext(Context) as any;

  return (
    <div className="w-[100%] flex items-start justify-between">
      <div className="message-container w-[100%] flex items-start">
        <div className="profile">
          <Avatar className="w-[40px] h-[40px] ">
            <AvatarImage src={Profile_Picture} className="w-[100%] h-[100%]" />
            <AvatarFallback className="capitalize font-medium text-[15px]">
              {FullName.split("")[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="content w-[100%] relative  pt-[5px]">
          <div className="w-[100%]  px-[8px]  rounded-b-[6px] rounded-r-[6px] cursor-pointer  relative z-[1] min-w-[100px]">
            <div className="head   flex items-center justify-start gap-[10px]">
              <div className="username">
                <p className="text-white global-font-roboto text-[14px] font-[400]  capitalize ">
                  {UserId === UserInformation?.id ? "You" : UserName}
                </p>
              </div>
              <div className="time flex items-center gap-[5px]">
                <p className="text-gray-400 text-[11px] global-font-roboto">
                  {GetLocalTimeFrom_UTC(Time)}
                </p>
                {Is_Edited && !Is_Deleted ? (
                  <p className="text-rose-400 text-[12px] global-font-roboto capitalize">
                    (edited)
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="message">
              <p
                className={`${
                  Is_Deleted ? "text-gray-400 italic" : "text-white"
                } global-font-roboto text-[15px] font-[300] py-[3px]`}
              >
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="crude-operation flex items-center gap-[10px]">
        {UserId === UserInformation?.id && !Is_Deleted ? (
          <>
            <button
              className="w-[18px] h-[18px] invisible text-[rgb(255,255,255,0.9)]  group-hover:visible"
              data-tooltip-id="Edit-Chat-icon-tooltip"
              data-tooltip-content="Edit Message"
              onClick={() => {
                setEdit_Message_State({
                  Is_Editing: true as boolean,
                  MessageId: message_id as string,
                  Message: message as string,
                  ChannelId: channel_id as string,
                  UserId: UserId as string,
                  UserName: UserName as string,
                  FullName: FullName as string,
                  Profile_Picture: Profile_Picture as string,
                  current_page: Current_Page as number,
                });
              }}
            >
              <Edit className="w-[18px] h-[18px]" />
            </button>
            <button
              className="w-[18px] h-[18px] invisible text-[rgb(255,255,255,0.9)]  group-hover:visible"
              data-tooltip-id="Delete-Chat-icon-tooltip"
              data-tooltip-content="Delete Message"
              onClick={() => DeleteMessage(message_id, Current_Page)}
            >
              <MdDelete className="w-[18px] h-[18px]" />
            </button>
          </>
        ) : (
          <>
            {AdminId === UserInformation?.id && !Is_Deleted ? (
              <button
                className="w-[18px] h-[18px] invisible text-[rgb(255,255,255,0.9)]  group-hover:visible"
                data-tooltip-id="Delete-Chat-icon-tooltip"
                data-tooltip-content="Delete Message"
                onClick={() => DeleteMessage(message_id, Current_Page)}
              >
                <MdDelete className="w-[18px] h-[18px]" />
              </button>
            ) : (
              ""
            )}
          </>
        )}
        <button
          className="w-[18px] h-[18px] invisible text-[rgb(255,255,255,0.9)]  group-hover:visible"
          data-tooltip-id="Reply-Chat-icon-tooltip"
          data-tooltip-content="Reply"
          onClick={() => {
            setReply_A_Specific_Message_State({
              Is_Replying: true as boolean,
              MessageId: message_id as string,
              Message: message as string,
              ChannelId: channel_id as string,
              UserId: UserId as string,
              UserName: UserName as string,
              FullName: FullName as string,
              Profile_Picture: Profile_Picture as string,
              current_page: Current_Page as number,
              Is_Deleted: Is_Deleted as boolean,
            });
          }}
        >
          <FaReply className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}

export default MessageProfile;
