import React, { useEffect, useState } from "react";
import SearchAllTheServerModal from "../Model/SearchAllTheServerModal";
import UserProfile from "../UserProfile";
import ChatsListingOnSideBar from "../OnToOnChats/ChatsListingOnSideBar";

function DashboardSideBar() {
  const [Open, setOpen] = useState(false as boolean);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((Open) => !Open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <>
      <div className="w-[100%] h-[100%] bg-[#2a2d31] relative">
        <div className="w-[100%] h-[100%]">
          <div className="search-bar  shadow-[0_0px_5px_0_rgba(0,0,0,0.1)] w-[100%] bg-[#1e1f22]  px-[12px] py-[10px] absolute top-0 left-0">
            <div className="relative" onClick={() => setOpen((Open) => !Open)}>
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-[14px] h-[14px] text-gray-500 dark:text-gray-400"
                >
                  <path
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    stroke="currentColor"
                  ></path>
                </svg>
              </div>
              <input
                required
                placeholder="Search"
                className="block w-full px-4 py-[5px] ps-10  text-gray-900 border border-gray-300 rounded-lg bg-gray-50  outline-none  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 fs-14 h-[25px]"
                id="default-search"
                type="search"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="w-[100%] h-[100%] pt-[46px] pb-[70px] ">
            <ChatsListingOnSideBar IsDashboard={true} />
          </div>

          <UserProfile Position="absolute bottom-[0px] left-[0px]"></UserProfile>
        </div>
      </div>
      <SearchAllTheServerModal Open={Open} setOpen={setOpen} />
    </>
  );
}

export default DashboardSideBar;
