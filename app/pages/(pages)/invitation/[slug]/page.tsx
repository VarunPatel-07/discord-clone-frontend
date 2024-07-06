"use client";
import GlobalDiscordLoader from "@/components/GlobalDiscordLoader";
import { Context } from "@/context/ContextApi";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useContext } from "react";

function Invitation() {
  const { push } = useRouter();
  const Path = usePathname();
  const {
    CheckUsersLoginStatus,
    UserInfoFetchingFunction,
    JoiningServerWithInvitationCode,
  } = useContext(Context) as any;
  const [Discord_Loader, setDiscord_Loader] = useState(true);

  useEffect(() => {
    const AuthToken = localStorage.getItem("AuthToken");
    UserInfoFetchingFunction(AuthToken);
    const checkStatus = async () => {
      try {
        const status = await CheckUsersLoginStatus();
        if (status) {
        } else {
          push("/pages/login");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    checkStatus();
    const Invite_Code = Path.split("/")[3];
    const Join__Server = async () => {
      const MemberStatus = await JoiningServerWithInvitationCode(
        AuthToken,
        Invite_Code
      );
      if (MemberStatus?.success) {
        if (MemberStatus?.allReadyInServer) {
          push(`/pages/server/${MemberStatus?.serverId}`);
        } else {
          push(`/pages/server/${MemberStatus?.serverId}`);
        }
      }
      // push(`/server/${Invite_Code}`);
    };

    Join__Server();
  }, []);

  if (Discord_Loader) {
    return <GlobalDiscordLoader />;
  }
}

export default Invitation;
