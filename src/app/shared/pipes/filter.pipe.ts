import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(items: string[] | null, query: string | null): string[] | null {
    if (!items) return null;
    if (!query) return items;

    return items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  }
}
