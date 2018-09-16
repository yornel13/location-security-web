import {Chat} from './chat';

export interface ListUnread {
  data: Chat[];
  unread: number;
}
