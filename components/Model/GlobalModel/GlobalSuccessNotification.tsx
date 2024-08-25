"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Context } from "@/context/ContextApi";
import React, { useContext } from "react";

enum NotificationType {
  FOLLOW,
  NORMAL,
  MESSAGE,
  FRIEND_REQUEST,
  ERROR,
}

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

function GlobalSuccessNotification() {
  const { GlobalSuccessNotification } = useContext(Context) as any;
  return (
    <div className="w-fit h-auto absolute top-[15px] right-[15px] z-[30]">
      <div className="w-[100%] h-[100%] flex flex-col-reverse items-end justify-end gap-[10px]">
        {GlobalSuccessNotification.map((notification: GlobalNotification) => {
          return (
            <div
              className="w-fit h-fit bg-white px-[10px] py-[8px] rounded-[8px] animate-enter"
              key={notification.id}
              id={notification.id}
            >
              <div className="flex items-center justify-center gap-[12px]">
                {notification.Type !== NotificationType.NORMAL && (
                  <div className="profile">
                    <Avatar
                      className="w-[40px] h-[40px] flex items-center justify-center rounded-full"
                      style={{ backgroundColor: notification.ProfileBgColor }}
                    >
                      <AvatarImage
                        src={notification.Profile_Picture}
                      ></AvatarImage>
                      <AvatarFallback
                        className="text-[15px] flex items-center justify-center font-semibold global-font-roboto"
                        style={{ color: notification.ProfileBanner_Color }}
                      >
                        {notification?.FullName?.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div className="content">
                  <p className="global-font-roboto text-[15px] text-gray-800  capitalize">
                    <span className="text-gray-950 font-semibold pr-[5px]">
                      {notification.UserName}
                    </span>
                    {notification.Message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GlobalSuccessNotification;
