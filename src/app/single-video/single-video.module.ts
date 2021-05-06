import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleVideoPageRoutingModule } from './single-video-routing.module';

import { SingleVideoPage } from './single-video.page';
import { PlayVideoPage } from '../play-video/play-video.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleVideoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SingleVideoPage, PlayVideoPage]
})
export class SingleVideoPageModule {}
