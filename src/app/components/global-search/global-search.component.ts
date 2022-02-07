import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { filter } from 'rxjs/operators';
// import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css'],
})
export class GlobalSearchComponent implements OnInit, AfterViewInit {
  constructor(
    private userService: UserService,
    private router: Router,
    // private chatService: ChatService
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        switch (event.url) {
          case '/calendar':
            this.title = 'Calendrier';
            break;
          case '/dashboard':
            this.title = 'Dashbord';
            break;
          case '/matiere':
            this.title = 'Matière';
            break;
          case '/matieres':
            this.title = 'Matières';
            break;
          case '/seances':
            this.title = 'Séances';
            break;
          case '/students':
            this.title = 'Apprenants';
            break;
          case '/instructors':
            this.title = 'Instructeurs';
            break;
          case '/course/create':
            this.title = 'Create A Course';
            break;
          default:
            this.title = event.url.substring(1);
            if (this.title.includes("instructors/edit/niv/")) {
              this.title = "Instructeur Niveaux";
            } else {
              this.title = this.title.split('/')[0];
              if (this.title === 'user') this.title = "Mon Profil";
              if (this.title === 'course') this.title = "Cours";
              if (this.title === 'matiere') this.title = "Détails Matière";
            }

            break;
        }
        this.isUserProfile =
          this.userService.getCurrentUser() &&
          event.url === `/user/${this.userService.getCurrentUser().username}`;
        // this.isChat = event.url === '/chat';
        if (event.url.includes('surveyresponses')) this.title = 'Survey Responses';
        // if (event.url.includes('edit')) this.title = 'Edit Course';
        if (event.url.includes('studentAnalytics')) this.title = 'Student Analytics';
        if (event.url.includes('assessments')) this.title = 'Assessments';
        if (event.url.includes('studentSubmissions')) this.title = 'Submissions';
      });
  }

  @ViewChild('searchBar') searchBar;
  @ViewChild('barContainer') barContainer;
  @ViewChild('dropdown') searchDropdown;

  title: String = '';
  searchQuery: String = '';
  isFocused: boolean;
  newMessage: boolean = false;
  socket: any;
  isUserProfile: boolean = false;
  isChat: boolean = false;

  ngOnInit(): void {
    // this.chatService.init(this.userService.getCurrentUser().username);
    // this.socket = this.chatService.getSocket();
    // this.socket.on('message', (chatId, message) => {
    //   if (this.router.url !== '/chat') {
    //     this.newMessage = true;
    //   }
    // });
    this.title =
      location.pathname === '/'
        ? 'Dashboard'
        : location.pathname.substring(1).split('/')[0];
  }

  ngAfterViewInit(): void {
    if (this.searchBar && this.searchBar.nativeElement) {
      // @ts-ignore
      const observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.searchDropdown.nativeElement.style.left =
            this.getOffset(this.searchBar.nativeElement).left + 'px';
          this.searchDropdown.nativeElement.style.width =
            this.searchBar.nativeElement.clientWidth + 'px';
        });
      });

      observer.observe(this.barContainer.nativeElement);
    }
  }

  goToProfile(): void {
    this.router.navigate([`user/${this.userService.getCurrentUser().username}`]);
  }

  onPressSearch(type: string): void {
    this.router.navigate([
      `search/${type}/${encodeURI(this.searchQuery.trim() as string)}`,
    ]);
    this.searchQuery = '';
  }

  onPressChat(): void {
    // this.newMessage = false;
    // this.router.navigate(['chat']);
  }

  getOffset(el: any) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    };
  }
  logout() {
    this.userService.logOut()
  }
}
