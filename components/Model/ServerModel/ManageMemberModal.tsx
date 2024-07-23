import React, { useState, useEffect, useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { usePathname } from "next/navigation";
import { Context } from "@/context/ContextApi";
import { BsThreeDotsVertical } from "react-icons/bs";
import LineLoader from "@/components/LineLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCookie } from "cookies-next";

//

//

function ManageMemberModal({
  ShowManageServerMembersModal,
  setShowManageServerMembersModal,
  ServerInfoById,
}: {
  ShowManageServerMembersModal: boolean;
  setShowManageServerMembersModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  ServerInfoById: any;
}) {
  //
  const Pathname = usePathname();

  const {
    ChangingMemberRoleFunction,
    UserInformation,
    KickOutMemberFromServerFunction,
  } = useContext(Context) as any;

  const [ChangingTheMemberRole, setChangingTheMemberRole] = useState(
    false as boolean
  );
  //
  //

  //

  const Change___Member__Role = async (
    MemberId: string,
    MemberRole: string,
    user_Id: string
  ) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const serverId = Pathname?.split("/")[3];
    setChangingTheMemberRole(true);
    await ChangingMemberRoleFunction(
      AuthToken,
      serverId,
      MemberId,
      MemberRole,
      user_Id
    );
    setChangingTheMemberRole(false);
  };
  const KickOutMemberFromServer = async (userId: string, memberId: string) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const serverId = Pathname?.split("/")[3];

    await KickOutMemberFromServerFunction(
      AuthToken,
      serverId,
      userId,
      memberId
    );
  };
  return (
    <div
      className={`absolute w-full h-full max-h-full max-w-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px] z-20 top-0 left-0 transition scale-0 opacity-0 not-visible ${
        ShowManageServerMembersModal ? "scale-100 opacity-100 visible" : ""
      } `}
    >
      <div className="w-100 h-100 flex items-center justify-center w-100 px-[15px]">
        <div className="modal-inner-section w-100  max-w-[600px] max-h-[600px] overflow-auto no- rounded-[10px] bg-[#f5f5f5] py-[15px]  ">
          <div className="inner-section">
            <div className="close-modal-button w-100 flex items-end justify-end px-[15px]">
              <button
                className="border-0 bg-transparent text-[30px]"
                onClick={() => setShowManageServerMembersModal(false)}
              >
                <IoIosCloseCircleOutline />
              </button>
            </div>
            <div className="invite-people-card-main-content-section w-100">
              <div className="card-title w-100 px-[15px]">
                <h3 className="font-mono text-[30px] capitalize text-indigo-600 text-center font-semibold ">
                  Manage members
                </h3>
                <p className="global-font-roboto capitalize fs-14 font-medium text-center mt-4">
                  {ServerInfoById?.members?.length} members
                </p>
              </div>
              <div className="members-information-wrapper mt-8 flex flex-col items-start justify-start w-100 ">
                {ChangingTheMemberRole ? (
                  <div className="w-100 mx-auto flex items-center justify-center">
                    <LineLoader />
                  </div>
                ) : (
                  <>
                    {ServerInfoById?.members?.map((MemberInfo: any) => (
                      <div
                        className="user-avatar-wrapper-main w-100 transition hover:bg-[#020202da] border-b-[1px] py-[10px] px-[15px] rounded-[5px] cursor-pointer last:border-0 hover:text-white"
                        key={MemberInfo.userId}
                      >
                        <div className="w-100 flex items-center justify-between">
                          <div className="left-part">
                            <div className="avatar flex items-center justify-center gap-[10px] ">
                              <div className="profile-image">
                                <div className="w-[52px] h-[52px] rounded-full overflow-hidden">
                                  <Avatar className="w-[52px] h-[52px] rounded-full">
                                    <AvatarImage
                                      src={MemberInfo?.user?.Profile_Picture}
                                    />
                                    <AvatarFallback className="global-font-roboto uppercase fs-28 font-semibold bg-slate-500 text-white flex items-center justify-center">
                                      {MemberInfo?.user?.FullName.split("")[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              </div>
                              <div className="members-information flex flex-col items-start justify-start gap-[2px]">
                                <p className="global-font-roboto capitalize h-[20px] fs-16 font-medium ">
                                  {MemberInfo?.user?.FullName}
                                </p>
                                <p
                                  className={`username fs-14 ${
                                    MemberInfo.user?.Is_Online
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {MemberInfo.user?.Is_Online
                                    ? "Online"
                                    : "Offline"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="right-part flex items-center justify-center gap-[5px]">
                            <div className="role-of-member ">
                              {MemberInfo?.role === "ADMIN" ? (
                                <p className="global-font-roboto uppercase fs-14 font-medium rounded-[5px] bg-orange-200 px-[10px] py-[3px] text-center text-orange-900 ">
                                  ADMIN
                                </p>
                              ) : (
                                ""
                              )}
                              {MemberInfo?.role === "MODERATOR" ? (
                                <p className="global-font-roboto uppercase fs-14 font-medium rounded-[5px] bg-green-200 px-[10px] py-[3px] text-center text-green-900 ">
                                  moderator
                                </p>
                              ) : (
                                ""
                              )}
                              {MemberInfo?.role === "GUEST" ? (
                                <p className="global-font-roboto uppercase fs-14 font-medium rounded-[5px] bg-blue-200 px-[10px] py-[3px] text-center text-blue-900 ">
                                  GUEST
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                            {ServerInfoById.userId === UserInformation.id &&
                            MemberInfo?.role === "ADMIN" ? (
                              ""
                            ) : (
                              <>
                                {MemberInfo.role === "ADMIN" ? (
                                  ""
                                ) : (
                                  <div className="action-done-on-user">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger className="border-0 outline-none">
                                        <BsThreeDotsVertical />
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="bg-slate-600 p-0">
                                        <DropdownMenuItem className="p-0">
                                          {MemberInfo?.role === "MODERATOR" ? (
                                            <button
                                              className="global-font-roboto border-0 outline-none font-medium capitalize px-2 py-[12px] fs-16 w-100 transition rounded hover:bg-white text-white hover:text-black"
                                              onClick={() =>
                                                Change___Member__Role(
                                                  MemberInfo.id,
                                                  MemberInfo.role,
                                                  MemberInfo.userId
                                                )
                                              }
                                            >
                                              change to guest
                                            </button>
                                          ) : (
                                            <button
                                              className="global-font-roboto border-0 outline-none font-medium capitalize px-2 py-[12px] fs-16 w-100 transition rounded hover:bg-white text-white hover:text-black"
                                              onClick={() =>
                                                Change___Member__Role(
                                                  MemberInfo.id,
                                                  MemberInfo.role,
                                                  MemberInfo.userId
                                                )
                                              }
                                            >
                                              change to moderator
                                            </button>
                                          )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="p-0">
                                          <button
                                            className="global-font-roboto border-0 outline-none font-medium capitalize px-2 py-[12px] fs-16 w-100 transition rounded hover:bg-white text-white hover:text-black"
                                            onClick={() =>
                                              KickOutMemberFromServer(
                                                MemberInfo.userId,
                                                MemberInfo.id
                                              )
                                            }
                                          >
                                            kick user
                                          </button>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageMemberModal;
