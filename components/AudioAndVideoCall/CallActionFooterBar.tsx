import React from "react";
import { FaMicrophone } from "react-icons/fa";
import { IoMdMic, IoMdMicOff, IoMdVideocam } from "react-icons/io";
import { IoVideocamOff } from "react-icons/io5";
import { MdCall, MdCallEnd } from "react-icons/md";

function CallActionFooterBar({
  TurnVideoOff,
  setTurnVideoOff,
  TurnMicOff,
  setTurnMicOff,
  CallStarted,
  setCallStarted,
  StartCallFunction,
}: {
  TurnVideoOff: boolean;
  setTurnVideoOff: React.Dispatch<React.SetStateAction<boolean>>;
  TurnMicOff: boolean;
  setTurnMicOff: React.Dispatch<React.SetStateAction<boolean>>;
  CallStarted: boolean;
  setCallStarted: React.Dispatch<React.SetStateAction<boolean>>;
  StartCallFunction: () => void;
}) {
  const StartTheCall = () => {
    StartCallFunction();
    setCallStarted(!CallStarted);
  };
  return (
    <div className="w-[100%] h-[50px] flex items-center justify-center gap-[15px] absolute  bottom-[30px]">
      <button
        className="w-[50px] h-[50px] bg-white flex items-center justify-center rounded-full transition  hover:scale-105"
        onClick={() => setTurnMicOff(!TurnMicOff)}
      >
        {TurnMicOff ? (
          <IoMdMic className="w-[20px] h-[20px] text-black transition duration-100 " />
        ) : (
          <IoMdMicOff className="w-[20px] h-[20px] text-black transition duration-100 " />
        )}
      </button>
      <button
        className="w-[50px] h-[50px] bg-white flex items-center justify-center rounded-full transition hover:scale-105 "
        onClick={() => setTurnVideoOff(!TurnVideoOff)}
      >
        {TurnVideoOff ? (
          <IoMdVideocam className="w-[20px] h-[20px] text-black transition duration-100 " />
        ) : (
          <IoVideocamOff className="w-[20px] h-[20px] text-black transition duration-100 " />
        )}
      </button>
      <button
        className={`w-[50px] h-[50px] ${
          CallStarted ? "bg-pink-700" : "bg-green-600"
        } transition flex items-center justify-center rounded-full  hover:scale-105`}
        onClick={() => StartTheCall()}
      >
        {!CallStarted ? (
          <MdCall className="w-[25px] h-[25px] text-white transition duration-100 " />
        ) : (
          <MdCallEnd className="w-[25px] h-[25px] text-white transition duration-100 " />
        )}
      </button>
    </div>
  );
}

export default CallActionFooterBar;
