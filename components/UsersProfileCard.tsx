import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useContext, useState } from "react";
import { useDebounce } from "@/hooks/debounceHook";
import { Context } from "@/context/ContextApi";
import { getCookie } from "cookies-next";
import SpinnerComponent from "./Loader/SpinnerComponent";

function UsersProfileCard({
  user,
  currentPage,
  SentRequest,
  All_The_Follower_Of_The_User,
}: {
  SentRequest: Array<object>;
  user: any;
  currentPage: string;
  All_The_Follower_Of_The_User: Array<object>;
}) {
  const [ShowLoader, setShowLoader] = useState(false as boolean);
  const {
    SendTheFollowRequestToTheUser,
    WithDrawTheSentFollowRequest,
    UnBlock_A_Specific_User,
  } = useContext(Context) as any;
  //
  // ? code related to the debouncing written the below
  //
  const SendTheUserRequestWithDebounce = useDebounce(async (userId) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await SendTheFollowRequestToTheUser(AuthToken, userId);
    setShowLoader(false);
  }, 350);
  const UseDebounceToWithDrawRequest = useDebounce(async (userId) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await WithDrawTheSentFollowRequest(AuthToken, userId);
    setShowLoader(false);
  }, 350);
  const UnBlockUserWithDebounce = useDebounce(async (userId) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await UnBlock_A_Specific_User(AuthToken, userId);
    setShowLoader(false);
  }, 350);
  //
  // ? code related to the debouncing written the above
  //
  const SendTheFollowRequest = (useId) => {
    setShowLoader(true);
    SendTheUserRequestWithDebounce(useId);
  };
  const WithDrawRequest = async (UserId) => {
    setShowLoader(true);
    UseDebounceToWithDrawRequest(UserId);
  };
  const UnblockUserButton = async (UserId) => {
    setShowLoader(true);
    UnBlockUserWithDebounce(UserId);
  };
  //
  //

  return (
    <div
      className={`bg-[rgba(255,255,255,0.1)]  backdrop-blur-[30px] px-[15px] py-[15px] w-[100%] rounded-[10px] border-[1px] border-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.1)] transition-all overflow-hidden`}
    >
      <div className="inner-section flex flex-col gap-[20px]  items-center">
        <div className="flex flex-col items-center  justify-start gap-[20px] w-[100%]">
          <div className="profile w-[100%]">
            <div
              className={`w-full h-16 absolute top-0 left-0`}
              style={{ backgroundColor: user.ProfileBanner_Img_Color }}
            ></div>

            <Avatar
              className="w-[70px] h-[70px] flex items-center justify-center rounded-full overflow-hidden relative z-[15] mt-[20px]"
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
          <div className="user-info flex flex-col text-center items-center justify-center">
            <h4 className="text-white global-font-roboto  text-[16px]  font-[500]">
              {user.FullName}
            </h4>
            <p className="text-white global-font-roboto  text-[14px]  font-[400]">
              {user.UserName}
            </p>
          </div>
        </div>
        <div className="follow-user-button w-[100%]  flex flex-col gap-[10px] ">
          {SentRequest.some((user_info: any) => user_info.id === user.id) ? (
            <button
              className={`${
                ShowLoader
                  ? "bg-red-700 border-[1px] border-red-700"
                  : "bg-indigo-500 border-[1px] border-indigo-500"
              }  transition-all  px-[15px] py-[8px] w-[100%] text-center rounded-[10px] global-font-roboto text-[16px] font-medium text-white hover:bg-red-700 hover:text-white hover:border-red-700 capitalize group`}
              onClick={() => WithDrawRequest(user.id)}
            >
              {ShowLoader ? (
                ""
              ) : (
                <span className="group-hover:text-[0px] transition  duration-[0.01s]">
                  requested
                </span>
              )}
              <span
                className={`capitalize  transition  duration-[0.01s] ${
                  ShowLoader
                    ? "visible  "
                    : "invisible  overflow-hidden text-[0px] group-hover:text-[16px] group-hover:visible"
                }`}
              >
                {ShowLoader ? <SpinnerComponent /> : "Withdraw request"}
              </span>
            </button>
          ) : (
            <>
              {currentPage === "blocked" ? (
                <button
                  className="bg-rose-700 transition-all  px-[15px] py-[8px] w-[100%] text-center rounded-[10px] global-font-roboto text-[16px] font-medium text-white hover:bg-rose-600  hover:text-white capitalize"
                  onClick={() => UnblockUserButton(user.id)}
                >
                  {ShowLoader ? (
                    <SpinnerComponent />
                  ) : (
                    <span className="block">unblock</span>
                  )}
                </button>
              ) : (
                <>
                  {All_The_Follower_Of_The_User.some(
                    (info: any) => info.id === user.id
                  ) ? (
                    <button
                      className="bg-[#3978f2] transition-all  px-[15px] py-[8px] w-[100%] text-center rounded-[10px] global-font-roboto text-[16px] font-medium text-white hover:bg-[#2662d8] hover:text-white capitalize"
                      onClick={() => SendTheFollowRequest(user.id)}
                    >
                      {ShowLoader ? (
                        <SpinnerComponent />
                      ) : (
                        <span className="block">Follow back</span>
                      )}
                    </button>
                  ) : (
                    <button
                      className="bg-green-700 transition-all  px-[15px] py-[8px] w-[100%] text-center rounded-[10px] global-font-roboto text-[16px] font-medium text-white hover:bg-green-800 hover:text-white capitalize"
                      onClick={() => SendTheFollowRequest(user.id)}
                    >
                      {ShowLoader ? (
                        <SpinnerComponent />
                      ) : (
                        <span className="block">Follow</span>
                      )}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersProfileCard;
