import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-range',
  templateUrl: './range.page.html',
  styleUrls: ['./range.page.scss'],
})
export class RangePage implements OnInit {
  modelId: any;
  modalTitle: any;
  value : any;
  finalRange = 0;
  range = 0;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.modelId = this.navParams.data.paramID;
    this.modalTitle = this.navParams.data.paramTitle;
  }

  ionViewWillEnter () {

  }
  setRange(value){
    this.finalRange = value;
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async sendData() {
    const onClosedData = this.finalRange ;
    await this.modalController.dismiss(onClosedData);
  }

}
