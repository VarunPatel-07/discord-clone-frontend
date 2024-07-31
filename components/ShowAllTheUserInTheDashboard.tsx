import React, { useContext, useEffect, useState } from "react";

import UsersProfileCard from "./UsersProfileCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { getCookie } from "cookies-next";
import MouseLoader from "./MouseLoader";
import RequiredInfoNotFoundSection from "./RequiredInfoNotFoundSection";

function ShowAllTheUserInTheDashboard({
  ShowLoader,
  UsersInfo,
  currentPage,
}: {
  ShowLoader: boolean;
  UsersInfo: Array<Object>;
  currentPage: string;
}) {
  //
  //
  //
  const {
    AllTheSendRequestOfTheUser,
    AllTheReceivedRequestOfTheUser,
    FetchingAllTheSentRequestOfUser,
    FetchingAllTheReceivedRequestOfUser,
  } = useContext(Context) as any;
  //
  //
  //
  const [ShowLoadingBar, setShowLoadingBar] = useState(false as boolean);
  //
  //
  //
  const FetchTheSentRequestUsingDebounce = useDebounce(async () => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await FetchingAllTheSentRequestOfUser(AuthToken);
    setShowLoadingBar(false);
  }, 350);
  const FetchTheReceivedRequestUsingDebounce = useDebounce(async () => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await FetchingAllTheReceivedRequestOfUser(AuthToken);
    setShowLoadingBar(false);
  }, 350);

  useEffect(() => {
    setShowLoadingBar(true);
    FetchTheSentRequestUsingDebounce();
  }, []);
  const FetchTheSentRequest = () => {
    setShowLoadingBar(true);
    FetchTheSentRequestUsingDebounce();
  };
  const FetchTheReceivedRequest = () => {
    setShowLoadingBar(true);
    FetchTheReceivedRequestUsingDebounce();
  };
  if (ShowLoader) {
    return <MouseLoader />;
  } else if (currentPage === "pendingRequest") {
    return (
      <div className="w-[100%] h-[100%] pt-[45px]">
        <div className="flex flex-col w-[100%] h-[100%] relative">
          <div className="w-[100%] h-[100%] flex flex-col gap-[10px] mx-auto px-[15px] py-[25px] overflow-auto no-scrollbar">
            <Tabs
              defaultValue="SendRequest"
              className="w-[100%] h-[100%] flex flex-col items-center "
            >
              <TabsList className="bg-[#111213] w-[100%] max-w-[450px] text-center">
                <TabsTrigger
                  value="SendRequest"
                  className=" text-white w-[100%]"
                  onClick={FetchTheSentRequest}
                >
                  Request Sent
                </TabsTrigger>
                <TabsTrigger
                  value="ReceivedRequest"
                  className=" text-white w-[100%]"
                  onClick={FetchTheReceivedRequest}
                >
                  Request Received
                </TabsTrigger>
              </TabsList>
              <TabsContent value="SendRequest" className="w-[100%] h-[100%]">
                {ShowLoadingBar ? (
                  <MouseLoader />
                ) : (
                  <div className="w-[100%] h-[100%]">
                    {AllTheSendRequestOfTheUser.length === 0 ? (
                      <RequiredInfoNotFoundSection />
                    ) : (
                      <div className="w-[100%] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center gap-[30px]  mx-auto px-[15px] py-[25px] overflow-auto no-scrollbar">
                        {AllTheSendRequestOfTheUser.map((user: any) => {
                          return (
                            <UsersProfileCard
                              key={user.id}
                              user={user}
                              currentPage={currentPage}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              <TabsContent
                value="ReceivedRequest"
                className="w-[100%] h-[100%]"
              >
                {ShowLoadingBar ? (
                  <MouseLoader />
                ) : (
                  <div className="w-[100%] h-[100%]">
                    {AllTheReceivedRequestOfTheUser.length === 0 ? (
                      <RequiredInfoNotFoundSection />
                    ) : (
                      <div className="w-[100%] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center gap-[30px]  mx-auto px-[15px] py-[25px] overflow-auto no-scrollbar">
                        {AllTheReceivedRequestOfTheUser.map((user: any) => {
                          return (
                            <UsersProfileCard
                              key={user.id}
                              user={user}
                              currentPage={currentPage}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  } else {
    if (UsersInfo.length === 0) {
      return <RequiredInfoNotFoundSection />;
    } else {
      return (
        <div className="w-[100%] h-[100%] pt-[50px]">
          <div className="flex flex-col w-[100%] h-[100%] relative">
            <div className="header border-b-[1px] border-[rgb(255,255,255,0.1)] px-[15px] py-[25px]">
              <div className="w-[100%] flex flex-col gap-[5px] pb-[10px]">
                <h1 className="text-white text-[20px] capitalize">
                  Search for more Friends
                </h1>
                <p className="text-[rgb(255,255,255,0.5)] text-[14px] capitalize">
                  you can search users with their Discord username and add them
                  as your friend
                </p>
              </div>
              <div className="w-[100%] flex items-stretch justify-between gap-[20px] bg-black rounded-[10px] overflow-hidden px-[4px] py-[4px]">
                <div className="input w-[100%]">
                  <input
                    type="text"
                    className="w-[100%] h-[100%] bg-transparent text-white  px-[10px] border-0 focus:ring-0 focus:border-0 focus:outline-none"
                    placeholder="Search Friends"
                  />
                </div>
                <div className="button  min-w-fit bg-indigo-600 text-white px-[10px]  py-[6px] rounded-[5px]">
                  <button>Search Friends</button>
                </div>
              </div>
            </div>
            <div className="w-[100%] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center gap-[30px]  mx-auto px-[15px] py-[25px] overflow-auto no-scrollbar">
              {UsersInfo.map((user: any) => {
                return (
                  <UsersProfileCard
                    key={user.id}
                    user={user}
                    currentPage={currentPage}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default ShowAllTheUserInTheDashboard;
