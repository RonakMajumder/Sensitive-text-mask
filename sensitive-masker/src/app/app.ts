import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Sensitive Info Masker</h2>
    
    <textarea 
      [(ngModel)]="text" 
      (input)="onInputChange()" 
      rows="10" 
      cols="50"
      placeholder="Type something with email, phone or credit card...">
    </textarea>
  `,
  styles: [`
    textarea {
      width: 100%;
      font-size: 16px;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 8px;
      resize: vertical;
    }
  `]
})
export class AppComponent {
  text = '';

  onInputChange() {
    this.text = this.maskSensitiveInfo(this.text);
  }

  maskSensitiveInfo(text: string): string {
    return text
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[email masked]')
      .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[credit card masked]')
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN masked]')
      .replace(/\b\d{10,11}\b/g, '[phone masked]');
  }
}