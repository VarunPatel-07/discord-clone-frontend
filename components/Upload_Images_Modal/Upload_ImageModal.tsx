import React from "react";
import MultipleImageUploader from "../MultipleImageUploader";

function Upload_ImageModal({
  showUploadImageModal,
  setShowUploadImageModal,
}: {
  showUploadImageModal: boolean;
  setShowUploadImageModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`${
        showUploadImageModal ? "scale-100" : "scale-0"
      } duration-200  w-full h-screen absolute top-0 left-0 bg-[rgba(0,0,0,0.35)] backdrop-blur-[5px] z-10`}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="px-[20px] py-[20px] rounded bg-white min-w-[500px] max-w-[500px]">
          <div className="w-full flex flex-col gap-[25px] items-start justify-start">
            <div className="w-full">
              <MultipleImageUploader />
            </div>
            <div className="w-full button flex items-center justify-between">
              <button className="send-button border-[1px] border-black rounded px-[15px] py-[10px] text-[15px] global-font-roboto capitalize text-black min-w-[120px] text-center hover:bg-black hover:text-white" onClick={()=>setShowUploadImageModal(false))}>
                cancel
              </button>
              <button className="cancel-button bg-violet-600 rounded px-[15px] py-[10px] text-[15px] global-font-roboto capitalize text-white min-w-[120px] text-center">
                share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload_ImageModal;
