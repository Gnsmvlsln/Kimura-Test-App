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
  selector: 'app-single-video',
  templateUrl: './single-video.page.html',
  styleUrls: ['./single-video.page.scss'],
})
export class SingleVideoPage implements OnInit {
  @Input() playVideoPage = false;

  [x: string]: any;
  libraryId: any;
  isResultPresent: boolean;
  videoArray: boolean;
  videoUrl: any = '';
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
  videoIdForplaySingle: number;

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
    this.homeService.$pageDetail.subscribe((data) => {
      console.log('Data', data);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((data) => {
      this.libraryId = data.libraryId;
    });
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
            this.getVideoArray();
            this.getVideoDetails();
          },
          (error) => {
            return throwError(error);
          });
      }
    });

    return await modal.present();
  }

  ionViewWillEnter() {
    this.getVideoDetails();
    this.getVideoArray();
    this.getComments();
    this.presentLoadingDefault();
  }

  async presentLoadingDefault() {
    this.loadingService.showLoader();
  }

  navigateToPlayVideo(videoId) {
    this.videoIdForplaySingle = videoId;
    this.router.navigate(['/play-video'], {
      queryParams: { videoIdd: videoId },
    });
  }

  getVideoArray() {
    this.homeService.callVideosApi(this.libraryId).subscribe((result: any) => {
      this.isResultPresent =
        result.data.result && result.data.result.length === 0
          ? false
          : true && (this.videoArray = result.data.result);
      this.$videoDetail.next(result.data.video);
    },
    (error) => {
      return throwError(error);
    });
  }

  getVideoDetails() {
    this.$videoDetail.subscribe((response) => {
      this.videoDetails = response;
      if (!this.videoUrl) {
        this.videoUrl = this.videoDetails.uri;
      }
      this.videoUploadedDate = this.videoDetails.created_at;
      this.videoTitle = this.videoDetails.title;
      this.videoDesc = this.videoDetails.description;
      this.videoLikes = this.videoDetails.total_likes;
      this.videoViews = this.videoDetails.total_views;
      this.videoComments = this.videoDetails.total_comments;
      this.videoMediId = this.videoDetails.media_id;
      this.videLiked = this.videoDetails.user_liked;
      this.avgRating = this.videoDetails.avg_rating;
    });
  }

  navigateBack() {
    this.router.navigate(['tabs/video']);
  }

  likeButtonClicked() {
    this.videLiked = this.videLiked === 0 && !this.videLiked ? 1 : 0;
    this.homeService
      .callLikeButtonApi(this.videLiked, this.videoMediId)
      .subscribe((result: any) => {
        this.getVideoArray();
      },
      (error) => {
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
          });
      }, (error) => {
        return throwError(error);
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
          });
      }, (error) => {
        return throwError(error);
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
      },
      (error) => {
        return throwError(error);
      });
  }

  loadMoreComments() {
    this.loadingService.showLoader();
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
      },
      (error) => {
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
          }, (error) => {
            return throwError(error);
          });
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
    this.homeService
      .callDeleteReplyCommentApi(commentId)
      .subscribe((result) => {
        this.getVideoArray();
        this.getComments();
      });
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

  ionViewWillLeave() {
    this.isCReplySectionOpened = false;
  }
}
