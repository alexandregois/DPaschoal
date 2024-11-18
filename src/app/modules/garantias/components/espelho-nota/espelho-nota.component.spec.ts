import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspelhoNotaComponent } from './espelho-nota.component';

describe('EspelhoNotaComponent', () => {
  let component: EspelhoNotaComponent;
  let fixture: ComponentFixture<EspelhoNotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EspelhoNotaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EspelhoNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
