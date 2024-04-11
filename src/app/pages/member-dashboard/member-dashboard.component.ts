import { HttpClient } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CatchError } from '../../services/errorHandle';
import { url } from '../../app.config';
import { catchError, distinctUntilChanged } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, Location } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatDividerModule, MatIconModule, CommonModule, MatFormFieldModule, MatInputModule, RouterModule, MatDialogModule, MatSortModule],
  templateUrl: './member-dashboard.component.html',
  styleUrl: './member-dashboard.component.css'
})

export class MemberDashboardComponent {

  private URL = url.app_url + "member/dashboard";
  private SearchURL = url.app_url + "member/search-member";
  private ExportURL = url.app_url + "member/excel";
  private DeleteURL = url.app_url + "member/delete";
  private ViewURL = url.app_url + "member/view-member";
  pageIndex?: number = 1;
  pageSize?: number = 2;
  length?: number;
  pageSizeOptions: number[] = [1, 2, 3, 4, 5];
  users: any = [];
  search_users: any = [];
  member_details: any = '';
  tempImage = url.image_url;
  constructor(private http: HttpClient, private handleError: CatchError, private dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer) {
  }
  displayedColumns: string[] = ['count', 'user_name', 'email', 'is_verify_email', 'nomination', 'action'];

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  ngOnInit(): void {
    this.loadMember();
  }

  public loadMember() {
    this.http.get(this.URL + '?page=' + this.pageIndex + '&pageSize=' + this.pageSize).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        this.users = res.result.data;
        // this.search_users = res.result.data;
        this.users = new MatTableDataSource(this.users);
        this.users.sort = this.sort;
        this.length = res.result.total;
        
      }));
  }
  getServerData(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadMember();
  }
  ngAfterViewInit(): void {
    this.users.paginator = this.paginator;
  }
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();

    if (this.users.paginator) {
      this.users.paginator.firstPage();
    }
    
    
    // if (!search)
    //   this.loadMember();

    // this.users = this.search_users.filter(
    //   (member: any) => member.user_name.toLowerCase().includes(search.toLowerCase()) || member.email.toLowerCase().includes(search.toLowerCase()) || member.first_name.toLowerCase().includes(search.toLowerCase()) || member.last_name.toLowerCase().includes(search.toLowerCase()) || member.country.toLowerCase().includes(search.toLowerCase()) || member.social_media_link.toLowerCase().includes(search.toLowerCase()),
    // );
    // this.http.get(this.SearchURL + '?search=' + search).pipe(
    //   // wait 300ms after each keystroke before considering the term
    //   //  debounceTime(300),
    //   // ignore new term if same as previous term
    //   distinctUntilChanged(),
    //   catchError(e => {
    //     return this.handleError.handleError(e);
    //   })).subscribe(((res: any) => {
    //     this.users = res.result;
    //   }));
  }

  export() {
    this.http.get(this.ExportURL, { responseType: 'blob' }).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        let fileUrl = window.URL.createObjectURL(res);
        let fileLink = document.createElement('a');
        fileLink.href = fileUrl;
        fileLink.setAttribute('download', 'members.xls');
        document.body.appendChild(fileLink)
        fileLink.click();
      }));
  }

  onDelete(id: number) {
    Swal.fire({
      title: 'Are you sure want to delete this member?',
      text: 'You will not be able to recover this member!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.http.get(this.DeleteURL + '?id=' + id).pipe(
          catchError(e => {
            return this.handleError.handleError(e);
          })).subscribe(((res: any) => {
            if (res.status == "success") {
              Swal.fire(
                'Success!',
                res.message,
                'success'
              )
              this.loadMember();
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

  openDialog(id: number) {
    this.http.get(this.ViewURL + '?id=' + id).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        if (res.status == "success") {
          this.member_details = res.result;
          const dialogRef = this.dialog.open(DialogContentExampleDialog, {
            data: {
              member: this.member_details
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            this.member_details = '';
          });
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

@Component({
  selector: 'dialog-content-example-dialog',
  template: `<h3 mat-dialog-title>Member Details</h3>
  <mat-dialog-content class="mat-typography">
  <div class="card-body">
        <div class="form-group row">
                                <div class="col-4">
                                    <img [src]="data.member.profile_pic==null?'/assets/avatar_white.gif':tempImage+data.member.profile_pic"
                                        height="100px" width="auto"
                                       style="background:grey;">
                                </div>
                                <div class="col-8">
                                </div>
                                <div class="col-4">
                                    <label for="member_name"> Full Name : <b>{{data.member.user_name}}</b></label>
                                </div>
                                <div class="col-4">
                                    <label for="member_name"> First Name : <b>{{data.member.first_name}}</b></label>
                                </div>
                                <div class="col-4">
                                    <label for="member_name"> Last Name : <b>{{data.member.last_name}}</b></label>
                                </div>
                                <div class="col-4">
                                    <label for="member_name"> Email : <b>{{data.member.email}}</b></label>
                                </div>
                                <div class="col-4">
                                    <label for="member_name"> Country : <b>{{data.member.country}}</b></label>
                                </div>
                                <div class="col-4">
                                    <label for="member_name"> Email Verification Status :
                                        <b>{{data.member.is_verify_email == '0' ? 'Not Verified' : 'Verified'}}</b></label>
                                </div>
                                <div class="col-4">
                                    <label for="member_name"> Registered On :
                                        <b>{{data.member.created_time}}</b></label>
                                </div>
                                <div class="col-4">
                                    <label for="member_name"> Registered From :
                                        <b>{{data.member.register_by == 'i' ? 'Excel sheet' : 'Registration'}}</b></label>
                                </div>
                                <div class="col-4">
                                    <label for="member_name"> Nomination :
                                        <b>{{data.member.nomination}}</b></label>
                                </div>
                                <div class="col-4">
                                    <label for="member_name"> Social Media Link :
                                        <b><a [href]="data.member.social_media_link"
                                                target="_blank"></a>{{data.member.social_media_link}}</b></label>
                                </div>

                            </div>
                        </div>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button mat-dialog-close>Close</button>
  </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogContentExampleDialog {
  tempImage = url.image_url;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
}

