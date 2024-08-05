import React, { useContext, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoIosSettings, IoMdMic } from "react-icons/io";
import { Context } from "@/context/ContextApi";
import { getCookie } from "cookies-next";
import UseSocketIO from "@/hooks/UseSocketIO";
import { useRouter } from "next/navigation";

function UserProfile({ Position }: { Position: string }) {
  const { push } = useRouter();
  const { UserInfoFetchingFunction, UserInformation } = useContext(
    Context
  ) as any;
  const socket = UseSocketIO();
  useEffect(() => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    UserInfoFetchingFunction(AuthToken);
  }, []);
  useEffect(() => {
    socket?.on("EmitUserStatusChanged", () => {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      UserInfoFetchingFunction(AuthToken);
    });
    return () => {
      socket?.off("EmitUserStatusChanged");
    };
  }, []);
  return (
    <div
      className={`${Position} w-[100%] transition-all cursor-pointer bg-[#121314] hover-parent-to-change-child hover:bg-green-900  px-[12px] py-[12px]`}
    >
      <div className="flex items-center justify-between w-[100%]">
        <div
          className="profile-username flex items-center justify-center gap-[10px]"
          onClick={() => {
            push(`/pages/profile/${UserInformation.UserName}`);
          }}
        >
          <div className="profile">
            <Avatar
              className="w-[45px] h-[45px]"
              style={{ backgroundColor: UserInformation.ProfileBgColor }}
            >
              <AvatarImage src={UserInformation.Profile_Picture} />
              <AvatarFallback>
                {UserInformation?.FullName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="info">
            <p className="name text-white text-[15px] max-w-[60px]  xl:max-w-[90px] text-nowrap text-ellipsis overflow-hidden">
              {UserInformation?.FullName}
            </p>
            <div className="w-100 h-[22px] overflow-hidden ">
              <div className="flex flex-col items-start justify-between show-status-on-hover transition duration-[0.15s]">
                <p
                  className={`username fs-14 ${
                    UserInformation.Is_Online
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {UserInformation.Is_Online ? "Online" : "Offline"}
                </p>
                <p className="username fs-14 text-white">
                  {UserInformation.UserName}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="user-action">
          <div className=" flex items-center justify-center gap-[6px]">
            <div
              className="mic-icon"
              data-tooltip-id="mic-icon-tooltip"
              data-tooltip-content="Mic"
            >
              <IoMdMic className="text-2xl text-white" />
             
            </div>
            <div
              className="setting-icon"
              data-tooltip-id="setting-tooltip"
              data-tooltip-content="Settings"
            >
              <IoIosSettings className="text-2xl text-white" />
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
