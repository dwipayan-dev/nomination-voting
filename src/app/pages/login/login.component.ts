import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CatchError } from '../../services/errorHandle';
import { url } from '../../app.config';
import { LoaderService } from '../../loader.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  submitted = false;
  signUpSubmitted = false;
  private URL = url.app_url + "login";
  private signUpURL = url.app_url + "sign-up";
  loginObject: any = {
    'email': "",
    'password': "",
  }

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  signUpForm: FormGroup = new FormGroup({
    userName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private http: HttpClient, private router: Router, private handleError: CatchError, private loader: LoaderService, private formBuilder: FormBuilder) { }

  validateForm() {

    this.submitted = true;
    this.form.invalid
    this.form = this.formBuilder.group(
      {
        email: [this.form.controls['email'].value, [Validators.required, Validators.email]],
        password: [
          this.form.controls['password'].value,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
      },
    );
  }

  validateSignUpForm() {
    this.signUpSubmitted = true;
    this.signUpForm.invalid
    this.signUpForm = this.formBuilder.group(
      {
        userName: [this.signUpForm.controls['userName'].value, [Validators.required]],
        email: [this.signUpForm.controls['email'].value, [Validators.required, Validators.email]],
        password: [
          this.signUpForm.controls['password'].value,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
      },
    );
  }

  onLogin() {

    // this.form.invalid
    if (this.form.valid) {
      // this.submitted = false;
      this.loader.showLoader();
      this.http.post(this.URL, this.loginObject).pipe(
        catchError(e => {
          this.loader.hideLoader();
          return this.handleError.handleError(e);
        })).subscribe(((res: any) => {
          this.loader.hideLoader();
          if (res.status == "success") {
            // alert('login Success');
            localStorage.setItem('loginTOken', res.token);
            this.router.navigateByUrl('/dashboard');
          } else {
            Swal.fire(
              'Error!',
              res.message,
              'error'
            )
            // alert(res.message);
          }
        }));
    } else {
      this.validateForm();
    }
  }

  signUp() {

    // this.signUpForm.invalid

    if (this.signUpForm.valid) {

      let signUpObject = {
        'user': this.signUpForm.controls['userName'].value,
        'email': this.signUpForm.controls['email'].value,
        'password': this.signUpForm.controls['password'].value
      };

      // this.signUpSubmitted = false;
      this.loader.showLoader();
      this.http.post(this.signUpURL, signUpObject).pipe(
        catchError(e => {
          this.loader.hideLoader();
          return this.handleError.handleError(e);
        })).subscribe(((res: any) => {
          this.loader.hideLoader();
          if (res.status == "success") {
            // alert(res.message);
            localStorage.setItem('loginTOken', res.token);
            this.router.navigateByUrl('/dashboard');
          } else {
            Swal.fire(
              'Error!',
              res.message,
              'error'
            )
            // alert(res.message);
          }
        }));
    } else {
      this.validateSignUpForm();
    }
  }

  ngOnInit(): void {
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  get s(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }


  // private handleError(error: HttpErrorResponse) {
  //   if (error.status === 0) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong.
  //     alert(error.error.message)
  //     console.error(
  //       `Backend returned code ${error.status}, body was: `, error.error);
  //   }
  //   // Return an observable with a user-facing error message.
  //   return throwError(() => new Error('Something bad happened; please try again later.'));
  // }

}
