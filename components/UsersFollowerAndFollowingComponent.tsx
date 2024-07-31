import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { useContext, useEffect, useState } from "react";
import MouseLoader from "./MouseLoader";
import { ScrollArea } from "@/components/ui/scroll-area";

import FollowerMoreActionModal from "./Model/FollowFollowingModal/FollowerMoreActionModal";
import FollowerProfileComponent from "./FollowerProfileComponent";
import FollowingUserMoreActionModal from "./Model/FollowFollowingModal/FollowingUserMoreActionModal";
import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { getCookie } from "cookies-next";
import FollowerNotFound from "./FollowerNotFound";
import NoFollowingFound from "./NoFollowingFound";

function UsersFollowerAndFollowingComponent() {
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

  const FollowerMoreActionButton = () => {
    setShowFollowerMoreActionModal(true);
  };
  const FollowingUserMoreActionButton = () => {
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
    setShowLoader(true);
    FetchTheFollowingDataUsingDebounce;
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
              <TabsContent value="Follower" className="w-[100%] h-[100%]">
                {ShowLoader ? (
                  <MouseLoader />
                ) : (
                  <>
                    {AllTheFollowingOfTheUser?.length === 0 ? (
                      <FollowerNotFound />
                    ) : (
                      <ScrollArea className="w-[100%] h-[100%]">
                        <FollowerProfileComponent
                          userInfo={MoreActionModalForFollower}
                          OnclickActionButton={FollowerMoreActionButton}
                        />
                      </ScrollArea>
                    )}
                  </>
                )}
              </TabsContent>
              <TabsContent value="Following" className="w-[100%] h-[100%]">
                {ShowLoader ? (
                  <MouseLoader />
                ) : (
                  <>
                    {AllTheFollowerOfTheUser?.length === 0 ? (
                      <NoFollowingFound />
                    ) : (
                      <ScrollArea className="w-[100%] h-[100%]">
                        <FollowerProfileComponent
                          userInfo={MoreActionModalForFollower}
                          OnclickActionButton={FollowingUserMoreActionButton}
                        />
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
