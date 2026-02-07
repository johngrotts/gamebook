import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileTransferUtil {
  public static downloadFile(data: any, filename: string, type: string): void {
    // Create a Blob object with the data and specified MIME type
    const blob = new Blob([data], {type: type});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  public uploadFile(): void {

  }
}
