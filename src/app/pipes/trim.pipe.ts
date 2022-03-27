import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim',
})
export class TrimPipe implements PipeTransform {
  transform(value: string): string {
    const userInput = value;
    return userInput?.replace('\n', '')?.trim();
  }
}
