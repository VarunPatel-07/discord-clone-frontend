import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import LineLoader from "./LineLoader";

function UsersProfileCard({
  user,
  currentPage,
}: {
  user: any;
  currentPage: string;
}) {
  const SendTheFollowRequestToTheUser = (useId) => {
    console.log(useId);
  };
  return (
    <div className=" bg-[rgba(255,255,255,0.05)] backdrop-blur-[30px] px-[15px] py-[15px] w-[100%] rounded-[10px] border-[1px] border-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.1)] transition-all">
      <div className="inner-section flex flex-col gap-[20px]  items-center">
        <div className="flex flex-col items-center  justify-start gap-[20px] w-[100%]">
          <div className="profile w-[100%]">
            <Avatar className="w-[70px] h-[70px] flex items-center justify-center bg-gradient-to-r from-slate-500 to-slate-800 rounded-full overflow-hidden">
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
          <button
            className="bg-green-700 transition-all  px-[15px] py-[8px] w-[100%] text-center rounded-[10px] global-font-roboto text-[16px] font-medium text-white hover:bg-green-800 hover:text-white capitalize"
            onClick={
              currentPage === "blocked"
                ? () => {}
                : () => SendTheFollowRequestToTheUser(user.id)
            }
          >
            {/* {currentPage === "blocked" ? "Unblock" : "Follow"} */}
          
          </button>
        </div>
      </div>
    </div>
  );
}

export default UsersProfileCard;
