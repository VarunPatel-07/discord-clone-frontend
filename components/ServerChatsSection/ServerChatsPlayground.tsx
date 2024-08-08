import React from "react";
import ServerNavbar from "./PlaygroundNavbar/ServerNavbar";
import ServerFooterBar from "./PlaygroundNavbar/ServerFooterBar";
import ShowChannelMessage from "./ShowChannelMessage";

function ServerChatsPlayground() {
  return (
    <div className="w-[100%] h-[100%]  overflow-hidden relative flex flex-col">
      <ServerNavbar />
      <ShowChannelMessage />
      <ServerFooterBar />
    </div>
  );
}

export default ServerChatsPlayground;
