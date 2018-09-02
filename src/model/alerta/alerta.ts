export interface Alerta {
    id?: number;
    guard_id?: string;
    imei?: string;
    cause?: string;
    type?: string;
    message?: string;
    extra?: string;
    latitude?: string;
    longitude?: string;
    create_date?: string;
    update_date?: string;
    status?: number;
}