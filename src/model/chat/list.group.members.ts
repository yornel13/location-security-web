import {Chat} from './chat';
import {Member} from './member';

export interface ListGroupMembers {
    data: Member[];
    total: number;
}
