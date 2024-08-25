import React, { useContext, useState, useEffect } from "react";
import Single_Image_DragDrop from "./Single_Image_DragDrop";
import "./scss/components.css";
import { Context } from "@/context/ContextApi";
import { getCookie } from "cookies-next";
import { useDebounce } from "@/hooks/debounceHook";
import SpinnerComponent from "./Loader/SpinnerComponent";
import { usePathname } from "next/navigation";
function Create_Update_Server_PopUp({ Pop_Up_Mode = "Create-PopUp-Mode" }) {
  const Front_End_Domain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN as string;
  const PathName = usePathname();
  const boxRef = React.useRef<HTMLInputElement>(null);
  const [Server__Name, setServer__Name] = useState("" as string);
  const [Loader, setLoader] = useState(false as boolean);
  const [New_ServerId, setNew_ServerId] = useState("" as string);
  const {
    Show_Create_Server_PopUp,
    setShow_Create_Server_PopUp,
    Create_New_Server_Function,
    Global_Server_Profile_Image,
  } = useContext(Context) as any;
  const Close_PopUp_Button = () => {
    setShow_Create_Server_PopUp(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setShow_Create_Server_PopUp(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const Submit_Form_Using_DeBounce = useDebounce(
    async (formData: FormData, AuthToken: string) => {
      const response = await Create_New_Server_Function(formData, AuthToken);
      setNew_ServerId(response);
    },
    500
  );
  useEffect(() => {
   
    if (New_ServerId !== "") {
      if (PathName === `/pages/server/${New_ServerId}`) {
        setLoader(false);
        setShow_Create_Server_PopUp(false);
      }
    }
  }, [Front_End_Domain, New_ServerId, PathName, setShow_Create_Server_PopUp]);

  const Submit__Form__Function = (e: any) => {
    setLoader(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("ServerName", Server__Name);
    formData.append("serverImage", Global_Server_Profile_Image.File_Of_Image);
    const AuthToken = getCookie("User_Authentication_Token") as string;
    Submit_Form_Using_DeBounce(formData, AuthToken);
  };
  if (Pop_Up_Mode == "Create-PopUp-Mode" && Show_Create_Server_PopUp == true) {
    return (
      <>
        <div className="absolute top-left-50 w-full h-full bg-back-opacity-10 z-20">
          <div className="w-100 h-100 flex items-center justify-center">
            <div className="server-popup-form-container " ref={boxRef}>
              <div className="logo-container capitalize global-font-roboto fs-20">
                create server
              </div>
              <div className="w-100 pt-4">
                <Single_Image_DragDrop />
              </div>
              <form className="form" onSubmit={Submit__Form__Function}>
                <div className="form-group">
                  <label
                    htmlFor="Sever_Name"
                    className="global-font-roboto fs-14 font-medium"
                  >
                    Sever Name
                  </label>
                  <input
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
                  className="form-submit-btn capitalize fs-18 font-medium global-font-roboto mt-9 disabled:opacity-85 disabled:bg-black disabled:hover:bg-black  disabled:hover:text-white disabled:hover:border-white disabled:cursor-not-allowed cursor-pointer"
                  type="submit"
                  disabled={Loader}
                >
                  {Loader ? <SpinnerComponent /> : "create server"}
                </button>
              </form>
              <button
                className="border-solid-black font-medium rounded hover-secondary-button py-3 px-4 capitalize fs-18 global-font-roboto disabled:opacity-85 disabled:hover:bg-transparent  disabled:hover:text-black disabled:hover:border-black disabled:cursor-not-allowed"
                type="button"
                onClick={Close_PopUp_Button}
                disabled={Loader}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else if (
    Pop_Up_Mode == "Update-PopUp-Mode" &&
    Show_Create_Server_PopUp == true
  ) {
    return (
      <>
        <p>Update Server</p>
      </>
    );
  } else {
    return <></>;
  }
}

export default Create_Update_Server_PopUp;
