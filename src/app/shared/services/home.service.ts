import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  $pageDetail = new Subject();
  $videoId = new Subject();

  constructor(public http: HttpClient) { }

  callVideoApi(){
    //removed the Api end points
    return this.http.get("").pipe(map(data => data));
  }

  callLikeButtonApi(videLikedValue,videoMediId){
    const reqParams = {
      media_id: videoMediId,
      liked: videLikedValue,
    };
    return this.http.post("",reqParams).pipe(map(data => data));
  }

  callAddCommentApi(mediaid,textValue) {
    const reqParams = {
      media_id : mediaid,
      comment : textValue
    }
    return this.http.post("",reqParams).pipe(map(data => data));
  }

  callVideosApi(libraryId){
    const reqParams = {
      library_id : libraryId
    }
    return this.http.get("",{params : reqParams}).pipe(map(data => data));
  }

  callCommentsApi(mediaid){
    const reqParams = {
      media_id : mediaid
    }
    return this.http.get("",{params : reqParams}).pipe(map(data => data));
  }

  callCommentLikeApi(commentId, commentLiked) {
    if(commentLiked === 0) {
      commentLiked = 1;
    }else {
      commentLiked = 0;
    }
    const reqParams = {
      comment_id : commentId,
      liked : commentLiked
    }
    return this.http.post("",reqParams).pipe(map(data => data));
  }

  callReplyCommentApi(mediaId,commentTyped,parentId){
    const reqParams = {
      media_id: mediaId,
      comment: commentTyped,
      parent_comment: parentId
    }
    return this.http.post("",reqParams).pipe(map(data => data));
  }

  callDeleteReplyCommentApi(commentId){
    const reqParams = {
      id: commentId
    }
    return this.http.delete("",{params : reqParams}).pipe(map(data => data));
  }

  callEditReplyCommentApi(mediaId,updatedText,commentId){
    const reqParams = {
      media_id: mediaId,
      comment: updatedText,
      id: commentId
    }
    return this.http.post("",reqParams).pipe(map(data => data));
  }

  callRatingApi(mediaId,ratingValue){
    const reqParams = {
      media_id: mediaId,
      rating: ratingValue
    }
    return this.http.post("",reqParams).pipe(map(data => data));
  }

  callLoadMoreComments(mediaId, page, perpage) {
    const reqParams = {
      media_id: mediaId,
      page : page,
      perpage : perpage
    }
    return this.http.get("",{params : reqParams}).pipe(map(data => data));

  }

  callGetSingleVideo(videoId){
    const url = ``;
    return this.http.get(url).pipe(map(data => data));
  }


}
