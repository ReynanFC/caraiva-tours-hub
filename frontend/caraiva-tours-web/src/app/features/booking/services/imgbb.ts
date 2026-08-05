import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ImgBbResponse } from '../models/img-bb-response';
import { environment } from '../../../../environment/environment';

@Service()
export class Imgbb {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.imgbb.com/1/upload';

  uploadImage(file: File): Observable<ImgBbResponse> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<ImgBbResponse>(this.apiUrl, formData, {
      params: {
        key: environment.imgbbApiKey,
      },
    });
  }
}
