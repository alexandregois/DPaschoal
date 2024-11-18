import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor() {}

  downloadFile(data: any, fileName: string): void {
    const objectUrl: string = this.convertBlobToObjectURL(data);

    const a: HTMLAnchorElement = document.createElement(
      'a'
    ) as HTMLAnchorElement;

    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }

  openFile(data: any): void {
    const objectUrl: string = this.convertBlobToObjectURL(data);
    window.open(objectUrl);
  }

  private convertBlobToObjectURL(data: any): string {
    const type: string = data.headers.get('content-type');
    const blob: Blob = new Blob([data.body], { type });
    return URL.createObjectURL(blob);
  }
}
