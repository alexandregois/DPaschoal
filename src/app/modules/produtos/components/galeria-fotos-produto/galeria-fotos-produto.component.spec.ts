import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaFotosProdutoComponent } from './galeria-fotos-produto.component';

describe('GaleriaFotosProdutoComponent', () => {
  let component: GaleriaFotosProdutoComponent;
  let fixture: ComponentFixture<GaleriaFotosProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GaleriaFotosProdutoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GaleriaFotosProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
