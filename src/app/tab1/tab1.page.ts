import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { LoadingService } from '../shared/services/loading.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {

  slideOpts = {
    initialSlide: 2,
    speed: 300,
    autoplay: true
  };
  tabselected: boolean;
  tabs = [
    {
      tabname : 'Calender',
      id:'calender',
      icon: 'calendar-outline',
      isSelected: false
    },
    {
      tabname : 'Videos',
      id:'videos',
      icon: 'logo-youtube',
      isSelected: false
    },
    {
      tabname : 'Belt Holders',
      id:'beltholders',
      icon: 'person-circle-outline',
      isSelected: false
    },
    {
      tabname : 'Messages',
      id:'messages',
      icon:'mail-outline',
      isSelected: false
    },
  ]
  userData: string;
  blogsArray: any;
  foundError: boolean;
  newArrayBlogs: any[];
  constructor(
    public http: HttpClient,
    private router: Router,
    public loadingService: LoadingService
    ) {}

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem("userData"));
    this.callBlogssApi().subscribe((result : any) => {
      if(result.data && result.data.result && result.data.result.length){
        this.blogsArray = result.data.result;
        this.newArrayBlogs =  this.arrayChunks(this.blogsArray);
        this.foundError = false;
      } else {
        this.foundError = true;
      }
    },
    (error) => {
      this.foundError = true;
      return throwError(error);
    });
  }

  ionViewWillEnter() {
    this.loadingService.showLoader();
  }

  arrayChunks(blogsArray) {
    const chunkArray = [];
    const size = 2;
    for(var i = 0; i < blogsArray.length; i += size) {
      chunkArray.push(blogsArray.slice(i, i+size));
    }
    return chunkArray;
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  clickedTab(tabid) {
   this.tabs.forEach((item) => {
     item.isSelected = item.id === tabid ? true : false;
   })
   if(tabid === 'videos') {
    this.router.navigate(['tabs/video']);
   }
  }

  callBlogssApi(){
    return this.http.get("https://test.kimura.dieselhausdev.com/api/v1/blogs").pipe(map(data => data));
  }

}
