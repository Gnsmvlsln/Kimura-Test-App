import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http: HttpClient) { }

  loginApiCall(reqParams) {
    //Login API call (removed the api end point)
    return this.http.post("",reqParams).pipe(map(data => data));
  }

  registerApiCall(reqParams) {
    //Register API call
    return this.http.post("",reqParams).pipe(map(data => data));
  }

  callChangePasswordApi(reqParams) {
    //Change Password API call
    return this.http.post("",reqParams).pipe(map(data => data));
  }

  callUserDetailsApi() {
    //User Details
    return this.http.get("").pipe(map(data => data));
  }
}