import SpinnerComponent from "@/components/Loader/SpinnerComponent";
import { Avatar } from "@/components/ui/avatar";
import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getCookie } from "cookies-next";
import React, { useContext, useEffect, useRef, useState } from "react";

function FollowerMoreActionModal({
  userInfo,
  ShowModal,
  setShowModal,
}: {
  userInfo: {
    UserId: string;
    UserName: string;
    FullName: string;
    ProfilePicture: string;
  };
  ShowModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  //
  const { RemoveASpecificFollowerFunction } = useContext(Context) as any;
  const [Loader, setLoader] = useState(false as boolean);
  //
  //
  const RefBox = useRef<HTMLDivElement>(null);
  //
  //
  useEffect(() => {
    // Handler to call on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (RefBox.current && !RefBox.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //
  //
  const RemovingAnFollowerUsingDebounce = useDebounce(async (userId) => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    await RemoveASpecificFollowerFunction(AuthToken, userId);
    setLoader(false);
    setShowModal(false);
  }, 350);
  //
  //
  const RemoveAnFollower = async (user_id) => {
    setLoader(true);
    RemovingAnFollowerUsingDebounce(user_id);
  };
  //
  //
  //
  return (
    <div
      className={`show-more-action-modal w-[100%]  h-[100%]  bg-[rgba(0,0,0,0.15)] backdrop-blur-[3px] absolute bottom-0 left-0 flex flex-col justify-end py-[10px] transition-all duration-[0.1s]  ${
        ShowModal ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className={`w-[100%] px-[15px] flex  flex-col items-start justify-center gap-[10px] transition-all duration-[0.1s] ${
          ShowModal
            ? "translate-y-[0%] visible opacity-100"
            : "translate-y-[300%] invisible opacity-0"
        }`}
        ref={RefBox}
      >
        <div className="user-info-sec bg-[#000000] flex flex-col items-center justify-center gap-[12px]  pt-[15px] rounded-[10px] overflow-hidden">
          <div className="user-profile-info flex flex-col items-center justify-center w-[100%] gap-[15px] px-[20px]">
            <div className="profile">
              <Avatar className="w-[60px] h-[60px] flex items-center justify-center bg-white rounded-full">
                <AvatarImage
                  src={userInfo.ProfilePicture}
                  className="w-[100%] h-[100%] "
                />
                <AvatarFallback className=" capitalize font-medium text-[30px]  text-black">
                  {userInfo.FullName.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-section ">
              <p className="text-[14px] text-center global-font-roboto text-slate-300">
                {/*  eslint-disable-next-line react/no-unescaped-entities */}
                we won't tell {userInfo.UserName} that they where removed from
                your followers
              </p>
            </div>
          </div>
          <div className="remove-button w-[100%]">
            <button
              className="bg-[#000000] flex fle-col items-center justify-center px-[20px] py-[12px] text-rose-500  font-medium capitalize  w-[100%] border-t-[1px] border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)]"
              onClick={() => RemoveAnFollower(userInfo.UserId)}
            >
              {Loader ? <SpinnerComponent /> : "Remove"}
            </button>
          </div>
        </div>
        <div className="cancel-button w-[100%]">
          <button
            className="bg-[#000000] flex fle-col items-center justify-center px-[20px] py-[10px] text-white capitalize rounded-[10px] w-[100%]"
            onClick={() => setShowModal(false)}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default FollowerMoreActionModal;
