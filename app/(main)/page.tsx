"use client";
import React, { useState, useEffect } from "react";
import GlobalDiscordLoader from "@/components/GlobalDiscordLoader";
import Link from "next/link";
// importing the css file
import "../css/font.css";
import Image from "next/image";
function Home() {
  const [Discord_Loader, setDiscord_Loader] = useState(true);

  useEffect(() => {
    const checkLoginStatus = localStorage.getItem("Is_User_Login");
    if (checkLoginStatus) {
      setDiscord_Loader(false);
    } else {
      setDiscord_Loader(true);
    }
  }, []);

  if (Discord_Loader) {
    return <GlobalDiscordLoader />;
  } else {
    return (
      <>
      
        <nav className="fixed top-0 left-0 w-full z-10">
          <div className="flex items-center justify-between plr-15 ptb-20">
            <div className="logo-section">
              <picture className="">
                <img
                  src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6257d23c5fb25be7e0b6e220_Open%20Source%20Projects%20_%20Discord-7.svg"
                  alt="banner image"
                  className="w-100 h-100 object-cover"
                  loading="lazy"
                  style={{width:"180px"}}
                />
              </picture>
            </div>
            <div className="login-button">
              <Link
                href="pages/login"
                className="blue-color-main-button global-font-roboto fs-20 capitalize"
              >
                log in
              </Link>
            </div>
          </div>
        </nav>
        <div className="relative w-full h-screen custom-background-image ">
          <div
            className="flex items-center justify-center max-width-1080 mx-auto h-full
          "
          >
            <div className="w-40">
              <div className="text-section">
                <h1 className="text-white fs-45 font-black">
                  GROUP CHAT THAT’S ALL FUN GAMES
                </h1>
                <p className="text-white fs-16">
                  Discord is great for playing games and chilling with friends,
                  or even building a worldwide community. Customise your own
                  space to talk, play, and hang out.
                </p>
              </div>
            </div>
            <div className="w-60">
              <picture className="w-100 h-100">
                <img
                  src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/664dae3aa8fa28593aa47cc6_CHARACTERS%20FULL.webp"
                  alt="banner image"
                  className="w-100 h-100 object-cover"
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
        </div> 
      </>
    );
  }
}

export default Home;
