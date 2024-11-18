import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormatTimePipe } from '../pipes/format-time.pipe';

import { RecuperarSenhaCodComponent } from './recuperar-senha-cod.component';

describe('RecuperarSenhaCodComponent', () => {
  let component: RecuperarSenhaCodComponent;
  let fixture: ComponentFixture<RecuperarSenhaCodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarSenhaCodComponent, FormatTimePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarSenhaCodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
