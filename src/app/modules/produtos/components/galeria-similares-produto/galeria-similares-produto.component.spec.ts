import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaSimilaresProdutoComponent } from './galeria-similares-produto.component';

describe('GaleriaSimilaresProdutoComponent', () => {
  let component: GaleriaSimilaresProdutoComponent;
  let fixture: ComponentFixture<GaleriaSimilaresProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GaleriaSimilaresProdutoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GaleriaSimilaresProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
