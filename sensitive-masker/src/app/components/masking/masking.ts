import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-masking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './masking.html',
  styleUrls: ['./masking.css']
})
export class MaskingComponent implements AfterViewInit {
  @ViewChild('maskingTextarea') textareaRef!: ElementRef<HTMLTextAreaElement>;
  
  rawText = '';
  maskedText = '';
  showRaw = false;
  private isUpdating = false;
  private lastCursorPosition = 0;
  private pendingInputData = '';

  sensitiveFields = [
    'password',
    'phone number',
    'email',
    'driver license number',
    'ip address',
    'social security number',
    'credit card number'
  ];

  get debugRawText(): string {
    return this.rawText;
  }

  ngAfterViewInit() {
    // Initialize
  }

  onBeforeInput(event: any) {
    if (event.data) {
      this.pendingInputData = event.data;
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const textarea = event.target as HTMLTextAreaElement;
    this.lastCursorPosition = textarea.selectionStart;        // Store the current cursor position

    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.pendingInputData = '';       // We need to handle combo keys like ctrl+c, ctrl+v, etc.
    }
  }

  onUserInput(event: Event) {
    if (this.isUpdating) return;

    const textarea = event.target as HTMLTextAreaElement;
    const currentCursor = textarea.selectionStart;
    
    if (this.showRaw) {
      this.rawText = textarea.value;
      this.updateMaskedText();
      return;
    }
    
    if (this.pendingInputData) {
      const beforeCursor = this.rawText.substring(0, this.lastCursorPosition);
      const afterCursor = this.rawText.substring(this.lastCursorPosition);
      this.rawText = beforeCursor + this.pendingInputData + afterCursor;
      this.pendingInputData = '';
    } else {
      const currentDisplayLength = textarea.value.length;
      const expectedMaskedLength = this.maskedText.length;
      
      if (currentDisplayLength < expectedMaskedLength) {
        const deletedCount = expectedMaskedLength - currentDisplayLength;
        const beforeCursor = this.rawText.substring(0, Math.max(0, this.lastCursorPosition - deletedCount));
        const afterCursor = this.rawText.substring(this.lastCursorPosition);
        this.rawText = beforeCursor + afterCursor;
      }
    }
    
    this.updateMaskedText();
    
    this.isUpdating = true;
    textarea.value = this.maskedText;
    
    const newCursorPos = this.calculateNewCursorPosition(currentCursor);
    
    requestAnimationFrame(() => {
      textarea.setSelectionRange(newCursorPos, newCursorPos);     //We can use this introduce controls like undo/redo
      this.isUpdating = false;
    });
  }

  calculateNewCursorPosition(currentCursor: number): number {
    const ratio = this.maskedText.length > 0 ? currentCursor / this.maskedText.length : 0;
    return Math.min(currentCursor, this.maskedText.length);
  }

  toggleVisibility() {
    this.showRaw = !this.showRaw;
    
    this.isUpdating = true;
    const textarea = this.textareaRef.nativeElement;
    const cursorPos = textarea.selectionStart;
    
    if (this.showRaw) {
      textarea.value = this.rawText;
    } else {
      textarea.value = this.maskedText;
    }
    
    const newCursorPos = Math.min(cursorPos, textarea.value.length);
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    
    this.isUpdating = false;
  }

  updateMaskedText() {
    const lines = this.rawText.split('\n');
    const maskedLines: string[] = [];

    for (const line of lines) {
      let maskedLine = line;
      
      for (const field of this.sensitiveFields) {
        maskedLine = this.maskFieldInLine(maskedLine, field);
      }
      
      maskedLines.push(maskedLine);
    }

    this.maskedText = maskedLines.join('\n');
  }

  maskFieldInLine(line: string, field: string): string {
    const regex = new RegExp(`(${field}\\s*)"([^"]*)"`, 'gi');
    return line.replace(regex, (_match, prefix, value) => {
      return prefix + '"' + '*'.repeat(value.length) + '"';
    });
  }

  get toggleIcon(): string {
    return this.showRaw ? '🫣' : '🧐';
  }
}