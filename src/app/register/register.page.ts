import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm : FormGroup
  errorMessage: any;
  errorTypes: any;
  fieldTextType: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public http: HttpClient,
    public autheService : AuthService,
    public alertController: AlertController) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      mob: ['', [Validators.required]]
    })
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  togglePassword() {
    this.fieldTextType = !this.fieldTextType;
  }

  clickedRegister() {
    const reqParams = {
      first_name: this.registerForm.value.fullname,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      mobile: this.registerForm.value.mob,
      country_id: 222
    };
    this.autheService.registerApiCall(reqParams).subscribe((data) => {
      this.presentAlert();
      this.router.navigate(['/login']);
    },
    (error) => {
      this.errorTypes = error.error.data.errors;
      if(this.errorTypes && error.error.data.errors.email && error.error.data.errors.email[0]) {
        this.errorMessage = error.error.data.errors.email[0];
      } else if (this.errorTypes && error.error.data.errors.first_name && error.error.data.errors.first_name[0]) {
        this.errorMessage = error.error.data.errors.first_name[0];
      } else if (this.errorTypes && error.error.data.errors.password && error.error.data.errors.password[0]) {
        this.errorMessage = error.error.data.errors.password[0];
      } else if (this.errorTypes && error.error.data.errors.password && error.error.data.errors.password[0]) {
        this.errorMessage = error.error.data.errors.password[0];
      } else if (this.errorTypes && error.error.data.errors.mobile && error.error.data.errors.mobile[0]) {
        this.errorMessage = error.error.data.errors.mobile[0];
      } else {
        this.errorMessage = 'Please check the entered items.'
      }
      this.presentErrorAlert();
      return throwError(error);
    })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Successful ',
      subHeader: 'Your a Registered member now',
      message: 'Login now',
      buttons: ['OK'],
      mode: "ios"
    });

    await alert.present();
  }

  async presentErrorAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Oopz!',
      subHeader: this.errorMessage,
      message:'',
      buttons: ['OK'],
      mode: "ios"
    });

    await alert.present();
  }


}
