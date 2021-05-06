import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleVideoPage } from './single-video.page';

const routes: Routes = [
  {
    path: '',
    component: SingleVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleVideoPageRoutingModule {}
