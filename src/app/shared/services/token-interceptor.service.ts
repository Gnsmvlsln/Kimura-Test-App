import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const noGuard = ['users/login'];

    if (req.url.includes('/users/login') && req.url.includes('users/register')) {
      return next.handle(req);
    } else {
      const request = req.clone({
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        })
      });
      return next.handle(request);
    }
  }
}
