import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarantiasComponent } from './garantias.component';

describe('GarantiasComponent', () => {
  let component: GarantiasComponent;
  let fixture: ComponentFixture<GarantiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GarantiasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GarantiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
