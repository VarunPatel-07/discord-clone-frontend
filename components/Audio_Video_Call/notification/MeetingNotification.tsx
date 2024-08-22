import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VideoAudioCallContext } from "@/context/CallContextApi";
import React, { useContext } from "react";
interface Notification {
  id: string;
  participant_id: string;
  FullName: string;
  UserName: string;
  Profile_Picture: string;
  ProfileBanner_Color: string;
  ProfileBgColor: string;
  Message: string;
}
function MeetingNotification() {
  const { ANewParticipant_Notification } = useContext(
    VideoAudioCallContext
  ) as any;
  return (
    <div className="w-fit h-auto absolute bottom-[15px] right-[15px] z-[10]">
      <div className="w-[100%] h-[100%] flex flex-col items-end justify-end gap-[10px]">
        {ANewParticipant_Notification.map((notification: Notification) => {
          return (
            <div
              className="w-fit h-fit bg-white px-[10px] py-[5px] rounded animate-enter"
              key={notification.id}
              id={notification.id}
            >
              <div className="flex items-center justify-center">
                <div className="profile">
                  <Avatar
                    className="w-[50px] h-[50px] flex items-center justify-center rounded-full"
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
                <div className="content">
                  <p className="global-font-roboto text-[15px] text-gray-800 px-[12px] py-[5px] capitalize">
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

export default MeetingNotification;
