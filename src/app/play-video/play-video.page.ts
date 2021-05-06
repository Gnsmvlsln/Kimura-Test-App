import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subject, throwError } from 'rxjs';
import { HomeService } from '../shared/services/home.service';
import { ModalController } from '@ionic/angular';
import { RangePage } from '../modals/range/range.page';
import { LoadingService } from '../shared/services/loading.service';
import { rangeModal, videosInterface } from '../models/single-video.models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-play-video',
  templateUrl: './play-video.page.html',
  styleUrls: ['./play-video.page.scss'],
})
export class PlayVideoPage implements OnInit {
  @Input() playVideoPage = false;

  [x: string]: any;
  libraryId: any;
  isResultPresent: boolean;
  videoUrl: any;
  videoDetails: any;
  $videoDetail = new Subject();
  videoTitle: any;
  videoDesc: any;
  videoLikes: any;
  videoViews: any;
  commentForm: FormGroup;
  isShowLoadMore = true;
  replyForm: FormGroup;
  userData: any;
  currentUsername: string;
  isReplyCommentEdited: boolean;
  editReplyForm: FormGroup;
  isCReplySectionOpened = false;
  dataReturned: any;
  commentFullDetails: any;
  commentsArrayy: any;
  videoIdForplaySingle: any;
  videoidd : any;


  constructor(
    public http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public homeService: HomeService,
    public alertController: AlertController,
    public modalController: ModalController,
    public loadingService: LoadingService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((data) => {
      this.videoidd = data.videoIdd;
    });
    this.getPlayVideo();

    this.commentForm = this.fb.group({
      comment_textarea: ['', [Validators.required]],
    });
    this.replyForm = this.fb.group({
      replyComment: ['', [Validators.required]],
    });
    this.editReplyForm = this.fb.group({
      EditreplyComment: ['', [Validators.required]],
    });
  }

  navigateBack() {
    // this.router.navigate(['tabs/video']);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: RangePage,
      componentProps: {},
      cssClass: 'range-modal',
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data && dataReturned.data !== undefined) {
        this.dataReturned = dataReturned.data;
        this.homeService
          .callRatingApi(this.videoMediId, this.dataReturned)
          .subscribe((data: rangeModal) => {
            this.getPlayVideo();
            this.getVideoDetails();
          }, (error) => {
            return throwError(error);
          });
      }
    });

    return await modal.present();
  }

  ionViewWillEnter() {
    this.getPlayVideo();
    this.getVideoDetails();
    this.getComments();
    this.presentLoadingDefault();
  }

  async presentLoadingDefault() {
    this.loadingService.showLoader();
  }

  getPlayVideo() {
      this.homeService
      .callGetSingleVideo(this.videoidd)
      .subscribe((result: any) => {
        this.$videoDetail.next(result.data.video);
        this.getVideoDetails();
      }, (error) => {
        return throwError(error);
      });
  }



  getVideoDetails() {
    this.$videoDetail.subscribe((response) => {
      this.videoDetails = response;
      this.videoUrl = this.videoDetails.uri;
      this.videoUploadedDate = this.videoDetails.created_at;
      this.videoTitle = this.videoDetails.title;
      this.videoDesc = this.videoDetails.description;
      this.videoLikes = this.videoDetails.total_likes;
      this.videoViews = this.videoDetails.total_views;
      this.videoComments = this.videoDetails.total_comments;
      this.videoMediId = this.videoDetails.media_id;
      this.videLiked = this.videoDetails.user_liked;
      this.avgRating = this.videoDetails.avg_rating;
    },(error) => {
      return throwError(error);
    });
  }


  likeButtonClicked() {
    this.videLiked = this.videLiked === 0 && !this.videLiked ? 1 : 0;
    this.homeService
      .callLikeButtonApi(this.videLiked, this.videoMediId)
      .subscribe((result: any) => {
        this.getPlayVideo();
      }, (error) => {
        return throwError(error);
      });
  }

  addComment() {
    this.homeService
      .callAddCommentApi(
        this.videoMediId,
        this.commentForm.value.comment_textarea
      )
      .subscribe((data: any) => {
        this.homeService
          .callCommentsApi(data.data.comment.media_id)
          .subscribe((result: any) => {
            this.loadAllComments(result.data.total);
            this.commentFullDetails = result.data;
            this.commentForm.controls['comment_textarea'].setValue('');
          }, (error) => {
            return throwError(error);
          });
      });
  }

  replyComment(commentId) {
    this.mainCommentIdGlobal = commentId;
    this.homeService
      .callReplyCommentApi(
        this.videoMediId,
        this.replyForm.value.replyComment,
        commentId
      )
      .subscribe((result) => {
        this.homeService
          .callCommentsApi(this.videoMediId)
          .subscribe((result: any) => {
            this.loadAllComments(result.data.total);
            this.getReplyResults(commentId);
            this.replyForm.reset();
          }, (error) => {
            return throwError(error);
          });
      });
  }

  getComments() {
    this.$videoDetail.subscribe((data: any) => {
      this.homeService
        .callCommentsApi(data.media_id)
        .subscribe((result: any) => {
          this.loadAllComments(result.data.total);
          this.commentFullDetails = result.data;
        }, (error) => {
          return throwError(error);
        });
    });
  }

  loadAllComments(perPage) {
    this.commentPage = 1;
    this.commentPerPage = perPage;
    this.homeService
      .callLoadMoreComments(
        this.videoMediId,
        this.commentPage,
        this.commentPerPage
      )
      .subscribe((data: any) => {
        this.commentsArrayy = data.data.result.reverse();
        this.commentsLimitedLength = 5;
        this.commentsArrayPrimary = this.commentsArrayy.slice(
          0,
          this.commentsLimitedLength
        );
        if (this.mainCommentIdGlobal) {
          this.getReplyResults(this.mainCommentIdGlobal);
        }
      }, (error) => {
        return throwError(error);
      });
  }

  loadMoreComments() {
    this.commentsLimitedLength = this.commentsLimitedLength + 5;
    this.commentsArrayPrimary = this.commentsArrayy.slice(
      0,
      this.commentsLimitedLength
    );
  }

  likeComment(commentId) {
    this.commentsArrayPrimary.forEach((data) => {
      if (data.id === commentId) {
        this.commentLiked = data.liked;
      }
    });
    this.homeService
      .callCommentLikeApi(commentId, this.commentLiked)
      .subscribe((result) => {
        this.getComments();
        this.homeService
          .callCommentsApi(this.videoMediId)
          .subscribe((result: any) => {
            this.loadAllComments(result.data.total);
            this.commentsArrayPrimary = this.commentsArray;
          });
      }, (error) => {
        return throwError(error);
      });
  }

  EditreplyComment(commentId, mainCommentId) {
    this.isReplyCommentEdited = false;
    this.homeService
      .callEditReplyCommentApi(
        this.videoMediId,
        this.editReplyForm.value.EditreplyComment,
        commentId
      )
      .subscribe((result) => {
        this.homeService
          .callCommentsApi(this.videoMediId)
          .subscribe((result: any) => {
            this.loadAllComments(result.data.total);
            this.getReplyResults(mainCommentId);
          });
      }, (error) => {
        return throwError(error);
      });
  }

  getReplyResults(mainCommentId) {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.currentUsername = this.userData.name;
    this.commentsArrayPrimary.forEach((element) => {
      if (element.id === mainCommentId) {
        this.replyResults = element.replies.result;
        this.parentCommentId = element.replies.result.parent_comment;
        this.currentReply = mainCommentId;
      }
    });
  }

  openEditBox(commentId, comment) {
    this.replyResults.forEach((item) => {
      if (commentId === item.id) {
        this.replyCommentId = item.id;
      }
    });
    this.editReplyForm.controls['EditreplyComment'].setValue(comment);
    this.isReplyCommentEdited = true;
  }

  deleteReplyComment(commentId) {
    // commented as delete method not working
    // this.homeService.callDeleteReplyCommentApi(commentId).subscribe((result) => {
    //   console.log('successfully deleted',result);
    // })
  }

  openReply(commentId) {
    this.isCReplySectionOpened = !this.isCReplySectionOpened;
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.currentUsername = this.userData.name;
    this.commentsArrayPrimary.forEach((element) => {
      if (element.id === commentId) {
        this.replyResults = element.replies.result;
        this.parentCommentId = element.replies.result.parent_comment;
        this.currentReply = commentId;
      }
    });
  }
}



