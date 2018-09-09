import {Chat} from './chat';
import {Member} from './Member';

export interface ListGroupMembers {
    data: Member[];
    total: number;
}