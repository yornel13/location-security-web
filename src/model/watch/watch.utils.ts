import {Watch} from './watch';

export class WatchUtils {

    processWatches(watches: Watch[]) {
        watches.forEach( watch => {
            watch.iconUrl = './assets/maps/watch.png';
        });
        return watches;
    }
}
