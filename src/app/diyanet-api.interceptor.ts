import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { AuthService, TOKEN_REQUEST_HTTP_CONTEXT_TOKEN } from './services/auth.service';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class DiyanetApiInterceptor implements HttpInterceptor {

  constructor(private _auth: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isTokenRequest = request.context.get(TOKEN_REQUEST_HTTP_CONTEXT_TOKEN);
    if (isTokenRequest) {
      return next.handle(request)
    }

    return of(this._auth.token).pipe(
      switchMap((token) => token ? of(token) : this._auth.getToken(environment.diyanetApi.userInfo)),
      switchMap((token) => {
        const firstReq = request.clone({
          setHeaders: {
            Authorization: this._auth.token
          }
        });
        return next.handle(firstReq).pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              return this._auth.getToken(environment.diyanetApi.userInfo).pipe(
                switchMap(() => {
                  const newRequest = request.clone({
                    setHeaders: {
                      Authorization: this._auth.token
                    }
                  });
                  return next.handle(newRequest)
                })
              )
            }

            throw err;
          }))
      }))
  }
}
