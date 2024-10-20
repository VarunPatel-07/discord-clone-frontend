import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string;

export const GetLocalTimeFrom_UTC = (Time: Date) => {
  const date = new Date(Time);
  const localTime = date.toLocaleString();
  const __time = localTime.split(",")[1].split(":");
  const AM_PM = Number(__time[0]) >= 12 ? "PM" : "AM";

  return `${__time[0]}:${__time[1]} ${AM_PM}`;
};

export const decryptContent = (encryptedContent: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, SECRET_KEY);
    const originalContent = bytes.toString(CryptoJS.enc.Utf8);
    return originalContent;
  } catch (error) {
    return null;
  }
};
