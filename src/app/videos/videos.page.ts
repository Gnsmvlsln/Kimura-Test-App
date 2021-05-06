import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../shared/services/home.service';
import { LoadingService } from '../shared/services/loading.service';
import { videoLibraryModels } from '../models/video.models';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements OnInit {
  videolIst: any;
  baseUrl;
  isShowDescription: boolean;
  libId: any;

  constructor(
    private router: Router,
    public http: HttpClient,
    public homeService: HomeService,
    public loadingService: LoadingService) { }

  ngOnInit() {
    this.homeService.callVideoApi().subscribe((data : videoLibraryModels) => {
      this.videolIst = data.data.result;
    });
  }

  ionViewWillEnter() {
    this.loadingService.showLoader();
  }

  navigateBack() {
    this.router.navigate(['tabs/tab1']);
  }

  showDescription(libId) {
    this.videolIst.forEach((element) => {
      if(element.library_id === libId) {
        this.libId = element.library_id;
        this.isShowDescription = !this.isShowDescription;
      }
    })
  }

  LibraryItemClicked(library_id) {
    this.router.navigate(['tabs/single-video'], {queryParams : {libraryId : library_id}});
  }
}
