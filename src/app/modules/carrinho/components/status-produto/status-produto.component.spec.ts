import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusProdutoComponent } from './status-produto.component';

describe('StatusProdutoComponent', () => {
  let component: StatusProdutoComponent;
  let fixture: ComponentFixture<StatusProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusProdutoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
