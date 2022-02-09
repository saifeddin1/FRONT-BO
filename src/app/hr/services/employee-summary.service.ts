import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { Contract } from '../models/contract.model';
import { Interview } from '../models/interview.model';
import { Timesheet } from '../models/timesheet.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeSummaryService {
  private BASE_URL: string = 'http://localhost:8001';

  constructor(private http: HttpClient) {}

  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.BASE_URL}/contracts`);
  }

  getContractDetails(id: string): Observable<Contract> {
    return this.http.get<Contract>(`${this.BASE_URL}/contracts/${id}`);
  }

  updateContract(id: string, body: Object): Observable<Contract> {
    return this.http.put<Contract>(`${this.BASE_URL}/contracts/${id}`, body);
  }
  getInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.BASE_URL}/interviews`);
  }

  public decodedToken = jwtDecode(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFmYWE0ZGY3OWFlZTc4MWNhNmVlOTZhIiwicm9sZSI6IlNUVURFTlQifSwiaWF0IjoxNjQzODE2NTc4fQ.uxmx9-nyNJgK5PoumH_s0UqVRlLBLHeQJXQWRbJQJ7k'
  );

  getUser() {
    return this.decodedToken['user'];
  }
  getFiles(): Observable<File[]> {
    return this.http.get<File[]>(`${this.BASE_URL}/files`);
  }

  getFile(id: string): Observable<File> {
    return this.http.get<File>(`${this.BASE_URL}/files/${id}`);
  }

  getTimeSheets(): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(`${this.BASE_URL}/timesheets`);
  }
}
