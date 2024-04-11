import { HttpInterceptorFn } from '@angular/common/http';

export const customerInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('loginTOken');
  if (token) {
    const newCloneRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    })
    return next(newCloneRequest);
  } else {
    return next(req);
  }
};


