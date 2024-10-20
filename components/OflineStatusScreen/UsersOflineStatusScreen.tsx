/* eslint-disable react/no-unescaped-entities */
import React, { useContext, useEffect, useState } from "react";
import "@/components/OflineStatusScreen/offlinePage.css";
import { Context } from "@/context/ContextApi";
import { NotificationType } from "@/enums/enums";
function UsersOfflineStatusScreen({ isOnline }: { isOnline: boolean }) {
  const { GlobalNotificationHandlerFunction } = useContext(Context) as any;
  const [runningForFirstTime, setRunningForFirstTime] = useState(true as boolean);
  useEffect(() => {
    if (!runningForFirstTime) {
      if (isOnline) {
        GlobalNotificationHandlerFunction({}, NotificationType.NetworkStatus, "online", "top-right", 2000);
      } else {
        GlobalNotificationHandlerFunction({}, NotificationType.NetworkStatus, "offline", "top-right", 2000);
      }
    } else {
      setRunningForFirstTime(false); // Move this inside to update the state after the first run
    }
  }, [isOnline]);
  if (!isOnline) {
    return (
      <div className="w-screen h-full fixed z-20 top-0 left-0 bg-white overflow-hidden">
        <div className="bg-black text-white w-full h-full flex items-center justify-center">
          <div className="flex flex-col w-full h-[70%] items-center justify-center gap-10">
            <div className="m-auto text-center">
              <div className="body"></div>
              <div className="eye"></div>
              <div className="mouth"></div>
              <div className="ground"></div>
              <div className="comets"></div>
            </div>
            <p className="text-sm md:text-base text-yellow-300 p-2 mb-4">
              You aren't connected to a working internet connection
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default UsersOfflineStatusScreen;
