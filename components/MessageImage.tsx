import { ImagesGroup } from "@/interface/ImagesGroup";
import { MessageProps } from "@/interface/MessageProps";
import { User } from "@/interface/UserProps";
import Image from "next/image";
import React from "react";

function MessageImage({ imageArray }: { imageArray: any }) {
  return (
    <div className="w-full h-full">
      {imageArray.length === 1 ? (
        <div className="w-full h-[200px] overflow-hidden">
          <Image alt="" src={imageArray[0]} width={300} height={300} className="w-full h-full object-cover rounded" />
        </div>
      ) : imageArray.length === 2 ? (
        <div className="grid grid-cols-2 gap-2 w-full h-[200px] overflow-hidden">
          {imageArray.slice(0, 2).map((img, index) => (
            <div className="w-full h-full" key={`_${index}_${img}`}>
              <Image alt="" src={img} width={200} height={300} className="w-full h-full object-cover rounded" />
            </div>
          ))}
        </div>
      ) : imageArray.length === 3 ? (
        <div className="grid grid-cols-2 gap-2 w-full h-[200px] overflow-hidden">
          {imageArray.slice(0, 2).map((img, index) => (
            <div className="w-full h-[200px] relative rounded overflow-hidden" key={`_${index}_${img}`}>
              <Image alt="" src={img} width={150} height={200} className="w-full h-full object-cover" />
              {index === 1 && imageArray.length > 2 && (
                <div className="absolute inset-0 top-0 left-0 bg-black bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center rounded text-white text-xl font-bold">
                  +{imageArray.length - 2}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-[300px] overflow-hidden">
          {imageArray.slice(0, 4).map((img, index) => (
            <div className="relative w-full h-full rounded overflow-hidden" key={`_${index}_${img}`}>
              <Image alt="" src={img} width={150} height={150} className="w-full h-full object-cover" />
              {index === 3 && imageArray.length > 4 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl rounded font-bold">
                  +{imageArray.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageImage;
