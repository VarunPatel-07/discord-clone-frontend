import React from "react";
import Image from "next/image";
import SpinnerComponent from "./Loader/SpinnerComponent";
import {
  getFileExtensionThroughMimeType,
  getFileLogoBasedOnTheExtension,
  getTheFileExtension,
} from "@/helper/GetFileTypeAndFileIcon";

function FilePreviewStructure({
  showUploadingLoader = true,
  pdfName,
  pdfSize,
  fileInformation,
  MessageSendBySender,
}: {
  showUploadingLoader?: Boolean;
  pdfName?: string;
  pdfSize?: number;
  fileInformation?: any;
  MessageSendBySender?: boolean;
}) {
  const convertToMegabyte = (byteValue) => {
    const valueInMb = byteValue / 1000000; // Convert to MB
    if (valueInMb < 1) {
      return `${(valueInMb * 1000).toFixed(2)} KB`; // Return in KB
    } else {
      return `${valueInMb.toFixed(2)} MB`; // Return in MB
    }
  };

  if (showUploadingLoader) {
    return (
      <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-emerald-600 max-w-[400px] rounded-sm ml-auto px-4 py-2.5 relative">
        <div className="flex items-center justify-start gap-5">
          <div className="file-image">
            <Image
              src={getTheFileExtension(pdfName)}
              width="100"
              height="100"
              alt="pdf file type icon"
              className="min-w-14 max-w-14 min-h-14 h-full"
            />
          </div>
          <div className="file-content flex items-start flex-col h-full gap-2">
            <p className="text-white text-base line-clamp-2">{pdfName}</p>
            <p className="text-gray-300 text-xs uppercase">{pdfSize}</p>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/[0.35] flex items-end justify-end gap-1">
          <div className="flex align-items-center justify-center pb-2 pr-2">
            <p className="text-white capitalize text-sm">sending...</p>
            <div>
              <SpinnerComponent />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`"w-full h-full ${
          MessageSendBySender
            ? "bg-gradient-to-r from-emerald-600 to-emerald-600"
            : "bg-gradient-to-r from-zinc-800 to-neutral-800"
        } max-w-[400px] rounded-sm ml-auto pl-2 pr-4 py-2.5`}>
        <div className="flex items-center justify-start gap-2 w-full">
          <div className="file-image">
            <Image
              src={getFileLogoBasedOnTheExtension(fileInformation.fileType)}
              width="100"
              height="100"
              alt="pdf file type icon"
              className="min-w-14 max-w-14 min-h-14 h-full"
            />
          </div>
          <div className="file-content flex items-start flex-col h-full gap-2 w-full max-w-[300px]">
            <p className="text-white text-base text-nowrap text-ellipsis overflow-hidden w-full">
              {fileInformation?.fileInfo?.public_id?.split("/")[1] +
                getFileExtensionThroughMimeType(fileInformation.fileType)}
            </p>
            <p className="text-gray-300 text-xs uppercase">{convertToMegabyte(fileInformation?.fileInfo?.bytes)}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default FilePreviewStructure;
