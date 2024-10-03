import React, { memo, useContext, useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import ChatsMessageProfile from "./chatsMessageProfile/ChatsMessageProfile";
import { Context } from "@/context/ContextApi";
import { getCookie } from "cookies-next";
import SpinnerComponent from "../Loader/SpinnerComponent";
import { useDebounce } from "@/hooks/debounceHook";

const ChatsListingOnSideBar = memo(({ IsDashboard }: { IsDashboard: boolean }) => {
  const { FetchingAllTheOneToOneConversation, UserInformation } = useContext(Context) as any;
  const [conversations, setConversations] = useState([] as Array<object>);
  const [loader, setLoader] = useState(true as boolean);

  const FetchAllTheConversationsWithDebounce = useDebounce(async () => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const response = await FetchingAllTheOneToOneConversation(AuthToken);
    if (response) setConversations(response?.data);
    setLoader(false);
  }, 350);

  useEffect(() => {
    setLoader(true);
    FetchAllTheConversationsWithDebounce();
  }, [FetchAllTheConversationsWithDebounce]);

  return (
    <>
      {loader ? (
        <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">
          <div>
            <SpinnerComponent />
          </div>
        </div>
      ) : (
        <ScrollArea className="w-[100%] h-[100%]">
          <div className="w-[100%] h-[100%]">
            {conversations.length > 0
              ? conversations.map((info: any) => {
                  return (
                    <ChatsMessageProfile
                      key={info.id}
                      ConversationsInfo={info}
                      IsDashboard={IsDashboard}
                      User_Info={UserInformation}
                    />
                  );
                })
              : "No Chats Found"}
          </div>
        </ScrollArea>
      )}
    </>
  );
});
ChatsListingOnSideBar.displayName = "ChatsListingOnSideBar";
export default ChatsListingOnSideBar;
