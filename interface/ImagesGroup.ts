import { MessageProps } from "./MessageProps";

export interface ImagesGroup {
  senderId: string;
  messageArray: Array<MessageProps>;
  timestamp: Date;
}
