import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrepreneur, VideoTestimony, AccompanyPrinciple } from '../models/entrepreneur';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EntrepreneurService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getEntrepreneurs(): Observable<Entrepreneur[]> {
    return this.http.get<Entrepreneur[]>(`${this.apiUrl}/entrepreneurs`);
  }

  getVideos(): Observable<VideoTestimony[]> {
    return this.http.get<VideoTestimony[]>(`${this.apiUrl}/videos`);
  }

  getPrinciples(): Observable<AccompanyPrinciple[]> {
    return this.http.get<AccompanyPrinciple[]>(`${this.apiUrl}/principles`);
  }
}
