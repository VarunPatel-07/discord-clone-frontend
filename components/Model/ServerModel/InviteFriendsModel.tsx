import { Context } from "@/context/ContextApi";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { TbReload } from "react-icons/tb";
//

//

function InviteFriendsModel({
  ShowInviteMemberModal,
  setShowInviteMemberModal,

  ServerInfoById,
}: {
  ShowInviteMemberModal: boolean;
  setShowInviteMemberModal: React.Dispatch<React.SetStateAction<boolean>>;

  ServerInfoById: any;
}) {
  const Pathname = usePathname();
  //

  //
  const [Copy, setCopy] = useState(false as boolean);
  const [Updated__Invite__Code, setUpdated__Invite__Code] = useState({
    Updated: false as boolean,
    InviteCode: "" as string,
  });
  //

  //

  const { RegeneratingServerInviteCodeFunction } = useContext(Context) as any;

  //

  //
  const RegenerateServerInviteCode = async () => {
    setCopy(false);
    const AuthToken = localStorage.getItem("AuthToken");
    const serverId = Pathname?.split("/")[3];
    const Updated_Invite_Code = await RegeneratingServerInviteCodeFunction(
      AuthToken,
      serverId
    );
    if (Updated_Invite_Code?.success) {
      setUpdated__Invite__Code({
        Updated: true,
        InviteCode: Updated_Invite_Code?.inviteCode,
      });
    }
  };

  const CopyUrlButton = (inviteCode: string) => {
    
    if (!Copy) {
      setCopy(true);
      navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_SERVER_INVITE_BASE_LINK}/${inviteCode}`
      );
    } else {
      setCopy(false);
    }
  };

  return (
    <div
      className={`absolute w-full h-full max-h-full max-w-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px] z-20 top-0 left-0 transition scale-0 opacity-0 not-visible ${
        ShowInviteMemberModal ? "scale-100 opacity-100 visible" : ""
      } `}
    >
      <div className="w-100 h-100 flex items-center justify-center w-100 px-[15px]">
        <div className="modal-inner-section w-100  max-w-[500px] rounded-[10px] bg-[#f2f2f2] py-[15px] px-[15px]">
          <div className="inner-section">
            <div className="close-modal-button w-100 flex items-end justify-end">
              <button
                className="border-0 bg-transparent text-[30px]"
                onClick={() => {
                  setShowInviteMemberModal(false);
                  setCopy(false);
                }}
              >
                <IoIosCloseCircleOutline />
              </button>
            </div>
            <div className="invite-people-card-main-content-section w-100">
              <div className="card-title w-100">
                <h3 className="font-mono text-[30px] capitalize text-indigo-600 text-center font-semibold ">
                  Invite friends
                </h3>
              </div>
              <div className="invite-url-section mt-7">
                <p className="global-font-roboto uppercase fs-14 font-medium ">
                  server invite link
                </p>
                <div className="w-100    overflow-hidden  mt-3">
                  <div className="flex w-100 items-stretch justify-end gap-[8px]">
                    <div className="url w-[90%] flex items-center justify-start py-[5px] px-[6px] bg-[#000000] rounded-[3px]">
                      <p className="global-font-roboto  fs-14 font-medium text-ellipsis text-nowrap overflow-hidden text-start text-white ">
                        {`${process.env.NEXT_PUBLIC_SERVER_INVITE_BASE_LINK}/${
                          Updated__Invite__Code.Updated
                            ? Updated__Invite__Code.InviteCode
                            : ServerInfoById?.inviteCode
                        }`}
                      </p>
                    </div>
                    <div className="copy-button w-[10%] bg-[#d6d7db] rounded-[3px]  ">
                      <button
                        className={`bg-transparent w-100 h-100 px-[12px] flex items-center justify-center ${
                          Copy ? "text-green-500" : "text-slate-600"
                        } `}
                        onClick={() =>
                          CopyUrlButton(
                            Updated__Invite__Code.Updated
                              ? Updated__Invite__Code.InviteCode
                              : ServerInfoById?.inviteCode
                          )
                        }
                      >
                        {Copy ? <FaCheck /> : <MdContentCopy />}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="flex w-fit items-center justify-start gap-[10px] mt-4 cursor-pointer border-b-[1px] border-slate-500 text-slate-600"
                  onClick={RegenerateServerInviteCode}
                >
                  <p className="global-font-roboto capitalize fs-14 font-medium ">
                    generate a new link
                  </p>
                  <span className="flex items-center justify-center h-100">
                    <TbReload />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InviteFriendsModel;
