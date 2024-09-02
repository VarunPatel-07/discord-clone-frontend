import { Context } from "@/context/ContextApi";
import { getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

function LeaveServerAlertModal({
  ShowLeaveModal,
  setShowLeaveModal,
  ServerInfoById,
}: {
  ShowLeaveModal: boolean;
  setShowLeaveModal: React.Dispatch<React.SetStateAction<boolean>>;
  ServerInfoById: object;
}) {
  const Pathname = usePathname();
  const { push } = useRouter();
  const { LeaveFromServerFunction } = useContext(Context) as any;
  const leave__Server = async (server_info: any) => {
    
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const serverId = Pathname?.split("/")[3];
    const userId = JSON.parse(localStorage.getItem("User__Info") || "").id;
    
    server_info.members.map(async (member: any) => {
      if (member.userId === userId) {
        await LeaveFromServerFunction(AuthToken, serverId, userId, member.id);
        push("/pages/dashboard");
        setShowLeaveModal(false);
      }
    });
  };
  return (
    <div
      className={`absolute w-full h-full max-h-full max-w-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px] z-20 top-0 left-0 transition scale-0 opacity-0 not-visible m ${
        ShowLeaveModal ? "scale-100 opacity-100 visible" : "scale-0 opacity-0 invisible"
      } `}
    >
      <div className="w-100 h-100 flex items-center justify-center w-100 px-[15px]">
        <div className="modal-inner-section w-100  max-w-[600px] max-h-[600px] overflow-auto no- rounded-[10px] bg-[#f2f2f2] py-[15px]  ">
          <div className="inner-section">
            <div className="close-modal-button w-100 flex items-end justify-end px-[15px]">
              <button
                className="border-0 bg-transparent text-[30px]"
                onClick={() => {
                  setShowLeaveModal(false);
                }}
              >
                <IoIosCloseCircleOutline />
              </button>
            </div>
            <div className="invite-people-card-main-content-section w-100">
              <div className="card-title w-100 px-[15px]">
                <h3 className="font-mono text-[30px] capitalize text-indigo-600 text-center font-semibold ">
                  leave server
                </h3>
                <p className="global-font-roboto fs-16 text-center font-medium global-font-roboto  text-black mt-[20px] capitalize">
                  are you sure you want to leave this server
                </p>
              </div>
              <div className=" mt-8">
                <div className="flex items-stretch justify-between px-[15px] gap-[30px]">
                  <button
                    className="bg-transparent text-indigo-700 w-100 px-[15px] py-[8px] max-w-[150px]   rounded-[5px]  capitalize fs-18 font-medium global-font-roboto  transition hover:bg-indigo-700   border-[2px] border-indigo-700  hover:text-white"
                    type="submit"
                    onClick={() => {
                      setShowLeaveModal(false);
                    }}
                  >
                    cancel
                  </button>
                  <button
                    className="bg-rose-600 text-white w-100 px-[15px] py-[8x] max-w-[150px] rounded-[5px]  capitalize fs-18 font-medium global-font-roboto  transition hover:bg-rose-800 disabled:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed "
                    type="submit"
                    onClick={() => leave__Server(ServerInfoById)}
                  >
                    leave
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

export default LeaveServerAlertModal;
