import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Context } from "@/context/ContextApi";
import { useDebounce } from "@/hooks/debounceHook";
import UseSocketIO from "@/hooks/UseSocketIO";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoIosCloseCircle, IoMdAdd } from "react-icons/io";
import CryptoJS from "crypto-js";
import { MessageProps } from "@/interface/MessageProps";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaCamera, FaFileUpload } from "react-icons/fa";
import { FaRegImages } from "react-icons/fa6";
import Upload_ImageModal from "@/components/Upload_Images_Modal/Upload_ImageModal";
import axios from "axios";
import Image from "next/image";

function ServerFooterBar({
  ChannalMessages,
  setChannalMessages,
  setFinalSelectedImagesArray,
}: {
  ChannalMessages: Array<Object>;
  setChannalMessages: React.Dispatch<React.SetStateAction<Array<Object>>>;
  setFinalSelectedImagesArray: any;
}) {
  const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string;
  const Pathname = usePathname();
  const {
    CurrentChatChannelInfo,
    SendMessageInTheSelectedChannelOfServer,
    editingAMessage,
    setEditingAMessage,
    UserInformation,
    EditMessageFunction,
    replyingASpecificMessage,
    setReplyingASpecificMessage,
    Reply_A_SpecificMessageFunction,
    setSelectedFinalImagesArray,
  } = useContext(Context) as any;

  const [message, setMessage] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Typing, setTyping] = useState(false);
  const socket = UseSocketIO();
  const InputFiledRef = useRef<HTMLInputElement>(null);
  const [showUploadImageModal, setShowUploadImageModal] = useState(false as boolean);
  const [messageWithImages, setMessageWithImages] = useState("" as string);
  const [selectedImagesArray, setSelectedImageArray] = useState([] as Array<File>);
  const [isSending, setIsSending] = useState("images" as string);
  const Data = useMemo(
    () => ({
      user_info: {
        FullName: UserInformation?.FullName,
        UserName: UserInformation?.UserName,
        id: UserInformation?.id,
      },
      chat_info: CurrentChatChannelInfo,
      is_group_chat: true,
    }),
    [UserInformation, CurrentChatChannelInfo]
  );
  const Host = process.env.NEXT_PUBLIC_BACKEND_DOMAIN as string;
  useEffect(() => {
    if (InputFiledRef.current) {
      InputFiledRef.current.focus();
    }
  }, [CurrentChatChannelInfo, ChannalMessages, showUploadImageModal]);

  const remove_editingAMessage_StateInfo = useCallback(() => {
    setEditingAMessage({
      is_Editing: false,
      data: {},
    });
    setReplyingASpecificMessage({
      is_Replying: false,
      data: {},
    });
    setMessage("");
  }, [setEditingAMessage, setReplyingASpecificMessage]);

  const SendMessageWithDebounce = useDebounce(async (AuthToken, serverId, channelId, message) => {
    const _newMessage = await SendMessageInTheSelectedChannelOfServer(AuthToken, serverId, channelId, message);
    if (!_newMessage) return;

    // Ensure the new message is only added if it's not already in ChannalMessages
    if (ChannalMessages.every((msg: any) => msg.id !== _newMessage.id)) {
      setChannalMessages((prevMessages) => [_newMessage, ...prevMessages]);
    }

    setLoading(false);
    setMessage("");
  }, 350);

  const EditMessageWithDebounce = useDebounce(async (AuthToken, message_id, message, Current_Page) => {
    await EditMessageFunction(AuthToken, message_id, message, Current_Page);
    setLoading(false);
    setMessage("");
    remove_editingAMessage_StateInfo();
  }, 200);

  const ReplayMessageWithDebounce = useDebounce(
    async (
      AuthToken,
      serverId,
      channelId,
      message,
      message_id,
      replying_to_message,
      replying_to_user_member_id,
      replying_message_message_id,
      replyingImage
    ) => {
      const _newMessage = await Reply_A_SpecificMessageFunction(
        AuthToken,
        serverId,
        channelId,
        message,
        message_id,
        replying_to_message,
        replying_to_user_member_id,
        replying_message_message_id,
        replyingImage
      );
      setLoading(false);
      setMessage("");
      remove_editingAMessage_StateInfo();
      if (ChannalMessages.every((msg: any) => msg.id !== _newMessage.id)) {
        setChannalMessages((prevMessages) => [_newMessage, ...prevMessages]);
      }
    },
    350
  );

  const OnFormSubmit = useCallback(
    async (e) => {
      setLoading(true);
      e.preventDefault();
      const AuthToken = getCookie("User_Authentication_Token") as string;
      const serverId = Pathname?.split("/")[3];
      const channel_id = CurrentChatChannelInfo?.ChatId;
      setFinalSelectedImagesArray(selectedImagesArray);
      SendMessageWithDebounce(AuthToken, serverId, channel_id, message);
      setShowUploadImageModal(false);
    },
    [message, Pathname, CurrentChatChannelInfo, SendMessageWithDebounce]
  );

  const Edit_SpecificMessage = useCallback(
    async (e) => {
      setLoading(true);
      e.preventDefault();
      const AuthToken = getCookie("User_Authentication_Token") as string;
      const message_id = editingAMessage?.data?.id;

      EditMessageWithDebounce(AuthToken, message_id, message);
    },
    [message, editingAMessage, EditMessageWithDebounce]
  );

  const Replay_Message_OnSubmit = useCallback(
    async (e) => {
      setLoading(true);
      e.preventDefault();
      const AuthToken = getCookie("User_Authentication_Token") as string;
      const serverId = Pathname?.split("/")[3];
      const channel_id = CurrentChatChannelInfo?.ChatId;
      const replying_to_message = replyingASpecificMessage?.data?.content;
      const replying_to_user_member_id = replyingASpecificMessage?.data?.member?.id;
      const replying_message_message_id = replyingASpecificMessage?.data?.id;
      const replyingImage =
        replyingASpecificMessage?.data?.ImageUrl !== "" ? JSON.parse(replyingASpecificMessage?.data?.ImageUrl)[0] : "";

      ReplayMessageWithDebounce(
        AuthToken,
        serverId,
        channel_id,
        message,
        replying_to_message,
        replying_to_user_member_id,
        replying_message_message_id,
        replyingImage
      );
    },
    [message, Pathname, CurrentChatChannelInfo, replyingASpecificMessage, ReplayMessageWithDebounce]
  );

  const InputFiledChanged = useCallback(
    (e) => {
      setMessage(e.target.value);

      if (!Typing) {
        setTyping(true);
        socket?.emit("StartTyping", Data);
      }

      const TypingStartTime = new Date().getTime();
      const WaitingTime = 3000;

      setTimeout(() => {
        const CurrentTime = new Date().getTime();
        const Diff = CurrentTime - TypingStartTime;

        if (Diff >= WaitingTime && Typing) {
          socket?.emit("StopTyping", Data);
          setTyping(false);
        }
      }, WaitingTime);
    },
    [Typing, socket, Data]
  );
  const decryptContent = useCallback(
    (encryptedContent) => {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedContent, SECRET_KEY);
        const originalContent = bytes.toString(CryptoJS.enc.Utf8);
        return originalContent;
      } catch (error) {
        console.error("Decryption error:", error);
        return null;
      }
    },
    [SECRET_KEY]
  );
  useEffect(() => {
    if (editingAMessage?.data?.content) {
      setMessage(decryptContent(editingAMessage?.data?.content));
    }
  }, [decryptContent, editingAMessage]);

  const ReplyingOrEditingCommonComponent = (data: MessageProps) => {
    if (data.content || data.ImageUrl !== "") {
      return (
        <div className="message-container w-[100%] flex items-center justify-between transition-all duration-300 py-[4px]">
          <div className="flex items-start">
            <div className="profile">
              <Avatar className="w-[40px] h-[40px] ">
                <AvatarImage src={data?.member?.user?.Profile_Picture} className="w-[100%] h-[100%]" />
                <AvatarFallback
                  className="capitalize font-medium text-[15px]"
                  style={{
                    backgroundColor: data?.member?.user?.ProfileBgColor,
                  }}>
                  {data?.member?.user?.FullName?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="content w-[100%] relative  pt-[5px]">
              <div className="w-[100%]  px-[8px]  rounded-b-[6px] rounded-r-[6px] cursor-pointer  relative z-[1] min-w-[100px]">
                <div className="head   flex items-center justify-start gap-[10px]">
                  <div className="username">
                    <p className="text-white global-font-roboto text-[14px] font-[400]  capitalize ">
                      {data?.member?.user?.UserName}
                    </p>
                  </div>
                </div>
                <div className="message">
                  {data.content ? (
                    <p className="text-white global-font-roboto text-[15px] font-[300] py-[3px]">
                      {data?.IsDeleted ? data?.content : decryptContent(data?.content)}
                    </p>
                  ) : data.ImageUrl !== "" ? (
                    <p className="text-white global-font-roboto text-[15px] font-[300] py-[3px] flex items-center justify-start gap-[5px]">
                      <FaCamera />
                      <span>Photo</span>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-[15px]">
            {data.ImageUrl !== "" ? (
              <div className="w-[70px] h-[70px]">
                <Image
                  src={JSON.parse(data.ImageUrl)[0]}
                  alt="replying image"
                  width={70}
                  height={70}
                  className="object-cover rounded w-full h-full"></Image>
              </div>
            ) : null}
            <div className="close">
              <button
                className="w-[32px] h-[32px] flex justify-center items-center  rounded-full text-white"
                onClick={remove_editingAMessage_StateInfo}>
                <IoIosCloseCircle className="w-[32px] h-[32px]" />
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const handelEmojiPicker = (emoji: string) => {
    if (showUploadImageModal) {
      setMessageWithImages((message: string) => message + emoji);
    } else {
      setMessage((msg: string) => msg + emoji);
    }

    // ((prevMessages) => [...prevMessages, ...newMessages])
  };

  const StoreSelectedImagesOnTheCloud = async (file: File, AuthToken: string) => {
    const formData = new FormData();
    formData.append("Image", file);
    const response = await axios({
      method: "post",
      url: `${Host}/app/api/cloud/uploader/UploadImageToCloud`,
      headers: {
        Authorization: AuthToken,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    if (response.data?.success) {
      return {
        res: true,
        URL_String: response.data?.data?.secure_url as string,
      };
    } else {
      return {
        res: false,
        URL_String: "",
      };
    }
  };

  const sendImagesToTheSelectedChannelMessage = async (
    AuthToken: string,
    serverId: string,
    channelId: string,
    message: string,
    imagesArray: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("server_id", serverId);
      formData.append("channel_id", channelId);
      formData.append("content", message);
      formData.append("stringyFyImagesArray", imagesArray);
      const response = await axios({
        method: "post",
        url: `${Host}/app/api/Messages/messageWithImages`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      socket?.emit("NewMessageHasBeenSent", response.data);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handelCloudImageUploadingProcess = (
    selected_Images_Array: Array<File>,
    AuthToken: string,
    message: string,
    serverId: string,
    channel_id: string
  ) => {
    try {
      let uploadedImagesArray: Array<string> = [];
      selected_Images_Array.forEach(async (EachFile: File) => {
        const response: {
          res: boolean;
          URL_String: string;
        } = await StoreSelectedImagesOnTheCloud(EachFile, AuthToken);
        if (!response.res) {
          setLoading(false);
          return;
        }
        uploadedImagesArray.push(response.URL_String);
        if (selected_Images_Array.length === uploadedImagesArray.length) {
          const _newMessage = await sendImagesToTheSelectedChannelMessage(
            AuthToken,
            serverId,
            channel_id,
            message,
            JSON.stringify(uploadedImagesArray)
          );
          if (!_newMessage) return;
          setSelectedFinalImagesArray([]);
          setSelectedImageArray([]);
          if (ChannalMessages.every((msg: any) => msg.id !== _newMessage.id)) {
            setChannalMessages((prevMessages) => [_newMessage, ...prevMessages]);
          }
        }
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const storeFilesToTheCloud = async (file: File, AuthToken: string) => {
    const formData = new FormData();
    formData.append("File", file);
    const response = await axios({
      method: "post",
      url: `${Host}/app/api/cloud/uploader/uploadFilesToTheCloud`,
      headers: {
        Authorization: AuthToken,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    if (response.data?.success) {
      return {
        res: true,
        URL_String: response.data?.data?.secure_url as string,
      };
    } else {
      return {
        res: false,
        URL_String: "",
      };
    }
  };

  const sendFilesToTheSelectedChannel = async (
    AuthToken: string,
    serverId: string,
    channelId: string,
    message: string,
    filesArray: string
  ) => {
    try {
      console.log(filesArray);
      const formData = new FormData();
      formData.append("server_id", serverId);
      formData.append("channel_id", channelId);
      formData.append("content", message);
      formData.append("stringyFyFilesArray", filesArray);
      const response = await axios({
        method: "post",
        url: `${Host}/app/api/Messages/sendFilesInTheChat`,
        headers: {
          Authorization: AuthToken,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      socket?.emit("NewMessageHasBeenSent", response.data);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handelCloudFilesUploadingProcess = (
    selected_ImagesArray: Array<File>,
    AuthToken: string,
    message: string,
    serverId: string,
    channel_id: string
  ) => {
    try {
      const uploadFilesArray: Array<string> = [];
      selected_ImagesArray.forEach(async (EachFile) => {
        const response: {
          res: boolean;
          URL_String: string;
        } = await storeFilesToTheCloud(EachFile, AuthToken);
        if (!response.res) {
          setLoading(false);
          return;
        }
        uploadFilesArray.push(response.URL_String);
        if (selected_ImagesArray.length === uploadFilesArray.length) {
          const _newMessage = await sendFilesToTheSelectedChannel(
            AuthToken,
            serverId,
            channel_id,
            message,
            JSON.stringify(uploadFilesArray)
          );
          if (!_newMessage) return;
          setSelectedFinalImagesArray([]);
          setSelectedImageArray([]);
          if (ChannalMessages.every((msg: any) => msg.id !== _newMessage.id)) {
            setChannalMessages((prevMessages) => [_newMessage, ...prevMessages]);
          }
        }
      });
    } catch (error) {}
  };

  const sendMessageWithImages = async (e) => {
    e.preventDefault();
    setLoading(true);
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const serverId = Pathname?.split("/")[3];
    const channel_id = CurrentChatChannelInfo?.ChatId;
    if (isSending === "images") {
      setShowUploadImageModal(false);
      setSelectedFinalImagesArray(selectedImagesArray);
      handelCloudImageUploadingProcess(selectedImagesArray, AuthToken, messageWithImages, serverId, channel_id);
    } else {
      setShowUploadImageModal(false);
      handelCloudFilesUploadingProcess(selectedImagesArray, AuthToken, messageWithImages, serverId, channel_id);
    }
  };
  const ImageAttachmentOnInputChange = (e) => {
    setMessageWithImages(e.target.value);
  };

  return (
    <>
      <div className="w-[100%] shadow  border-t-[1px] border-t-[#2f2f2f] flex flex-col h px-[12px] pb-[15px] pt-[6px]  backdrop-blur-[10px] bg-[rgba(0,0,0,0.45)] absolute bottom-0 left-0 z-10 ">
        {editingAMessage?.is_Editing && !replyingASpecificMessage?.is_Replying
          ? ReplyingOrEditingCommonComponent(editingAMessage?.data)
          : null}
        {replyingASpecificMessage?.is_Replying && !editingAMessage?.is_Editing
          ? ReplyingOrEditingCommonComponent(replyingASpecificMessage?.data)
          : null}
        <div className="w-[100%] h-[100%] pr-[20px] py-[5px] bg-[#41464f] px-[12px] rounded-[5px]">
          <div className="w-[100%] flex gap-[5px] ">
            <DropdownMenu>
              <DropdownMenuTrigger className="min-w-[32px] h-[32px] flex justify-center items-center bg-gray-400 rounded-full group border-none focus:border-none focus:ring-0 focus:outline-none">
                <IoMdAdd className="text-[22px] group-hover:rotate-180 transition  duration-150    font-bold text-black" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className=" text-[rgb(255,255,255,0.9)]"
                  onClick={() => {
                    setIsSending("images");
                    setShowUploadImageModal(true);
                  }}>
                  <span className="flex items-center gap-[5px]">
                    <FaRegImages className="w-[18px] h-[18px]" />
                    <span className="">Send Image</span>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className=" text-[rgb(255,255,255,0.9)]"
                  onClick={() => {
                    setIsSending("files");
                    setShowUploadImageModal(true);
                  }}>
                  <span className="flex items-center gap-[5px]">
                    <FaFileUpload className="w-[18px] h-[18px]" />
                    <span className="">Send File</span>
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-[100%]">
              {showUploadImageModal ? (
                <form onSubmit={sendMessageWithImages} className="w-[100%] h-[100%]">
                  <input
                    type="text"
                    className="w-[100%] h-[100%] bg-transparent text-white focus:ring-0 focus:border-0 focus:outline-none global-font-roboto px-[5px] disabled:opacity-50"
                    placeholder={`Sent An Attachment Into #${CurrentChatChannelInfo?.ChatName}`}
                    value={messageWithImages}
                    onChange={ImageAttachmentOnInputChange}
                    disabled={Loading}
                    ref={InputFiledRef}
                  />
                </form>
              ) : (
                <form
                  onSubmit={
                    editingAMessage.is_Editing
                      ? Edit_SpecificMessage
                      : replyingASpecificMessage?.is_Replying
                      ? Replay_Message_OnSubmit
                      : OnFormSubmit
                  }
                  className="w-[100%] h-[100%]">
                  <input
                    type="text"
                    className="w-[100%] h-[100%] bg-transparent text-white focus:ring-0 focus:border-0 focus:outline-none global-font-roboto px-[5px] disabled:opacity-50"
                    placeholder={`Message #${CurrentChatChannelInfo?.ChatName}`}
                    value={message || ""}
                    onChange={InputFiledChanged}
                    disabled={Loading}
                    ref={InputFiledRef}
                  />
                </form>
              )}
            </div>

            <Popover>
              <PopoverTrigger className="min-w-[32px] h-[32px] flex justify-center items-center rounded-full group">
                <BsEmojiSmileFill className="text-[22px]  transition  duration-150    font-bold text-white" />
              </PopoverTrigger>
              <PopoverContent align="end" className="p-0 w-fit bg-transparent">
                <Picker data={data} onEmojiSelect={(emoji: any) => handelEmojiPicker(emoji.native)} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      {showUploadImageModal ? (
        <Upload_ImageModal
          showUploadImageModal={showUploadImageModal}
          setShowUploadImageModal={setShowUploadImageModal}
          selectedImagesArray={selectedImagesArray}
          setSelectedImagesArray={setSelectedImageArray}
          sendImagesOnClick={sendMessageWithImages}
          isSending={isSending}
        />
      ) : null}
    </>
  );
}
export default ServerFooterBar;
