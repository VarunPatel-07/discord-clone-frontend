"use client";
import { Context } from "@/context/ContextApi";
import React, { useState, useContext } from "react";
import { IoIosCloseCircle } from "react-icons/io";

function CustomGlobalAlert() {
  //
  //
  const { GlobalAlertInformation, setGlobalAlertInformation } = useContext(
    Context
  ) as any;
  return (
    <div
      className={`absolute  transition-all  max-w-[500px]  rounded-[8px] border-[1px] bg-black  ${
        GlobalAlertInformation?.showAlert
          ? "bottom-[15px] right-[15px] opacity-100 scale-x-100 "
          : "bottom-[15px] right-[-100px] opacity-0 scale-x-0  "
      }`}
    >
      <div className="w-[100%] px-[15px] py-[10px]  relative">
        <p className="global-font-roboto fs-14 capitalize font-light text-white overflow-hidden text-ellipsis line-clamp-2">
          {GlobalAlertInformation?.title}
        </p>

        <button
          onClick={() =>
            setGlobalAlertInformation({
              showAlert: false,
              title: "",
            })
          }
          className="text-white w-[25px] h-[25px] absolute top-[-8px] right-[-8px] bg-black rounded-full"
        >
          <IoIosCloseCircle className="w-[25px] h-[25px] " />
        </button>
      </div>
    </div>
  );
}

export default CustomGlobalAlert;
