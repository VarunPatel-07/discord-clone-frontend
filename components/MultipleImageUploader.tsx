import Image from "next/image";
import React, { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { checkTheFileFormateOfThatIsBeingUploading, getTheFileExtension } from "@/helper/GetFileTypeAndFileIcon";
import { Context } from "@/context/ContextApi";
import { NotificationType } from "@/enums/enums";
import cloudUploadIcon from "@/public/cloud-computing.png";
import { checkTheImageTypeThatIsBeingUploading } from "@/helper/ImageTypeChecker";

function MultipleImageUploader({
  setSelectedImagesArray,
  isSending,
  setSelectedFilesFinalArray,
  selectedFilesFinalArray,
}: {
  setSelectedImagesArray: React.Dispatch<React.SetStateAction<Array<File>>>;
  isSending: string;
  setSelectedFilesFinalArray: React.Dispatch<React.SetStateAction<Array<File>>>;
  selectedFilesFinalArray: Array<File>;
}) {
  const [previewImagesUrls, setPreviewImagesUrls] = useState([] as Array<string>);
  const { GlobalNotificationHandlerFunction } = useContext(Context) as any;

  const onDrop = useCallback((files) => {
    if (isSending === "images") {
      files.map((file: File) => {
        const isAllowedFormate = checkTheImageTypeThatIsBeingUploading(file.name);
        if (isAllowedFormate) {
          const ImageUrl = URL.createObjectURL(file);
          setPreviewImagesUrls((Urls) => [...Urls, ImageUrl]);
          setSelectedImagesArray((previous) => [...previous, file]);
        } else {
          GlobalNotificationHandlerFunction(
            "",
            NotificationType.ERROR,
            `".${file.name.split(".")[1].toLocaleUpperCase()}"  is not a valid formate`,
            "top-right",
            1500
          );
        }
      });
    } else {
      files.map((file: File) => {
        const isAllowedFormate = checkTheFileFormateOfThatIsBeingUploading(file);
        if (isAllowedFormate) {
          setSelectedFilesFinalArray((previous) => [...previous, file]);
        } else {
          GlobalNotificationHandlerFunction(
            "",
            NotificationType.ERROR,
            `".${file.name.split(".")[1].toLocaleUpperCase()}"  is not a valid formate`,
            "top-right",
            1500
          );
        }
      });
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeSpecificUrl = (image_url, index) => {
    if (isSending === "images") {
      const updatedUrls = previewImagesUrls.filter((ImageURL) => ImageURL !== image_url);
      setPreviewImagesUrls(updatedUrls);

      setSelectedImagesArray((previous) => {
        const updatedArray = [...previous];
        updatedArray.splice(index, 1);
        return updatedArray;
      });
    } else {
      setSelectedFilesFinalArray((previous) => {
        const updatedFilesArray = [...previous];
        updatedFilesArray.splice(index, 1);
        return updatedFilesArray;
      });
    }
  };

  return (
    <div className="multiple-image-uploader h-full">
      <div className="image-uploader-dropzone h-full">
        <div
          {...getRootProps()}
          className={`w-full h-full fixed transition-all ${isDragActive ? "z-30" : "z-[1]"} top-0 left-0`}>
          <input {...getInputProps()} />
          <div className="w-full h-full p-2 pb-[72px]">
            <div
              className={`h-full rounded-xl transition-all relative z-50 ${
                isDragActive ? "bg-[rgba(0,0,0,0.35)]" : ""
              }`}>
              <div
                className={`w-full h-full rounded flex items-center justify-center ${
                  isDragActive ? "visible" : "invisible"
                }`}>
                <div className="min-w-80 min-h-80 aspect-square rounded-[100%] bg-black">
                  <div className="w-full h-full flex flex-col items-center justify-center gap-5">
                    <div className="min-w-28 min-h-28 aspect-auto bg-white rounded-[100%] flex items-center justify-center">
                      <Image
                        src={cloudUploadIcon}
                        height={100}
                        width={100}
                        className="w-20 h-20"
                        alt="cloud files upload"
                      />
                    </div>
                    <p className="text-base text-white capitalize gap-1">drop your {isSending} and upload it</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="px-[20px] text-center py-[18px] border-[3px] border-dashed border-violet-600 rounded capitalize">
        {isDragActive ? `Drop ${isSending}` : `Drag And Drop Your ${isSending} Hear ...`}
      </p>
      {previewImagesUrls.length >= 1 ? (
        <ScrollArea className="w-full h-[240px] py-[10px] max-w-[500px] relative z-10">
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
                    <button className="text-white w-[36px] h-[36px]" onClick={() => removeSpecificUrl(ImgUrl, index)}>
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
      {selectedFilesFinalArray.length >= 1 ? (
        <ScrollArea className="w-full h-[240px] py-[10px] max-w-[500px] relative z-10">
          <div
            className={`flex items-stretch ${
              previewImagesUrls.length <= 1 ? "justify-center" : "justify-start"
            } flex-nowrap w-full h-full gap-[20px]`}>
            {selectedFilesFinalArray.map((file: File, index) => {
              return (
                <div
                  key={index}
                  className="w-full min-w-[200px] aspect-square max-w-[200px] rounded overflow-hidden relative group ">
                  <div className="flex items-center flex-col justify-center gap-4 w-full h-full bg-gray-200 px-2">
                    <div className="file-image">
                      <Image
                        src={getTheFileExtension(file.name)}
                        width="100"
                        height="100"
                        alt="pdf file type icon"
                        className="min-w-14 max-w-14 min-h-14 h-full"
                      />
                    </div>
                    <div className="w-full">
                      <p className="text-black text-base line-clamp-1 text-ellipsis text-center w-full">{file.name}</p>
                    </div>
                  </div>
                  <div className="w-full h-full absolute top-0 left-0 bg-black/[0.5] flex items-center justify-center backdrop-blur-[4px] invisible group-hover:visible">
                    <button className="text-white w-[36px] h-[36px]" onClick={() => removeSpecificUrl(file, index)}>
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
