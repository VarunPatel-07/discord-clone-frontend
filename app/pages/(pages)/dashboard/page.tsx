"use client";
import { Context } from "@/context/ContextApi";
import { useRouter } from "next/navigation";
import React, { useState, useContext, useEffect } from "react";
import GlobalDiscordLoader from "@/components/GlobalDiscordLoader";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

function Dashboard() {
  const { push } = useRouter();
  // ? importing the required function from the context api
  const { CheckUsersLoginStatus } = useContext(
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
        <div className="flex w-full h-full max-w-full max-h-full flex-col bg-[#202225]">
          <div className="w-100 navbar">
            <Navbar />
          </div>
          <div className="w-100 h-100">
            <div className="w-100 h-100 flex">
              <div className="w--15">
                <Sidebar />
              </div>
              <div className="w-100 bg-[#36393F] rounded overflow-auto"></div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Dashboard;
