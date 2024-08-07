"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Context } from "@/context/ContextApi";
import React, { useContext } from "react";

function GlobalSuccessNotification() {
  const { GlobalSuccessNotification } = useContext(Context) as any;
  if (GlobalSuccessNotification.Type === "FOLLOW") {
    return (
      <div
        className={`absolute ${
          GlobalSuccessNotification.Notification_Position
            ? GlobalSuccessNotification.Notification_Position
            : "top-0 left-[50%] translate-x-[-50%]"
        } z-20 w-fit  transition-all duration-500 ease-in-out  cursor-pointer ${
          GlobalSuccessNotification.ShowAlert
            ? "translate-y-0 scale-x-100 opacity-100 visible"
            : " translate-y-[-300%] scale-x-0 opacity-0 invisible"
        }`}
      >
        <div className="w-[100%] flex items-center justify-center  pt-[15px]">
          <div className="bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800  px-[15px] py-[6px]  ">
            <div className="w-[100%] flex items-center justify-between gap-[5px]">
              <div className="w-[28px] h-[28px]">
                <Avatar className="w-[28px] h-[28px] flex items-center justify-center bg-gradient-to-r bg-black rounded-full overflow-hidden">
                  <AvatarImage
                    src={GlobalSuccessNotification.Profile_Picture}
                    className="w-[100%] h-[100%] "
                  />
                  <AvatarFallback className=" capitalize font-medium text-[15px]  text-[#f1f1f1]">
                    {GlobalSuccessNotification?.FullName?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-black global-font-roboto transition-all duration-1000 ease-in-out capitalize text-[14px] text-nowrap">
                  <span className="font-bold px-[3px]  text-black">
                    {GlobalSuccessNotification?.UserName}
                  </span>
                  {GlobalSuccessNotification?.Message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (GlobalSuccessNotification.Type === "REMOVE_FROM_SERVER") {
    return (
      <div
        className={`absolute ${
          GlobalSuccessNotification.Notification_Position
            ? GlobalSuccessNotification.Notification_Position
            : "top-0 left-[50%] translate-x-[-50%]"
        } z-20 w-fit  transition-all duration-300 ease-in-out  cursor-pointer ${
          GlobalSuccessNotification.ShowAlert
            ? "translate-y-0 scale-x-100 opacity-100 visible"
            : " translate-y-[-300%] scale-x-0 opacity-0 invisible"
        }`}
      >
        <div className="w-[100%] flex items-center justify-center  pt-[15px]">
          <div className="bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800  px-[15px] py-[6px]  ">
            <p className="text-black global-font-roboto transition-all duration-1000 ease-in-out capitalize text-[15px] text-nowrap">
              {GlobalSuccessNotification.Message}
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (GlobalSuccessNotification.Type === "NORMAL") {
    return (
      <div
        className={`absolute ${
          GlobalSuccessNotification.Notification_Position
            ? GlobalSuccessNotification.Notification_Position
            : "top-0 left-[50%] translate-x-[-50%]"
        } z-20 w-fit  transition-all duration-300 ease-in-out  cursor-pointer ${
          GlobalSuccessNotification.ShowAlert
            ? "translate-y-0 scale-x-100 opacity-100 visible"
            : " translate-y-[-300%] scale-x-0 opacity-0 invisible"
        }`}
      >
        <div className="w-[100%] flex items-center justify-center  pt-[15px]">
          <div className="bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800  px-[15px] py-[6px]  ">
            <p className="text-black global-font-roboto transition-all duration-1000 ease-in-out capitalize text-[15px] text-nowrap">
              {GlobalSuccessNotification.Message}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default GlobalSuccessNotification;
