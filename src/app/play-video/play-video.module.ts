import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayVideoPageRoutingModule } from './play-video-routing.module';

import { PlayVideoPage } from './play-video.page';
import { SingleVideoPage } from '../single-video/single-video.page'
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayVideoPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [PlayVideoPage, SingleVideoPage]
})
export class PlayVideoPageModule {}
