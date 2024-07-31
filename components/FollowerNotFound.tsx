import React from "react";
import GirlImage from "../public/cute-girl-png.png";
import Image from "next/image";
function FollowerNotFound() {
  return (
    <div className="w-[100%]  pt-[50px] flex flex-col items-center justify-center ">
      <Image
        src={GirlImage}
        alt="cute girl"
        className="w-[100%]  max-h-[400px] max-w-[600px] m-auto"
      />
      <p className="text-[18px] text-center capitalize text-white global-font-roboto">
        no one follow you 🥲
      </p>
    </div>
  );
}

export default FollowerNotFound;
