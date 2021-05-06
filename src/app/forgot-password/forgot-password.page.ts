import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  changePasswordForm : FormGroup
  foundError: boolean;
  fieldTextType: boolean;

  constructor(
    private fb: FormBuilder,
    public http: HttpClient,
    public alertController: AlertController,
    public autheService : AuthService,
    private router: Router) { }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]]
    });
  }

  changePassword(){
    const reqParams = {
      old_password: this.changePasswordForm.value.old_password,
      password: this.changePasswordForm.value.new_password,
    };
    this.autheService.callChangePasswordApi(reqParams).subscribe((element) => {
      this.foundError = false;
    },
    (error) => {
      this.foundError = true;
      this.presentAlert();
    })
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

  navigateToLogin() {
    this.router.navigate(['/login']);
  }



}
