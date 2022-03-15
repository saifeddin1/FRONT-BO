import { EidentityModule } from './eidentity/eidentity.module';
import { AccountingModule } from './accounting/accounting.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ClarityModule } from '@clr/angular';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { NgxFileDropModule } from 'ngx-file-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

// import { FrontPageHeaderComponent } from './components/front-page-header/front-page-header.component';
// import { GlobalSearchComponent } from './components/global-search/global-search.component';
// import { IcIlProfileComponent } from './components/profile-components/ic-il-profile/ic-il-profile.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { SettingsComponent } from './pages/settings/settings.component';
// import { UserProfileComponent } from './pages/user-profile/user-profile.component';
// import { ChatComponent } from './pages/chat/chat.component';
// import { SearchResultsComponent } from './pages/search-results/search-results.component';
// import { AboutComponent } from './pages/home-pages/about/about.component';
// import { SolutionsComponent } from './pages/home-pages/solutions/solutions.component';
// import { CalendarModule, DateAdapter } from 'angular-calendar';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
// import { StudentCalendarComponent } from './pages/student-calendar/student-calendar.component';
import { CommonModule } from '@angular/common';
// import { FlatpickrModule } from 'angularx-flatpickr';
// import { StudentOffreComponent } from './pages/student-offre/student-offre.component';
// import { StudentAssistanceComponent } from './pages/student-assistance/student-assistance.component';
// import { StudentMatiereComponent } from './pages/student-matiere/student-matiere.component';
// import { MatiereDetailsComponent } from './pages/student-matiere/matiere-details/matiere-details.component';
// import { SummaryComponent } from './pages/student-matiere/matiere-details/summary/summary.component';
// import { ChaptersComponent } from './pages/student-matiere/matiere-details/chapters/chapters.component';
// import { ChapitreDetailsComponent } from './pages/student-matiere/chapitre-details/chapitre-details.component';
// import { PlyrModule } from 'ngx-plyr';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { AuthInterceptor } from './core/helpers/auth.interceptor';
// import { ErrorInterceptor } from './core/helpers/error.interceptor';
// import { IvyCarouselModule } from 'angular-responsive-carousel';
// import { ToastrModule } from 'ngx-toastr';
// import { BannerComponent } from './pages/home-pages/banner/banner.component';
// import { HeaderComponent } from './pages/home-pages/header/header.component';
// import { WorkProcessComponent } from './pages/home-pages/work-process/work-process.component';
// import { PricingComponent } from './pages/home-pages/pricing/pricing.component';
// import { TestimonialsComponent } from './pages/home-pages/testimonials/testimonials.component';
// import { FooterComponent } from './pages/home-pages/footer/footer.component';
// import { NgxStarRatingModule } from 'ngx-star-rating';
// import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from './shared/shared.module';
import { HRModule } from './hr/hr.module';
import { LMSModule } from './lms/lms.module';
import { LoginSignupComponent } from './pages/login-signup/login-signup.component';

@NgModule({
  declarations: [
    AppComponent,
    // FrontPageHeaderComponent,
    // LoginSignupComponent,
    // FooterComponent,
    // DashboardComponent,
    // GlobalSearchComponent,
    // IcIlProfileComponent,
    // SettingsComponent,
    // UserProfileComponent,
    // ChatComponent,
    // SearchResultsComponent,
    // AboutComponent,
    // SolutionsComponent,
    // StudentCalendarComponent,
    // StudentOffreComponent,
    // StudentAssistanceComponent,
    // StudentMatiereComponent,
    // MatiereDetailsComponent,
    // SummaryComponent,
    // ChaptersComponent,
    // ChapitreDetailsComponent,
    // BannerComponent,
    // HeaderComponent,
    // WorkProcessComponent,
    // PricingComponent,
    // TestimonialsComponent,
    // ImgPreloaderDirective,

    LoginSignupComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MatIconModule,
    // ClarityModule,
    // BrowserAnimationsModule,
    // ToastrModule.forRoot(),
    FormsModule,
    // HttpClientModule,
    // PdfViewerModule,
    // NgxFileDropModule,
    // FlatpickrModule.forRoot(),
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory,
    // }),
    // PlyrModule,
    // MatTableModule,
    // MatTabsModule,
    // MatPaginatorModule,
    // MatButtonToggleModule,
    // IvyCarouselModule,
    // NgxStarRatingModule,
    // SweetAlert2Module.forRoot(),
    SharedModule, // leave it here
    HRModule, // leave it here,
    LMSModule,
    MatMenuModule,
    AccountingModule,
    EidentityModule,
  ],
  // providers: [
  //   { provide: LOCALE_ID, useValue: 'fr' },
  //   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  //   { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  // ],
  bootstrap: [AppComponent],
})
export class AppModule {}
