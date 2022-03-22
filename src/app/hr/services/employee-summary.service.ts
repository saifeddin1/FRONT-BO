import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Observable, ObservableInput, ObservableLike } from 'rxjs';
import { UserService } from 'src/app/lms/services/user.service';
import { environment } from 'src/environments/environment';
import { getToken } from '../helpers/getToken';
// import { getToken } from '../helpers/getToken';
import { Contract } from '../models/contract.model';
import { File } from '../models/file.models';
import { Interview } from '../models/interview.model';
import { Notification } from '../models/notification.model';
import { Timeoff } from '../models/timeoff.model';
import { Timesheet } from '../models/timesheet.model';
import { TimesheetDeclaration } from '../models/timesheetDeclaration.model';
import { Timeslot } from '../models/timeslot.model';
import { YearMonth } from '../models/yearMonth.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeSummaryService {
  private BASE_URL: string = environment.HRApi;

  constructor(private http: HttpClient, private userservise: UserService) {}

  public decodedToken = this.userservise.decodeToken(getToken());
  getUser() {
    console.log(this.decodedToken, '****************************');
    return this.decodedToken;
  }

  getAllUsers(extractedRrole): Observable<any> {
    return this.http.get<any>(
      `${environment.IdentityApi}/api/v1/users?extract=${extractedRrole}`
    );
  }
  // ---------------------------- CONTRACTS 📜  ----------------------------------
  createContract(body): Observable<Contract> {
    return this.http.post<Contract>(`${this.BASE_URL}/contracts`, body);
  }

  deleteContract(id: string): Observable<Contract> {
    return this.http.delete<Contract>(`${this.BASE_URL}/contracts/${id}`);
  }

  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(
      `${this.BASE_URL}/contracts/employeeContracts`
    );
  }
  getAllContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.BASE_URL}/contracts`);
  }

  getAllContractsWithSalaries(): Observable<Contract[]> {
    return this.http.get<Contract[]>(
      `${this.BASE_URL}/contracts/getAllContractsWithSalaries`
    );
  }

  getContractsWithSalary(): Observable<Contract[]> {
    return this.http.get<Contract[]>(
      `${this.BASE_URL}/contracts/employeeContractsWithSalary`
    );
  }

  updateContractWithSalary(id: string, body): Observable<Contract> {
    return this.http.put<Contract>(
      `${this.BASE_URL}/contracts/updateContractWithSalaries/${id}`,
      body
    );
  }

  // ---------------------------- INTERVIEW -----------------------
  getInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(
      `${this.BASE_URL}/interviews/employeeInterviews?limit=99`
    );
  }

  getAllInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.BASE_URL}/interviews`);
  }

  createInterview(body: any): Observable<Interview> {
    return this.http.post<Interview>(`${this.BASE_URL}/interviews`, body);
  }

  updateInterview(id: string, body: Interview): Observable<Interview> {
    return this.http.put<Interview>(`${this.BASE_URL}/interviews/${id}`, body);
  }
  deleteInterview(id: string): Observable<Interview> {
    return this.http.delete<Interview>(`${this.BASE_URL}/interviews/${id}`);
  }

  // --------------------------------- PROFILE / FILE -----------------------------

  createEmployeeFile(body: File): Observable<File> {
    return this.http.post<File>(`${this.BASE_URL}/files`, body);
  }

  getCollaborators(): Observable<File[]> {
    return this.http.get<File[]>(`${this.BASE_URL}/files/getCollaborators`);
  }

  getFiles(): Observable<File[]> {
    return this.http.get<File[]>(`${this.BASE_URL}/files`);
  }

  getFileDetails(): Observable<File> {
    return this.http.get<File>(`${this.BASE_URL}/files/employeeFileDetails`);
  }

  updateProfile(body: any): Observable<File> {
    return this.http.put<File>(
      `${this.BASE_URL}/files/employeeFileDetails`,
      JSON.stringify(body),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  updateEmployeeFileAsAdmin(id: string, body: File): Observable<File> {
    return this.http.put<File>(
      `${this.BASE_URL}/files/employeeFileAsAdmin/${id}`,
      JSON.stringify(body),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  getSingleFile(userId: string): Observable<File> {
    return this.http.get<File>(
      `${this.BASE_URL}/files/getOneByUserId/${userId}`
    );
  }

  deleteEmployeeFile(id: string): Observable<File> {
    return this.http.delete<File>(`${this.BASE_URL}/files/${id}`);
  }
  // ------------------------------------- TIMESHEET ---------------------------------------
  getEmployeeTimeSheets(p: number, limit: number): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(
      `${this.BASE_URL}/timesheets/getEmployeeTimeSheets?page=${
        p - 1
      }&limit=${limit}`
    );
  }

  getTimesheetsByUserId(
    userId: string,
    p: number,
    limit: number
  ): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(
      `${this.BASE_URL}/timesheets/getTimesheetsByUserId/${userId}?page=${
        p - 1
      }&limit=${limit}`
    );
  }

  getMonthlyEmployeeTimesheets(
    p: number,
    limit: number,
    yearMonth: string
  ): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(
      `${
        this.BASE_URL
      }/timesheets/getMonthlyEmployeeTimesheets/${yearMonth}?page=${
        p - 1
      }&limit=${limit}`
    );
  }

  getAllSheets(): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(`${this.BASE_URL}/timesheets`);
  }

  getEmployeeCurrentTimeSheet(date): Observable<Timesheet> {
    return this.http.get<Timesheet>(
      `${this.BASE_URL}/timesheets/getCurrentTimeSheet/${date}`
    );
  }

  updateEmployeeTimeSheet(sheet_id: string, body): Observable<Object> {
    return this.http.put<Object>(
      `${this.BASE_URL}/timesheets/updateTimeSheetForEmployee/${sheet_id}`,
      body
    );
  }
  updateTimeSheet(sheet_id: string, body): Observable<Object> {
    return this.http.put<Object>(
      `${this.BASE_URL}/timesheets/${sheet_id}`,
      body
    );
  }

  createEmployeeTimeSheet(body): Observable<Timesheet> {
    return this.http.post<Timesheet>(`${this.BASE_URL}/timesheets`, body);
  }

  createTimesheetDeclaration(body): Observable<TimesheetDeclaration> {
    return this.http.post<TimesheetDeclaration>(
      `${this.BASE_URL}/timesheetDeclarations`,
      body
    );
  }
  deleteDeclaration(id: string): Observable<TimesheetDeclaration> {
    return this.http.delete<TimesheetDeclaration>(
      `${this.BASE_URL}/timesheetDeclarations/${id}`
    );
  }

  deleteTimesheet(id: string): Observable<Timesheet> {
    return this.http.delete<Timesheet>(`${this.BASE_URL}/timesheets/${id}`);
  }

  getCurrentDeclaration(month: number): Observable<TimesheetDeclaration> {
    return this.http.get<TimesheetDeclaration>(
      `${this.BASE_URL}/timesheetDeclarations/getCurrentDeclaration/${month}`
    );
  }

  getWorkedHoursMonthly(date: string): Observable<Number> {
    return this.http.get<Number>(
      `${this.BASE_URL}/timesheets/getMonthlyWorkingHours/${date}`
    );
  }

  // --------------------------------- TIMETABLE ----------------------------
  getTimeSlots(): Observable<Timeslot[]> {
    return this.http.get<Timeslot[]>(
      `${this.BASE_URL}/timeslots/getEmployeeTimeslots`
    );
  }

  // ------------------------------- TIMEOFFS 😴 -----------------------------
  getEmployeeTimeoffHistory(): Observable<Timeoff> {
    return this.http.get<Timeoff>(
      `${this.BASE_URL}/timeoffs/employeeTimeoffHistory`
    );
  }
  createTimeoffRequest(body: Timeoff): Observable<Timeoff> {
    return this.http.post<Timeoff>(
      `${this.BASE_URL}/timeOffs/createTimeOffAsEmployee`,
      body
    );
  }

  updateTimeoffStatus(body, id: string): Observable<Timeoff> {
    return this.http.put<Timeoff>(
      `${this.BASE_URL}/timeoffs/updateStatus/${id}`,
      body
    );
  }

  updateTimeoff(id: string, body: Timeoff): Observable<Timeoff> {
    return this.http.put<Timeoff>(`${this.BASE_URL}/timeOffs/${id}`, body);
  }
  getAllTimeoffs(): Observable<Timeoff> {
    return this.http.get<Timeoff>(`${this.BASE_URL}/timeoffs`);
  }

  deleteTimeoff(id: string): Observable<Timeoff> {
    return this.http.delete<Timeoff>(`${this.BASE_URL}/timeoffs/${id}`);
  }

  // ---------------------- Notifications 🔕 -------------------

  getUserNotifications(): Observable<Notification> {
    return this.http.get<Notification>(
      `${this.BASE_URL}/notifications/getUserNotifications`
    );
  }

  getAllNotifications(): Observable<Notification> {
    return this.http.get<Notification>(`${this.BASE_URL}/notifications`);
  }

  createNotification(body: Notification): Observable<Notification> {
    console.log(
      '*******************************************************************'
    );

    return this.http.post<Notification>(`${this.BASE_URL}/notifications`, body);
  }

  // ------------------- Year Month Items -----------------------------

  getAllYearMonthItems(): Observable<YearMonth[]> {
    return this.http.get<YearMonth[]>(`${this.BASE_URL}/yearMonths`);
  }

  getYearMonthItem(id: string): Observable<YearMonth> {
    return this.http.get<YearMonth>(`${this.BASE_URL}/yearMonths${id}`);
  }

  createYearMonthItem(body: YearMonth, userId: string): Observable<YearMonth> {
    return this.http.post<YearMonth>(
      `${this.BASE_URL}/yearMonths/${userId}`,
      body
    );
  }

  editYearMonthItem(id: string, body: YearMonth): Observable<YearMonth> {
    return this.http.put<YearMonth>(`${this.BASE_URL}/yearMonths${id}`, body);
  }

  deleteYearMonthItem(id: string, body: YearMonth): Observable<YearMonth> {
    return this.http.delete<YearMonth>(`${this.BASE_URL}/yearMonths${id}`);
  }
}
