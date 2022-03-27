import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseMsg } from '../interfaces/response-msg';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private readonly _http: HttpClient) {}

  getUserProfileImg(photoId: string) {
    const url = `${environment.serviceUrl}files/${photoId}`;
    return this._http.get(url, { responseType: 'blob' }).pipe(
      map((imgBlob) => {
        return of(() => {
          const sub = new Subject<string>();
          const obs$ = sub.asObservable();
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            () => {
              sub.next(reader.result as string);
            },
            false
          );
          reader.readAsDataURL(imgBlob);
          return obs$;
        });
      })
    );
  }

  uploadPhoto(payload: FormData): Observable<string> {
    const url = `${environment.serviceUrl}files/uploadfile`;
    return this._http
      .post<{ uploadId: string }>(url, payload)
      .pipe(map((responseObj) => responseObj.uploadId));
  }
}
