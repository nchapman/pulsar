export interface ChatMsg {
  id: Id;
  text: string;
  isUser?: boolean;
  user?: { name: string };
  assistant?: {
    userMsgId: Id;
  };
}
