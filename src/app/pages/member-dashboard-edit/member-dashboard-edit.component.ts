import { Component, ElementRef, Renderer2 } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { url } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { CatchError } from '../../services/errorHandle';
import { catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-member-dashboard-edit',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatIconModule, CommonModule, MatRadioModule, MatButtonModule],
  templateUrl: './member-dashboard-edit.component.html',
  styleUrl: './member-dashboard-edit.component.css'
})
export class MemberDashboardEditComponent {
  hide = true;
  private CountryURL = url.app_url + "country";
  private UpdateMember = url.app_url + "member/update";
  private EditMember = url.app_url + "member/edit";
  country: any = [];
  member: any = '';
  id: any = null;
  profile_pic!: File;
  append_profile_pic = null
  constructor(private http: HttpClient, private handleError: CatchError, private el: ElementRef, private renderer: Renderer2, private router: Router, private _location: Location, private route: ActivatedRoute) {
    var events = 'cut copy paste';
    events.split(' ').forEach(e =>
      this.renderer.listen(this.el.nativeElement, e, (event) => {
        event.preventDefault();
      })
    );
  }
  confirmPasswordValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (control.get('passwordFormControl')?.value == '') {
      return null;
    } else {
      return control.get('passwordFormControl')?.value === control.get('confirmPasswordFormControl')?.value
        ? null
        : { PasswordNoMatch: true };
    }
  }
  form: any = new FormGroup({
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    fullNameFormControl: new FormControl('', [Validators.required]),
    socialMediaFormControl: new FormControl('', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
    firstNameFormControl: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]+')]),
    lastNameFormControl: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]+')]),
    countryFormControl: new FormControl('', [Validators.required]),
    nominationFormControl: new FormControl('', [Validators.required]),
    profilePicFormControl: new FormControl(''),
    passwordFormControl: new FormControl(''),
    confirmPasswordFormControl: new FormControl(''),
  }, [this.confirmPasswordValidator]);
  ngOnInit(): void {
    this.loadCountry();
    this.getMember();
  }
  getMember(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get(this.EditMember + '?id=' + id).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        this.append_profile_pic = res.result.profile_pic == null ? "/assets/avatar_white.gif" : url.image_url + res.result.profile_pic

        this.id = res.result.id;

        if (res.result.profile_pic == null) {
          this.form.controls['profilePicFormControl'].setValidators(Validators.required)
          this.form.controls['profilePicFormControl'].updateValueAndValidity();
        }

        this.form.patchValue({
          emailFormControl: res.result.email,
          fullNameFormControl: res.result.user_name,
          socialMediaFormControl: res.result.social_media_link,
          firstNameFormControl: res.result.first_name,
          lastNameFormControl: res.result.last_name,
          countryFormControl: res.result.country,
          nominationFormControl: res.result.nomination,
        });
      }));
  }

  loadCountry() {
    this.http.get(this.CountryURL).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        this.country = res.result;
      }));
  }
  matcher = new MyErrorStateMatcher();

  onPasswordInput() {
    if (this.form.controls['passwordFormControl'].value == '') {
      this.form.controls['passwordFormControl'].clearValidators();
      this.form.controls['confirmPasswordFormControl'].clearValidators();
      this.form.controls['confirmPasswordFormControl'].setValue('');
      this.form.controls['passwordFormControl'].updateValueAndValidity();
      this.form.controls['confirmPasswordFormControl'].updateValueAndValidity();
    } else {
      this.form.controls['passwordFormControl'].setValidators([Validators.required, Validators.minLength(6)]);
      this.form.controls['confirmPasswordFormControl'].setValidators([Validators.required]);
      this.form.controls['passwordFormControl'].updateValueAndValidity();
      this.form.controls['confirmPasswordFormControl'].updateValueAndValidity();
    }
  }

  get password2() { return this.form.get('confirmPasswordFormControl'); }
  onConfPasswordInput() {
    if (this.form.hasError('PasswordNoMatch'))
      this.password2.setErrors([{ 'PasswordNoMatch': true }]);
    else
      this.password2.setErrors(null);
  }

  onFileSelected(event: any): void {
    this.profile_pic = event.target.files[0];
    if (this.profile_pic) {
      this.form.controls['profilePicFormControl'].setValue(this.profile_pic?.name);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.append_profile_pic = e.target.result;
      };
      reader.readAsDataURL(this.profile_pic);
    }
  }
  onUpdate() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('id', this.id);
      formData.append('full_name', this.form.controls['fullNameFormControl'].value);
      formData.append('social_media_link', this.form.controls['socialMediaFormControl'].value);
      formData.append('first_name', this.form.controls['firstNameFormControl'].value);
      formData.append('last_name', this.form.controls['lastNameFormControl'].value);
      formData.append('country', this.form.controls['countryFormControl'].value);
      formData.append('email', this.form.controls['emailFormControl'].value);
      formData.append('nomination', this.form.controls['nominationFormControl'].value);
      formData.append('password', this.form.controls['passwordFormControl'].value);

      if (this.form.controls['profilePicFormControl'].value == '')
        formData.append('profile_pic', '');
      else
        formData.append('profile_pic', this.profile_pic, this.profile_pic.name);

      this.http.post(this.UpdateMember, formData).pipe(
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
