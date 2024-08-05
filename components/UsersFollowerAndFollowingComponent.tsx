import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { useContext, useEffect, useState } from "react";
import MouseLoader from "./Loader/MouseLoader";
import { ScrollArea } from "@/components/ui/scroll-area";

import FollowerMoreActionModal from "./Model/FollowFollowingModal/FollowerMoreActionModal";
import FollowerProfileComponent from "./FollowerProfileComponent";
import FollowingUserMoreActionModal from "./Model/FollowFollowingModal/FollowingUserMoreActionModal";
import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { getCookie } from "cookies-next";
import FollowerNotFound from "./NotFoundIndicatorComponent/FollowerNotFound";
import NoFollowingFound from "./NotFoundIndicatorComponent/NoFollowingFound";
import UseSocketIO from "@/hooks/UseSocketIO";

function UsersFollowerAndFollowingComponent() {
  const socket = UseSocketIO();
  const [ShowFollowerMoreActionModal, setShowFollowerMoreActionModal] =
    useState(false as boolean);
  //
  //

  const [MoreActionModalForFollower, setMoreActionModalForFollower] = useState({
    UserId: "" as string,
    UserName: "" as string,
    FullName: "" as string,
    ProfilePicture: "" as string,
  });
  const [
    ShowFollowingUserMoreActionModal,
    setShowFollowingUserMoreActionModal,
  ] = useState(false as boolean);
  //
  //

  const [FollowingUserInfo, setFollowingUserInfo] = useState({
    UserId: "" as string,
    UserName: "" as string,
    FullName: "" as string,
    ProfilePicture: "" as string,
  });
  const [ShowLoader, setShowLoader] = useState(false as boolean);
  //
  //
  //

  const FollowerMoreActionButton = (user_info) => {
    setMoreActionModalForFollower({
      UserId: user_info.id,
      UserName: user_info.UserName,
      FullName: user_info.FullName,
      ProfilePicture: user_info.Profile_Picture,
    });
    setShowFollowerMoreActionModal(true);
  };
  const FollowingUserMoreActionButton = (user_info) => {
    console.log(user_info);
    setFollowingUserInfo({
      UserId: user_info.id,
      UserName: user_info.UserName,
      FullName: user_info.FullName,
      ProfilePicture: user_info.Profile_Picture,
    });
    setShowFollowingUserMoreActionModal(true);
  };
  //
  //
  //

  const {
    AllTheFollowerOfTheUser,
    AllTheFollowingOfTheUser,
    FetchAllTheFollowerOfTheUser,
    FetchAllTheFollowingOfTheUser,
    FetchTheUserOnTheBaseOfDemand,
  } = useContext(Context) as any;
  //
  //
  //
  const FetchTheFollowerDataUsingDebounce = useDebounce(async () => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await FetchAllTheFollowerOfTheUser(AuthToken);
    setShowLoader(false);
  }, 350);
  const FetchTheFollowingDataUsingDebounce = useDebounce(async () => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await FetchAllTheFollowingOfTheUser(AuthToken);
    setShowLoader(false);
  }, 350);

  const OnClickFetchFollower = () => {
    setShowLoader(true);
    FetchTheFollowerDataUsingDebounce();
  };
  const OnClickFetchFollowing = () => {
    setShowLoader(true);
    FetchTheFollowingDataUsingDebounce();
  };
  //
  //
  useEffect(() => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    socket?.on("EmitYourFollowRequestHasBeenAccepted", async () => {
      await FetchAllTheFollowingOfTheUser(AuthToken);
      await FetchAllTheFollowerOfTheUser(AuthToken);
    });
    socket?.on("EmitUserUnFollowedAnFollower", async (data) => {
      await FetchAllTheFollowerOfTheUser(AuthToken);
      await FetchAllTheFollowingOfTheUser(AuthToken);
      await FetchTheUserOnTheBaseOfDemand(AuthToken, "all");
    });
    socket?.on("EmitAnFollowerHasBeenRemoved", async () => {
      await FetchAllTheFollowerOfTheUser(AuthToken);
      await FetchAllTheFollowingOfTheUser(AuthToken);
      await FetchTheUserOnTheBaseOfDemand(AuthToken, "all");
    });
    socket?.on("EmitAnUserBlockedSuccessfully", async () => {
      await FetchAllTheFollowerOfTheUser(AuthToken);
      await FetchAllTheFollowingOfTheUser(AuthToken);
      await FetchTheUserOnTheBaseOfDemand(AuthToken, "blocked");
    });
    socket?.on("EmitAnUser_UnBlocked_Successfully", async () => {
      await FetchAllTheFollowerOfTheUser(AuthToken);
      await FetchAllTheFollowingOfTheUser(AuthToken);
    });
    return () => {
      socket?.off("EmitYourFollowRequestHasBeenAccepted");
      socket?.off("EmitUserUnFollowedAnFollower");
      socket?.off("EmitAnFollowerHasBeenRemoved");
      socket?.off("EmitAnUserBlockedSuccessfully");
      socket?.off("EmitAnUser_UnBlocked_Successfully");
    };
  }, [socket]);
  useEffect(() => {
    setShowLoader(true);
    FetchTheFollowingDataUsingDebounce();
  }, []);

  return (
    <>
      <div className="w-[100%] h-[100%]  overflow-hidden  pt-[45px]">
        <div className="flex flex-col w-[100%] h-[100%] overflow-hidden relative">
          <div className="w-[100%] h-[100%] flex flex-col gap-[10px] mx-auto  pt-[25px] overflow-auto no-scrollbar">
            <Tabs
              defaultValue="Following"
              className="w-[100%] h-[100%] overflow-hidden "
            >
              <div className="w-[100%] px-[15px]">
                <TabsList className="bg-[#111213] w-[100%] max-w-[450px] text-center ">
                  <TabsTrigger
                    value="Following"
                    className=" text-white w-[100%]"
                    onClick={OnClickFetchFollowing}
                  >
                    Following
                  </TabsTrigger>
                  <TabsTrigger
                    value="Follower"
                    className=" text-white w-[100%]"
                    onClick={OnClickFetchFollower}
                  >
                    Follower
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="Following" className="w-[100%] h-[100%]">
                {ShowLoader ? (
                  <MouseLoader />
                ) : (
                  <>
                    {AllTheFollowingOfTheUser?.length === 0 ? (
                      <NoFollowingFound />
                    ) : (
                      <ScrollArea className="w-[100%] h-[100%]">
                        {AllTheFollowingOfTheUser.map((user_info: any) => {
                          return (
                            <FollowerProfileComponent
                              userInfo={user_info}
                              OnclickActionButton={
                                FollowingUserMoreActionButton
                              }
                              CurrentState="Following"
                              key={user_info.id}
                              Is_FollowBack={true}
                            />
                          );
                        })}
                      </ScrollArea>
                    )}
                  </>
                )}
              </TabsContent>
              <TabsContent value="Follower" className="w-[100%] h-[100%]">
                {ShowLoader ? (
                  <MouseLoader />
                ) : (
                  <>
                    {AllTheFollowerOfTheUser?.length === 0 ? (
                      <FollowerNotFound />
                    ) : (
                      <ScrollArea className="w-[100%] h-[100%]">
                        {AllTheFollowerOfTheUser.map((user_info: any) => {
                          return (
                            <FollowerProfileComponent
                              userInfo={user_info}
                              OnclickActionButton={FollowerMoreActionButton}
                              key={user_info.id}
                              CurrentState="Follower"
                              Is_FollowBack={AllTheFollowingOfTheUser.some(
                                (user: any) => user.id === user_info.id
                              )}
                            />
                          );
                        })}
                      </ScrollArea>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <FollowerMoreActionModal
        userInfo={MoreActionModalForFollower}
        ShowModal={ShowFollowerMoreActionModal}
        setShowModal={setShowFollowerMoreActionModal}
      />
      <FollowingUserMoreActionModal
        userInfo={FollowingUserInfo}
        ShowModal={ShowFollowingUserMoreActionModal}
        setShowModal={setShowFollowingUserMoreActionModal}
      />
    </>
  );
}

export default UsersFollowerAndFollowingComponent;
