import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";


function ServerDetails() {
  return (
    <>
      <div className="flex w-full h-full max-w-full max-h-full flex-col bg-[#202225]">
        <div className="w-100 navbar">
          <Navbar />
        </div>
        <div className="w-100 h-100">
          <div className="w-100 h-100 flex">
            <div className="w--15">
              <Sidebar />
            </div>
            <div className="w-100 bg-[#36393F] rounded overflow-auto">
              <div className="w-100 h-100 flex items-stretch">
                <div className="server-configuration w-[18%] bg-[#2F3136]">
                 
                </div>
                <div className="more-action-on-server-section w-[82%] bg-[#36393F]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServerDetails;
