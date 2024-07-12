import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoIosSettings, IoMdMic } from "react-icons/io";

function UserProfile({ Position }: { Position: string }) {
  return (
    <div
      className={`${Position} w-[100%] transition-all cursor-pointer bg-[#121314] hover:bg-[var(--discord-loader-main-color)] px-[12px] py-[10px]`}
    >
      <div className="flex items-center justify-between w-[100%]">
        <div className="profile-username flex items-center justify-center gap-[8px]">
          <div className="profile">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="info">
            <p className="name text-white text-[15px]">Shadcn</p>
            <p className="username fs-14 text-white">@shadcn</p>
          </div>
        </div>
        <div className="user-action">
          <div className=" flex items-center justify-center gap-[6px]">
            <div className="mic-icon">
              <IoMdMic className="text-2xl text-white" />
            </div>
            <div className="setting-icon">
              <IoIosSettings className="text-2xl text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
