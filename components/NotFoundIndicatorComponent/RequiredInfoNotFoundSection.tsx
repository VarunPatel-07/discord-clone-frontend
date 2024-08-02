import Image from "next/image";
import React from "react";
import Illustration from "../../public/data-not-found.png";
function RequiredInfoNotFoundSection() {
  return (
    <div className="w-[100%] h-[100%] pt-[50px] flex flex-col items-center justify-center ">
      <Image
        src={Illustration}
        alt="cute girl"
        className="w-[100%] h-[100%] max-h-[400px] max-w-[600px] m-auto"
      />
    </div>
  );
}

export default RequiredInfoNotFoundSection;
