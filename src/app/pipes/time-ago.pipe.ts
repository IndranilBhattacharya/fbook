import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (value) {
      const [ms, min, hr, day, mon, yr] = getTimeDiffParams(value);
      return timePassed(ms, min, hr, day, mon, yr);
    }
    return 'Now';
  }
}

const timePassed = (...timeParams: number[]): string => {
  const affix = ' ago';
  const [ms, min, hr, day, mon, yr] = timeParams;
  if (ms <= 0) {
    return '♾️';
  } else if (yr > 1) {
    return `${yr} years ${affix}`;
  } else if (mon > 1) {
    return `${mon} months ${affix}`;
  } else if (day > 1) {
    return `${day} days ${affix}`;
  } else if (hr > 1) {
    return `${hr} hours ${affix}`;
  } else {
    if (hr === 1) {
      if (min > 60) {
        return `${hr}h ${min % 60}mins ${affix}`;
      }
      return `1h ago`;
    } else if (min > 1) {
      return `${min}mins ${affix}`;
    }
  }
  return 'Now';
};

const getTimeDiffParams = (fromTime: string): number[] => {
  const inputTime = new Date(fromTime)?.getTime();
  if (inputTime <= 0) {
    return [-1];
  }
  const currentTime = new Date().getTime();
  const ms = currentTime - inputTime;
  const sec = ~~(ms / 1000);
  const min = ~~(sec / 60);
  const hr = ~~(min / 60);
  const day = ~~(hr / 24);
  const mon = ~~(day / 30);
  const yr = ~~(mon / 12);
  return [ms, min, hr, day, mon, yr];
};
