import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { ConversationMessageInterface } from "@/interface/ConversationMessageInterface";
import { SelectedOneToOneChatInterface } from "@/interface/SelectedOneToOneChatInterface";
import { getCookie } from "cookies-next";
import React, { useContext, useEffect, useState } from "react";

function OneToOneConversationPlayground({
  selectedOneToOneChatInfo,
  conversationMessagesArray,
  setConversationMessagesArray,
}: {
  selectedOneToOneChatInfo: SelectedOneToOneChatInterface;
  conversationMessagesArray: Array<ConversationMessageInterface>;
  setConversationMessagesArray: React.Dispatch<React.SetStateAction<Array<ConversationMessageInterface>>>;
}) {
  const { FetchAllTheMessageOfAnOneToOneConversation } = useContext(Context) as any;

  const fetchTheConversationWithDebounce = useDebounce(async () => {
    const AuthToken = getCookie("User_Authentication_Token");
    const response = await FetchAllTheMessageOfAnOneToOneConversation(AuthToken, selectedOneToOneChatInfo?.id.trim());
    setConversationMessagesArray(response.data.Message);
  }, 350);
  useEffect(() => {
    if (selectedOneToOneChatInfo?.id !== "") {
      fetchTheConversationWithDebounce();
    }
  }, [selectedOneToOneChatInfo]);

  return <div></div>;
}

export default OneToOneConversationPlayground;
