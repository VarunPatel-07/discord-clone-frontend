import axios from "axios";
import { getCookie } from "cookies-next";

export const GenerateCallToken = async () => {
  const HOST = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;
  const AuthToken = getCookie("User_Authentication_Token") as string;
  const response = await axios({
    method: "get",
    url: `${HOST}/app/api/VideoCall/generateTokenForCall`,
    headers: {
      Authorization: AuthToken,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.token;
};
