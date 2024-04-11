import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDashboardCreateComponent } from './member-dashboard-create.component';

describe('MemberDashboardCreateComponent', () => {
  let component: MemberDashboardCreateComponent;
  let fixture: ComponentFixture<MemberDashboardCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberDashboardCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberDashboardCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
