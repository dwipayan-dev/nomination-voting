import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { DatePipe, JsonPipe, Location } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { url } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { CatchError } from '../../../services/errorHandle';
import { catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-nomination-create',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatDatepickerModule, FormsModule, JsonPipe, MatNativeDateModule, MatSelectModule],
  providers: [
    DatePipe,
  ],
  templateUrl: './manage-nomination-create.component.html',
  styleUrl: './manage-nomination-create.component.css'
})
export class ManageNominationCreateComponent {
  private memberhipPositionURL = url.app_url + "memberhip-position";
  private storeNominationURL = url.app_url + "nomination/store";
  constructor(private http: HttpClient, private handleError: CatchError, private _location: Location, private datepipe: DatePipe) { }
  positionList: any = [];

  ngOnInit(): void {
    this.loadMemberhipPosition();
  }

  loadMemberhipPosition() {
    this.http.get(this.memberhipPositionURL).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        this.positionList = res.result;
      }));
  }

  form: any = new FormGroup({
    nominationFormControl: new FormControl('', [Validators.required]),
    startFormControl: new FormControl<Date | null>(null, [Validators.required]),
    endFormControl: new FormControl<Date | null>(null, [Validators.required]),
    positionFormControl: new FormControl('', [Validators.required]),
  });
  matcher = new MyErrorStateMatcher();

  onCreate() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('nomination_name', this.form.controls['nominationFormControl'].value);
      const startDate = this.datepipe.transform(this.form.controls['startFormControl'].value, 'y-MM-dd');
      formData.append('start_date', startDate!);
      const endDate = this.datepipe.transform(this.form.controls['endFormControl'].value, 'y-MM-dd');
      formData.append('end_date', endDate!);
      formData.append('membership_position_uuid', this.form.controls['positionFormControl'].value);

      this.http.post(this.storeNominationURL, formData).pipe(
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