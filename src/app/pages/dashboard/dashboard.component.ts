import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, Input, OnInit } from '@angular/core';
import { catchError, retry, timer } from 'rxjs';
import { CatchError } from '../../services/errorHandle';
import { RouterModule, Router } from '@angular/router';
import { url } from '../../app.config';
import { FormControl, FormGroup, Validators, FormsModule, FormBuilder, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  users: any = '';
  constructor(private http: HttpClient, private handleError: CatchError) {
  }
  private URL = url.app_url + "user";
  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers() {
    this.http.get(this.URL).pipe(
      catchError(e => {
        return this.handleError.handleError(e);
      })).subscribe(((res: any) => {
        this.users = res;
      }));
  }
}
