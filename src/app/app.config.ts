import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { routes } from './app.routes';
import { customerInterceptor } from './services/customer.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { loaderInterceptor } from './interceptors/loader.interceptor';
import { loggerInterceptor } from './interceptors/logger.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([customerInterceptor, loaderInterceptor, loggerInterceptor])), provideAnimations()]
};

export const url: any = {
  app_url: "your url here",
  image_url: "image url here",
};
