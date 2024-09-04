import React, { useRef } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoIosCloseCircle, IoMdAdd } from "react-icons/io";
function ChatsFooterBar({
  setMessageInputValue,
}: {
  setMessageInputValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const HandelTheInputValueChange = (e: any) => {
    setMessageInputValue(e.target.value);
  };
  const SubmitTheNewMessage = (e: any) => {
    e.preventDefault();
  };
  return (
    <div className="w-[100%] shadow  border-t-[1px] border-t-[#2f2f2f] flex flex-col h px-[12px] pb-[15px] pt-[6px]  backdrop-blur-[10px] bg-[rgba(0,0,0,0.45)] ">
      {/* {(editingAMessage.Is_Editing ||
      replyingASpecificMessage?.Is_Replying) && (
      <div className="message-container w-[100%] flex items-center justify-between transition-all duration-300">
        <div className="flex items-start">
          <div className="profile">
            <Avatar className="w-[40px] h-[40px] ">
              <AvatarImage
                src={
                  editingAMessage.Is_Editing
                    ? editingAMessage?.Profile_Picture
                    : replyingASpecificMessage?.Profile_Picture
                }
                className="w-[100%] h-[100%]"
              />
              <AvatarFallback className="capitalize font-medium text-[15px]">
                {editingAMessage.Is_Editing
                  ? editingAMessage?.FullName?.split("")[0]
                  : replyingASpecificMessage?.FullName?.split(
                      ""
                    )[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="content w-[100%] relative  pt-[5px]">
            <div className="w-[100%]  px-[8px]  rounded-b-[6px] rounded-r-[6px] cursor-pointer  relative z-[1] min-w-[100px]">
              <div className="head   flex items-center justify-start gap-[10px]">
                <div className="username">
                  <p className="text-white global-font-roboto text-[14px] font-[400]  capitalize ">
                    {editingAMessage.Is_Editing
                      ? editingAMessage?.UserId ===
                        UserInformation?.id
                        ? "You"
                        : editingAMessage?.UserName
                      : replyingASpecificMessage?.UserId ===
                        UserInformation?.id
                      ? "You"
                      : replyingASpecificMessage?.UserName}
                  </p>
                </div>
              </div>
              <div className="message">
                <p className="text-white global-font-roboto text-[15px] font-[300] py-[3px]">
                  {editingAMessage.Is_Editing
                    ? editingAMessage?.Message
                    : replyingASpecificMessage?.Message}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="close">
          <button
            className="w-[32px] h-[32px] flex justify-center items-center  rounded-full text-white"
            // onClick={remove_editingAMessage_StateInfo}
          >
            <IoIosCloseCircle className="w-[32px] h-[32px]" />
          </button>
        </div>
      </div>
    )} */}
      <div className="w-[100%] h-[100%] py-[5px] bg-[#41464f] px-[12px] rounded-[5px]">
        <div className="w-[100%] flex gap-[5px] ">
          <button className="min-w-[32px] h-[32px] flex justify-center items-center bg-gray-400 rounded-full group">
            <IoMdAdd className="text-[22px] group-hover:rotate-180 transition  duration-150    font-bold text-black" />
          </button>
          <div className="w-[100%]">
            <form onSubmit={SubmitTheNewMessage} className="w-[100%] h-[100%]">
              <input
                type="text"
                className="w-[100%] h-[100%] bg-transparent text-white focus:ring-0 focus:border-0 focus:outline-none global-font-roboto px-[5px] disabled:opacity-50"
                placeholder={`Type a message...`}
                // value={Message === "" ? "" : Message}
                onChange={HandelTheInputValueChange}
                // disabled={}
                ref={inputFieldRef}
              />
            </form>
          </div>
          <button className="min-w-[32px] h-[32px] flex justify-center items-center rounded-full group">
            <BsEmojiSmileFill className="text-[22px]  transition  duration-150    font-bold text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatsFooterBar;
