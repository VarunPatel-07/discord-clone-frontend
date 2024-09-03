import { Context } from "@/context/ContextApi";
import React, { useCallback, useState, useContext, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IoIosCloseCircle } from "react-icons/io";
import "./scss/components.css";
import Image from "next/image";
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
        <div className="drag-drop-image__content pt-4 flex items-center justify-center relative w-[110px]  mx-auto">
          <div className="relative  w-[100px] h-[100px] overflow-hidden rounded-full ">
            <Image
              src={Preview__Image__URL}
              alt="selected image"
              fill={true}
            ></Image>
          
          </div>
          <div
              className="absolute top-[15px] right-[5px] bg-black text-white rounded-50 fs-icon-30 cursor-pointer"
              onClick={Remove_Selected_Image}
            >
              <IoIosCloseCircle />
            </div>
        </div>
      )}
    </div>
  );
}

export default Single_Image_DragDrop;
