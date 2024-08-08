"use client";
import ColorPicker from "@/components/ColorPicker";
import DiscordLogoAnimation from "@/components/DiscordLogoAnimation";
import GlobalDiscordLoader from "@/components/Loader/GlobalDiscordLoader";
import SpinnerComponent from "@/components/Loader/SpinnerComponent";
import ProfileBannerImageUploader from "@/components/Model/ProfileBannerImageUploader";
import UploadProfileImageModal from "@/components/Model/UploadProfileImageModal";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Context } from "@/context/ContextApi";

import { useDebounce } from "@/hooks/debounceHook";
import isValidUrl from "@/hooks/Is_Valid_URL";
import UseSocketIO from "@/hooks/UseSocketIO";
import { AvatarFallback } from "@radix-ui/react-avatar";

import { deleteCookie, getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState, useRef } from "react";
import { FaPen } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

function Profile() {
  //
  //
  const { push } = useRouter();
  //
  //
  const {
    UserInfoFetchingFunction,
    UserInformation,
    UpdatingTheUserProfileDetails,
    CheckUsersLoginStatus,
  } = useContext(Context) as any;
  //
  //
  const socket = UseSocketIO();
  //
  //
  const ColorPickerRefOne =
    useRef() as React.MutableRefObject<HTMLInputElement>;
  const ColorPickerRefTwo =
    useRef() as React.MutableRefObject<HTMLInputElement>;
  //
  //
  const [Discord_Loader, setDiscord_Loader] = useState(true);
  const [Is_Editable, setIs_Editable] = useState(false as boolean);
  const [ShowColorPicker, setShowColorPicker] = useState(false);
  const [ChangedColorForBanner, setChangedColorForBanner] = useState(
    "" as string
  );
  const [ChangedColorForProfileBgColor, setChangedColorForProfileBgColor] =
    useState("" as string);
  const [ShowColorPickerForProfile, setShowColorPickerForProfile] = useState(
    false as boolean
  );
  const [ProfileChangeDoneByEditing, setProfileChangeDoneByEditing] = useState({
    FullName: "" as string,
    UserName: "" as string,
    Email: "" as string,
  });
  const [ShowProfileUploaderModal, setShowProfileUploaderModal] = useState(
    false as boolean
  );
  const [UpdatedProfileImage, setUpdatedProfileImage] = useState({
    Preview_Image: "" as string,
    File_Of_Image: null as unknown as File,
  });
  const [CurrentImageUrl, setCurrentImageUrl] = useState(
    UserInformation.Profile_Picture as string
  );
  const [UpdatedProfileBannerImage, setUpdatedProfileBannerImage] = useState({
    Preview_Image: "" as string,
    File_Of_Image: null as unknown as File,
  });
  const [LogOutLoader, setLogOutLoader] = useState(false as boolean);
  const [
    ShowProfileBannerImageUploaderModal,
    setShowProfileBannerImageUploaderModal,
  ] = useState(false as boolean);

  const [CurrentBannerImageUrl, setCurrentBannerImageUrl] = useState(
    UserInformation.ProfileBanner_Img as string
  );
  const [Loader, setLoader] = useState(false as boolean);
  //
  //
  //
  //
  const OnChange = (e: any) => {
    const { name, value } = e.target;
    setProfileChangeDoneByEditing({
      ...ProfileChangeDoneByEditing,
      [name]: value,
    });
  };
  //
  //
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await CheckUsersLoginStatus();
        if (status) {
          setDiscord_Loader(false);
        } else {
          setDiscord_Loader(false);
          push("/pages/login");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkStatus();

    const AuthToken = getCookie("User_Authentication_Token") as string;

    UserInfoFetchingFunction(AuthToken);
    setDiscord_Loader(false);
  }, []);
  //
  //
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ColorPickerRefOne.current &&
        !ColorPickerRefOne.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //
  //
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ColorPickerRefTwo.current &&
        !ColorPickerRefTwo.current.contains(event.target as Node)
      ) {
        setShowColorPickerForProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //
  //
  const FetchingTheUserInfoWithDebounce = useDebounce(
    async (AuthToken: string, formData: FormData) => {
      await UpdatingTheUserProfileDetails(AuthToken, formData);
      setUpdatedProfileBannerImage({
        File_Of_Image: [] as unknown as File,
        Preview_Image: "",
      });
      setLoader(false);
      setIs_Editable(false);
    },
    500
  );
  //
  //
  const OnFormSubmit = async (e: any) => {
    setLoader(true);
    e.preventDefault();
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const formData = new FormData();
    formData.append("FullName", ProfileChangeDoneByEditing.FullName);
    formData.append("UserName", ProfileChangeDoneByEditing.UserName);
    formData.append("Email", ProfileChangeDoneByEditing.Email);
    formData.append("ProfileBgColor", ChangedColorForProfileBgColor);
    formData.append("profilePicture", UpdatedProfileImage.File_Of_Image);
    formData.append(
      "ProfileBannerImage",
      UpdatedProfileBannerImage.File_Of_Image
    );
    formData.append("ProfileBanner_Color", ChangedColorForBanner);
    console.log(UpdatedProfileBannerImage.File_Of_Image);

    FetchingTheUserInfoWithDebounce(AuthToken, formData);
  };
  //
  //
  useEffect(() => {
    const AuthToken = getCookie("User_Authentication_Token") as string;
    socket?.on("EmitUserProfileUpdatedSuccessfully", () => {
      UserInfoFetchingFunction(AuthToken);
      setDiscord_Loader(false);
    });
  }, [socket]);
  //
  //
  const LogOutWithDebounce = useDebounce(async () => {
    deleteCookie("User_Authentication_Token");
    deleteCookie("User__Info");
    const checkStatus = async () => {
      try {
        const status = await CheckUsersLoginStatus();
        if (status) {
          setDiscord_Loader(false);
        } else {
          setDiscord_Loader(false);
          push("/pages/login");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkStatus();
    setLogOutLoader(false);
  }, 350);
  //
  //
  const LogOutButton = () => {
    setLogOutLoader(true);
    LogOutWithDebounce();
  };
  //
  //
  if (Discord_Loader) {
    return <GlobalDiscordLoader />;
  } else {
    return (
      <>
        <div className="bg-[#36393F] w-[100%] h-[100%] px-[15px] overflow-auto no-scrollbar">
          <div className="back-button pt-[40px] xl:max-w-[80%] mx-auto">
            <Link href="/pages/dashboard" className="w-fit block">
              <span className="flex items-center gap-[10px] bg-white text-black rounded-full px-[20px] py-[10px] ">
                <FaArrowLeftLong />
                <span>Back</span>
              </span>
            </Link>
          </div>
          <div className=" xl:max-w-[80%] mx-auto pt-[50px]  pb-[100px] gap-[20px] flex items-start justify-between">
            <div className="user-profile-card w-[35%]  sticky left-0 top-[20px]">
              <div className="bg-[rgb(0,0,0)]  backdrop-blur-[30px] px-[15px] py-[15px] w-[100%] rounded-[10px] border-[1px] border-[rgba(255,255,255,0.05)] cursor-pointer  max-w-[350px] transition-all overflow-hidden shadow-2xl ">
                <div className="inner-section flex flex-col gap-[20px]  items-center">
                  <div className="flex flex-col items-start  justify-start gap-[20px] w-[100%]">
                    <div className="profile w-[100%]">
                      {isValidUrl(UserInformation.ProfileBanner_Img) ? (
                        <div
                          className={`w-full h-[100px] absolute top-0 left-0`}
                        >
                          <picture>
                            <source
                              src={UserInformation.ProfileBanner_Img}
                              type=""
                            />
                            <img
                              src={UserInformation.ProfileBanner_Img}
                              className="w-[100%] h-[100%] "
                              alt="banner image"
                            />
                          </picture>
                        </div>
                      ) : (
                        <div
                          className={`w-full h-[100px] absolute top-0 left-0`}
                          style={{
                            backgroundColor:
                              !Is_Editable || !ChangedColorForBanner
                                ? UserInformation.ProfileBanner_Color
                                : ChangedColorForBanner,
                          }}
                        ></div>
                      )}
                      <div className="w-[100%] flex  items-center justify-center">
                        <div className="relative w-[110px] h-[110px] outline outline-[4px] outline-black rounded-full overflow-hidden mt-[20px] group  ">
                          <Avatar
                            className="w-[100%] h-[100%] flex items-center justify-center rounded-full overflow-hidden relative z-[15] "
                            style={{
                              backgroundColor: UserInformation.ProfileBgColor,
                            }}
                          >
                            <AvatarImage
                              src={
                                !Is_Editable ||
                                !UpdatedProfileImage.Preview_Image
                                  ? UserInformation.Profile_Picture
                                  : UpdatedProfileImage.Preview_Image
                              }
                              className="w-[100%] h-[100%] "
                            />
                            <AvatarFallback className=" capitalize font-medium text-[30px]  text-white">
                              {UserInformation.FullName?.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div className=" w-full h-full bg-[#36393f48] absolute top-0 left-0 z-20 invisible opacity-0 transition duration-[0.3s] group-hover:visible group-hover:opacity-100">
                            <div className="w-full h-full flex items-center justify-center">
                              <button
                                onClick={() => {
                                  setIs_Editable(true);
                                  setShowProfileUploaderModal(true);
                                }}
                              >
                                <FaPen className="w-[25px] h-[25px] text-white  " />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" flex flex-col w-[100%]  items-center justify-center  gap-[0px]">
                      <h4 className="text-white global-font-roboto  text-[18px]  font-[500] w-[100%] text-nowrap text-ellipsis overflow-hidden max-w-[90%] text-center">
                        {!Is_Editable ||
                        ProfileChangeDoneByEditing.FullName === ""
                          ? UserInformation.FullName
                          : ProfileChangeDoneByEditing.FullName}
                      </h4>
                      <p className="text-[#ededef] global-font-roboto  text-[16px]  font-[400] w-[100%] text-nowrap text-ellipsis overflow-hidden max-w-[90%] text-center">
                        {!Is_Editable ||
                        ProfileChangeDoneByEditing.UserName === ""
                          ? UserInformation.UserName
                          : ProfileChangeDoneByEditing.UserName}
                      </p>
                    </div>
                    <div className="follower flex items-center justify-between w-[100%]">
                      <p className="text-white global-font-roboto  text-[16px] w-[50%] font-[400] flex flex-col gap-[1px] items-center justify-center">
                        <span className="text-[#ededef] block">
                          {UserInformation.followers?.length}
                        </span>
                        <span className="text-[#ededef] block">Following</span>
                      </p>
                      <p className="text-white global-font-roboto  text-[16px]  w-[50%] font-[400] flex flex-col gap-[1px] items-center justify-center">
                        <span className="text-[#ededef] block">
                          {UserInformation.following?.length}
                        </span>
                        <span className="text-[#ededef] block">Followers</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[100%]  flex flex-col items-start justify-end w-[65%] ">
              <form className="w-[100%]" onSubmit={(e) => OnFormSubmit(e)}>
                <div className="edit-profile flex items-center justify-end gap-[20px] w-[100%] border-b-[1px] border-[rgba(255,255,255,0.1)] pb-[15px] mb-[20px]">
                  {Is_Editable ? (
                    <>
                      <button
                        onClick={() => {
                          setIs_Editable(!Is_Editable);
                        }}
                        className="text-[#000000] global-font-roboto  text-[16px] font-[500] bg-white px-[10px] py-[5px] rounded-[5px] capitalize transition-all duration-[0.1s]"
                        type="button"
                      >
                        cancel
                      </button>
                      <button
                        className="text-[#efecec] global-font-roboto  text-[16px] font-[500] bg-green-600 px-[10px] py-[5px] rounded-[5px] capitalize transition-all duration-[0.1s]"
                        type="submit"
                      >
                        {Loader ? <SpinnerComponent /> : "Update"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setIs_Editable(!Is_Editable);
                      }}
                      className="text-[#ffffff] global-font-roboto  text-[16px] font-[500] bg-indigo-700 px-[10px] py-[5px] rounded-[5px] transition-all duration-[0.1s]  capitalize"
                      type="button"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-[35px] w-[100%]">
                  <div className="flex  gap-[20px]">
                    <div className="flex flex-col gap-[5px] w-[100%] md:w-[50%]">
                      <label htmlFor="" className="text-[#c9cacc] ">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={
                          !Is_Editable ||
                          ProfileChangeDoneByEditing.FullName === ""
                            ? UserInformation?.FullName
                            : ProfileChangeDoneByEditing.FullName
                        }
                        className="px-[10px]   border-[1px] border-[rgba(0,0,0,0.7)]  text-white py-[8px]  rounded-[8px]  global-font-roboto focus:outline-none  focus:border-rose-600 bg-[rgba(0,0,0,0.7)] disabled:opacity-80 transition-all duration-[0.3s]"
                        disabled={!Is_Editable}
                        name="FullName"
                        onChange={OnChange}
                      />
                    </div>
                    <div className="flex flex-col gap-[5px] w-[100%] md:w-[50%]">
                      <label htmlFor="" className="text-[#c9cacc] ">
                        UserName
                      </label>
                      <input
                        type="text"
                        value={
                          !Is_Editable ||
                          ProfileChangeDoneByEditing.UserName === ""
                            ? UserInformation?.UserName
                            : ProfileChangeDoneByEditing.UserName
                        }
                        className="px-[10px]  transition-all border-[1px] border-[rgba(0,0,0,0.7)]  text-white py-[8px]  rounded-[8px]  global-font-roboto focus:outline-none  focus:border-rose-600 bg-[rgba(0,0,0,0.7)] disabled:opacity-80 duration-[0.3s]"
                        disabled={!Is_Editable}
                        name="UserName"
                        onChange={OnChange}
                      />
                    </div>
                  </div>
                  <div className="flex  gap-[20px]">
                    <div className="flex flex-col gap-[5px] w-[100%] ">
                      <label htmlFor="" className="text-[#c9cacc] ">
                        Email
                      </label>
                      <input
                        type="text"
                        value={
                          !Is_Editable ||
                          ProfileChangeDoneByEditing.Email === ""
                            ? UserInformation?.Email
                            : ProfileChangeDoneByEditing.Email
                        }
                        className="px-[10px]  transition-all border-[1px] border-[rgba(0,0,0,0.7)]  text-white py-[8px]  rounded-[8px]  global-font-roboto focus:outline-none  focus:border-rose-600 bg-[rgba(0,0,0,0.7)] disabled:opacity-80 duration-[0.3s]"
                        disabled={!Is_Editable}
                        name="Email"
                        onChange={OnChange}
                      />
                    </div>
                  </div>
                  <div className="flex  gap-[20px] items-center">
                    <div className="relative w-fit">
                      <label htmlFor="" className="text-[#c9cacc] ">
                        Profile Banner Color
                      </label>
                      <div
                        className="w-[100%] max-w-[150px] h-[50px] rounded p-[5px] flex  justify-end cursor-pointer"
                        style={{
                          backgroundColor:
                            !Is_Editable || !ChangedColorForBanner
                              ? UserInformation.ProfileBanner_Color
                              : ChangedColorForBanner,
                        }}
                        onClick={() => {
                          if (Is_Editable) {
                            setShowColorPicker(!ShowColorPicker);
                          }
                        }}
                      >
                        <FaPen className="w-[15px] h-[15px] text-white  " />
                      </div>
                      <div
                        className={`  absolute top-0 left-[-150%] ${
                          ShowColorPicker ? "" : "hidden"
                        }`}
                        ref={ColorPickerRefOne}
                      >
                        {ShowColorPicker && (
                          <ColorPicker
                            DefaultColor={
                              !Is_Editable || !ChangedColorForBanner
                                ? UserInformation.ProfileBanner_Color
                                : ChangedColorForBanner
                            }
                            setChangedColor={setChangedColorForBanner}
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <button
                        className="text-white capitalize global-font-roboto  text-[16px]  font-[400] transition hover:underline hover:text-[#3caaff]"
                        type="button"
                        onClick={() => {
                          setIs_Editable(true);
                          setShowProfileBannerImageUploaderModal(true);
                        }}
                      >
                        upload banner Image
                      </button>
                    </div>
                  </div>
                  {!UserInformation.Profile_Picture && (
                    <div className="flex  gap-[20px] items-center">
                      <div className="relative w-fit">
                        <label htmlFor="" className="text-[#c9cacc] ">
                          Profile BackgroundColor
                        </label>
                        <div
                          className="w-[100%] max-w-[150px] h-[50px] rounded p-[5px] flex  justify-end cursor-pointer"
                          style={{
                            backgroundColor:
                              !Is_Editable || !ChangedColorForProfileBgColor
                                ? UserInformation.ProfileBgColor
                                : ChangedColorForProfileBgColor,
                          }}
                          onClick={() => {
                            setShowColorPickerForProfile(!ShowColorPicker);
                          }}
                        >
                          <FaPen className="w-[15px] h-[15px] text-white  " />
                        </div>
                        <div
                          className={`  absolute top-0 left-[-150%] ${
                            ShowColorPickerForProfile ? "" : "hidden"
                          }`}
                          ref={ColorPickerRefTwo}
                        >
                          {ShowColorPickerForProfile && (
                            <ColorPicker
                              DefaultColor={
                                !Is_Editable || !ChangedColorForProfileBgColor
                                  ? UserInformation.ProfileBanner_Color
                                  : ChangedColorForProfileBgColor
                              }
                              setChangedColor={setChangedColorForProfileBgColor}
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <button
                          className="text-white capitalize global-font-roboto  text-[16px]  font-[400] transition hover:underline hover:text-[#3caaff]"
                          type="button"
                        >
                          upload Profile Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
              <div className="profile-critical-aspect border-[1px] border-rose-600 mt-[35px] px-[10px] py-[10px] rounded-[20px] flex flex-col items-start justify-start gap-[8px] w-[100%]">
                <div className="change-password-button  w-[100%] flex items-center justify-between  px-[10px] py-[10px] rounded-[10px]">
                  <div className="info">
                    <p className="text-white text-[16px] global-font-roboto ">
                      Change Password
                      <span className="text-[#c9cacc] block text-[14px]">
                        Changing Password is a good practice to keep your
                        account secure
                      </span>
                    </p>
                  </div>
                  <div className="button ">
                    <button className="text-white capitalize global-font-roboto  text-[16px]  font-[400] transition bg-red-600 w-[100%] h-[100%] rounded-[10px] px-[15px] py-[10px]">
                      Change Password{" "}
                    </button>
                  </div>
                </div>
                <span className="w-[100%] h-[1px] bg-[rgba(255,255,255,0.15)] block rounded"></span>
                <div className="log-out-button w-[100%] flex items-center justify-between  px-[10px] py-[10px] rounded-[10px]">
                  <div className="info">
                    <p className="text-white text-[16px] global-font-roboto ">
                      Log Out
                      <span className="text-[#c9cacc] block text-[14px] capitalize">
                        Log out of your account and You Will Need To Login Again
                      </span>
                    </p>
                  </div>
                  <div className="button ">
                    <button
                      className="text-white capitalize global-font-roboto  text-[16px]  font-[400] transition bg-red-600 w-[100%] h-[100%] rounded-[10px] px-[15px] py-[10px]"
                      onClick={() => LogOutButton()}
                    >
                      {LogOutLoader ? <SpinnerComponent /> : "Log Out"}
                    </button>
                  </div>
                </div>
                <span className="w-[100%] h-[1px] bg-[rgba(255,255,255,0.15)] block rounded"></span>
                <div className="delete-account-button w-[100%] flex items-center justify-between  px-[10px] py-[10px] rounded-[10px]">
                  <div className="info">
                    <p className="text-white text-[16px] global-font-roboto ">
                      Delete Account
                      <span className="text-[#c9cacc] block text-[14px] capitalize">
                        By deleting your account, you will lose all of your data
                      </span>
                    </p>
                  </div>
                  <div className="button ">
                    <button className="text-white capitalize global-font-roboto  text-[16px]  font-[400] transition bg-red-600 w-[100%] h-[100%] rounded-[10px] px-[15px] py-[10px]">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <UploadProfileImageModal
          mainText="Upload Profile Image"
          CurrentImageUrl={CurrentImageUrl}
          ShowProfileUploaderModal={ShowProfileUploaderModal}
          setShowProfileUploaderModal={setShowProfileUploaderModal}
          UpdatedProfileImage={UpdatedProfileImage}
          setCurrentImageUrl={setCurrentImageUrl}
          setUpdatedProfileImage={setUpdatedProfileImage}
        />
        <ProfileBannerImageUploader
          CurrentImageUrl={CurrentBannerImageUrl}
          setCurrentImageUrl={setCurrentBannerImageUrl}
          ShowProfileBannerImageUploaderModal={
            ShowProfileBannerImageUploaderModal
          }
          UpdatedProfileBannerImage={UpdatedProfileBannerImage}
          mainText="Upload Banner Image"
          setUpdatedProfileBannerImage={setUpdatedProfileBannerImage}
          setShowProfileBannerImageUploaderModal={
            setShowProfileBannerImageUploaderModal
          }
        />
        <div
          className={`w-[100vw] h-[100vh] fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px] transition duration-300 ${
            Loader ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <div className="w-[100%] h-[100%] flex items-center justify-center">
            <DiscordLogoAnimation />
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
