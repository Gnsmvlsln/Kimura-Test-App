import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(public loadingCtrl: LoadingController) { }

  async showLoader() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 1000
    });

    await loading.present();
  }

  hideLoader() {
    this.loadingCtrl.dismiss().then((res) => {
      console.log('Loading Dismissed!',res);
    }).catch((error) => {
      console.log('error',error);
    })
  }
}
