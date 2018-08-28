export interface ChatLine {
    id?: number;
    chat_id: number;
    channel_id: string;
    text: string;
    create_at: string;
    sender_id: number;
    sender_type: string;
    sender_name: string;
    state: number;
}
