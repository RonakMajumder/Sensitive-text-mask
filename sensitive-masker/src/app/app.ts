import { Component } from '@angular/core';
import { MaskingComponent } from './components/masking/masking';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MaskingComponent],
  template: `
    <main>
      <app-masking />
    </main>
  `,
  styles: [`
    main {
      max-width: 700px;
      margin: 50px auto;
      padding: 20px;
      font-family: sans-serif;
    }
  `]
})
export class AppComponent {}
