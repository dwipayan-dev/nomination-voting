import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { CatchError } from '../services/errorHandle';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandle = inject(CatchError);
  return next(req).pipe(
    catchError(e => {
      // unauthorized check
      if ([401, 403].includes(e.status)) {
        localStorage.removeItem('loginTOken');
        window.location.href = '/login';
      }
      return errorHandle.handleError(e);
    })
  );
};
