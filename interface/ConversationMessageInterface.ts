import { User } from "./UserProps";

export interface ConversationMessageInterface {
  id: string;
  content: string;
  FileURL: string;
  ImageURL: string;
  IsDeleted: boolean;
  IsEdited: boolean;
  IsMessageReply: boolean;
  ConversationId: string;
  SenderId: string;
  Sender: User;
  ReceiverId: string;
  Receiver: User;
  createdAt: Date;
  updatedAt: Date;
  replyingMessageContent?: string | null;
  replyingToUser_UserId?: string | null;
  replyingToUser?: User | null;
  replyingMessage_MessageId?: string | null;
}
