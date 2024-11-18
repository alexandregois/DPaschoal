import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringService {
  convertToFriendlyUrl(therm: string | undefined): string | undefined {
    if (!therm) {
      return undefined;
    }
    return encodeURIComponent(
      therm
        .split(' ')
        .join('-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    );
  }
}
