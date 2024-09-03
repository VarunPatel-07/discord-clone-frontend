import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getCookie } from "cookies-next";
import { Edit } from "lucide-react";
import React, { useContext } from "react";
import { FaReply } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import CryptoJS from "crypto-js";

interface MessageProfileInfo {
  Profile_Picture;
  FullName;
  UserName;
  message;
  Is_Edited;
  Time;
  UserId;
  message_id;
  channel_id;
  Current_Page;
  AdminId;
  Is_Deleted;
  Other_ClassName;
  DeleteMessage;
  Is_Replied;
  replayMessage_Id_To_Delete;
  ReplyingUser_UserName;
  Editing_Replay;
  ProfileBgColor;
  ProfileBanner_Color;
}

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
  Other_ClassName,
  DeleteMessage,
  Is_Replied,
  replayMessage_Id_To_Delete,
  ReplyingUser_UserName,
  Editing_Replay,
  ProfileBgColor,
  ProfileBanner_Color,
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
  Other_ClassName?: string;
  DeleteMessage: (message_id: string, current_page: number) => void;
  Is_Replied?: boolean;
  replayMessage_Id_To_Delete?: string;
  ReplyingUser_UserName?: string;
  Editing_Replay?: boolean;
  ProfileBgColor: string;
  ProfileBanner_Color: string;
}) {
  const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string;

  const {
    UserInformation,
    setEdit_Message_State,
    setReply_A_Specific_Message_State,
    Delete_MessageReplayFunction,
  } = useContext(Context) as any;

  const GetLocalTimeFrom_UTC = (Time: string) => {
    const date = new Date(Time);
    const localTime = date.toLocaleString();
    const __time = localTime.split(",")[1].split(":");
    const AM_PM = Number(__time[0]) >= 12 ? "PM" : "AM";

    return `${__time[0]}:${__time[1]} ${AM_PM}`;
  };

  const DeleteMessageWithDebounce = useDebounce(
    async (
      AuthToken: string,
      message_id: string,
      message_replay_id: string
    ) => {
      await Delete_MessageReplayFunction(
        AuthToken,
        message_id,
        message_replay_id
      );
    },
    200
  );

  const Delete_Message_Replay = async (
    message_id: string,
    message_replay_id: string
  ) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    DeleteMessageWithDebounce(AuthToken, message_id, message_replay_id);
  };

  const decryptContent = (encryptedContent) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedContent, SECRET_KEY);
      const originalContent = bytes.toString(CryptoJS.enc.Utf8);
      return originalContent;
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  };
  return (
    <div
      className={`w-[100%] flex items-start justify-between transition-all duration-150 ${Other_ClassName} `}
    >
      <div className="message-container w-[100%] flex items-start  justify-start">
        <div className="profile">
          <Avatar
            className="w-[45px] h-[45px]  rounded-full overflow-hidden flex items-center justify-center "
            style={{ backgroundColor: ProfileBgColor }}
          >
            <AvatarImage src={Profile_Picture} className="w-[100%] h-[100%]" />
            <AvatarFallback className="capitalize font-medium text-[15px] text-white">
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
            <div
              className={`message w-[100%] flex items-center ${
                ReplyingUser_UserName ? "gap-[10px]" : ""
              } `}
            >
              {!Is_Deleted && (
                <p
                  className="text-[#0fa7ff]
                  global-font-roboto text-[15px] font-[500] py-[3px]"
                >
                  {ReplyingUser_UserName}
                </p>
              )}

              <p
                className={`${
                  Is_Deleted ? "text-gray-400 italic" : "text-white"
                } global-font-roboto text-[15px] font-[300] py-[3px] max-w-[1000px] overflow-hidden text-ellipsis text-wrap`}
              >
                {Is_Deleted ? message : decryptContent(message)}
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
                  Message: decryptContent(message) as string,
                  ChannelId: channel_id as string,
                  UserId: UserId as string,
                  UserName: UserName as string,
                  FullName: FullName as string,
                  Profile_Picture: Profile_Picture as string,
                  current_page: Current_Page as number,
                  Editing_Replay: Editing_Replay as boolean,
                  Edit_Replay_Message_Id: replayMessage_Id_To_Delete as string,
                });
              }}
            >
              <Edit className="w-[18px] h-[18px]" />
            </button>
            <button
              className="w-[18px] h-[18px] invisible text-[rgb(255,255,255,0.9)]  group-hover:visible"
              data-tooltip-id="Delete-Chat-icon-tooltip"
              data-tooltip-content="Delete Message"
              onClick={
                Is_Replied
                  ? () => {
                      Delete_Message_Replay(
                        message_id,
                        replayMessage_Id_To_Delete as string
                      );
                    }
                  : () => DeleteMessage(message_id, Current_Page)
              }
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
                onClick={
                  Is_Replied
                    ? () => {
                        Delete_Message_Replay(
                          message_id,
                          replayMessage_Id_To_Delete as string
                        );
                      }
                    : () => DeleteMessage(message_id, Current_Page)
                }
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
              Message: Is_Deleted
                ? message
                : (decryptContent(message) as string),
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
