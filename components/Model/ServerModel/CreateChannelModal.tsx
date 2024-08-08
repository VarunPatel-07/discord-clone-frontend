import { Context } from "@/context/ContextApi";
import React, { useState, useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import { useDebounce } from "@/hooks/debounceHook";
import SpinnerComponent from "@/components/Loader/SpinnerComponent";
function CreateChannelModal({
  ShowCreateNewChannelModal,
  setShowCreateNewChannelModal,
  CreateChanelInfoChannelName,
  setCreateChanelInfoChannelName,
  CreateChanelInfoChannelType,
  setCreateChanelInfoChannelType,
}: {
  ShowCreateNewChannelModal: boolean;
  setShowCreateNewChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
  CreateChanelInfoChannelName: string;
  setCreateChanelInfoChannelName: React.Dispatch<React.SetStateAction<string>>;
  CreateChanelInfoChannelType: string;
  setCreateChanelInfoChannelType: React.Dispatch<React.SetStateAction<string>>;
}) {
  //

  //

  const Pathname = usePathname();
  const { CreateNewChannelFunction } = useContext(Context) as any;
  const [ShowLoader, setShowLoader] = useState(false);
  //
  //
  //
  const CreateChannelUsingDebounce = useDebounce(
    async (
      AuthToken: String,
      serverId: String,
      ChannelName: String,
      ChannelType: String
    ) => {
      await CreateNewChannelFunction(
        AuthToken,
        serverId,
        ChannelName,
        ChannelType
      );
      setShowLoader(false);
      setShowCreateNewChannelModal(false);
    },
    350
  );
  //
  //
  //
  const Create__New__Channel__Function = async (e: any) => {
    setShowLoader(true);
    e.preventDefault();
    const AuthToken = getCookie("User_Authentication_Token") as string;
    const serverId = Pathname?.split("/")[3];
    setShowCreateNewChannelModal(true);
    CreateChannelUsingDebounce(
      AuthToken,
      serverId,
      CreateChanelInfoChannelName,
      CreateChanelInfoChannelType
    );
  };
  //
  //
  //
  return (
    <div
      className={`absolute w-full h-full max-h-full max-w-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px] z-20 top-0 left-0 transition scale-0 opacity-0 not-visible ${
        ShowCreateNewChannelModal ? "scale-100 opacity-100 visible" : ""
      } `}
    >
      <div className="w-100 h-100 flex items-center justify-center w-100 px-[15px]">
        <div className="modal-inner-section w-100  max-w-[600px] max-h-[600px] overflow-auto no- rounded-[10px] bg-[#f2f2f2] py-[15px]  ">
          <div className="inner-section">
            <div className="close-modal-button w-100 flex items-end justify-end px-[15px]">
              <button
                className="border-0 bg-transparent text-[30px]"
                onClick={() => {
                  setShowCreateNewChannelModal(false);
                  setCreateChanelInfoChannelName("");
                  setCreateChanelInfoChannelType("");
                }}
              >
                <IoIosCloseCircleOutline />
              </button>
            </div>
            <div className="invite-people-card-main-content-section w-100">
              <div className="card-title w-100 px-[15px]">
                <h3 className="font-mono text-[30px] capitalize text-indigo-600 text-center font-semibold ">
                  create channel
                </h3>
              </div>
              <div className="server-information-section mt-8">
                <div className="input-section w-100 px-[15px]">
                  <form
                    className="form"
                    onSubmit={Create__New__Channel__Function}
                  >
                    <div className="flex flex-col items-start justify-start">
                      <label
                        htmlFor="Sever_Name"
                        className="global-font-roboto fs-16 font-medium global-font-roboto  text-black pb-2 capitalize"
                      >
                        channel Name
                      </label>
                      <input
                        className="w-100 bg-white py-[10px] px-[8px] rounded-[5px] text-black fs-14 global-font-roboto"
                        type="text"
                        id="Sever_Name"
                        name="Sever_Name"
                        placeholder="Enter Sever Name"
                        value={CreateChanelInfoChannelName}
                        onChange={(e: any) => {
                          setCreateChanelInfoChannelName(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="mt-[30px]">
                      <Select
                        onValueChange={(value) => {
                          setCreateChanelInfoChannelType(value);
                        }}
                        value={CreateChanelInfoChannelType}
                      >
                        <SelectTrigger className="w-[100%] shadow-none border-0 outline-none">
                          <SelectValue placeholder="Select Channel Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="TEXT"
                            className="cursor-pointer global-font-roboto fs-16"
                          >
                            Text
                          </SelectItem>
                          <SelectItem
                            value="AUDIO"
                            className="cursor-pointer global-font-roboto fs-16"
                          >
                            Audio
                          </SelectItem>
                          <SelectItem
                            value="VIDEO"
                            className="cursor-pointer global-font-roboto fs-16"
                          >
                            Video
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <button
                      className="bg-indigo-500 text-white w-100 px-[15px] py-[12px] rounded-[5px]  capitalize fs-18 font-medium global-font-roboto mt-[30px] transition hover:bg-indigo-700 disabled:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={CreateChanelInfoChannelName === "general"}
                    >
                      {ShowLoader ? <SpinnerComponent /> : "create channel"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateChannelModal;
