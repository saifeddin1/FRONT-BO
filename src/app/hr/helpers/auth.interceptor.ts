import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    var token: string =
      // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFmYWE0ZGY3OWFlZTc4MWNhNmVlOTZhIiwicm9sZSI6IlNUVURFTlQifSwiaWF0IjoxNjQzODE2NTc4fQ.uxmx9-nyNJgK5PoumH_s0UqVRlLBLHeQJXQWRbJQJ7k';
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVkaXQiOjAsImNoYXRzIjpbXSwiX2lkIjoiNjIwMGYwNTU1ZTBlOWI5ZWFjM2YyMmFlIiwidXNlcm5hbWUiOiJzYWlmZWRkaW4wMSIsImVtYWlsIjoic2FpZjFAZ21haWwuY29tIiwicHJvZmlsZSI6eyJmdWxsTmFtZSI6IlNhaWZlZGRpbiBNYXRvdWkiLCJwaG9uZSI6IjEyMzQ1Njc4IiwibGlua2VkSW4iOiJzYWlmZWRkaW4wMSIsImZhY2Vib29rIjoiIn0sInR5cGUiOiJFU1RVREVOVCIsInN0dWRlbnROaXZlYXVJZCI6IjYxMDgyYTlkNmM1MzYwMmIxYzYwYzhhZiIsImNyZWF0ZWRBdCI6IjIwMjItMDItMDdUMTA6MTE6MzMuMjMxWiIsInVwZGF0ZWRBdCI6IjIwMjItMDItMTVUMDg6NDg6NDIuNzAxWiIsIl9fdiI6MCwiaWF0IjoxNjQ0OTE2MjI4LCJleHAiOjE2NjI5MTYyMjh9.0tPzDABqmcNXw8frdKF5dgkdyz6It_PAOkoRZgKpUU0';
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
