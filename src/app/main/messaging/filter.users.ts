import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsers implements PipeTransform {

  transform(users: any[], search: any): any {
    if (search === undefined) {
      return users;
    } else {
      return users.filter(data => {
        if (data.name.trim().toLowerCase().includes(search.trim().toLowerCase())) {
          return data.name.trim().toLowerCase().includes(search.trim().toLowerCase());
        }
      });
    }
  }
}
