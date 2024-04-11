import { Component, ElementRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule, } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { CatchError } from '../../../services/errorHandle';
import { url } from '../../../app.config';
import { catchError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-manage-nomination-position',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatDividerModule, MatIconModule, CommonModule, MatFormFieldModule, MatInputModule, RouterModule, MatDialogModule, MatSortModule, MatCardModule,MatProgressBarModule],
  templateUrl: './manage-nomination-position.component.html',
  styleUrl: './manage-nomination-position.component.css'
})
export class ManageNominationPositionComponent {
  displayedColumnsNominationPosition: string[] = ['membership_name', 'total_vote', 'total_vote_in_per', 'status', 'action'];
  private PositionURL = url.app_url + "nomination/membership-position/details";
  private ExportURL = url.app_url + "nomination/membership-position/excel";
  memberNomination: any = [];
  position: any;
  constructor(private http: HttpClient, private handleError: CatchError, private el: ElementRef, private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.getPosition();
  }
  getPosition() {
    const uuid = String(this.route.snapshot.paramMap.get('uuid'));
    this.http.get(this.PositionURL + '/' + uuid).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        console.log(res);
        this.position = res.check_details
        this.memberNomination = new MatTableDataSource(res.member_nomination);
        this.memberNomination = res.member_nomination
      }));
  }
  export(uuid: String) {
    this.http.get(this.ExportURL + '?nomination_position_uuid=' + uuid, { responseType: 'blob' }).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        let fileUrl = window.URL.createObjectURL(res);
        let fileLink = document.createElement('a');
        fileLink.href = fileUrl;
        fileLink.setAttribute('download', 'nomination-postion.xls');
        document.body.appendChild(fileLink)
        fileLink.click();
      }));
  }
}
