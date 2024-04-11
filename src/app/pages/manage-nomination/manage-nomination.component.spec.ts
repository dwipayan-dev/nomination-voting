import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNominationComponent } from './manage-nomination.component';

describe('ManageNominationComponent', () => {
  let component: ManageNominationComponent;
  let fixture: ComponentFixture<ManageNominationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageNominationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageNominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
