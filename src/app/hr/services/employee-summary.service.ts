import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { Contract } from '../models/contract.model';
import { File } from '../models/file.models';
import { Interview } from '../models/interview.model';
import { Timesheet } from '../models/timesheet.model';
import { Timeslot } from '../models/timeslot.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeSummaryService {
  // public decodedToken = jwtDecode(
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFmYWE0ZGY3OWFlZTc4MWNhNmVlOTZhIiwicm9sZSI6IlNUVURFTlQifSwiaWF0IjoxNjQzODE2NTc4fQ.uxmx9-nyNJgK5PoumH_s0UqVRlLBLHeQJXQWRbJQJ7k'
  // );

  public decodedToken = jwtDecode(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVkaXQiOjAsImNoYXRzIjpbXSwiX2lkIjoiNjIwMGYwNTU1ZTBlOWI5ZWFjM2YyMmFlIiwidXNlcm5hbWUiOiJzYWlmZWRkaW4wMSIsImVtYWlsIjoic2FpZjFAZ21haWwuY29tIiwicHJvZmlsZSI6eyJmdWxsTmFtZSI6IlNhaWZlZGRpbiBNYXRvdWkiLCJwaG9uZSI6IjEyMzQ1Njc4IiwibGlua2VkSW4iOiJzYWlmZWRkaW4wMSIsImZhY2Vib29rIjoiIn0sInR5cGUiOiJFU1RVREVOVCIsInN0dWRlbnROaXZlYXVJZCI6IjYxMDgyYTlkNmM1MzYwMmIxYzYwYzhhZiIsImNyZWF0ZWRBdCI6IjIwMjItMDItMDdUMTA6MTE6MzMuMjMxWiIsInVwZGF0ZWRBdCI6IjIwMjItMDItMTVUMDg6NDg6NDIuNzAxWiIsIl9fdiI6MCwiaWF0IjoxNjQ0OTE2MjI4LCJleHAiOjE2NjI5MTYyMjh9.0tPzDABqmcNXw8frdKF5dgkdyz6It_PAOkoRZgKpUU0'
  );

  private BASE_URL: string = 'http://localhost:8001';

  constructor(private http: HttpClient) {}

  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(
      `${this.BASE_URL}/contracts/employeeContracts`
    );
  }
  getContractsWithSalary(): Observable<Contract[]> {
    return this.http.get<Contract[]>(
      `${this.BASE_URL}/contracts/employeeContractsWithSalary`
    );
  }

  getCollaborators(): Observable<File[]> {
    return this.http.get<File[]>(`${this.BASE_URL}/files/getCollaborators`);
  }

  getInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(
      `${this.BASE_URL}/interviews/employeeInterviews`
    );
  }

  getUser() {
    return this.decodedToken;
    // return this.decodedToken['user'];
  }
  getFiles(): Observable<File[]> {
    return this.http.get<File[]>(`${this.BASE_URL}/files`);
  }

  getFileDetails(): Observable<File> {
    return this.http.get<File>(`${this.BASE_URL}/files/employeeFileDetails`);
  }

  getTimeSheets(): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(
      `${this.BASE_URL}/timesheets/getEmployeeTimeSheets`
    );
  }

  updateProfile(body: any): Observable<File> {
    return this.http.put<File>(
      `${this.BASE_URL}/files/employeeFileDetails`,
      JSON.stringify(body),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  getTimeSlots(): Observable<Timeslot[]> {
    return this.http.get<Timeslot[]>(`${this.BASE_URL}/timeslots`);
  }
}
