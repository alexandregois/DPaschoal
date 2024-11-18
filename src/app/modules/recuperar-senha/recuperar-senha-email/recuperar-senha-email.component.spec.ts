import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { RecuperarSenhaEmailComponent } from './recuperar-senha-email.component';

describe('RecuperarSenhaEmailComponent', () => {
  let component: RecuperarSenhaEmailComponent;
  let fixture: ComponentFixture<RecuperarSenhaEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RecuperarSenhaEmailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarSenhaEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
