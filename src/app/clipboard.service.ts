import { Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  constructor(private clipboard: Clipboard) { }
  
  copyToClipboard(text: string): void {
    this.clipboard.copy(text);
  }
}
