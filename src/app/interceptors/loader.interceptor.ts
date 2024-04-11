import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../loader.service';
import { finalize } from 'rxjs';
import { inject } from '@angular/core';
import { url } from '../app.config';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);
  
  if (req.url.includes(url.app_url + "member/search-member")) {
    return next(req);
  }

  loader.showLoader();
  return next(req).pipe(
    finalize(() => loader.hideLoader())
  );
  // return next(req);
};
