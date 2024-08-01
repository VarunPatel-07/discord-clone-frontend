"use client";
import { Context } from "@/context/ContextApi";
import React, { useContext } from "react";

function GlobalTopLoader() {
  const { GlobalTopBarAlertInformation } = useContext(Context) as any;
  return (
    <div
      className={`absolute top-0 left-[50%] translate-x-[-50%] z-20 w-fit  transition-all duration-300 ease-in-out  cursor-pointer ${
        GlobalTopBarAlertInformation.ShowAlert
          ? "translate-y-0 scale-x-100 opacity-100 visible"
          : " translate-y-[-300%] scale-x-0 opacity-0 invisible"
      }`}
    >
      <div className="w-[100%] flex items-center justify-center  pt-[6px]">
        <div className="bg-black  px-[15px] py-[6px] rounded-[5px] shadow shadow-[rgba(255,255,255,0.6)]">
          <p className="text-white global-font-roboto transition-all duration-1000 ease-in-out capitalize text-[15px] text-nowrap">
            {GlobalTopBarAlertInformation.Message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GlobalTopLoader;
