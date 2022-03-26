import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private readonly _http: HttpClient) {}

  getPosts(postId: string): Observable<Post> {
    const url = `${environment.serviceUrl}posts/${postId}`;
    return this._http.get<Post>(url);
  }

  getMyNumOfPosts(id: string): Observable<number> {
    const url = `${environment.serviceUrl}posts/findpostbyuserid`;
    return this._http
      .post<Post[]>(url, { id })
      .pipe(map((postList) => postList?.length));
  }
}
