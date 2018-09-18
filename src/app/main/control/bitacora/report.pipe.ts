import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'reportFilter'
})
export class ReportFilterPipe implements PipeTransform {

    transform(markersData: any[], search: any): any {
        if (search === undefined) {
            return markersData;
        } else {
            return markersData.filter(data => {

                if (data.title.toLowerCase().includes(search.toLowerCase())) {
                    return data.title.toLowerCase().includes(search.toLowerCase());
                }
                if (data.observation.toLowerCase().includes(search.toLowerCase())) {
                    return data.observation.toLowerCase().includes(search.toLowerCase());
                }
                if (data.watch !== undefined) {
                    const name = data.watch.guard_name + ' ' + data.watch.lastname;
                    if (name.toLowerCase().includes(search.toLowerCase())) {
                        return name.toLowerCase().includes(search.toLowerCase());
                    }
                    if (data.watch.guard_dni.toLowerCase().includes(search.toLowerCase())) {
                        return data.watch.guard_dni.toLowerCase().includes(search.toLowerCase());
                    }
                    if (data.watch.tablet_imei.toLowerCase().includes(search.toLowerCase())) {
                        return data.watch.tablet_imei.toLowerCase().includes(search.toLowerCase());
                    }
                }
            });
        }
    }

}