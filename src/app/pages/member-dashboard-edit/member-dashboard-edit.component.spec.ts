import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDashboardEditComponent } from './member-dashboard-edit.component';

describe('MemberDashboardEditComponent', () => {
  let component: MemberDashboardEditComponent;
  let fixture: ComponentFixture<MemberDashboardEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberDashboardEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberDashboardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
