import { User } from "./UserProps";

export interface ConversationMessageInterface {
  ConversationId: string;
  FileURL: string;
  ImageURL: string;
  IsDeleted: boolean;
  IsEdited: boolean;
  Receiver: User;
  ReceiverId: string;
  Sender: User;
  SenderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
