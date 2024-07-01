"use client";
import { Context } from "@/context/ContextApi";
import { useRouter } from "next/navigation";
import React, { useState, useContext, useEffect } from "react";
import Create_Update_Server_PopUp from "@/components/Create_Update_Server_PopUp";
import Single_Image_DragDrop from "@/components/Single_Image_DragDrop";
import GlobalDiscordLoader from "@/components/GlobalDiscordLoader";

function Dashboard() {
  const { push } = useRouter();
  // ? importing the required function from the context api
  const { CheckUsersLoginStatus, setShow_Create_Server_PopUp } = useContext(
    Context
  ) as any;

  // ? defining all the state

  //   using the useState
  const [Discord_Loader, setDiscord_Loader] = useState(true);
  //   ? using the useEffect
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await CheckUsersLoginStatus();
        if (status) {
          setDiscord_Loader(false);
        } else {
          setDiscord_Loader(false);
          push("/pages/login");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkStatus();
  }, []);
  if (Discord_Loader) {
    return <GlobalDiscordLoader />;
  } else {
    return (
      <>
        <h1>hello from dashboard</h1>
        <button onClick={() => setShow_Create_Server_PopUp(true)}>hello</button>
        <Create_Update_Server_PopUp Pop_Up_Mode="Create-PopUp-Mode" />
      </>
    );
  }
}
export default Dashboard;
