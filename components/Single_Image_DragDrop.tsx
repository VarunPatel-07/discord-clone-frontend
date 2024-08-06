import { Context } from "@/context/ContextApi";
import React, { useCallback, useState, useContext, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IoIosCloseCircle } from "react-icons/io";
import "./scss/components.css";
function Single_Image_DragDrop({
  MainText = "Drag and Drop an Image",
  AlternateText = "Drop the files here ...",
}: {
  MainText?: string;
  AlternateText?: string;
}) {
  // getting the context
  const { Global_Server_Profile_Image, setGlobal_Server_Profile_Image } =
    useContext(Context) as any;
  const [Preview__Image__URL, setPreview__Image__URL] = useState("" as string);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const Image_URL = URL.createObjectURL(file);

      setPreview__Image__URL(Image_URL);
      //   setting it globally so it can be used in other components
      setGlobal_Server_Profile_Image({
        Preview__Image__URL: Image_URL,
        File_Of_Image: file,
      });
    });
  }, []);

  const Remove_Selected_Image = () => {
    setPreview__Image__URL("");
    setGlobal_Server_Profile_Image("");
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="drag-drop-image">
      {!Preview__Image__URL ? (
        <div
          {...getRootProps()}
          className="drag-drop-image__uploader cursor-pointer"
        >
          <input {...getInputProps()} />
          {isDragActive ? <p>{AlternateText}</p> : <p>{MainText}</p>}
        </div>
      ) : (
        <div className="drag-drop-image__content pt-4 flex items-center justify-center">
          <div className="relative ">
            <picture className="single-image-preview">
              <source src={Preview__Image__URL} />
              <img
                src={Preview__Image__URL}
                loading="lazy"
                alt="selected image"
              />
            </picture>
            <div
              className="absolute top--10 right--10 bg-black text-white rounded-50 fs-icon-30 cursor-pointer"
              onClick={Remove_Selected_Image}
            >
              <IoIosCloseCircle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Single_Image_DragDrop;
