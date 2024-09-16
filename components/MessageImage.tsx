import Image from "next/image";
import React from "react";

function MessageImage({ imagesArray }: { imagesArray: Array<string> }) {
  return (
    <div className="w-full h-auto pb-[4px]">
      {imagesArray.length === 1 ? (
        // Case 1: Display a single image full-width
        <div className="w-full h-[200px]">
          <Image alt="" src={imagesArray[0]} width={300} height={300} className="w-full h-full object-cover rounded" />
        </div>
      ) : imagesArray.length === 2 ? (
        // Case 2: Display two images side by side
        <div className="grid grid-cols-2 gap-2 w-full h-[150px]">
          {imagesArray.slice(0, 2).map((img, index) => (
            <div className="w-full h-full" key={`_${index}_${img}`}>
              <Image alt="" src={img} width={150} height={300} className="w-full h-full object-cover rounded" />
            </div>
          ))}
        </div>
      ) : imagesArray.length === 3 ? (
        <div className="grid grid-cols-2 gap-2 w-full h-[150px]">
          {imagesArray.slice(0, 2).map((img, index) => (
            <div className="w-full h-[150px] relative" key={`_${index}_${img}`}>
              <Image alt="" src={img} width={150} height={150} className="w-full h-full object-cover rounded" />
              {index === 1 && imagesArray.length > 2 && (
                <div className="absolute inset-0 top-0 left-0 bg-black bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center text-white text-xl font-bold">
                  +{imagesArray.length - 2}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Case 4: Display four images in a 2x2 grid, with a "+N" overlay for remaining images
        <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-[300px]">
          {imagesArray.slice(0, 4).map((img, index) => (
            <div className="relative w-full h-full" key={`_${index}_${img}`}>
              <Image alt="" src={img} width={100} height={100} className="w-full h-full object-cover rounded" />
              {/* Show the overlay if it's the 4th image and there are more images */}
              {index === 3 && imagesArray.length > 4 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold">
                  +{imagesArray.length - 4}
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
