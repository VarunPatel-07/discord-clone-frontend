import React, { memo, useContext, useEffect, useRef } from "react";
import MultipleImageUploader from "../MultipleImageUploader";
import { Context } from "@/context/ContextApi";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { BsEmojiSmileFill } from "react-icons/bs";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
interface UploadImageModalProps {
  showUploadImageModal: boolean;
  setShowUploadImageModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImagesArray: Array<File>;
  setSelectedImagesArray: React.Dispatch<React.SetStateAction<Array<File>>>;
  sendImagesOnClick: any;
}

const Upload_ImageModal = memo((props: UploadImageModalProps) => {
  const { SendImagesToTheSelectedTextChannel } = useContext(Context) as any;
  const {
    showUploadImageModal,
    setShowUploadImageModal,

    setSelectedImagesArray,
    sendImagesOnClick,
  } = props;

  const mainBoxRef = useRef<HTMLDivElement>(null);

  const cancelButton = () => {
    setShowUploadImageModal(false);
  };

  return (
    <>
      <div
        className={`duration-200 w-full h-screen absolute top-0 left-0 bg-[rgba(0,0,0,0.35)] backdrop-blur-[5px] z-[9] ${
          showUploadImageModal ? "scale-100 visible" : "scale-0 invisible"
        }`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="px-[20px] py-[20px] rounded bg-white min-w-[500px] max-w-[500px]" ref={mainBoxRef}>
            <div className="w-full flex flex-col gap-[25px] items-start justify-start">
              <div className="w-full">
                <MultipleImageUploader setSelectedImagesArray={setSelectedImagesArray} />
              </div>

              <div className="w-full button flex items-center justify-between">
                <button
                  className="send-button border-[1px] border-black rounded px-[15px] py-[10px] text-[15px] global-font-roboto capitalize text-black min-w-[120px] text-center hover:bg-black hover:text-white"
                  onClick={cancelButton}>
                  cancel
                </button>
                <button
                  className="cancel-button bg-violet-600 rounded px-[15px] py-[10px] text-[15px] global-font-roboto capitalize text-white min-w-[120px] text-center"
                  onClick={sendImagesOnClick}>
                  share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
Upload_ImageModal.displayName = "Upload_ImageModal";
export default Upload_ImageModal;