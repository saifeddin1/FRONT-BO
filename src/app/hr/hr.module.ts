import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmplyeeProfileComponent } from './pages/emplyee-profile/emplyee-profile.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { EmployeeSummaryService } from './services/employee-summary.service';

@NgModule({
  declarations: [EmplyeeProfileComponent],
  imports: [CommonModule],
  exports: [EmplyeeProfileComponent],
  providers: [
    EmployeeSummaryService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class HRModule {}
