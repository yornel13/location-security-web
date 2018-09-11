import {PipeTransform, Pipe} from '@angular/core';

@Pipe({
  name: 'relativeTime'
})

export class RelativeTimePipe implements PipeTransform {

  transform(inputDate: string): string {
      const current = new Date().valueOf();
      const input = new Date(inputDate).valueOf();
      const msPerMinute = 60 * 1000;
      const msPerHour = msPerMinute * 60;
      const msPerDay = msPerHour * 24;
      const msPerMonth = msPerDay * 30;
      const msPerYear = msPerDay * 365;

      const elapsed = current - input;

      if (elapsed < msPerMinute) {
          return 'hace ' + Math.round(elapsed / 1000) + ' segundos';
      } else if (elapsed < msPerHour) {
          const time = Math.round(elapsed / msPerMinute);
          if (time > 1) {return 'hace ' + time + ' minutos';
          } else { return 'hace ' + time + ' minuto'; }
      } else if (elapsed < msPerDay) {
          const time = Math.round(elapsed / msPerHour);
          if (time > 1) {return 'hace ' + time + ' horas';
          } else { return 'hace ' + time + ' hora'; }
      } else if (elapsed < msPerMonth) {
          const time = Math.round(elapsed / msPerDay);
          if (time > 1) {return 'hace ' + time + ' dias';
          } else { return 'hace ' + time + ' dia'; }
      } else if (elapsed < msPerYear) {
          const time = Math.round(elapsed / msPerMonth);
          if (time > 1) {return 'hace ' + time + ' meses';
          } else { return 'hace ' + time + ' mes'; }
      } else {
          return 'aproximadamente hace ' + Math.round(elapsed / msPerYear) + ' años';
      }
  }
}
