import React, { useContext, useEffect, useState } from "react";

import UsersProfileCard from "./UsersProfileCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { getCookie } from "cookies-next";
import MouseLoader from "./Loader/MouseLoader";
import RequiredInfoNotFoundSection from "./NotFoundIndicatorComponent/RequiredInfoNotFoundSection";
import PendingRequestUserCard from "./PendingRequestUserCard";
import { ScrollArea } from "./ui/scroll-area";
import UseSocketIO from "@/hooks/UseSocketIO";

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
    AllTheFollowerOfTheUser,
    AllTheSendRequestOfTheUser,
    AllTheReceivedRequestOfTheUser,
    FetchTheUserOnTheBaseOfDemand,
    FetchingAllTheSentRequestOfUser,
    FetchingAllTheReceivedRequestOfUser,
    FetchAllTheFollowerOfTheUser,
  } = useContext(Context) as any;

  const socket = UseSocketIO();
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

  const FetchTheFollowerDataUsingDebounce = useDebounce(async () => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await FetchAllTheFollowerOfTheUser(AuthToken);
    setShowLoadingBar(false);
  }, 350);

  useEffect(() => {
    setShowLoadingBar(true);
    FetchTheSentRequestUsingDebounce();
    FetchTheFollowerDataUsingDebounce();
  }, []);

  //
  // ? all the code related to the socket io start from here
  //
  useEffect(() => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    socket?.on("EmitA_FollowRequestHasBeenWithdrawn", async () => {
      await FetchingAllTheSentRequestOfUser(AuthToken);
      await FetchingAllTheReceivedRequestOfUser(AuthToken);
    });

    socket?.on("EmitA_FollowRequestHasBeenIgnored", async () => {
      await FetchingAllTheSentRequestOfUser(AuthToken);
      await FetchingAllTheReceivedRequestOfUser(AuthToken);
    });

    socket?.on("EmitAnUser_UnBlocked_Successfully", async () => {
      await FetchTheUserOnTheBaseOfDemand(AuthToken, "blocked");
    });
    socket?.on("EmitAnUserBlockedSuccessfully", async () => {
      await FetchTheUserOnTheBaseOfDemand(AuthToken, "blocked");
    });
    return () => {
      socket?.off("EmitA_FollowRequestHasBeenWithdrawn");

      socket?.off("EmitA_FollowRequestHasBeenIgnored");

      socket?.off("EmitAnUser_UnBlocked_Successfully");
      socket?.off("EmitAnUserBlockedSuccessfully");
    };
  }, [socket]);
  //
  // ? all the code related to the socket io ended from here
  //

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
          <div className="w-[100%] h-[100%] flex flex-col gap-[10px] mx-auto px-[15px] pt-[25px]  no-scrollbar">
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
                  {AllTheSendRequestOfTheUser.length > 0 && (
                    <>
                      <span className="absolute w-[10px] h-[10px] bg-[#f00] rounded-full top-[0px] right-[-5px]"></span>
                      <span className="absolute w-[10px] h-[10px] bg-[#f00] rounded-full top-[0px] right-[-5px] animate-ping"></span>
                    </>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="ReceivedRequest"
                  className=" text-white w-[100%]"
                  onClick={FetchTheReceivedRequest}
                >
                  Request Received
                  {AllTheReceivedRequestOfTheUser.length > 0 && (
                    <>
                      <>
                        <span className="absolute w-[10px] h-[10px] bg-[#f00] rounded-full top-[0px] right-[-5px]"></span>
                        <span className="absolute w-[10px] h-[10px] bg-[#f00] rounded-full top-[0px] right-[-5px] animate-ping"></span>
                      </>
                    </>
                  )}
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
                      <>
                        <div className="w-[100%]  border-b-[1px] border-[rgba(255,255,255,0.3)] py-[10px]">
                          <p className="global-font-roboto text-white capitalize">
                            request received (
                            {AllTheSendRequestOfTheUser?.length})
                          </p>
                        </div>
                        <ScrollArea className="w-[100%] h-[100%]">
                          <div className="w-[100%] grid grid-cols-1  justify-center gap-[10px]  mx-auto px-[15px] pt-[15px] mb-[60px] overflow-auto no-scrollbar">
                            {AllTheSendRequestOfTheUser?.map((user: any) => {
                              return (
                                <PendingRequestUserCard
                                  key={user.id}
                                  user={user}
                                  currentPage={currentPage}
                                  requestSent={true}
                                />
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </>
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
                      <>
                        <div className="w-[100%]  border-b-[1px] border-[rgba(255,255,255,0.3)] py-[10px]">
                          <p className="global-font-roboto text-white capitalize">
                            request received (
                            {AllTheReceivedRequestOfTheUser?.length})
                          </p>
                        </div>
                        <ScrollArea className="w-[100%] h-[100%]">
                          <div className="w-[100%] grid grid-cols-1  justify-center gap-[10px]  mx-auto px-[15px] pt-[15px] mb-[60px] overflow-auto no-scrollbar">
                            {AllTheReceivedRequestOfTheUser?.map(
                              (user: any) => {
                                return (
                                  <PendingRequestUserCard
                                    key={user.id}
                                    user={user}
                                    currentPage={currentPage}
                                    requestSent={false}
                                  />
                                );
                              }
                            )}
                          </div>
                        </ScrollArea>
                      </>
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
                    SentRequest={AllTheSendRequestOfTheUser}
                    All_The_Follower_Of_The_User={AllTheFollowerOfTheUser}
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
