import { Context } from "@/context/ContextApi";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

function DeleteChannelModal({
  ShowModal,
  setShowModal,
  ChannalInfo,
}: {
  ShowModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  ChannalInfo: any;
}) {
  const Pathname = usePathname();
  const { DeleteChannelFunction } = useContext(Context) as any;
  const Delete_Channel = () => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const serverId = Pathname?.split("/")[3];

    DeleteChannelFunction(AuthToken, serverId, ChannalInfo.id);
    setShowModal(false);
  };
  return (
    <div
      className={`w-[100vw] h-[100vh] fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] backdrop-blur z-20 ${
        ShowModal ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
    >
      <div className="w-100 h-100 flex items-center justify-center w-100 px-[15px]">
        <div className="modal-inner-section w-100  max-w-[600px] max-h-[600px] overflow-auto no- rounded-[10px] bg-[#f2f2f2] py-[15px]  ">
          <div className="inner-section">
            <div className="close-modal-button w-100 flex items-end justify-end px-[15px]">
              <button
                className="border-0 bg-transparent text-[30px]"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                <IoIosCloseCircleOutline />
              </button>
            </div>
            <div className="invite-people-card-main-content-section w-100">
              <div className="card-title w-100 px-[15px]">
                <h3 className="font-mono text-[30px] capitalize text-indigo-600 text-center font-semibold ">
                  delete channel
                </h3>
                <p className="global-font-roboto fs-16 text-center font-medium global-font-roboto  text-black mt-[20px] capitalize">
                  are you sure you want to delete this channel
                </p>
              </div>
              <div className=" mt-8">
                <div className="flex items-stretch justify-between px-[15px] gap-[30px]">
                  <button
                    className="bg-transparent text-indigo-700 w-100 px-[15px] py-[8px] max-w-[150px]   rounded-[5px]  capitalize fs-18 font-medium global-font-roboto  transition hover:bg-indigo-700   border-[2px] border-indigo-700  hover:text-white"
                    type="submit"
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    cancel
                  </button>
                  <button
                    className="bg-rose-600 text-white w-100 px-[15px] py-[8x] max-w-[150px] rounded-[5px]  capitalize fs-18 font-medium global-font-roboto  transition hover:bg-rose-800 disabled:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed "
                    type="submit"
                    onClick={Delete_Channel}
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteChannelModal;
