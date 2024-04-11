import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { url } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { CatchError } from '../../services/errorHandle';
import { catchError } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import 'grapesjs-preset-webpage';

@Component({
  selector: 'app-manage-election',
  standalone: true,
  imports: [MatTabsModule, MatProgressBarModule, MatCardModule, CommonModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, RouterModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './manage-election.component.html',
  styleUrl: './manage-election.component.css'
})
export class ManageElectionComponent {
  election: any = [];
  all_election: any = [];
  membership_type: any = [];
  election_data: any;
  total_customer!: number;
  election_progress_chart: any = [];
  private URL = url.app_url + "election/dashboard";
  private membershipTypeURL = url.app_url + "membership-type";


  displayedColumns: string[] = ['nomination_name', 'membership_position', 'start_date', 'end_date', 'status', 'action'];
  filter: any = '';

  constructor(private http: HttpClient, private handleError: CatchError, public dialog: MatDialog) {
  }
  matcher = new MyErrorStateMatcher();
  ngOnInit(): void {
    this.loadElection();
  }

  electionFilter() {
    this.loadElection();
  }

  public loadElection() {
    this.http.get(this.URL + '?filter=' + this.filter).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        this.election_data = res.votings;
        this.election = res.votings?.get_voting_positions;
        this.election = new MatTableDataSource(this.election);
        this.total_customer = res.total_customer;
        this.election_progress_chart = res.vote_progress_data;
        this.all_election = res.all_votings;
      }));
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
