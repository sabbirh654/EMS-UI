import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAmPm' })
export class TimeAmPmPipe implements PipeTransform {
    transform(value: string): string {
        const [hours, minutes, seconds] = value.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds);
        return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
    }
}