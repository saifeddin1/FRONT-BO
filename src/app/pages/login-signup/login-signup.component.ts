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
import {
  ADMIN,
  HR,
  INSTRUCTOR,
  STUDENT,
} from '../../lms/constants/roles.constant';
import { ResetpwdService } from 'src/app/identity/services/resetpwd.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css'],
})
export class LoginSignupComponent implements OnInit {
  logged: boolean = false;
  pagetype: string = '';
  emailtoverify:string='';
  newpwd:string='';
  isRightPanelActive: boolean;
  constructor(
    private resetpwdrService :ResetpwdService,
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
    } else if(this.pagetype =='register'){
      this.form = this.signup;
    }
    else if(this.pagetype =='forgetpass'){
      this.form = this.forgetpass;
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

  navigateToLink = (email?:string,forgetpass?:string) => {
    console.log(this.form);
    if (this.form.id == 'login' ) {
      console.log("hani hneeee login")
      if(this.form.forgetpass == forgetpass)
      {
        console.log("hani hneeee forgetpass")
        this.form=this.forgetpass;
      }else{this.form = this.signup;}
     
    } else if (this.form.id == 'register') {
      this.form = this.login;
    }else if (this.form.id == 'forgetpass') {
      this.form = this.verifycode;
      this.emailtoverify = email;
    }else if (this.form.id == 'verifycode') {
      this.form = this.resetpwd;
      
    }else if (this.form.id == 'resetpwd') {
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
    forgetpass:'no',
    img: '../../../assets/eunoia-logo.png',
    slogan: 'Vous avez déjà un compte?',
  };

  forgetpass: FormDisplay = {
    id: 'forgetpass',
    greeting: 'Forget your password',
    linkPrompt: "Vous n'avez pas de compte ?",
    link: "S'INSCRIRE",
    submit: "Send email",
    forgetpass:'FORGET YOUR PASSWORD',
    img: '../../../assets/eunoia-logo.png',
    slogan: 'Vous avez déjà un compte?',
  };

  verifycode: FormDisplay = {
    id: 'verifycode',
    greeting: 'Verify your code',
    linkPrompt: "",
    link: "",
    submit: "Check my code",
    forgetpass:'',
    img: '../../../assets/eunoia-logo.png',
    slogan: '',
  }

  resetpwd: FormDisplay = {
    id: 'resetpwd',
    greeting: 'Reset your password',
    linkPrompt: "",
    link: "",
    submit: 'RESET',
    forgetpass:'',
    img: '../../assets/login-signup/signup.svg',
    slogan: "",
  };

  login: FormDisplay = {
    id: 'login',
    greeting: 'Content de vous revoir',
    linkPrompt: "Vous n'avez pas de compte ?",
    link: "S'INSCRIRE",
    submit: 'SE CONNECTER',
    forgetpass:'FORGET YOUR PASSWORD ?',
    img: '../../assets/login-signup/signup.svg',
    slogan: "Vous n'avez pas de compte ?",
  };

  form: FormDisplay;

  email: string = '';
  username: string = '';
  password: string = '';
  phone: string = '';
  code:string='';
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
          // console.log('***** aCESS TOKEN ****', res.accessToken);
          this.userService.setUser(
            this.userService.decodeToken(res.accessToken)
          );
          this.userService.setToken(res.accessToken);
          // console.log(this.userService.user);

          if (
            this.userService.user.type === STUDENT ||
            this.userService.user.type === INSTRUCTOR
          ) {
            this.router.navigate(['lms']);
          } else if (
            this.userService.user.type === HR ||
            this.userService.user.type === INSTRUCTOR
          ) {
            this.router.navigate(['hr/administration']);
          } else {
            this.router.navigate(['lms/dashboard']);
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
          this.router.navigate(['lms']);
        } else {
          this.router.navigate(['hr/administration']);
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
    if (this.form.id == 'register') {
      this.registerHandler(user);
    } else if (this.form.id == 'login') {
      this.loginHandler(user);
    }else if(this.form.id =='forgetpass'){
      this.resetpwdrService.sendEmail(user).subscribe(
        (result)=>{
          this.toasterService.success(result.message);
          console.log(result)
          this.navigateToLink(user.email);
        },
        (err)=>{
          console.log(err)
          this.toasterService.error(err.statusText);
        }
      )
    }else if(this.form.id =='verifycode'){
      const code ={
        verificationCode: this.code
      }
      this.resetpwdrService.verifycode(code,this.emailtoverify).subscribe(
        (result)=>{
          if(result.succes ==true){
            this.toasterService.success(result.message);
          console.log(result)
          this.navigateToLink();
          }
          else{
            this.toasterService.error(result.error);
          console.log(result)
          }
        },
        (err)=>{
          console.log(err)
          this.toasterService.error("Something wrong");
        }
      )
    }else if(this.form.id =='resetpwd'){

      const newpass ={
        newpassword: this.newpwd
      }
      console.log(this.emailtoverify)
      this.resetpwdrService.resetPassword(newpass,this.emailtoverify).subscribe(
        (result)=>{
          this.toasterService.success(result.message);
          console.log(result)
          this.navigateToLink()
          
        },
        (err)=>{
          console.log(err)
          this.toasterService.error(err);
        }
      )
    }
  }
  

  ngOnInit(): void {
    if (!!this.userService.getCurrentUser()) {
      this.router.navigate(['lms/dashboard']);
    }
  }
}
