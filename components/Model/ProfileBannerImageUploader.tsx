import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { IoIosCloseCircle, IoIosCloseCircleOutline } from "react-icons/io";

function ProfileBannerImageUploader({
  mainText,
  ShowProfileBannerImageUploaderModal,
  setShowProfileBannerImageUploaderModal,
  CurrentImageUrl,
  setCurrentImageUrl,
  UpdatedProfileBannerImage,
  setUpdatedProfileBannerImage,
}: {
  mainText: string;
  ShowProfileBannerImageUploaderModal: boolean;
  setShowProfileBannerImageUploaderModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  CurrentImageUrl: string;
  setCurrentImageUrl: React.Dispatch<React.SetStateAction<string>>;
  UpdatedProfileBannerImage: {
    Preview_Image: string;
    File_Of_Image: File;
  };
  setUpdatedProfileBannerImage: React.Dispatch<React.SetStateAction<any>>;
}) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const Image_URL = URL.createObjectURL(file);

      setCurrentImageUrl(Image_URL);

      setUpdatedProfileBannerImage({
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
        ShowProfileBannerImageUploaderModal
          ? "scale-100 opacity-100 visible"
          : ""
      } `}
    >
      <div className="w-100 h-100 flex items-center justify-center w-100 px-[15px]">
        <div className="modal-inner-section w-100  max-w-[600px] max-h-[600px] overflow-auto no- rounded-[10px] bg-[#f2f2f2] py-[15px]  ">
          <div className="inner-section">
            <div className="close-modal-button w-100 flex items-end justify-end px-[15px]">
              <button
                className="border-0 bg-transparent text-[30px]"
                onClick={() => {
                  setShowProfileBannerImageUploaderModal(false);
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
                {UpdatedProfileBannerImage.Preview_Image || CurrentImageUrl ? (
                  <div className=" w-[200px] h-[100px] rounded   mx-auto bg-black relative">
                    <picture>
                      <img
                        src={
                          UpdatedProfileBannerImage.Preview_Image
                            ? UpdatedProfileBannerImage.Preview_Image
                            : CurrentImageUrl
                        }
                        alt=""
                        className="w-100 h-100 object-cover  rounded w-[100%] h-[100px] "
                        loading="lazy"
                      />
                    </picture>
                    <div
                      className="absolute top-[-10px] right-[-10px] bg-black rounded-full cursor-pointer text-[24px] text-red-600"
                      onClick={() => {
                        console.log("clicked");
                        setUpdatedProfileBannerImage({
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

export default ProfileBannerImageUploader;
