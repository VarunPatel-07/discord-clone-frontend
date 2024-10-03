import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { IoIosCloseCircleOutline } from "react-icons/io";
import PdfFileTypeIcon from "@/public/file-type-icons/pdf.png";
import docFileTypeIcon from "@/public/file-type-icons/google-docs.png";
import docxFileTypeIcon from "@/public/file-type-icons/docx-file.png";
import excelFileTypeIcon from "@/public/file-type-icons/excel.png";
import csvFileTypeIcon from "@/public/file-type-icons/csv.png";
import pptxFileTypeIcon from "@/public/file-type-icons/pptx-file.png";
import pptFileTypeIcon from "@/public/file-type-icons/ppt.png";
import rtfFileTypeIcon from "@/public/file-type-icons/rtf.png";
import txtFileTypeIcon from "@/public/file-type-icons/txt.png";
import zipFileTypeIcon from "@/public/file-type-icons/zip.png";
import markdownFileTypeIcon from "@/public/file-type-icons/substance.png";
import codeFileTypeIcon from "@/public/file-type-icons/markup.png";

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

  const onDrop = useCallback((files) => {
    if (isSending === "images") {
      files.map((file) => {
        const ImageUrl = URL.createObjectURL(file);
        setPreviewImagesUrls((Urls) => [...Urls, ImageUrl]);
        setSelectedImagesArray((previous) => [...previous, file]);
      });
    } else {
      console.log(files);
      files.map((file) => {
        setSelectedFilesFinalArray((previous) => [...previous, file]);
      });
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getTheFileExtension = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    let mimeType;

    switch (extension) {
      case "pdf":
        mimeType = "application/pdf";
        break;
      case "doc":
        mimeType = "application/msword";
        break;
      case "docx":
        mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case "xls":
        mimeType = "application/vnd.ms-excel";
        break;
      case "xlsx":
        mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
      case "csv":
        mimeType = "text/csv";
        break;
      case "ppt":
        mimeType = "application/vnd.ms-powerpoint";
        break;
      case "pptx":
        mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        break;
      case "rtf":
        mimeType = "application/rtf";
        break;
      case "txt":
        mimeType = "text/plain";
        break;
      case "zip":
        mimeType = "application/zip";
        break;
      case "md":
        mimeType = "text/markdown"; // or "application/octet-stream"
        break;
      case "html":
        mimeType = "text/html";
        break;
      case "css":
        mimeType = "text/css";
        break;
      default:
        mimeType = "application/octet-stream"; // Default for unknown types
    }

    // Now use the mimeType in the original switch to return the icon
    switch (mimeType) {
      case "application/pdf":
        return PdfFileTypeIcon;
      case "application/msword":
        return docFileTypeIcon;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return docxFileTypeIcon;
      case "application/vnd.ms-excel":
        return excelFileTypeIcon;
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return excelFileTypeIcon;
      case "text/csv":
        return csvFileTypeIcon;
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return pptxFileTypeIcon;
      case "application/vnd.ms-powerpoint":
        return pptFileTypeIcon;
      case "application/rtf":
        return rtfFileTypeIcon;
      case "text/plain":
        return txtFileTypeIcon;
      case "application/zip":
        return zipFileTypeIcon;
      case "application/octet-stream":
        return markdownFileTypeIcon; // Use markdown icon for octet-stream
      case "text/html":
        return codeFileTypeIcon;
      case "text/css":
        return codeFileTypeIcon;
      case "text/markdown":
        return markdownFileTypeIcon; // Use a specific icon for markdown
      default:
        return "Unknown MIME type";
    }
  };

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
    <div className="multiple-image-uploader">
      <div className="image-uploader-dropzone">
        <div {...getRootProps()} className="w-full ">
          <input {...getInputProps()} />
          <p className="px-[20px] text-center py-[18px] border-[3px] border-dashed border-violet-600 rounded capitalize">
            {isDragActive ? `Drag And Drop ${isSending}` : `Drag And Drop Your ${isSending} Hear ...`}
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
        <ScrollArea className="w-full h-[240px] py-[10px] max-w-[500px] ">
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
