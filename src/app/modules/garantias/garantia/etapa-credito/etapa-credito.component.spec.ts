import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtapaCreditoComponent } from './etapa-credito.component';

describe('EtapaCreditoComponent', () => {
  let component: EtapaCreditoComponent;
  let fixture: ComponentFixture<EtapaCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapaCreditoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EtapaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
