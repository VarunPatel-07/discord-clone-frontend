import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import UseSocketIO from "@/hooks/UseSocketIO";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FaRegSmileWink } from "react-icons/fa";
import { IoIosCloseCircle, IoMdAdd } from "react-icons/io";

function ServerFooterBar() {
  const Pathname = usePathname();
  const {
    CurrentChatChannelInfo,
    SendMessageInTheSelectedChannelOfServer,
    Edit_Message_State,
    setEdit_Message_State,
    UserInformation,
    EditMessageFunction,
    Reply_A_Specific_Message_State,
    setReply_A_Specific_Message_State,
    Reply_A_SpecificMessageFunction,
    Edit_MessageReplayFunction,
  } = useContext(Context) as any;
  const [Message, setMessage] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Typing, setTyping] = useState(false);
  const socket = UseSocketIO();

  const InputFiledRef = useRef<HTMLInputElement>(null);

  // this is the function that will send the message but using the debounce hook for the performance
  const SendMessageWithDebounce = useDebounce(
    async (
      AuthToken: string,
      serverId: string,
      channelId: string,
      message: string
    ) => {
      await SendMessageInTheSelectedChannelOfServer(
        AuthToken,
        serverId,
        channelId,
        message
      );
      setLoading(false);
      setMessage("");
    },
    350
  );

  // this is the function that will edit the message but using the debounce hook for the performance
  const EditMessageWithDebounce = useDebounce(
    async (
      AuthToken: string,
      message_id: string,
      message: string,
      Current_Page: number
    ) => {
      await EditMessageFunction(AuthToken, message_id, message, Current_Page);
      setLoading(false);
      setMessage("");
      remove_Edit_Message_State_StateInfo();
    },
    200
  );
  // replying to a specific message using the debounce hook
  const ReplayMessageWithDebounce = useDebounce(
    async (
      AuthToken: string,
      serverId: string,
      channelId: string,
      message: string,
      message_id: string,
      Replying_To_UserName: string
    ) => {
      await Reply_A_SpecificMessageFunction(
        AuthToken,
        serverId,
        channelId,
        message,
        message_id,
        Replying_To_UserName
      );
      setLoading(false);
      setMessage("");
      remove_Edit_Message_State_StateInfo();
    },
    350
  );
  // editing a replay message using the debounce hook
  const EditMessageRepliesWithDebounce = useDebounce(
    async (
      AuthToken: string,
      message_id: string,
      message_replay_id: string,
      content: string
    ) => {
      await Edit_MessageReplayFunction(
        AuthToken,
        message_id,
        message_replay_id,
        content
      );
      setLoading(false);
      setMessage("");
      remove_Edit_Message_State_StateInfo();
    },
    200
  );

  const remove_Edit_Message_State_StateInfo = () => {
    setEdit_Message_State({
      Is_Editing: false as boolean,
      MessageId: "" as string,
      Message: "" as string,
      ChannelId: "" as string,
      UserId: "" as string,
      UserName: "" as string,
      FullName: "" as string,
      Profile_Picture: "" as string,
    });
    setReply_A_Specific_Message_State({
      Is_Replying: false as boolean,
      MessageId: "" as string,
      Message: "" as string,
      ChannelId: "" as string,
      UserId: "" as string,
      UserName: "" as string,
      FullName: "" as string,
      Profile_Picture: "" as string,
    });
  };
  const OnFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const AuthToken = getCookie("User_Authentication_Token") as string;

    const serverId = Pathname?.split("/")[3];
    const channel_id = CurrentChatChannelInfo?.ChatId;
    const message = Message;

    SendMessageWithDebounce(AuthToken, serverId, channel_id, message);
  };

  const Edit_SpecificMessage = async (e) => {
    setLoading(true);
    e.preventDefault();
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const message_id = Edit_Message_State?.MessageId;
    const message = Message;
    const Current_Page = Edit_Message_State?.current_page;

    EditMessageWithDebounce(AuthToken, message_id, message, Current_Page);
  };

  const Replay_Message_OnSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const message_id = Reply_A_Specific_Message_State?.MessageId;
    const Replying_To_UserName = Reply_A_Specific_Message_State?.UserName;
    const serverId = Pathname?.split("/")[3];
    const channel_id = CurrentChatChannelInfo?.ChatId;
    const message = Message;
    ReplayMessageWithDebounce(
      AuthToken,
      serverId,
      channel_id,
      message,
      message_id,
      Replying_To_UserName
    );
  };

  const Edit_A_Replied_Message = async (e) => {
    e.preventDefault();
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const message_id = Edit_Message_State?.MessageId;
    const message_replay_id = Edit_Message_State?.Edit_Replay_Message_Id;
    const content = Message;

    EditMessageRepliesWithDebounce(
      AuthToken,
      message_id,
      message_replay_id,
      content
    );
    console.log("Edit_A_Replied_Message");
  };

  const InputFiledChanged = useCallback(
    (e) => {
      setMessage(e.target.value);

      const Data = {
        user_info: {
          FullName: UserInformation?.FullName,
          UserName: UserInformation?.UserName,
          id: UserInformation?.id,
        },
        chat_info: CurrentChatChannelInfo,
        is_group_chat: true,
      };
      if (!Typing) {
        setTyping(true);

        socket?.emit("StartTyping", Data);
      }
      let TypingStartTime = new Date().getTime();
      let WaitingTime = 3000;
      setTimeout(() => {
        let CurrentTime = new Date().getTime();
        let Diff = CurrentTime - TypingStartTime;
        if (Diff >= WaitingTime && Typing) {
          socket?.emit("StopTyping", Data);
          setTyping(false);
        }
      }, WaitingTime);
    },
    [socket, Typing, UserInformation]
  );
  useEffect(() => {
    setMessage(Edit_Message_State?.Message);
  }, [Edit_Message_State]);

  return (
    <div className="w-[100%] shadow  border-t-[1px] border-t-[#2f2f2f] flex flex-col h px-[12px] pb-[15px] pt-[6px]  backdrop-blur-[10px] bg-[rgba(0,0,0,0.45)] absolute bottom-0 left-0 z-[2] ">
      {(Edit_Message_State.Is_Editing ||
        Reply_A_Specific_Message_State?.Is_Replying) && (
        <div className="message-container w-[100%] flex items-center justify-between transition-all duration-300">
          <div className="flex items-start">
            <div className="profile">
              <Avatar className="w-[40px] h-[40px] ">
                <AvatarImage
                  src={
                    Edit_Message_State.Is_Editing
                      ? Edit_Message_State?.Profile_Picture
                      : Reply_A_Specific_Message_State?.Profile_Picture
                  }
                  className="w-[100%] h-[100%]"
                />
                <AvatarFallback className="capitalize font-medium text-[15px]">
                  {Edit_Message_State.Is_Editing
                    ? Edit_Message_State?.FullName?.split("")[0]
                    : Reply_A_Specific_Message_State?.FullName?.split("")[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="content w-[100%] relative  pt-[5px]">
              <div className="w-[100%]  px-[8px]  rounded-b-[6px] rounded-r-[6px] cursor-pointer  relative z-[1] min-w-[100px]">
                <div className="head   flex items-center justify-start gap-[10px]">
                  <div className="username">
                    <p className="text-white global-font-roboto text-[14px] font-[400]  capitalize ">
                      {Edit_Message_State.Is_Editing
                        ? Edit_Message_State?.UserId === UserInformation?.id
                          ? "You"
                          : Edit_Message_State?.UserName
                        : Reply_A_Specific_Message_State?.UserId ===
                          UserInformation?.id
                        ? "You"
                        : Reply_A_Specific_Message_State?.UserName}
                    </p>
                  </div>
                </div>
                <div className="message">
                  <p className="text-white global-font-roboto text-[15px] font-[300] py-[3px]">
                    {Edit_Message_State.Is_Editing
                      ? Edit_Message_State?.Message
                      : Reply_A_Specific_Message_State?.Message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="close">
            <button
              className="w-[32px] h-[32px] flex justify-center items-center  rounded-full text-white"
              onClick={remove_Edit_Message_State_StateInfo}
            >
              <IoIosCloseCircle className="w-[32px] h-[32px]" />
            </button>
          </div>
        </div>
      )}
      <div className="w-[100%] h-[100%] py-[5px] bg-[#41464f] px-[12px] rounded-[5px]">
        <div className="w-[100%] flex gap-[5px] ">
          <button className="min-w-[32px] h-[32px] flex justify-center items-center bg-gray-400 rounded-full group">
            <IoMdAdd className="text-[22px] group-hover:rotate-180 transition  duration-150    font-bold text-black" />
          </button>
          <div className="w-[100%]">
            <form
              onSubmit={
                Edit_Message_State.Is_Editing
                  ? Edit_Message_State.Editing_Replay
                    ? Edit_A_Replied_Message
                    : Edit_SpecificMessage
                  : Reply_A_Specific_Message_State?.Is_Replying
                  ? Replay_Message_OnSubmit
                  : OnFormSubmit
              }
              className="w-[100%] h-[100%]"
            >
              <input
                type="text"
                className="w-[100%] h-[100%] bg-transparent text-white focus:ring-0 focus:border-0 focus:outline-none global-font-roboto px-[5px] disabled:opacity-50"
                placeholder={`Message #${CurrentChatChannelInfo?.ChatName}`}
                value={Message === "" ? "" : Message}
                onChange={InputFiledChanged}
                disabled={Loading}
                ref={InputFiledRef}
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

export default ServerFooterBar;
