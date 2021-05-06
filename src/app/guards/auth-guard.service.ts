import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { LoadingService } from '../shared/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  gotUserData: any;

  constructor(
    public autheService : AuthService,
    public loadingService: LoadingService
    ) { }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
    this.loadingService.showLoader();
    this.autheService.callUserDetailsApi().subscribe((data : any) => {
      this.gotUserData = data.data.user
    });
    if(this.gotUserData){
      this.loadingService.hideLoader();
      return true;
    }else {
      return false;
    }
  }

}
