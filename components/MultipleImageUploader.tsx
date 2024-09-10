import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios, { AxiosProgressEvent } from "axios";
import { getCookie } from "cookies-next";
import { url } from "inspector";
import CircularProgressBar from "./ProgressBar/CircularProgressBar";
function MultipleImageUploader({
  setSelectedImagesArray,
}: {
  setSelectedImagesArray: React.Dispatch<React.SetStateAction<Array<File>>>;
}) {
  const [previewImagesUrls, setPreviewImagesUrls] = useState([] as Array<string>);
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;
  const [uploadingProgress, setUploadingProgress] = useState([] as Array<ProgressProps>);

  interface ProgressProps {
    ImageUrl: string;
    progress: Number;
  }

  const handelProgress = (ImageUrl: string, progress: Number) => {
    setUploadingProgress((prev) => {
      const CurrentData = [...prev];
      const index = CurrentData.findIndex((data: ProgressProps) => data.ImageUrl === ImageUrl);
      if (index !== -1) {
        CurrentData[index].progress = index;
      } else {
        CurrentData.push({ ImageUrl, progress });
      }
      return CurrentData;
    });
  };

  const UploadImagesOnTheCloud = async (file: File, ImageUrl: string) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const formData = new FormData();
    formData.append("Image", file);
    const response = await axios({
      method: "post",
      url: `${Host}/app/api/uploader/images/UploadImageToCloud`,
      headers: {
        Authorization: AuthToken,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 50;
        console.log(progress);
        handelProgress(ImageUrl, progress);
      },
    });
  };
  const onDrop = useCallback((files) => {
    files.map((file) => {
      const ImageUrl = URL.createObjectURL(file);
      setPreviewImagesUrls((Urls) => [...Urls, ImageUrl]);
      setSelectedImagesArray((previous) => [...previous, file]);
      UploadImagesOnTheCloud(file, ImageUrl);
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
                  {uploadingProgress.map((obj, progressIndex) =>
                    obj.ImageUrl === ImgUrl ? (
                      <div
                        key={progressIndex}
                        className="w-full h-full absolute top-0 left-0 bg-black/[0.5] flex items-center justify-center backdrop-blur-[4px]">
                        <CircularProgressBar percentage={obj.progress} />
                      </div>
                    ) : null
                  )}
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
