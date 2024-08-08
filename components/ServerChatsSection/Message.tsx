import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PiArrowBendRightUpBold, PiArrowBendUpRightBold } from "react-icons/pi";

function Message({
  Profile_Picture,
  FullName,
  UserName,
  message,
  Is_Edited,
  Time,
}: {
  Profile_Picture: string;
  FullName: string;
  UserName: string;
  message: string;
  Is_Edited: boolean;
  Time: string;
}) {
  return (
    <div className="message max-w-[500px] ">
      <div className="message-container flex items-end gap-[5px]">
        <div className="profile">
          <Avatar className="w-[35px] h-[35px] ">
            <AvatarImage src={Profile_Picture} className="w-[100%] h-[100%]" />
            <AvatarFallback className="capitalize font-medium text-[15px]">
              {FullName.split("")[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="content ">
          <div className="w-[100%] bg-[#282828] px-[7px] py-[4px] rounded cursor-pointer ">
            <div className="head">
              <p className="text-indigo-400 global-font-roboto text-[16px] font-[400]  capitalize ">
                {UserName}
              </p>
            </div>
            <div className="message">
              <p className="text-white global-font-roboto text-[16px] font-[300]">
                {message}
              </p>
            </div>
            <div className="time w-[100%] flex items-center justify-end gap-[5px]">
              {Is_Edited ? (
                <p className="text-white text-[12px] global-font-roboto capitalize">
                  edited
                </p>
              ) : (
                ""
              )}
              <p className="text-white text-[12px] global-font-roboto">
                {Time}
              </p>
            </div>
          </div>
          <span className="h-[15px] block"></span>
        </div>
      </div>
    </div>
  );
}

export default Message;
