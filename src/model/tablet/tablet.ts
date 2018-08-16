export interface Tablet {
    id: number;
    latitude: string;
    longitude: string;
    generated_time: string;
    message_time: string;
    watch_id: string;
    imei: number;
    message: string;
    guard_id: number;
    guard_dni: string;
    guard_name: string;
    guard_lastname: string;
    group_name?: string;
    iconUrl: string;
}
