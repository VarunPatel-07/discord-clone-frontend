"use client";

import { Context } from "@/context/ContextApi";
import { useRouter } from "next/navigation";
import React, { useState, useContext, useEffect } from "react";
import GlobalDiscordLoader from "@/components/Loader/GlobalDiscordLoader";
import Navbar from "@/components/Navbar";
import DashboardSideBar from "@/components/Sidebar/DashboardSideBar";
import { BsFillPersonFill } from "react-icons/bs";
import ShowAllTheUserInTheDashboard from "@/components/ShowAllTheUserInTheDashboard";
import { getCookie } from "cookies-next";
import { useDebounce } from "@/hooks/debounceHook";
import UsersFollowerAndFollowingComponent from "@/components/UsersFollowerAndFollowingComponent";

function Dashboard() {
  const { push } = useRouter();

  // ? importing the required function from the context api
  const {
    CheckUsersLoginStatus,
    FetchTheUserOnTheBaseOfDemand,
    FetchAllTheOtherUsers,
    setGlobalMetaTagHandler,
    AllTheSendRequestOfTheUser,
    AllTheReceivedRequestOfTheUser,
  } = useContext(Context) as any;
  //
  //
  //
  const [UsersFriendType, setUserFriendType] = useState("all" as string);
  const [ShowLoader, setShowLoader] = useState(true as boolean);
  //
  //
  //
  // ? defining all the state

  //   using the useState
  const [Discord_Loader, setDiscord_Loader] = useState(true);
  //
  //
  //
  //   ? using the useEffect

  const fetchingDataWithDebounce = useDebounce(
    async (AuthToken: string, userState: string) => {
      await FetchTheUserOnTheBaseOfDemand(AuthToken, userState);
      setShowLoader(false);
    },
    350
  );
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
    setShowLoader(true);
    const AuthToken = getCookie("User_Authentication_Token") as string;
    fetchingDataWithDebounce(AuthToken, "all");
  }, []);

  const ClickTheToFetchTheFriendType = async (userState: string) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    setShowLoader(true);
    setUserFriendType(userState);
    if (userState === "pendingRequest") {
      setShowLoader(false);
    } else {
      fetchingDataWithDebounce(AuthToken, userState);
    }
  };

  return (
    <>
      {Discord_Loader && <GlobalDiscordLoader ShowLoader={Discord_Loader} />}
      <div className="w-[100%] h-[100vh] flex bg-[#36393F]">
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
                <div className="w-[100%] h-[100%] relative">
                  <div className="w-[100%] bg-[#41464f] z-10 shadow-[0_0px_5px_0_rgba(0,0,0,0.1)] absolute top-0 left-0 h-[45px] px-[15px] py-[10px]">
                    <div className="flex items-stretch w-[100%]   h-[100%] justify-start">
                      <div className="sec-1 flex items-center justify-start text-white">
                        <span className="mr-[5px] ">
                          <BsFillPersonFill className="w-[25px] h-[25px]" />
                        </span>
                        <span className="capitalize global-font-roboto text-[15px]  font-medium">
                          friends
                        </span>
                      </div>
                      <span className="w-[2px] rounded h-[100%] block bg-[#f5f6f888]  mx-[15px]"></span>
                      <div className="action-button-wrapper flex items-center justify-start gap-[20px]">
                        <button
                          className={`text-white  transition px-[5px] py-[1px] rounded-[5px] ${
                            UsersFriendType === "online"
                              ? "bg-[#2a2d31]"
                              : "hover:bg-[#2a2d31]"
                          }`}
                          onClick={() => ClickTheToFetchTheFriendType("online")}
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
                            UsersFriendType === "pendingRequest"
                              ? "bg-[#2a2d31]"
                              : "hover:bg-[#2a2d31]"
                          }`}
                          onClick={() =>
                            ClickTheToFetchTheFriendType("pendingRequest")
                          }
                        >
                          <span className="capitalize global-font-roboto text-[15px]  font-medium relative">
                            pending Request
                            {AllTheReceivedRequestOfTheUser.length > 0 ||
                              (AllTheSendRequestOfTheUser.length > 0 && (
                                <>
                                  <span className="absolute w-[10px] h-[10px] bg-[#f00] rounded-full top-[0px] right-[-5px]"></span>
                                  <span className="absolute w-[10px] h-[10px] bg-[#f00] rounded-full top-[0px] right-[-5px] animate-ping"></span>
                                </>
                              ))}
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
                      <div className="w-[32%] border-l-[1px] border-[rgb(255,255,255,0.1)] relative overflow-hidden">
                        <UsersFollowerAndFollowingComponent />
                      </div>
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

export default Dashboard;
