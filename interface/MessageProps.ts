import { Channel } from "./Channel";
import { Member } from "./Member";

export interface MessageProps {
  id: string;
  content: string;
  FileURL: string;
  ImageUrl: string;
  IsEdited: boolean;
  IsDeleted: boolean;
  DeletedBy: string | null;
  Is_Reply: boolean;
  memberId: string;
  channelId: string;
  replyingMessage: string | null;
  replyingToUser_MemberId: string | null;
  replyingMessageMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;
  member: Member;
  channel: Channel;
  replyingToUser: Member;
  replyingImage: string;
  MessageType: string;
}
