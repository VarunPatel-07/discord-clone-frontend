"use client";
import GlobalDiscordLoader from "@/components/Loader/GlobalDiscordLoader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Context } from "@/context/ContextApi";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { getCookie } from "cookies-next";
import React, { useContext, useEffect, useState } from "react";

function Profile() {
  const [Discord_Loader, setDiscord_Loader] = useState(true);
  const { UserInfoFetchingFunction, UserInformation } = useContext(
    Context
  ) as any;
  useEffect(() => {
    const AuthToken = getCookie("User_Authentication_Token") as string;

    UserInfoFetchingFunction(AuthToken);
    setDiscord_Loader(false);
  }, []);
  if (Discord_Loader) {
    return <GlobalDiscordLoader />;
  } else {
    return (
      <div className="w-[100vw] h-[100vh] bg-[#0d0d0d]">
        <div className="flex">
          <div className="profile-image-section">
            <div className="profile">
              <Avatar>
                <AvatarImage
                  src={UserInformation?.Profile_Picture}
                ></AvatarImage>
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
