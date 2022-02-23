import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  /**
   * POST add profile image to user
   * @param {FormData} file the course image
   * @param {string} courseId id of course
   */
  uploadImage(file: FormData, docId: string, ref: string): Observable<any> {
    return this.http.post<any>(
      `${environment.LmsApiUrl}/api/${ref}/${docId}/uploadImage`,
      file
    );
  }

  openFile(element, ref = 'media') {
    debugger;
    if (element.img) {
      const url = `${environment.LmsApiUrl}/api/${ref}/documents/${element.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
      console.log('url :', url);
      window.open(url);
    }
  }
}
