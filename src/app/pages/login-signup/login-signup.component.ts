import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Niveau,
  NiveauService,
} from '../../lms/pages/admin/niveau/niveau.service';
import { UserService } from './../../lms/services/user.service';
import { FormDisplay } from './FormDisplay';
import {
  DEFAULT_MESSAGES,
  ToasterService,
} from '../../lms/services/toaster.service';
import { ADMIN, HR, STUDENT } from '../../lms/constants/roles.constant';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css'],
})
export class LoginSignupComponent implements OnInit {
  logged: boolean = false;
  pagetype: string = '';
  isRightPanelActive: boolean;
  constructor(
    private userService: UserService,
    private niveauService: NiveauService,
    private router: Router,
    private toasterService: ToasterService,
    private activatedRouter: ActivatedRoute
  ) {
    this.getNiveaux();
    this.pagetype = this.activatedRouter.snapshot.params['type'];
    if (this.pagetype == 'login') {
      this.form = this.login;
    } else {
      this.form = this.signup;
    }
    this.activeClass = true;
  }

  activeClass = false;
  niveauxList;
  getNiveaux() {
    this.niveauService.getAllForUsers().subscribe(
      (res: [Niveau]) => {
        console.log('Niveaux : ', res);
        this.niveauxList = res;
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  navigateToLink = () => {
    console.log(this.form);
    if (this.form.id == 'login') {
      this.form = this.signup;
    } else if (this.form.id == 'register') {
      this.form = this.login;
    }
    this.pagetype = this.form.id;
    this.activeClass = !this.activeClass;
  };

  signup: FormDisplay = {
    id: 'register',
    greeting: 'Créer un compte',
    linkPrompt: 'Vous avez déjà un compte?',
    link: 'SE CONNECTER',
    submit: "S'INSCRIRE",
    img: '../../../assets/eunoia-logo.png',
    slogan: 'Vous avez déjà un compte?',
  };

  login: FormDisplay = {
    id: 'login',
    greeting: 'Content de vous revoir',
    linkPrompt: "Vous n'avez pas de compte ?",
    link: "S'INSCRIRE",
    submit: 'SE CONNECTER',
    img: '../../assets/login-signup/signup.svg',
    slogan: "Vous n'avez pas de compte ?",
  };

  form: FormDisplay;

  email: string = '';
  username: string = '';
  password: string = '';
  phone: string = '';
  studentNiveauId: string = '';
  type: string = STUDENT;
  error: string = '';

  loginHandler(user: any) {
    this.userService.loginUser(user.email, user.password).subscribe(
      (res: boolean | { token: string } | any) => {
        if (res === false) {
          this.toasterService.error(
            DEFAULT_MESSAGES.confirmation.password.invalid
          );
          console.log('incorrect password');
          this.error = 'Error: Invalid Password';
        } else {
          console.log('***** aCESS TOKEN ****', res.accessToken);
          this.userService.setUser(
            this.userService.decodeToken(res.accessToken)
          );
          this.userService.setToken(res.accessToken);

          if (
            this.userService.user.type === STUDENT ||
            this.userService.user.type === HR ||
            this.userService.user.type === ADMIN
          ) {
            this.router.navigate(['lms']);
          } else if (this.userService.user.type === HR) {
            this.router.navigate(['hr/administration']);
          } else {
            this.router.navigate(['dashboard']);
          }
        }
      },
      (err) => {
        console.log(err.error);
        this.error = err.error;
      }
    );
  }

  registerHandler(user: {
    username: string;
    email: string;
    phone: string;
    password: string;
    type: string;
    studentNiveauId: string;
  }) {
    debugger;
    if (
      !user.username ||
      !user.email ||
      !user.password ||
      !user.phone ||
      !user.type
    ) {
      this.toasterService.error(DEFAULT_MESSAGES.confirmation.pleaseFill);
      return;
    }

    if (!this.userService.validateEmail(user.email)) {
      this.toasterService.error(DEFAULT_MESSAGES.confirmation.email.invalid);
      return;
    }

    if (user.password.length < 8) {
      this.toasterService.error(DEFAULT_MESSAGES.confirmation.password.short);
      return;
    }
    // logs student in
    console.log('user :', user);

    this.userService.postNewUser(user).subscribe(
      (res: { token: string }) => {
        this.userService.setUser(this.userService.decodeToken(res.token));
        this.userService.setToken(res.token);
        this.toasterService.success(DEFAULT_MESSAGES.success.register);
        if (this.userService.user.type === STUDENT) {
          this.router.navigate(['calendar']);
        } else {
          this.router.navigate(['dashboard']);
        }
      },
      (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
        if (err.error.message === undefined) {
          this.error = "Erreur : L'adresse email est déjà enregistrée";
          this.toasterService.error(DEFAULT_MESSAGES.confirmation.email.used);
        }
        return;
      }
    );
  }

  onSubmit() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
      phone: this.phone,
      type: this.type,
      studentNiveauId: this.studentNiveauId,
    };
    console.log('$$$$$$$$$$$$', user);
    if (this.form.id == 'register') {
      this.registerHandler(user);
    } else if (this.form.id == 'login') {
      this.loginHandler(user);
    }
  }

  ngOnInit(): void {
    if (!!this.userService.getCurrentUser()) {
      this.router.navigate(['dashboard']);
    }
  }
}
