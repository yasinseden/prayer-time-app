import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { tap } from 'rxjs';
import { LOCAL_STORAGE_TOKEN_KEY } from './data-control.service';

export const TOKEN_REQUEST_HTTP_CONTEXT_TOKEN = new HttpContextToken(() => false)

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private _http: HttpClient) {}

  get token() {
    const tokenFromLS = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)
    return tokenFromLS != null ? JSON.parse(tokenFromLS) : 'TOKEN NOT FOUND'
  }

  getToken(userInfo: any) {
    return this._http.post<any>(environment.diyanetApi.endPoints.getToken, userInfo, { context: new HttpContext().set(TOKEN_REQUEST_HTTP_CONTEXT_TOKEN, true) }).pipe(
      tap((token) => {
        const stringifiedToken = JSON.stringify(this.makeTokenUsable(token))
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, stringifiedToken)
      })
    )
  }

  makeTokenUsable(token: any): string {
    return `Bearer ${token?.data.accessToken}`
  }
}
