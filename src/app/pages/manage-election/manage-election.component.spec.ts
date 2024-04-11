import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageElectionComponent } from './manage-election.component';

describe('ManageElectionComponent', () => {
  let component: ManageElectionComponent;
  let fixture: ComponentFixture<ManageElectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageElectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageElectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
