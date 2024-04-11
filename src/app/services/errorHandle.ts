import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of, throwError } from 'rxjs';
import Swal from "sweetalert2";


@Injectable({
    providedIn: 'root'
})
export class CatchError {
    handleError(error: any) {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            // console.error('An error occurred:', error.error);
            Swal.fire(
                'Error!',
                'Something went wrong! Please check your internet connection.',
                'error'
            )
            // alert('Something went wrong! Please check your internet connection.')
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            // alert(error.error.message)
            Swal.fire(
                'Error!',
                error.error?.message,
                'error'
            )
            // console.error(
            //     `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => Swal.fire(
            'Error!',
            'Something bad happened; please try again later.',
            'error'
        )
            // new Error('Something bad happened; please try again later.')
        );
    }
}