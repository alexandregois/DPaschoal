import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaDeUsoDialogComponent } from './politica-de-uso-dialog.component';

describe('PoliticaDeUsoDialogComponent', () => {
  let component: PoliticaDeUsoDialogComponent;
  let fixture: ComponentFixture<PoliticaDeUsoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoliticaDeUsoDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PoliticaDeUsoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
