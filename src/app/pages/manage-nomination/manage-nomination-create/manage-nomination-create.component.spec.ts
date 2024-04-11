import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNominationCreateComponent } from './manage-nomination-create.component';

describe('ManageNominationCreateComponent', () => {
  let component: ManageNominationCreateComponent;
  let fixture: ComponentFixture<ManageNominationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageNominationCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageNominationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
