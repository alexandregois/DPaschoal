import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { ToolbarNotificationIconComponent } from './toolbar-notification-icon.component';

describe('ToolbarNotificationIconComponent', () => {
  let component: ToolbarNotificationIconComponent;
  let fixture: ComponentFixture<ToolbarNotificationIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
      declarations: [ToolbarNotificationIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarNotificationIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
