import { Component, Inject, Injectable, Input, ViewChild } from '@angular/core';
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
declare var grapesjs: any;
import 'grapesjs-preset-webpage';

@Component({
  selector: 'app-manage-nomination',
  standalone: true,
  imports: [MatTabsModule, MatProgressBarModule, MatCardModule, CommonModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, RouterModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './manage-nomination.component.html',
  styleUrl: './manage-nomination.component.css'
})
@Injectable({
  providedIn: 'root',
})
export class ManageNominationComponent {
  nomination: any = [];
  all_nomination: any = [];
  membership_type: any = [];
  nomination_data: any;
  total_customer!: number;
  nomination_progress_chart: any = [];
  private URL = url.app_url + "nomination/dashboard";
  private membershipTypeURL = url.app_url + "membership-type";


  displayedColumns: string[] = ['membership_type', 'membership_position', 'start_date', 'end_date', 'status', 'action'];
  filter: any = '';
  private _editor: any;

  constructor(private http: HttpClient, private handleError: CatchError, public dialog: MatDialog) {

  }

  get editor() {
    return this._editor;
  }

  matcher = new MyErrorStateMatcher();
  // @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this.loadNomination();
    this.loadMembershipType();
    this.loadMemberhipPosition();

    // this._editor = this.initializeEditor();
    // this.editor.on('asset:add', () => {
    //   console.log('Asset add fired');
    //   // this.editor.runCommand('open-assets');
    // });
  }

  // private initializeEditor(): any {
  //   return grapesjs.init({
  //     container: '#grapesjs-container',
  //     autorender: true,
  //     forceClass: false,
  //     components: '',
  //     style: '',
  //     plugins: ['grapesjs-preset-webpage'],
  //     pluginsOpts: {
  //       'grapesjs-preset-webpage': {
  //         navbarOpts: false,
  //         countdownOpts: false,
  //         formsOpts: false,
  //         blocksBasicOpts: {
  //           blocks: ['link-block', 'quote', 'image', 'video', 'text', 'column1', 'column2', 'column3'],
  //           flexGrid: false,
  //           stylePrefix: 'lala-'
  //         }
  //       }
  //     },
  //     assetManager: {
  //       uploadText: 'Add image through link or upload image',
  //       modalTitle: 'Select Image',
  //       openAssetsOnDrop: 1,
  //       inputPlaceholder: 'http://url/to/the/image.jpg',
  //       addBtnText: 'Add image',
  //       uploadFile: (e: { dataTransfer: { files: any[]; }; target: { files: any[]; }; }) => {
  //         const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
  //       },
  //       handleAdd: (textFromInput: any) => {
  //         this.editor.AssetManager.add(textFromInput);
  //       }
  //     },
  //     canvas: {
  //       styles: [
  //         'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
  //         'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css'
  //       ],
  //       scripts: ['https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js']
  //     }
  //   });
  // }

  nominationFilter() {
    this.loadNomination();
  }

  public loadNomination() {
    this.http.get(this.URL + '?filter=' + this.filter).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        this.nomination_data = res.nomination;
        this.nomination = res.nomination?.get_nomination_position;
        this.nomination = new MatTableDataSource(this.nomination);
        this.total_customer = res.total_customer;
        this.nomination_progress_chart = res.nomination_progress_chart;
        this.all_nomination = res.all_nomination_list;
      }));
  }

  // Membership Type
  displayedColumnsMembershipType: string[] = ['membership_type', 'created_at', 'status', 'action'];
  private membershipTypeDeleteURL = url.app_url + "nomination/membership-type/delete";
  private membershipTypeStoreURL = url.app_url + "nomination/membership-type/store";

  public loadMembershipType() {
    this.http.get(this.membershipTypeURL).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        this.membership_type = new MatTableDataSource(this.membership_type);
        this.membership_type = res.result;
      }));
  }

  onDelete(uuid: string) {
    Swal.fire({
      title: 'Are you sure want to delete this membership type?',
      text: 'You will not be able to recover this membership type!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.http.get(this.membershipTypeDeleteURL + '?uuid=' + uuid).pipe(
          catchError(e => {
            return this.handleError.handleError(e);
          })).subscribe(((res: any) => {
            if (res.status == "success") {
              Swal.fire(
                'Success!',
                res.message,
                'success'
              )
              this.loadMembershipType();
            } else {
              Swal.fire(
                'Error!',
                res.message,
                'error'
              )
            }
          }));
      }
    })
  }
  formMembership: any = new FormGroup({
    membershipTypeFormControl: new FormControl('', [Validators.required]),
  });

  createMembershipType(formDirective: FormGroupDirective) {
    if (this.formMembership.valid) {
      const formData = new FormData();
      formData.append('membership_type', this.formMembership.controls['membershipTypeFormControl'].value);
      this.http.post(this.membershipTypeStoreURL, formData).pipe(
        catchError(e => {
          return this.handleError.handleError(e);
        })).subscribe(((res: any) => {
          if (res.status == "success") {
            Swal.fire(
              'Success!',
              res.message,
              'success'
            )
            this.ngOnInit()
            formDirective.resetForm();
            this.formMembership.reset();
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

  openDialog(id: number): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px',
      data: {
        membership:
          this.membership_type.find((x: any) => x.id === id)
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }


  // Membership Position 
  displayedColumnsMembershipPosition: string[] = ['membership_type', 'membership_position', 'created_at', 'status', 'action'];
  private membershipPositionDeleteURL = url.app_url + "nomination/membership-position/delete";
  private membershipPositionStoreURL = url.app_url + "nomination/membership-position/store";
  private memberhipPositionURL = url.app_url + "memberhip-position";
  positionList: any = [];
  loadMemberhipPosition() {
    this.http.get(this.memberhipPositionURL).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        this.positionList = new MatTableDataSource(this.positionList);
        this.positionList = res.result;
      }));
  }

  formMembershipPosition: any = new FormGroup({
    membershipTypeSelectFormControl: new FormControl('', [Validators.required]),
    membershipPositionFormControl: new FormControl('', [Validators.required]),
  });

  createMembershipPosition(formPositionDirective: FormGroupDirective) {
    if (this.formMembershipPosition.valid) {
      const formData = new FormData();
      formData.append('membership_type_uuid', this.formMembershipPosition.controls['membershipTypeSelectFormControl'].value);
      formData.append('membership_position', this.formMembershipPosition.controls['membershipPositionFormControl'].value);
      this.http.post(this.membershipPositionStoreURL, formData).pipe(
        catchError(e => {
          return this.handleError.handleError(e);
        })).subscribe(((res: any) => {
          if (res.status == "success") {
            Swal.fire(
              'Success!',
              res.message,
              'success'
            )
            this.ngOnInit();
            formPositionDirective.resetForm();
            this.formMembershipPosition.reset();
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

  onPositionDelete(uuid: string) {
    Swal.fire({
      title: 'Are you sure want to delete this membership position?',
      text: 'You will not be able to recover this membership position!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.http.get(this.membershipPositionDeleteURL + '?uuid=' + uuid).pipe(
          catchError(e => {
            return this.handleError.handleError(e);
          })).subscribe(((res: any) => {
            if (res.status == "success") {
              Swal.fire(
                'Success!',
                res.message,
                'success'
              )
              this.ngOnInit();
            } else {
              Swal.fire(
                'Error!',
                res.message,
                'error'
              )
            }
          }));
      }
    })
  }

  onPositionEdit(id: number): void {
    const dialogRef = this.dialog.open(MembershipPositionDialog, {
      width: '400px',
      data: {
        membership_position:
          this.positionList.find((x: any) => x.id === id),
        membership_type: this.membership_type
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit()
    });
  }

}
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

// Membership Type Modal
@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<h1 mat-dialog-title>Membership Type Update</h1>
  <div mat-dialog-content>
  <mat-form-field class="example-full-width">
    <mat-label>Membership Type Name</mat-label>
      <input type="text" matInput [formControl]="updateMembershipFormControl" placeholder="Executive Council Members">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
  <button mat-button [mat-dialog-close]="data.animal" cdkFocusInitial>Close</button>
    <button mat-button (click)="UpdateClick()">Update</button>
  </div>`,
  styleUrl: './manage-nomination.component.css',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatDialogClose,
  ],
})
export class DialogOverviewExampleDialog {
  private membershipTypeUpdateURL = url.app_url + "nomination/membership-type/update";
  updateMembershipFormControl = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private handleError: CatchError
  ) {
    this.updateMembershipFormControl.setValue(data.membership.membership_type)
  }

  UpdateClick(): void {
    if (this.updateMembershipFormControl.valid) {
      const formData = new FormData();
      formData.append('uuid', this.data.membership.uuid);
      formData.append('membership_type', this.updateMembershipFormControl.value!);
      this.http.post(this.membershipTypeUpdateURL, formData).pipe(
        catchError(e => {
          return this.handleError.handleError(e);
        })).subscribe(((res: any) => {
          if (res.status == "success") {
            Swal.fire(
              'Success!',
              res.message,
              'success'
            )
            this.updateMembershipFormControl.reset();
            this.dialogRef.close();
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

// Membership Position Modal
@Component({
  selector: 'membership-position-dialog',
  template: `<h1 mat-dialog-title>Membership Position Update</h1>
  <div mat-dialog-content>
  <mat-form-field class="example-full-width">
  <mat-label>Membership Type</mat-label>
   <mat-select required [formControl]="membershipSelectFormControl">
    <mat-option *ngFor="let type of data.membership_type" [value]="type.uuid">{{type.membership_type}}</mat-option>
    </mat-select>
    </mat-form-field>
    <mat-form-field class="example-full-width">
    <mat-label>Membership Position Name</mat-label>
      <input type="text" matInput [formControl]="membershipPositionFormControl" placeholder="President">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
  <button mat-button [mat-dialog-close]="data.animal" cdkFocusInitial>Close</button>
    <button mat-button (click)="UpdateClick()">Update</button>
  </div>`,
  styleUrl: './manage-nomination.component.css',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatDialogClose,
    MatSelectModule,
    CommonModule
  ],
})
export class MembershipPositionDialog {
  private membershipPositionUpdateURL = url.app_url + "nomination/membership-position/update";
  membershipSelectFormControl = new FormControl('', [Validators.required]);
  membershipPositionFormControl = new FormControl('', [Validators.required]);
  constructor(
    public dialogRef: MatDialogRef<MembershipPositionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private handleError: CatchError
  ) {
    this.membershipSelectFormControl.setValue(data.membership_position?.membership_type_uuid)
    this.membershipPositionFormControl.setValue(data.membership_position?.membership_position)
  }
  @Input() manageNomination!: ManageNominationComponent;


  UpdateClick(): void {
    if (this.membershipSelectFormControl.valid || this.membershipPositionFormControl.valid) {
      const formData = new FormData();
      formData.append('uuid', this.data.membership_position.uuid);
      formData.append('membership_position', this.membershipPositionFormControl.value!);
      formData.append('membership_type_uuid', this.membershipSelectFormControl.value!);
      this.http.post(this.membershipPositionUpdateURL, formData).pipe(
        catchError(e => {
          return this.handleError.handleError(e);
        })).subscribe(((res: any) => {
          if (res.status == "success") {
            Swal.fire(
              'Success!',
              res.message,
              'success'
            )
            this.dialogRef.close();
            this.membershipSelectFormControl.reset();
            this.membershipPositionFormControl.reset();
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