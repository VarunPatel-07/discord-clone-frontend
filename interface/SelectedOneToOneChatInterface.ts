import { User } from "./UserProps";

export interface SelectedOneToOneChatInterface {
  LatestMessage: string;
  ReceiverId: string;
  Recever: User;
  Sender: User;
  SenderId: string;
  createdAt: string;
  id: string;
  updatedAt: string;
}
