import React, { useContext } from "react";
import Single_Image_DragDrop from "./Single_Image_DragDrop";
import "./scss/components.css";
import { Context } from "@/context/ContextApi";
function Create_Update_Server_PopUp({ Pop_Up_Mode = "Create-PopUp-Mode" }) {
  const { Show_Create_Server_PopUp, setShow_Create_Server_PopUp } = useContext(
    Context
  ) as any;
  const Close_PopUp_Button = () => {
    setShow_Create_Server_PopUp(false);
  };
  if (Pop_Up_Mode == "Create-PopUp-Mode" && Show_Create_Server_PopUp == true) {
    return (
      <>
        <div className="absolute top-left-50 w-full h-full bg-back-opacity-10">
          <div className="w-100 h-100 flex items-center justify-center">
            <div className="server-popup-form-container ">
              <div className="logo-container capitalize global-font-roboto fs-20">
                create server
              </div>
              <div className="w-100 pt-4">
                <Single_Image_DragDrop />
              </div>
              <form className="form">
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
                    required
                  />
                </div>

                <button
                  className="form-submit-btn capitalize fs-18 font-medium global-font-roboto mt-9"
                  type="submit"
                >
                  create server
                </button>
              </form>
              <button
                className="border-solid-black font-medium rounded hover-secondary-button py-3 px-4 capitalize fs-18 global-font-roboto"
                type="button"
                onClick={Close_PopUp_Button}
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
