"use client";
import GlobalDiscordLoader from "@/components/Loader/GlobalDiscordLoader";
import { Context } from "@/context/ContextApi";
import { getCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useContext, useRef } from "react";

function Invitation() {
  const hasRun = useRef(false);
  const { push } = useRouter();
  const Path = usePathname();
  const { CheckUsersLoginStatus, JoiningServerWithInvitationCode } = useContext(
    Context
  ) as any;
  const [Discord_Loader, setDiscord_Loader] = useState(true);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const AuthToken = getCookie("User_Authentication_Token") as string;

    const checkStatus = async () => {
      try {
        const status = await CheckUsersLoginStatus();
        if (!status) {
          push("/pages/login");
        } else {
          const Invite_Code = Path.split("/")[3];
          await JoiningServerWithInvitationCode(AuthToken, Invite_Code);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setDiscord_Loader(false); // Hide loader once operation is complete
      }
    };

    checkStatus();

    // Clean-up function
  }, []);

  if (Discord_Loader) {
    return <GlobalDiscordLoader ShowLoader={Discord_Loader} />;
  }

  return null; // Return null or other component after the loader
}

export default Invitation;
