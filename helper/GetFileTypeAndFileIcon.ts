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
import jsonFileTypeIcon from "@/public/file-type-icons/json.png";
import xmlFileTypeIcon from "@/public/file-type-icons/xml.png";
import jsFileTypeIcon from "@/public/file-type-icons/js-format.png";
import tsFileTypeIcon from "@/public/file-type-icons/ts.png";
import javaFileTypeIcon from "@/public/file-type-icons/java.png";
import htmlFileTypeIcon from "@/public/file-type-icons/html-5.png";
import cssFileTypeIcon from "@/public/file-type-icons/css-3.png";

export const checkTheFileFormateOfThatIsBeingUploading = (file: File) => {
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
        mimeType = "application/octet-stream"; // or "application/octet-stream"
        break;
      case "html":
        mimeType = "text/html";
        break;
      case "css":
        mimeType = "text/css";
        break;
      case "js":
        mimeType = "application/javascript";
        break;
      case "ts":
        mimeType = "application/typescript";
        break;
      case "json":
        mimeType = "application/json";
        break;
      case "py":
        mimeType = "application/x-python";
        break;
      case "java":
        mimeType = "text/x-java-source";
        break;
      case "c":
        mimeType = "text/x-c";
        break;
      case "cpp":
        mimeType = "text/x-c++src";
        break;
      case "cs":
        mimeType = "text/plain";
        break;
      case "rb":
        mimeType = "application/x-ruby";
        break;
      case "php":
        mimeType = "application/x-httpd-php";
        break;
      case "xml":
        mimeType = "application/xml";
        break;
      case "go":
        mimeType = "text/x-go";
        break;
      case "swift":
        mimeType = "text/x-swift";
        break;
      default:
        mimeType = ""; // Default for unknown types
    }
    return mimeType;
  };
  const fileType = getTheFileExtension(file.name);
  const allowedDocumentFormats = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", // Excel (.xls)
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-powerpoint",
    "application/rtf",
    "text/plain",
    "application/zip",
    "text/markdown",
    "text/html",
    "text/css",
    "application/octet-stream",
    "application/javascript",
    "application/typescript",
    "application/json",
    "application/x-python",
    "text/x-java-source",
    "text/x-c",
    "text/x-c++src",
    "application/x-ruby",
    "application/x-httpd-php",
    "application/xml",
    "text/x-go",
    "text/x-swift",
  ];

  if (allowedDocumentFormats.includes(fileType)) {
    return true;
  } else {
    return false;
  }
};

export const getTheFileExtension = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  let mimeType;

  // Determine MIME type based on file extension
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
      mimeType = "application/octet-stream"; // or "application/octet-stream"
      break;
    case "html":
      mimeType = "text/html";
      break;
    case "css":
      mimeType = "text/css";
      break;
    case "js":
      mimeType = "application/javascript"; // JavaScript
      break;
    case "ts":
      mimeType = "application/typescript"; // TypeScript
      break;
    case "json":
      mimeType = "application/json"; // JSON
      break;
    case "py":
      mimeType = "application/x-python"; // Python
      break;
    case "java":
      mimeType = "text/x-java-source"; // Java
      break;
    case "c":
      mimeType = "text/x-c"; // C
      break;
    case "cpp":
      mimeType = "text/x-c++src"; // C++
      break;
    case "rb":
      mimeType = "application/x-ruby"; // Ruby
      break;
    case "php":
      mimeType = "application/x-httpd-php"; // PHP
      break;
    case "xml":
      mimeType = "application/xml"; // XML
      break;
    case "go":
      mimeType = "text/x-go"; // Go
      break;
    case "swift":
      mimeType = "text/x-swift"; // Swift
      break;
    default:
      mimeType = ""; // Default for unknown types
  }
  return getFileLogoBasedOnTheExtension(mimeType);
};

export const getFileLogoBasedOnTheExtension = (mineType) => {
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
      return htmlFileTypeIcon;
    case "text/css":
      return cssFileTypeIcon;
    // Additional MIME types
    case "application/javascript": // js
      return jsFileTypeIcon;
    case "application/typescript": // ts
      return tsFileTypeIcon;
    case "application/json": // json
      return jsonFileTypeIcon;
    case "application/x-python": // py
      return codeFileTypeIcon;
    case "text/x-java-source": // java
      return javaFileTypeIcon;
    case "text/x-c": // c
      return codeFileTypeIcon;
    case "text/x-c++src": // cpp
      return codeFileTypeIcon;
    case "application/x-ruby": // rb
      return codeFileTypeIcon;
    case "application/x-httpd-php": // php
      return codeFileTypeIcon;
    case "application/xml": // xml
      return xmlFileTypeIcon;
    case "text/x-go": // go
      return codeFileTypeIcon;
    case "text/x-swift": // swift
      return codeFileTypeIcon;
    default:
      return "Unknown MIME type";
  }
};

export const getFileExtensionThroughMimeType = (mimeType) => {
  let extension;

  switch (mimeType) {
    case "application/pdf":
      extension = ".pdf";
      break;
    case "application/msword":
      extension = ".doc";
      break;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      extension = ".docx";
      break;
    case "application/vnd.ms-excel":
      extension = ".xls";
      break;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      extension = ".xlsx";
      break;
    case "text/csv":
      extension = ".csv";
      break;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      extension = ".pptx";
      break;
    case "application/vnd.ms-powerpoint":
      extension = ".ppt";
      break;
    case "application/rtf":
      extension = ".rtf";
      break;
    case "text/plain":
      extension = ".txt";
      break;
    case "application/zip":
      extension = ".zip";
      break;
    case "application/octet-stream":
      extension = ".md"; // You may want to consider changing this based on your needs.
      break;
    case "text/html":
      extension = ".html";
      break;
    case "text/css":
      extension = ".css";
      break;
    case "application/javascript":
      extension = ".js"; // JavaScript
      break;
    case "application/typescript":
      extension = ".ts"; // TypeScript
      break;
    case "application/json":
      extension = ".json"; // JSON
      break;
    case "application/x-python":
      extension = ".py"; // Python
      break;
    case "text/x-java-source":
      extension = ".java"; // Java
      break;
    case "text/x-c":
      extension = ".c"; // C
      break;
    case "text/x-c++src":
      extension = ".cpp"; // C++
      break;
    case "application/x-ruby":
      extension = ".rb"; // Ruby
      break;
    case "application/x-httpd-php":
      extension = ".php"; // PHP
      break;
    case "application/xml":
      extension = ".xml"; // XML
      break;
    case "text/x-go":
      extension = ".go"; // Go
      break;
    case "text/x-swift":
      extension = ".swift"; // Swift
      break;
    default:
      extension = "Unknown MIME type";
  }

  return extension;
};
