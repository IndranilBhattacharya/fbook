import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../interfaces/post';
import { ResponseMsg } from '../interfaces/response-msg';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private readonly _http: HttpClient) {}

  getAllPosts(): Observable<Post[]> {
    const url = `${environment.serviceUrl}posts`;
    return this._http
      .get<Post[]>(url)
      .pipe(map((posts) => posts.sort((a, b) => sortByDate(a, b))));
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
}

const sortByDate = (a: Post, b: Post) => {
  return (
    new Date(b?.createdDate).getTime() - new Date(a?.createdDate).getTime()
  );
};
