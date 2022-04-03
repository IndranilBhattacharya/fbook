import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BulkUpdatePost } from '../interfaces/bulk-update-post';
import { BulkUpdatedPost } from '../interfaces/bulk-updated-post';
import { Post } from '../interfaces/post';
import { ResponseMsg } from '../interfaces/response-msg';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private readonly _http: HttpClient) {}

  getEntirePostsList(): Observable<Post[]> {
    const url = `${environment.serviceUrl}posts`;
    return this._http
      .get<Post[]>(url)
      .pipe(map((posts) => posts.sort((a, b) => sortByDate(a, b))));
  }

  getAllPosts(): Observable<Post[]> {
    return this.getEntirePostsList().pipe(
      map((posts) => posts.filter((p) => p.isActive))
    );
  }

  getMyNumOfPosts(id: string): Observable<number> {
    const url = `${environment.serviceUrl}posts/findpostbyuserid`;
    return this._http
      .post<Post[]>(url, { id })
      .pipe(map((postList) => postList?.length));
  }

  createPost(payload: Post): Observable<ResponseMsg> {
    const url = `${environment.serviceUrl}posts/createpost`;
    return this._http.post<ResponseMsg>(url, {
      ...payload,
      profession: 'user',
    });
  }

  updatePost(payload: Post): Observable<Post> {
    const url = `${environment.serviceUrl}posts/${payload._id}`;
    return this._http.put<Post>(url, payload);
  }

  updatePostsAsBulk(payload: BulkUpdatePost): Observable<BulkUpdatedPost> {
    const url = `${environment.serviceUrl}posts/updatemanyposts`;
    return this._http.post<BulkUpdatedPost>(url, payload);
  }

  deletePost(payload: Post): Observable<Post> {
    const url = `${environment.serviceUrl}posts/${payload._id}`;
    return this._http.delete<Post>(url);
  }
}

const sortByDate = (a: Post, b: Post) => {
  return (
    new Date(b?.createdDate).getTime() - new Date(a?.createdDate).getTime()
  );
};
