import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-masking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './masking.html',
  styleUrls: ['./masking.css']
})
export class MaskingComponent {
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