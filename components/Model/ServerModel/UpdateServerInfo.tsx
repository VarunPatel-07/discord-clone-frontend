import React, { useState, useContext, useCallback } from "react";
import { IoIosCloseCircle, IoIosCloseCircleOutline } from "react-icons/io";
import { useDropzone } from "react-dropzone";
import { Context } from "@/context/ContextApi";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next";

//

//

//

function UpdateServerInfo({
  ShowUpdateServerInformation,
  setShowUpdateServerInformation,
}: {
  ShowUpdateServerInformation: boolean;
  setShowUpdateServerInformation: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const Pathname = usePathname();
  //

  //

  const {
    UpdateServerInfoImage,
    setUpdateServerInfoImage,
    UpdatingServerInformationFunction,
  } = useContext(Context) as any;

  //

  //

  const [Preview__Image__URL, setPreview__Image__URL] = useState("" as string);
  const [Server__Name, setServer__Name] = useState("" as string);

  //

  //

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const Image_URL = URL.createObjectURL(file);

      setPreview__Image__URL(Image_URL);

      setUpdateServerInfoImage({
        Preview_Image: Image_URL,
        File_Of_Image: file,
      });
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  const RemoveTheProfileImage = () => {
    setPreview__Image__URL("");
    setUpdateServerInfoImage({
      Preview_Image: "",
      File_Of_Image: "",
    });
  };
  const Submit__Form__Function = async (e: any) => {
    e.preventDefault();
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const serverId = Pathname?.split("/")[3];
    const formData = new FormData();

    formData.append("serverId", serverId);
    formData.append("serverImage", UpdateServerInfoImage.File_Of_Image);
    formData.append("ServerName", Server__Name);

    await UpdatingServerInformationFunction(AuthToken, formData);
    setServer__Name("");
    setShowUpdateServerInformation(false);
  };

  //

  //

  return (
    <div
      className={`absolute w-full h-full max-h-full max-w-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px] z-20 top-0 left-0 transition scale-0 opacity-0 not-visible ${
        ShowUpdateServerInformation ? "scale-100 opacity-100 visible" : ""
      } `}
    >
      <div className="w-100 h-100 flex items-center justify-center w-100 px-[15px]">
        <div className="modal-inner-section w-100  max-w-[600px] max-h-[600px] overflow-auto no- rounded-[10px] bg-[#f2f2f2] py-[15px]  ">
          <div className="inner-section">
            <div className="close-modal-button w-100 flex items-end justify-end px-[15px]">
              <button
                className="border-0 bg-transparent text-[30px]"
                onClick={() => {
                  setShowUpdateServerInformation(false);
                  setServer__Name("");
                }}
              >
                <IoIosCloseCircleOutline />
              </button>
            </div>
            <div className="invite-people-card-main-content-section w-100">
              <div className="card-title w-100 px-[15px]">
                <h3 className="font-mono text-[30px] capitalize text-indigo-600 text-center font-semibold ">
                  Update Server Information
                </h3>
              </div>
              <div className="server-information-section mt-8">
                {Preview__Image__URL || UpdateServerInfoImage.Preview_Image ? (
                  <div className="profile-image w-[100px] h-[100px] rounded-full mx-auto bg-black relative">
                    <picture>
                      <img
                        src={
                          UpdateServerInfoImage.Preview_Image
                            ? UpdateServerInfoImage.Preview_Image
                            : Preview__Image__URL
                        }
                        alt=""
                        className="w-100 h-100 object-cover w-[100px] h-[100px] rounded-full"
                        loading="lazy"
                      />
                    </picture>
                    <div
                      className="absolute top-0 right-0 cursor-pointer text-[24px] text-red-600"
                      onClick={RemoveTheProfileImage}
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
                <div className="input-section w-100 px-[15px]">
                  <form className="form" onSubmit={Submit__Form__Function}>
                    <div className="flex flex-col items-start justify-start">
                      <label
                        htmlFor="Sever_Name"
                        className="global-font-roboto fs-14 font-medium global-font-roboto fs-14 text-black pb-2"
                      >
                        Sever Name
                      </label>
                      <input
                        className="w-100 bg-white py-[10px] px-[8px] rounded-[5px] text-black fs-14 global-font-roboto"
                        type="text"
                        id="Sever_Name"
                        name="Sever_Name"
                        placeholder="Enter Sever Name"
                        value={Server__Name}
                        onChange={(e: any) => {
                          setServer__Name(e.target.value);
                        }}
                        required
                      />
                    </div>

                    <button
                      className="bg-indigo-500 text-white w-100 px-[15px] py-[12px] rounded-[5px]  capitalize fs-18 font-medium global-font-roboto mt-9 transition hover:bg-indigo-700"
                      type="submit"
                    >
                      Update Server
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateServerInfo;
