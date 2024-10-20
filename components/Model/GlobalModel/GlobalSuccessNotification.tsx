"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Context } from "@/context/ContextApi";
import { NotificationType } from "@/enums/enums";
import React, { useContext } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface GlobalNotification {
  id: string;
  Show_Notification: boolean;
  Profile_Picture: string;
  FullName: string;
  UserName: string;
  Message: string;
  Type: NotificationType;
  Notification_Position: string;
  Notification_Time: number;
  ProfileBgColor: string;
  ProfileBanner_Color: string;
}
const is_Normal_Notification = [NotificationType.NORMAL, NotificationType.MESSAGE_SUCCESS];
function GlobalSuccessNotification() {
  const { GlobalSuccessNotification } = useContext(Context) as any;
  return (
    <div className="w-fit h-auto absolute top-[15px] right-[15px] z-[30]">
      <div className="w-[100%] h-[100%] flex flex-col-reverse items-end justify-end gap-[10px]">
        {GlobalSuccessNotification.map((notification: GlobalNotification) => {
          if (notification.Type !== NotificationType.ERROR) {
            if (notification.Type === NotificationType.NetworkStatus) {
              return (
                <div
                  className="w-fit h-fit px-[16px] py-[8px] rounded-[8px] animate-enter bg-white"
                  key={notification.id}
                  id={notification.id}>
                  <div className="flex items-center justify-center gap-[12px]">
                    <div className="content flex items-center justify-center gap-1.5">
                      {notification?.Message.toLocaleLowerCase().trim() === "offline" ? (
                        <span className="w-5 h-5">
                          <IoIosCloseCircleOutline className="text-rose-600 w-5 h-5" />
                        </span>
                      ) : (
                        <span className="w-5 h-5">
                          <FaRegCircleCheck className="text-green-600 w-5 h-5" />
                        </span>
                      )}
                      <p className="global-font-roboto text-[15px] text-black capitalize">
                        {notification?.Message.toLocaleLowerCase().trim() === "offline"
                          ? "Oops! You're offline."
                          : "Great! You're back online."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            } else
              return (
                <div
                  className={`w-fit h-fit ${
                    notification.Type === NotificationType.MESSAGE_SUCCESS
                      ? "bg-green-400 border-[1px] border-green-600"
                      : "bg-white"
                  } px-[10px] py-[8px] rounded-[8px] animate-enter`}
                  key={notification.id}
                  id={notification.id}>
                  <div className="flex items-center justify-center gap-[12px]">
                    {!is_Normal_Notification.includes(notification.Type) && (
                      <div className="profile">
                        <Avatar
                          className="w-[40px] h-[40px] flex items-center justify-center rounded-full"
                          style={{ backgroundColor: notification.ProfileBgColor }}>
                          <AvatarImage src={notification.Profile_Picture}></AvatarImage>
                          <AvatarFallback
                            className="text-[15px] flex items-center justify-center font-semibold global-font-roboto"
                            style={{ color: notification.ProfileBanner_Color }}>
                            {notification?.FullName?.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div className="content">
                      <p className="global-font-roboto text-[15px] text-gray-800  capitalize">
                        <span className="text-gray-950 font-semibold pr-[5px]">{notification.UserName}</span>
                        {notification.Message}
                      </p>
                    </div>
                  </div>
                </div>
              );
          } else {
            return (
              <div
                className="w-fit h-fit px-[16px] py-[8px] rounded-[8px] animate-enter bg-[#c52216df]"
                key={notification.id}
                id={notification.id}>
                <div className="flex items-center justify-center gap-[12px]">
                  <div className="content">
                    <p className="global-font-roboto text-[15px] text-white  capitalize">{notification.Message}</p>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default GlobalSuccessNotification;
