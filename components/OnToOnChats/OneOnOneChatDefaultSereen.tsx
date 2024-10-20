import { Context } from "@/context/ContextApi";
import { SelectedOneToOneChatInterface } from "@/interface/SelectedOneToOneChatInterface";
import { getCookie } from "cookies-next";
import Image from "next/image";
import React, { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function OneOnOneChatDefaultScreen({ OneOnOneChatInfo }: { OneOnOneChatInfo: SelectedOneToOneChatInterface }) {
  const { UserInformation } = useContext(Context) as any;

  const UserInfo = UserInformation || getCookie("User__Info") ? JSON.parse(getCookie("User__Info") as string) : "";

  const GetUserName = () => {
    if (OneOnOneChatInfo?.Sender?.id === UserInfo?.id) {
      return OneOnOneChatInfo?.Recever?.FullName;
    } else {
      return OneOnOneChatInfo?.Sender?.FullName;
    }
  };
  const GetTheUserProfilePicture = () => {
    if (OneOnOneChatInfo?.Sender?.id === UserInfo?.id) {
      return OneOnOneChatInfo?.Recever?.Profile_Picture;
    } else {
      return OneOnOneChatInfo?.Sender?.Profile_Picture;
    }
  };

  return (
    <div className="default-section w-[100%]">
      <div className="server_name flex flex-col items-start justify-start gap-2.5">
        <Avatar className="w-[70px] h-[70px] flex flex-col items-center justify-center">
          <AvatarImage src={GetTheUserProfilePicture()}></AvatarImage>
          <AvatarFallback className="bg-white text-black global-font-roboto font-medium text-2xl flex flex-col items-center justify-center">
            {GetUserName().slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div className="w-full flex flex-col gap-1">
          <p className="global-font-roboto text-balance text-2xl font-bold text-white flex items-center gap-[5px]">
            {GetUserName()}
          </p>
          <div className="w-full">
            <p className="global-font-roboto text-balance text-sm font-light text-slate-200 flex items-center gap-[5px]">
              <span className="capitalize inline-block">This is the start of your direct message history with</span>
              <span>{GetUserName()}</span>
            </p>
            <p className="global-font-roboto  text-balance text-sm font-light text-slate-200 flex items-center gap-[5px]">
              Direct messages and files shared here are not shown to people outside this area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OneOnOneChatDefaultScreen;
