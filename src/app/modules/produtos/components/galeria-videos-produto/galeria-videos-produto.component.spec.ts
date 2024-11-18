import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaVideosProdutoComponent } from './galeria-videos-produto.component';

describe('GaleriaFotosProdutoComponent', () => {
  let component: GaleriaVideosProdutoComponent;
  let fixture: ComponentFixture<GaleriaVideosProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GaleriaVideosProdutoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GaleriaVideosProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
