export const checkTheImageTypeThatIsBeingUploading = (fileName) => {
  const getFileMimeType = () => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      case "svg":
        return "image/svg+xml"; // SVG format
      case "bmp":
        return "image/bmp"; // BMP format
      case "tiff":
      case "tif":
        return "image/tiff"; // TIFF format
      case "heic":
      case "heif":
        return "image/heif"; // HEIC/HEIF format
      // Add more formats as needed
      default:
        return "unknown"; // or throw an error if you want to handle unsupported types
    }
  };

  const mimeType = getFileMimeType();
  const allowedImageFormats = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
    "image/heif",
  ];

  if (allowedImageFormats.includes(mimeType)) {
    return true;
  } else {
    return false;
  }
};
