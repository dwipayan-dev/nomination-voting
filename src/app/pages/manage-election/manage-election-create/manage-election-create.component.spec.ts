import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageElectionCreateComponent } from './manage-election-create.component';

describe('ManageElectionCreateComponent', () => {
  let component: ManageElectionCreateComponent;
  let fixture: ComponentFixture<ManageElectionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageElectionCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageElectionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
