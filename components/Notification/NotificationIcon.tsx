import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IoMdNotifications } from "react-icons/io";
import { useDebounce } from "@/hooks/debounceHook";
import SpinnerComponent from "../Loader/SpinnerComponent";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
enum NotificationType {
  FOLLOW,
  NORMAL,
  MESSAGE,
  FRIEND_REQUEST,
  ERROR,
}

function NotificationIcon() {
  const [Loading, setLoading] = useState(false);
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;
  const [Notification, setNotification] = useState([] as any);
  const FetchAllTheNotificationUsingDebounce = useDebounce(
    async (server_id) => {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      const ServerID = server_id
        ? server_id
        : "2c8f1e46-8a34-4965-baea-aaa82065d825";
      if (!AuthToken || !ServerID) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios({
          method: "get",
          url: `${Host}/app/api/Notification/FetchAllTheNotification/${ServerID}`,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: AuthToken,
          },
        });

        if (response.data.success) {
          setNotification(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    },
    1000
  );
  const FetchAllTheNotificationWithClick = () => {
    setLoading(true);
    console.log("FetchAllTheNotificationWithClick");
    FetchAllTheNotificationUsingDebounce();
  };
  return (
    <Sheet>
      <SheetTrigger>
        <span
          className="relative block w-[25px] h-[25px]"
          onClick={FetchAllTheNotificationWithClick}
        >
          <IoMdNotifications className="w-[25px] h-[25px] text-white" />
          <span className="absolute top-0 right-0 w-[11px] h-[11px] bg-red-500 rounded-full "></span>
          <span className="absolute top-0 right-0 w-[11px] h-[11px] bg-red-500 rounded-full animate-ping"></span>
        </span>
      </SheetTrigger>
      <SheetContent className="bg-gray-600 border-0 text-white">
        <SheetHeader>
          <SheetTitle className="text-white invisible"></SheetTitle>
          <SheetDescription className="text-white invisible"></SheetDescription>
        </SheetHeader>
        {Loading ? (
          <SpinnerComponent />
        ) : (
          <ScrollArea className="w-[100%] h-[100%] ">
            <div className="w-[100%] h-[100%] flex flex-col-reverse items-start justify-end gap-[10px] pb-[60px]">
              {Notification.map((notification: any) => {
                return (
                  <div
                    className="h-fit bg-white px-[10px] py-[8px] rounded-[8px] w-[100%]"
                    key={notification.id}
                    id={notification.id}
                  >
                    <div className="flex items-center justify-start gap-[12px]">
                      {notification.Type !== NotificationType.NORMAL && (
                        <div className="profile">
                          <Avatar
                            className="w-[40px] h-[40px] flex items-center justify-center rounded-full"
                            style={{
                              backgroundColor:
                                notification?.sender?.ProfileBgColor,
                            }}
                          >
                            <AvatarImage
                              src={notification?.sender?.Profile_Picture}
                            ></AvatarImage>
                            <AvatarFallback
                              className="text-[15px] flex items-center justify-center font-semibold global-font-roboto"
                              style={{
                                color:
                                  notification?.sender?.ProfileBanner_Color,
                              }}
                            >
                              {notification?.sender?.FullName?.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <div className="content">
                        <p className="global-font-roboto text-[15px] text-gray-800  capitalize">
                          <span className="text-gray-950 font-semibold pr-[5px]">
                            {notification?.sender?.UserName}
                          </span>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default NotificationIcon;
