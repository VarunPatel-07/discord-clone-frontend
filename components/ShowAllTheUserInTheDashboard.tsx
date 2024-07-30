import React from "react";
import GlobalDiscordLoader from "./GlobalDiscordLoader";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import notFoundImage from "../public/undraw_empty_re_opql.svg";

function ShowAllTheUserInTheDashboard({
  ShowLoader,
  UsersInfo,
  currentPage,
}: {
  ShowLoader: boolean;
  UsersInfo: Array<Object>;
  currentPage: string;
}) {
  if (ShowLoader) {
    return "";
  } else if (currentPage === "addFriend") {
    return (
      <div className="w-[100%] h-[100%] pt-[50px]">
        <div className="flex flex-col w-[100%] h-[100%] relative">
          <div className="header border-b-[1px] border-[rgb(255,255,255,0.1)] px-[15px] py-[25px]">
            <div className="w-[100%] flex flex-col gap-[5px] pb-[10px]">
              <h1 className="text-white text-[20px]">Search Your Friends</h1>
              <p className="text-[rgb(255,255,255,0.5)] text-[14px] capitalize">
                you can search users with their Discord username and add them as
                your friend
              </p>
            </div>
            <div className="w-[100%] flex items-stretch justify-between gap-[20px] bg-black rounded-[10px] overflow-hidden px-[4px] py-[4px]">
              <div className="input w-[100%]">
                <input
                  type="text"
                  className="w-[100%] h-[100%] bg-transparent text-white  px-[10px] border-0 focus:ring-0 focus:border-0 focus:outline-none"
                  placeholder="Search Friends"
                />
              </div>
              <div className="button  min-w-fit bg-indigo-600 text-white px-[10px]  py-[6px] rounded-[5px]">
                <button>Search Friends</button>
              </div>
            </div>
          </div>
          <div className="w-[100%] flex flex-col gap-[10px] max-w-[400px] mx-auto px-[15px] py-[25px] overflow-auto no-scrollbar">
            {/* {UsersInfo.map((user: any) => {
              return (
                <div
                  className="w-[100%]  user-profile-card  px-[12px] py-[5px] hover:bg-[rgb(255,255,255,0.1)] rounded-[10px] cursor-pointer"
                  key={user.id}
                >
                  <div className="w-[100%] flex items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      <div className="profile">
                        <Avatar className="w-[45px] h-[45px] block">
                          <AvatarImage
                            src={user.Profile_Picture}
                            className="w-[100%] h-[100%] "
                          />
                          <AvatarFallback className="w-[100%] h-[100%] capitalize font-medium text-[20px]">
                            {user.FullName?.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="user_info">
                        <p className="text-[14px] font-[500] text-white">
                          {user.FullName}
                        </p>
                        <p className="text-[14px] text-[#ccc]">
                          {user.UserName}
                        </p>
                      </div>
                    </div>
                    <div className="button">
                      <button className="bg-green-600 text-[#000] px-[10px] py-[5px] rounded-[5px] text-[14px] font-[500]">
                        Follow
                      </button>
                    </div>
                  </div>
                </div>
              );
            })} */}
          </div>
        </div>
      </div>
    );
  } else {
    if (UsersInfo.length === 0) {
      return (
        <div className="w-[100%] h-[100%] pt-[50px] flex flex-col items-center justify-center ">
          <picture>
            <source src="https://cdni.iconscout.com/illustration/premium/thumb/no-search-found-illustration-download-in-svg-png-gif-file-formats--not-seach-available-nothing-error-state-pack-seo-web-illustrations-2133696.png" />
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/no-search-found-illustration-download-in-svg-png-gif-file-formats--not-seach-available-nothing-error-state-pack-seo-web-illustrations-2133696.png"
              alt=""
              className="w-[100%] h-[100%] max-h-[400px] max-w-[600px] m-auto"
              loading="lazy"
            />
          </picture>
        </div>
      );
    } else {
      return (
        <div className="w-[100%] h-[100%] pt-[50px]">
          <div className="flex flex-col w-[100%] h-[100%] relative">
            <div className="header border-b-[1px] border-[rgb(255,255,255,0.1)] px-[15px] py-[25px]">
              <div className="w-[100%] flex flex-col gap-[5px] pb-[10px]">
                <h1 className="text-white text-[20px]">Search Your Friends</h1>
                <p className="text-[rgb(255,255,255,0.5)] text-[14px] capitalize">
                  you can search users with their Discord username and add them
                  as your friend
                </p>
              </div>
              <div className="w-[100%] flex items-stretch justify-between gap-[20px] bg-black rounded-[10px] overflow-hidden px-[4px] py-[4px]">
                <div className="input w-[100%]">
                  <input
                    type="text"
                    className="w-[100%] h-[100%] bg-transparent text-white  px-[10px] border-0 focus:ring-0 focus:border-0 focus:outline-none"
                    placeholder="Search Friends"
                  />
                </div>
                <div className="button  min-w-fit bg-indigo-600 text-white px-[10px]  py-[6px] rounded-[5px]">
                  <button>Search Friends</button>
                </div>
              </div>
            </div>
            <div className="w-[100%] flex flex-wrap justify-center gap-[30px]  mx-auto px-[15px] py-[25px] overflow-auto no-scrollbar">
              {UsersInfo.map((user: any) => {
                return (
                  // <div
                  //   className="w-[100%]  user-profile-card  px-[12px] py-[5px] hover:bg-[rgb(255,255,255,0.1)] rounded-[10px] cursor-pointer"
                  //   key={user.id}
                  // >
                  //   <div className="w-[100%] flex items-center justify-between">
                  //     <div className="flex items-center gap-[10px]">
                  //       <div className="profile">
                  //         <Avatar className="w-[45px] h-[45px] block">
                  //           <AvatarImage
                  //             src={user.Profile_Picture}
                  //             className="w-[100%] h-[100%] "
                  //           />
                  //           <AvatarFallback className="w-[100%] h-[100%] capitalize font-medium text-[20px]">
                  //             {user.FullName?.slice(0, 1)}
                  //           </AvatarFallback>
                  //         </Avatar>
                  //       </div>
                  //       <div className="user_info">
                  //         <p className="text-[14px] font-[500] text-white">
                  //           {user.FullName}
                  //         </p>
                  //         <p className="text-[14px] text-[#ccc]">
                  //           {user.UserName}
                  //         </p>
                  //       </div>
                  //     </div>
                  //     <div className="button">
                  //       <button className="bg-green-600 text-[#000] px-[10px] py-[5px] rounded-[5px] text-[14px] font-[500]">
                  //         Follow
                  //       </button>
                  //     </div>
                  //   </div>
                  // </div>
                  <div className="user-profile-card" key={user.id}>
                    <Avatar className="w-[80px] h-[80px] block">
                      <AvatarImage
                        src={user.Profile_Picture}
                        className="w-[100%] h-[100%] "
                      />
                      <AvatarFallback className="w-[100%] h-[100%] capitalize font-medium text-[40px]">
                        {user.FullName?.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className=" text-black text-[16px] font-medium">{user.FullName}</h4>
                    <p className="text-gray-900 text-[14px] font-[400]">{user.UserName}</p>
                    <a
                      className="button"
                      href="https://instagram.com/chynodeluxe"
                      target="_blank"
                    >
                      <span>+</span> Follow
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default ShowAllTheUserInTheDashboard;
