import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, ErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { CommonModule, DatePipe, JsonPipe, Location } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { url } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { CatchError } from '../../../services/errorHandle';
import { catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-election-create',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatDatepickerModule, FormsModule, JsonPipe, MatNativeDateModule, MatSelectModule, CommonModule],
  providers: [
    DatePipe,
  ],
  templateUrl: './manage-election-create.component.html',
  styleUrl: './manage-election-create.component.css'
})
export class ManageElectionCreateComponent {
  private nominationPositionURL = url.app_url + "election/nomination-position";
  private nominationListURL = url.app_url + "election/nomination-list";
  private storeElectionURL = url.app_url + "election/store";
  minDate?: Date;
  constructor(private http: HttpClient, private handleError: CatchError, private _location: Location, private datepipe: DatePipe, private adapter: DateAdapter<any>) { }
  positionList: any = [];
  nominationList: any = [];

  ngOnInit(): void {
    // this.loadMemberhipPosition();
    this.getNominationList();
  }

  getNominationList() {
    this.http.get(this.nominationListURL).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        this.nominationList = res.nomination;
      }));
  }

  isStartDateDisabled(): boolean {
    const startDate = this.form.controls['startFormControl'].value;
    const today = this.adapter.today();
    return startDate && startDate < today;
  };

  getPosition() {
    this.http.get(this.nominationPositionURL + '?nomination_uuid=' + this.form.controls['nominationFormControl'].value).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        this.positionList = res.result;
      }));
  }
  // validateStartDate(control: any) {
  //   const selectedDate = control.value;
  //   const today = this.adapter.today();
  //   return selectedDate >= today ? null : { matStartDateInvalid: true };
  // }

  // validateEndDate(control: any) {
  //   const selectedDate = control.value;
  //   const today = this.adapter.today();
  //   return selectedDate >= today ? null : { matEndDateInvalid: true };
  // }
  form: any = new FormGroup({
    nominationFormControl: new FormControl('', [Validators.required]),
    startFormControl: new FormControl<Date | null>(null, [Validators.required, /*this.validateStartDate.bind(this)*/]),
    endFormControl: new FormControl<Date | null>(null, [Validators.required, /*this.validateEndDate.bind(this)*/]),
    positionFormControl: new FormControl('', [Validators.required]),
  });
  matcher = new MyErrorStateMatcher();

  onCreate() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('nomination', this.form.controls['nominationFormControl'].value);
      const startDate = this.datepipe.transform(this.form.controls['startFormControl'].value, 'y-MM-dd');
      formData.append('start_date', startDate!);
      const endDate = this.datepipe.transform(this.form.controls['endFormControl'].value, 'y-MM-dd');
      formData.append('end_date', endDate!);
      formData.append('nomination_position', this.form.controls['positionFormControl'].value);

      this.http.post(this.storeElectionURL, formData).pipe(
        catchError(e => {
          return this.handleError.handleError(e);
        })).subscribe(((res: any) => {
          if (res.status == "success") {
            Swal.fire(
              'Success!',
              res.message,
              'success'
            )
            this._location.back();
          } else {
            Swal.fire(
              'Error!',
              res.message,
              'error'
            )
          }
        }));
    }
  }

}


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}