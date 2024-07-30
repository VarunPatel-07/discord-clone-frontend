"use client";
import { Context } from "@/context/ContextApi";
import { useRouter } from "next/navigation";
import React, { useState, useContext, useEffect } from "react";
import GlobalDiscordLoader from "@/components/GlobalDiscordLoader";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import DashboardSideBar from "@/components/Sidebar/DashboardSideBar";
import { BsFillPersonFill } from "react-icons/bs";
import ShowAllTheUserInTheDashboard from "@/components/ShowAllTheUserInTheDashboard";
import { getCookie } from "cookies-next";

function Dashboard() {
  const { push } = useRouter();
  // ? importing the required function from the context api
  const {
    CheckUsersLoginStatus,
    FetchTheUserOnTheBaseOfDemand,
    FetchAllTheOtherUsers,
    AllTheUsersRequestSendOrReceived,
  } = useContext(Context) as any;
  const [UsersFriendType, setUserFriendType] = useState("" as string);
  const [ShowLoader, setShowLoader] = useState(true as boolean);
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

  const ClickTheToFetchTheFriendType = async (userState) => {
    setShowLoader(true);
    setUserFriendType(userState);
    if (userState === "addFriend") {
      setShowLoader(false);
    } else {
      const AuthToken = getCookie("User_Authentication_Token") as string;
      await FetchTheUserOnTheBaseOfDemand(AuthToken, userState);
      setShowLoader(false);
    }
  };
  useEffect(() => {
    setUserFriendType("all");
  }, []);
  if (Discord_Loader) {
    return <GlobalDiscordLoader />;
  } else {
    return (
      <>
        <div className="w-[100%] h-[100vh] flex bg-[#36393F]">
          <div className="w-[15%] max-w-[72px]">
            <Sidebar />
          </div>
          <div className="w-[100%] h-[100%] bg-[#36393F] rounded overflow-hidden">
            <div className="w-[100%] h-[100%] flex flex-col">
              <div className="w-100 navbar">
                <Navbar />
              </div>
              <div className="w-[100%] h-[100%]">
                <div className="flex w-[100%] h-[100%]">
                  <div className="w-[18%] h-[100%]">
                    <DashboardSideBar />
                  </div>
                  <div className="w-[82%] h-[100%] relative">
                    <div className="w-[100%] bg-[#41464f] z-10 shadow-[0_0px_5px_0_rgba(0,0,0,0.1)] absolute top-0 left-0 h-[45px] px-[15px] py-[10px]">
                      <div className="flex items-stretch   h-[100%] justify-start">
                        <div className="sec-1 flex items-center justify-start text-white">
                          <span className="mr-[5px] ">
                            <BsFillPersonFill className="w-[25px] h-[25px]" />
                          </span>
                          <span className="capitalize global-font-roboto text-[15px]  font-medium">
                            friends
                          </span>
                        </div>
                        <span className="w-[2px] rounded h-[100%] block bg-[#f5f6f888] line mx-[15px]"></span>
                        <div className="action-button-wrapper flex items-center justify-start gap-[20px]">
                          <button
                            className={`text-white  transition px-[5px] py-[1px] rounded-[5px] ${
                              UsersFriendType === "online"
                                ? "bg-[#2a2d31]"
                                : "hover:bg-[#2a2d31]"
                            }`}
                            onClick={() =>
                              ClickTheToFetchTheFriendType("online")
                            }
                          >
                            <span className="capitalize global-font-roboto text-[14px]  font-medium">
                              online
                            </span>
                          </button>
                          <button
                            className={`text-white  transition px-[5px] py-[1px] rounded-[5px] ${
                              UsersFriendType === "all"
                                ? "bg-[#2a2d31]"
                                : "hover:bg-[#2a2d31]"
                            }`}
                            onClick={() => ClickTheToFetchTheFriendType("all")}
                          >
                            <span className="capitalize global-font-roboto text-[15px]  font-medium">
                              all
                            </span>
                          </button>
                          <button
                            className={`text-white  transition px-[5px] py-[1px] rounded-[5px] ${
                              UsersFriendType === "pending"
                                ? "bg-[#2a2d31]"
                                : "hover:bg-[#2a2d31]"
                            }`}
                            onClick={() =>
                              ClickTheToFetchTheFriendType("pending")
                            }
                          >
                            <span className="capitalize global-font-roboto text-[15px]  font-medium">
                              pending
                            </span>
                          </button>
                          <button
                            className={`text-white  transition px-[5px] py-[1px] rounded-[5px] ${
                              UsersFriendType === "blocked"
                                ? "bg-[#2a2d31]"
                                : "hover:bg-[#2a2d31]"
                            }`}
                            onClick={() =>
                              ClickTheToFetchTheFriendType("blocked")
                            }
                          >
                            <span className="capitalize global-font-roboto text-[15px]   font-medium">
                              blocked
                            </span>
                          </button>
                          <button
                            className={` transition px-[5px] py-[1px] rounded-[5px] ${
                              UsersFriendType === "addFriend"
                                ? "bg-green-700 text-white "
                                : " text-green-500 hover:bg-green-700 hover:text-white"
                            }`}
                            onClick={() =>
                              ClickTheToFetchTheFriendType("addFriend")
                            }
                          >
                            <span className="capitalize global-font-roboto text-[15px]  font-medium">
                              addFriends
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="w-[100%] h-[100%] relative">
                      <div className="w-[100%] h-[100%] flex items-stretch">
                        <div className="w-[68%] overflow-hidden">
                          <ShowAllTheUserInTheDashboard
                            ShowLoader={ShowLoader}
                            UsersInfo={FetchAllTheOtherUsers}
                            currentPage={UsersFriendType}
                          />
                        </div>
                        <div className="w-[32%] border-l-[1px] border-[rgb(255,255,255,0.1)]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Dashboard;
