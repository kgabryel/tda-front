import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddNotificationGroupComponent} from './add-notification-group.component';

describe('AddNotificationGroupComponent', () => {
  let component: AddNotificationGroupComponent;
  let fixture: ComponentFixture<AddNotificationGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNotificationGroupComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotificationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
