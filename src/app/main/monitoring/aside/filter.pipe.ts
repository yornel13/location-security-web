import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(markersData: any[], search: any): any {
       if ( search === undefined) {
           return markersData;
       } else {
           return markersData.filter(data => {
               if (data.imei.toLowerCase().includes(search.toLowerCase())) {
                    return data.imei.toLowerCase().includes(search.toLowerCase());
               }
               if (data.group_name.toLowerCase().includes(search.toLowerCase())) {
                   return data.group_name.toLowerCase().includes(search.toLowerCase());
               }
               if (data.guard_name !== undefined) {
                  const name = data.guard_name + ' ' + data.lastname;
                  if (name.toLowerCase().includes(search.toLowerCase())) {
                      return name.toLowerCase().includes(search.toLowerCase());
                  }
                   if (data.guard_dni.toLowerCase().includes(search.toLowerCase())) {
                      return data.guard_dni.toLowerCase().includes(search.toLowerCase());
                   }
               }
           });
      }
  }

}
