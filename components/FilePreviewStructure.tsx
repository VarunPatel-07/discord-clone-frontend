import React from "react";
import PdfFileTypeIcon from "@/public/file-type-icons/pdf.png";
import Image from "next/image";
import SpinnerComponent from "./Loader/SpinnerComponent";
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
  const getFileExtension = (mimeType) => {
    switch (mimeType) {
      case "application/pdf":
        return ".pdf";
      case "application/msword":
        return ".doc";
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return ".docx";
      case "application/vnd.ms-excel":
        return ".xls";
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return ".xlsx";
      case "text/csv":
        return ".csv";
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return ".pptx";
      case "application/vnd.ms-powerpoint":
        return ".ppt";
      case "application/rtf":
        return ".rtf";
      case "text/plain":
        return ".txt";
      case "application/zip":
        return ".zip";
      case "application/octet-stream":
        return ".md";
      case "text/html":
        return ".html";
      case "text/css":
        return ".css";
      default:
        return "Unknown MIME type";
    }
  };
  const getFileLogoBasedOnTheExtension = (mineType) => {
    switch (mineType) {
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
        return markdownFileTypeIcon;
      case "text/html":
        return codeFileTypeIcon;
      case "text/css":
        return codeFileTypeIcon;
      default:
        return "Unknown MIME type";
    }
  };
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
              {fileInformation?.fileInfo?.public_id?.split("/")[1] + getFileExtension(fileInformation.fileType)}
            </p>
            <p className="text-gray-300 text-xs uppercase">{convertToMegabyte(fileInformation?.fileInfo?.bytes)}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default FilePreviewStructure;
