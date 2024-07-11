"use client";
import { Context } from "@/context/ContextApi";
import React, { useState, useContext } from "react";

function CustomGlobalAlert() {
  //
  //
  const { GlobalAlertInformation } = useContext(Context) as any;
  return (
    <div
      className={`absolute  transition-all  min-w-[450px]  rounded-[5px] bg-white overflow-hidden ${
        GlobalAlertInformation?.showAlert
          ? "bottom-[15px] right-[15px] opacity-100 visible"
          : "bottom-[-100px] right-[-100px] opacity-0 not-visible"
      }`}
    >
      <div className="w-[100%] px-[15px] py-[10px] relative">
        <p className="global-font-roboto fs-14 capitalize font-medium text-black">
          {GlobalAlertInformation?.title}
        </p>
        <p className="global-font-roboto fs-14 capitalize font-[400] text-black mt-[4px] mb-[6px]">
          {GlobalAlertInformation?.message}
        </p>
        <span className="absolute bottom-0 right-0 inline-block h-[10px] w-[100%] bg-[var(--discord-loader-main-color)]"></span>

      </div>
    </div>
  );
}

export default CustomGlobalAlert;
