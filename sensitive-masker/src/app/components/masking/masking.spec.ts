import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskingComponent } from './masking';

describe('MaskingComponent', () => {
  let component: MaskingComponent;
  let fixture: ComponentFixture<MaskingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaskingComponent],
      declarations: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaskingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
