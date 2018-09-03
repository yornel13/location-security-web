export interface Chat {
    id?: number;
    user_1_id: number;
    user_1_type: string;
    user_1_name: string;
    user_2_id: number;
    user_2_type: string;
    user_2_name: string;
    create_at: string;
    update_at: string;
    state: number;
    old?: boolean;
}
