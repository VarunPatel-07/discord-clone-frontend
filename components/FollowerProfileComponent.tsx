import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BsThreeDots } from "react-icons/bs";

function FollowerProfileComponent({
  OnclickActionButton,
  userInfo,
}: {
  OnclickActionButton: () => void;
  userInfo: {
    UserId: string;
    UserName: string;
    FullName: string;
    ProfilePicture: string;
  };
}) {
  return (
    <div className="w-[100%] px-[22px] py-[6px] hover:bg-[rgba(0,0,0,0.2)] cursor-pointer  rounded-[2px]">
      <div className="w-[100%] flex items-center justify-between">
        <div className="profile-info flex items-center justify-start gap-[8px] w-[70%]">
          <div className="profile">
            <Avatar className="w-[45px] h-[45px] flex items-center justify-center bg-gray-800 rounded-full">
              <AvatarImage
                src={userInfo.ProfilePicture}
                className="w-[100%] h-[100%] "
              />
              <AvatarFallback className=" capitalize font-medium text-[30px]  text-black">
                {userInfo.FullName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="user-info flex flex-col items-start justify-center ">
            <h4 className="text-white text-[15px] global-font-roboto line-clamp-1">
              {userInfo.UserName}
            </h4>
            <p className="text-slate-300 text-[13px] global-font-roboto line-clamp-1">
              {userInfo.FullName}
            </p>
          </div>
        </div>
        <div className="action-on-user flex items-center justify-end gap-[7px] w-[30%]">
          <button className="bg-[#18191b] text-white capitalize global-font-roboto text-[14px] rounded-[3px] px-[10px] py-[3px]">
            message
          </button>
          <button
            className=" text-white capitalize global-font-roboto text-[20px] "
            onClick={() => OnclickActionButton()}
          >
            <BsThreeDots />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FollowerProfileComponent;
