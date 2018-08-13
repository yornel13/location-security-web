import { Guard } from '../guard/guard';

export class Watch {
    id: number;
    guard_id?: number;
    guard_out_id?: number;
    create_date: string;
    update_date: string;
    longitude: number;
    latitude: number;
    observation?: string;
    status?: string;
    guard?: Guard;
    iconUrl?: string;
}
