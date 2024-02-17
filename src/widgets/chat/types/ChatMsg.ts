export interface ChatMsg {
  id: Id;
  text: string;
  author?: string;
  isUser?: boolean;
}
