import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RecuperarSenhaAlteracaoComponent } from './recuperar-senha-alteracao.component';

describe('RecuperarSenhaAlteracaoComponent', () => {
  let component: RecuperarSenhaAlteracaoComponent;
  let fixture: ComponentFixture<RecuperarSenhaAlteracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      declarations: [RecuperarSenhaAlteracaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarSenhaAlteracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
