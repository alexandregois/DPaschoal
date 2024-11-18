import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarSenhaHeaderComponent } from './recuperar-senha-header.component';

describe('RecuperarSenhaHeaderComponent', () => {
  let component: RecuperarSenhaHeaderComponent;
  let fixture: ComponentFixture<RecuperarSenhaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarSenhaHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarSenhaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
