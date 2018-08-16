import {Tablet} from './tablet';

export class TabletUtils {

    processTablets(tablets: Tablet[]) {
        tablets.forEach(tablet => {
            tablet.group_name = 'Tablet Guardia';
            tablet.iconUrl = './assets/maps/watch.png';
        });
        return tablets;
    }
}
