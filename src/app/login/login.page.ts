import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { AuthGuardService } from '../guards/auth-guard.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup
  foundError: boolean;
  facebookLogo: string;
  fieldTextType: boolean;


  constructor(private fb: FormBuilder,
    public http: HttpClient,
    private router: Router,
    public alertController: AlertController,
    public autheService : AuthService,
    public authGuard : AuthGuardService
    ) {
    }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  login() {
    const reqParams = {
      email: this.loginForm.value.username,
      password: this.loginForm.value.password,

    };

    this.autheService.loginApiCall(reqParams).subscribe((data : any) => {
      this.foundError = false;
      sessionStorage.setItem("token",data.data.token.access_token);
      sessionStorage.setItem('userData', JSON.stringify(data.data.user));
      if(data && data.data.token.access_token) {
        this.router.navigate(['tabs']);
      }
    },
    (error) => {
      this.foundError = true;
      this.presentAlert();
      return throwError(error);
    }
    )
  }

  togglePassword() {
    this.fieldTextType = !this.fieldTextType;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Oopz!',
      subHeader: 'Something went wrong',
      message: 'Please check the entered items.',
      buttons: ['OK'],
      mode: "ios"
    });

    await alert.present();
  }

  navigateToRegister(){
    this.router.navigate(['/register']);
  }
  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }


  }
