import { ConversationMessageInterface } from "./ConversationMessageInterface";

export interface EditingMessagePreview {
  isEditing: boolean;
  data: ConversationMessageInterface;
}

export interface ReplyingMessagePreviewInterface {
  isReplying: boolean;
  data: ConversationMessageInterface;
}
