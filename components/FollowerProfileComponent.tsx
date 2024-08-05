import React, { useContext, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BsThreeDots } from "react-icons/bs";
import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { getCookie } from "cookies-next";
import SpinnerComponent from "./Loader/SpinnerComponent";

function FollowerProfileComponent({
  OnclickActionButton,
  userInfo,
  CurrentState,
  Is_FollowBack,
}: {
  OnclickActionButton: (userInfo) => void;
  userInfo: {
    id: string;
    UserName: string;
    FullName: string;
    Profile_Picture: string;
    ProfileBgColor: string;
  };
  CurrentState: string;
  Is_FollowBack: boolean;
}) {
  //
  const {
    SendTheFollowRequestToTheUser,
    WithDrawTheSentFollowRequest,
    AllTheSendRequestOfTheUser,
  } = useContext(Context) as any;
  //
  const SendingFollowRequestUsingDebounce = useDebounce(async (userId) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await SendTheFollowRequestToTheUser(AuthToken, userId);
    setLoader("");
  }, 350);

  const WithDrawFollowRequestUsingDebounce = useDebounce(async (userId) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await WithDrawTheSentFollowRequest(AuthToken, userId);
    setLoader("");
  }, 350);

  const SendFollowRequest = (user_id) => {
    setLoader(user_id);
    SendingFollowRequestUsingDebounce(user_id);
  };

  const WithDrawFollowRequest = (user_id) => {
    setLoader(user_id);
    WithDrawFollowRequestUsingDebounce(user_id);
  };
  const [Loader, setLoader] = useState("" as string);
  return (
    <div className="w-[100%] px-[22px] py-[6px] hover:bg-[rgba(0,0,0,0.2)] cursor-pointer  rounded-[2px] transition-all">
      <div className="w-[100%] flex items-center justify-between">
        <div className="profile-info flex items-center justify-start gap-[8px] w-[70%]">
          <div className="profile">
            <Avatar
              className="w-[45px] h-[45px] flex items-center justify-center  rounded-full"
              style={{ backgroundColor: userInfo.ProfileBgColor }}
            >
              <AvatarImage
                src={userInfo.Profile_Picture}
                className="w-[100%] h-[100%]"
              />
              <AvatarFallback className=" capitalize font-medium text-[23px]  text-black">
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
          {CurrentState === "Follower" ? (
            <>
              {Is_FollowBack ? (
                <button className="bg-[#18191b] text-white capitalize global-font-roboto text-[14px] rounded-[3px] px-[10px] py-[3px]">
                  message
                </button>
              ) : (
                <>
                  {AllTheSendRequestOfTheUser.some(
                    (user_info) => user_info.id === userInfo.id
                  ) ? (
                    <button
                      className="bg-[#000000] text-white capitalize global-font-roboto text-[14px] rounded-[3px] px-[10px] py-[3px]"
                      onClick={() => WithDrawFollowRequest(userInfo.id)}
                    >
                      {Loader === userInfo.id ? (
                        <SpinnerComponent />
                      ) : (
                        "requested"
                      )}
                    </button>
                  ) : (
                    <button
                      className="bg-[#3978F2] text-white capitalize global-font-roboto text-[14px] rounded-[3px] px-[10px] py-[3px]"
                      onClick={() => SendFollowRequest(userInfo.id)}
                    >
                      {Loader === userInfo.id ? <SpinnerComponent /> : "follow"}
                    </button>
                  )}
                </>
              )}
            </>
          ) : (
            <button className="bg-[#18191b] text-white capitalize global-font-roboto text-[14px] rounded-[3px] px-[10px] py-[3px]">
              message
            </button>
          )}
          <button
            className=" text-white capitalize global-font-roboto text-[20px] "
            onClick={() => OnclickActionButton(userInfo)}
          >
            <BsThreeDots />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FollowerProfileComponent;
