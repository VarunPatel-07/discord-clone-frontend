import { Context } from "@/context/ContextApi";
import React, { useCallback, useState, useContext, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IoIosCloseCircle } from "react-icons/io";
import "./scss/components.css";
function Single_Image_DragDrop() {
  // getting the context
  const { Server_Profile_Image, setServer_Profile_Image } = useContext(
    Context
  ) as any;
  const [Preview__Image__URL, setPreview__Image__URL] = useState("" as string);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const Image_URL = URL.createObjectURL(file);

      setPreview__Image__URL(Image_URL);
      //   setting it globally so it can be used in other components
      setServer_Profile_Image(Image_URL);
      // todo  start
      // make an object for the Server_Profile_Image
      // which is like this
      // {
      //   Preview__Image__URL
      //   File_Of_Image
      // }
      // todo end
    });
  }, []);
  useEffect(() => {
    if (Server_Profile_Image) {
      console.log("global image", Server_Profile_Image);
    }
  }, [Server_Profile_Image]);
  const Remove_Selected_Image = () => {
    setPreview__Image__URL("");
    setServer_Profile_Image("");
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="drag-drop-image">
      <div
        {...getRootProps()}
        className="drag-drop-image__uploader cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag n drop some files </p>
        )}
      </div>
      <div className="drag-drop-image__content pt-4 flex items-center justify-center">
        {Preview__Image__URL && (
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
        )}
      </div>
    </div>
  );
}

export default Single_Image_DragDrop;
