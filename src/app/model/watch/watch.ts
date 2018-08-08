import { Guard } from './guard';

export interface Watch {
    id: number;
    guard_id: number;
    guard_out_id: number;
    create_date: string;
    update_date: string;
    latitude: string;
    longitude: string;
    observation: string;
    status: string;
    guard: Guard;
}