import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupstudentService {

  constructor(private http:HttpClient) { }

  private BASE_URL: string= environment.Accounting;

  getStudentgroup():Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/api/studentGroup/`);
  }
  getOneStudentgroup(id:string):Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/api/studentGroup/studentsofgroup/${id}`);
  }
  
  

  editStudentgroup(id:string, element:any):Observable<any>{
    console.log("element edit",element)
    return this.http.put<any>(`${this.BASE_URL}/api/studentGroup/${id}`,element);
  }





  getStudents():Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/api/student/`);
  }
  getGroupStudentsbyname():Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/api/studentGroup/byname`);
  }
  getDisabledGroupStudents():Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/api/studentGroup/disablestudentgroup`);
  }

  createStudentGroup(studgroup:any){
  
    return this.http.post<any>(`${this.BASE_URL}/api/studentGroup/`,studgroup)
  }


  searchPrograms(query:string){
    return this.http.post<{payload:Array<any>}>(`${this.BASE_URL}/api/studentGroup/search`,{payload:query},{
      headers: new HttpHeaders({'Content-Type':'application/json'})
    }).pipe(
      map(data => data.payload)
    )

  }
  editStudent(id:string, element:any):Observable<any>{
    return this.http.put<any>(`${this.BASE_URL}/api/student/${id}`,element)
  }
  deleteStudent(id:string):Observable<any>{
    return this.http.delete(`${this.BASE_URL}/api/studentGroup/student/${id}`)
  }
  deleteStudentgroup(id:string):Observable<any>{
    return this.http.delete(`${this.BASE_URL}/api/studentGroup/${id}`)
  }

  restore(id:string):Observable<any>{
    
    return this.http.put<any>(`${this.BASE_URL}/api/studentGroup/restore/${id}`,{})
  }
}
