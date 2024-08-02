import Image from "next/image";
import React from "react";
import illustration from "../../public/no-following.png";
function NoFollowingFound() {
  return (
    <div className="w-[100%]  pt-[50px] flex flex-col items-center justify-center ">
      <Image
        src={illustration}
        alt="cute girl"
        className="w-[100%]  max-h-[400px] max-w-[600px] m-auto"
      />
      <p className="text-[18px] text-center capitalize text-white global-font-roboto">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        you Don't follow anyone 😔
      </p>
    </div>
  );
}

export default NoFollowingFound;
