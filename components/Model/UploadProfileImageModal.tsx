import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { IoIosCloseCircle, IoIosCloseCircleOutline } from "react-icons/io";

function UploadProfileImageModal({
  mainText,
  ShowProfileUploaderModal,
  setShowProfileUploaderModal,
  CurrentImageUrl,
  setCurrentImageUrl,
  UpdatedProfileImage,
  setUpdatedProfileImage,
}: {
  mainText: string;
  ShowProfileUploaderModal: boolean;
  setShowProfileUploaderModal: React.Dispatch<React.SetStateAction<boolean>>;
  CurrentImageUrl: string;
  setCurrentImageUrl: React.Dispatch<React.SetStateAction<string>>;
  UpdatedProfileImage: {
    Preview_Image: string;
    File_Of_Image: File;
  };
  setUpdatedProfileImage: React.Dispatch<React.SetStateAction<any>>;
}) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const Image_URL = URL.createObjectURL(file);

      setCurrentImageUrl(Image_URL);

      setUpdatedProfileImage({
        Preview_Image: Image_URL,
        File_Of_Image: file,
      });
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div
      className={`absolute w-full h-full max-h-full max-w-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px] z-20 top-0 left-0 transition scale-0 opacity-0 not-visible ${
        ShowProfileUploaderModal ? "scale-100 opacity-100 visible" : ""
      } `}
    >
      <div className="w-100 h-100 flex items-center justify-center w-100 px-[15px]">
        <div className="modal-inner-section w-100  max-w-[600px] max-h-[600px] overflow-auto no- rounded-[10px] bg-[#f2f2f2] py-[15px]  ">
          <div className="inner-section">
            <div className="close-modal-button w-100 flex items-end justify-end px-[15px]">
              <button
                className="border-0 bg-transparent text-[30px]"
                onClick={() => {
                  setShowProfileUploaderModal(false);
                  setCurrentImageUrl("");
                }}
              >
                <IoIosCloseCircleOutline />
              </button>
            </div>
            <div className="invite-people-card-main-content-section w-100">
              <div className="card-title w-100 px-[15px]">
                <h3 className="font-mono text-[30px] capitalize text-indigo-600 text-center font-semibold ">
                 {mainText}
                </h3>
              </div>
              <div className="server-information-section mt-8">
                {UpdatedProfileImage.Preview_Image || CurrentImageUrl ? (
                  <div className="profile-image w-[100px] h-[100px] rounded-full mx-auto bg-black relative">
                    <picture>
                      <img
                        src={
                          UpdatedProfileImage.Preview_Image
                            ? UpdatedProfileImage.Preview_Image
                            : CurrentImageUrl
                        }
                        alt=""
                        className="w-100 h-100 object-cover w-[100px] h-[100px] rounded-full"
                        loading="lazy"
                      />
                    </picture>
                    <div
                      className="absolute top-0 right-0 cursor-pointer text-[24px] text-red-600"
                      onClick={() => {
                        console.log("clicked");
                        setUpdatedProfileImage({
                          Preview_Image: "",
                          File_Of_Image: null,
                        });
                        setCurrentImageUrl("");
                      }}
                    >
                      <IoIosCloseCircle />
                    </div>
                  </div>
                ) : (
                  <div className="drag-drop-zone-section text-center border-dashed border-[3px] border-indigo-500 w-fit mx-auto rounded-[6px] py-[15px] px-[30px] fs-20 text-indigo-500 font-semibold ">
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
                  </div>
                )}
                <div className="input-section w-100 px-[15px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadProfileImageModal;
