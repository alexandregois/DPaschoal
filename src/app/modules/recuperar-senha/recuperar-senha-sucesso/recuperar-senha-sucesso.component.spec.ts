import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarSenhaSucessoComponent } from './recuperar-senha-sucesso.component';

describe('RecuperarSenhaSucessoComponent', () => {
  let component: RecuperarSenhaSucessoComponent;
  let fixture: ComponentFixture<RecuperarSenhaSucessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarSenhaSucessoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarSenhaSucessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
