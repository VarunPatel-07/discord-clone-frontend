import React, { memo, useRef } from "react";
import MultipleImageUploader from "../MultipleImageUploader";
interface UploadImageModalProps {
  showUploadImageModal: boolean;
  setShowUploadImageModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImagesArray: Array<File>;
  setSelectedImagesArray: React.Dispatch<React.SetStateAction<Array<File>>>;
  sendImagesOnClick: any;
  isSending: string;
  setSelectedFilesFinalArray: React.Dispatch<React.SetStateAction<Array<File>>>;
  selectedFilesFinalArray: Array<File>;
}

const Upload_ImageModal = memo((props: UploadImageModalProps) => {
  const {
    showUploadImageModal,
    setShowUploadImageModal,
    setSelectedImagesArray,
    sendImagesOnClick,
    isSending,
    setSelectedFilesFinalArray,
    selectedFilesFinalArray,
  } = props;

  const mainBoxRef = useRef<HTMLDivElement>(null);

  const cancelButton = () => {
    setShowUploadImageModal(false);
    setSelectedFilesFinalArray([]);
    setSelectedImagesArray([]);
  };

  return (
    <>
      <div
        aria-hidden={!showUploadImageModal}
        className={`duration-200 w-full h-screen absolute top-0 left-0 bg-[rgba(0,0,0,0.35)] backdrop-blur-[5px] z-[9] ${
          showUploadImageModal ? "scale-100 visible" : "scale-0 invisible"
        }`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="px-[20px] py-[20px] rounded bg-white min-w-[500px] max-w-[500px]" ref={mainBoxRef}>
            <div className="w-full flex flex-col gap-[25px] items-start justify-start">
              <div className="w-full">
                <MultipleImageUploader
                  setSelectedImagesArray={setSelectedImagesArray}
                  isSending={isSending}
                  setSelectedFilesFinalArray={setSelectedFilesFinalArray}
                  selectedFilesFinalArray={selectedFilesFinalArray}
                />
              </div>

              <div className="w-full button flex items-center justify-between relative z-20">
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
