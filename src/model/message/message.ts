export interface Message {
  id?: number;
  chat_id?: number;
  channel_id?: number;
  text?: string;
  image?: string;
  create_at?: string;
  sender_id?: number;
  sender_type?: string;
  senderName?: string;
  state?: number;
}
