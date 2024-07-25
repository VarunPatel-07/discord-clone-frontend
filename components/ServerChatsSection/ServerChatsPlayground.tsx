import React from "react";
import ServerNavbar from "./PlaygroundNavbar/ServerNavbar";
import ServerFooterBar from "./PlaygroundNavbar/ServerFooterBar";

function ServerChatsPlayground() {
  return (
    <div className="w-[100%] h-[100%] relative">
      <ServerNavbar />
      <ServerFooterBar />
    </div>
  );
}

export default ServerChatsPlayground;
