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
  } = useContext(Context) as any;
  const GetLocalTimeFrom_UTC = (Time: string) => {
    const date = new Date(Time);
    const localTime = date.toLocaleString();
    const __time = localTime.split(",")[1].split(":");
    const AM_PM = Number(__time[0]) >= 12 ? "PM" : "AM";

    return `${__time[0]}:${__time[1]} ${AM_PM}`;
  };
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

  return (
    <div className="message w-[100%] hover:bg-[rgba(0,0,0,0.3)] px-[10px] py-[5px] rounded group transition-all duration-300">
      <div className="w-[100%] flex items-start justify-between">
        <div className="message-container w-[100%] flex items-start">
          <div className="profile">
            <Avatar className="w-[40px] h-[40px] ">
              <AvatarImage
                src={Profile_Picture}
                className="w-[100%] h-[100%]"
              />
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
                  onClick={() => DeleteMessage(message_id, Current_Page)}
                >
                  <MdDelete className="w-[18px] h-[18px]" />
                </button>
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
  // }
}

export default Message;
