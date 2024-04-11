import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNominationPositionComponent } from './manage-nomination-position.component';

describe('ManageNominationPositionComponent', () => {
  let component: ManageNominationPositionComponent;
  let fixture: ComponentFixture<ManageNominationPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageNominationPositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageNominationPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
