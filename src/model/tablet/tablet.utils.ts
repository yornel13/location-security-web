import {Tablet} from './tablet';

export class TabletUtils {

    processTablets(tablets: Tablet[]) {
        tablets.forEach(tablet => {
            tablet.group_name = 'Tablet Guardia';
            tablet.iconUrl = './assets/maps/watch.png';
            let id_string = '' + tablet.id;
            if (id_string.length === 1) {
                id_string = '00' + id_string;
            } else if (id_string.length === 2) {
                id_string = '0' + id_string;
            }
            tablet.alias = 'Tablet ' + id_string;
        });
        return tablets;
    }
}
