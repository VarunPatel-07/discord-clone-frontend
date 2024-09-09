import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { IoIosCloseCircleOutline } from "react-icons/io";
function MultipleImageUploader() {
  const [previewImagesUrls, setPreviewImagesUrls] = useState([] as Array<string>);
  const onDrop = useCallback((files) => {
    files.map((file) => {
      console.log(file);
      const ImageUrl = URL.createObjectURL(file);

      setPreviewImagesUrls((Urls) => [...Urls, ImageUrl]);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeSpecificUrl = (image_url) => {
    const updatedUrls = previewImagesUrls.filter((ImageURL) => ImageURL !== image_url);
    setPreviewImagesUrls(updatedUrls);
  };

  return (
    <div className="multiple-image-uploader">
      <div className="image-uploader-dropzone">
        <div {...getRootProps()} className="w-full ">
          <input {...getInputProps()} />
          <p className="px-[20px] text-center py-[18px] border-[3px] border-dashed border-violet-600 rounded">
            {isDragActive ? "Drag And Drop Images" : "Drag And Drop Your Files Hear ..."}
          </p>
        </div>
      </div>
      {previewImagesUrls.length >= 1 ? (
        <ScrollArea className="w-full h-[240px] py-[10px] max-w-[500px] ">
          <div
            className={`flex items-stretch ${
              previewImagesUrls.length <= 1 ? "justify-center" : "justify-start"
            } flex-nowrap w-full h-full gap-[20px]`}>
            {previewImagesUrls.map((ImgUrl, index) => {
              return (
                <div
                  key={index}
                  className="w-full min-w-[200px] aspect-square max-w-[200px] rounded overflow-hidden relative group ">
                  <picture className="w-full h-full">
                    <source src={ImgUrl} />
                    <img src={ImgUrl} alt="" className="w-full h-full object-cover rounded " loading="lazy" />
                  </picture>
                  <div className="w-full h-full absolute top-0 left-0 bg-black/[0.5] flex items-center justify-center backdrop-blur-[4px] invisible group-hover:visible">
                    <button className="text-white w-[36px] h-[36px]" onClick={() => removeSpecificUrl(ImgUrl)}>
                      <IoIosCloseCircleOutline className="w-[36px] h-[36px] text-white" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : null}
    </div>
  );
}

export default MultipleImageUploader;
