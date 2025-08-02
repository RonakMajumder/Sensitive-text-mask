import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-masking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './masking.html',
  styleUrls: ['./masking.css']
})
export class MaskingComponent {
  rawText = '';
  maskedText = '';
  showRaw = false;

  sensitiveFields = [
    'password',
    'phone number',
    'email',
    'driver license number',
    'ip address',
    'social security number',
    'credit card number'
  ];

  onUserInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.rawText = textarea.value;
    this.updateMaskedText();
  }

  toggleVisibility() {
    this.showRaw = !this.showRaw;
  }

  updateMaskedText() {
    const lines = this.rawText.split('\n');
    const maskedLines: string[] = [];

    for (const line of lines) {
      const match = this.matchSensitiveLine(line);
      if (match) {
        const { prefix, value } = match;
        maskedLines.push(prefix + '*'.repeat(value.length));
      } else {
        maskedLines.push(line);
      }
    }

    this.maskedText = maskedLines.join('\n');
  }

  matchSensitiveLine(line: string): { prefix: string; value: string } | null {
    for (const field of this.sensitiveFields) {
      const regex = new RegExp(`^(${field}:\\s*)(.*)$`, 'i');
      const match = line.match(regex);
      if (match) {
        return {
          prefix: match[1],
          value: match[2]
        };
      }
    }
    return null;
  }

  get displayText(): string {
    return this.showRaw ? this.rawText : this.maskedText;
  }

  get toggleIcon(): string {
    return this.showRaw ? 'Hide' : 'Show';
  }
}