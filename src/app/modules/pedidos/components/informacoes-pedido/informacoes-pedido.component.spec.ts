import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacoesPedidoComponent } from './informacoes-pedido.component';

describe('InformacoesPedidoComponent', () => {
  let component: InformacoesPedidoComponent;
  let fixture: ComponentFixture<InformacoesPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformacoesPedidoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InformacoesPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
