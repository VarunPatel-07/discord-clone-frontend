import React from "react";
import ServerNavbar from "./PlaygroundNavbar/ServerNavbar";
import ServerFooterBar from "./PlaygroundNavbar/ServerFooterBar";
import ShowChannelMessage from "./ShowChannelMessage";
import { ScrollArea } from "../ui/scroll-area";

function ServerChatsPlayground() {
  return (
    <div className="w-[100%] h-[100%]  overflow-hidden relative flex flex-col">
      <ServerNavbar />
      <ScrollArea className="w-[100%] h-[100%]">
        <ShowChannelMessage />
      </ScrollArea>
      <ServerFooterBar />
    </div>
  );
}

export default ServerChatsPlayground;
