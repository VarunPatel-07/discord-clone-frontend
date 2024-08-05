import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useContext, useState } from "react";
import { useDebounce } from "@/hooks/debounceHook";
import { Context } from "@/context/ContextApi";
import { getCookie } from "cookies-next";
import SpinnerComponent from "./Loader/SpinnerComponent";
function PendingRequestUserCard({
  user,
  currentPage,
  requestSent,
}: {
  user: any;
  currentPage: string;
  requestSent: boolean;
}) {
  //
  // ? using The Context Api to get the function
  //
  const [ShowIgnoreLoader, setShowIgnoreLoader] = useState(false as boolean);
  const [ShowAcceptLoader, setShowAcceptLoader] = useState(false as boolean);
  const [ShowLoader, setShowLoader] = useState(false as boolean);

  const {
    WithDrawTheSentFollowRequest,
    IgnoreReceivedFollowRequest,
    AcceptFollowRequestFunction,
  } = useContext(Context) as any;
  const UseDebounceToWithDrawRequest = useDebounce(async (userId) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await WithDrawTheSentFollowRequest(AuthToken, userId);
    setShowLoader(false);
  }, 350);
  const useDebounceToIgnoreRequest = useDebounce(async (senderId) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await IgnoreReceivedFollowRequest(AuthToken, senderId);
    setShowIgnoreLoader(false);
  }, 350);
  const useDebounceHookToAcceptRequest = useDebounce(async (senderId) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await AcceptFollowRequestFunction(AuthToken, senderId);
    setShowAcceptLoader(false);
  }, 350);
  //
  //

  //
  const WithDrawRequest = async (UserId) => {
    setShowLoader(true);
    UseDebounceToWithDrawRequest(UserId);
  };
  const IgnoreRequest = async (userId) => {
    setShowIgnoreLoader(true);
    useDebounceToIgnoreRequest(userId);
  };
  const AcceptRequest = async (userId) => {
    setShowAcceptLoader(true);
    useDebounceHookToAcceptRequest(userId);
  };
  //
  return (
    <div className=" bg-[rgba(0,0,0,0.5)] backdrop-blur-[30px] px-[15px] py-[12px] w-[100%] rounded-[10px] border-[1px] border-[rgba(0,0,0,0.5)] cursor-pointer hover:bg-[rgba(0,0,0,0.6)] hover:border-[rgba(255,255,255,0.1)] transition-all ">
      <div className="inner-section flex  gap-[20px]  items-center justify-between">
        <div className="flex  items-center  justify-start gap-[20px] w-[70%] ">
          <div className="profile ">
            <Avatar
              className="w-[70px] h-[70px] flex items-center justify-center  rounded-full overflow-hidden"
              style={{ backgroundColor: user.ProfileBgColor }}
            >
              <AvatarImage
                src={user.Profile_Picture}
                className="w-[100%] h-[100%] "
              />
              <AvatarFallback className=" capitalize font-medium text-[30px]  text-white">
                {user.FullName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="user-info flex flex-col text-start items-start justify-center">
            <h4 className="text-white global-font-roboto  text-[16px]  font-[500]">
              {user.FullName}
            </h4>
            <p className="text-white global-font-roboto  text-[14px]  font-[400]">
              {user.UserName}
            </p>
          </div>
        </div>
        <div className="follow-user-button flex gap-[10px] w-[30%] justify-end items-stretch">
          {requestSent ? (
            <button
              className="bg-transparent border-[1px] border-red-500  transition-all  px-[15px] py-[8px] w-fit text-center rounded-[10px] global-font-roboto text-[16px] font-medium text-red-500 hover:bg-red-700 hover:text-white hover:border-red-700 capitalize"
              onClick={() => WithDrawRequest(user.id)}
            >
              {ShowLoader ? <SpinnerComponent /> : "withdraw"}
            </button>
          ) : (
            <>
              <button
                className="bg-transparent border-[1px] border-white  transition-all  px-[15px] py-[8px] w-fit text-center rounded-[10px] global-font-roboto text-[16px] font-medium text-white hover:bg-white hover:text-black capitalize  "
                onClick={() => IgnoreRequest(user.id)}
              >
                {ShowIgnoreLoader ? <SpinnerComponent /> : "ignore"}
              </button>
              <button
                className="bg-blue-500 transition-all  px-[15px] py-[8px] w-fit text-center rounded-[10px] global-font-roboto text-[16px] font-medium text-white hover:bg-blue-700 hover:text-white capitalize  border-[1px] border-blue-500 hover:border-blue-700"
                onClick={() => AcceptRequest(user.id)}
              >
                {ShowAcceptLoader ? <SpinnerComponent /> : "accept"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PendingRequestUserCard;
