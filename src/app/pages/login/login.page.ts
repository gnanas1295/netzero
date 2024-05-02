import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPageForm } from './login.page.form';
import { Store } from '@ngrx/store';
import { AppState } from 'src/store/AppState';
import { hide, show } from 'src/store/loading/loading.actions';
import { ToastController } from '@ionic/angular';
import { LoginState } from 'src/store/login/LoginState';
import { AuthService } from 'src/app/services/auth/auth.service';
import { login, loginFail, loginSuccess, recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from 'src/store/login/login.actions';
import { Subscription } from 'rxjs';
import { ClipboardService } from 'src/app/clipboard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  // form: FormGroup = new FormGroup({});
  loginStateSubscription!: Subscription;

  form: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private store: Store<AppState>, private toastController: ToastController, private authService: AuthService, private clipboardService: ClipboardService) { 
    this.form = new FormGroup({

    });
  }

  ngOnInit() {
    this.form = new LoginPageForm(this.formBuilder).createForm();

    this.loginStateSubscription = this.store.select('login').subscribe(loginState => {
      this.onIsRecoveredPassword(loginState);
      this.onIsRecoveringPassword(loginState);
      this.onError(loginState);
      this.onIsLoggingIn(loginState);
      this.onIsLoggedIn(loginState);
      this.toggleLoading(loginState);
    })
  }

  copyEmailToClipboard(): void {
    const emailValue = this.form.get('email')?.value;
    if (emailValue) {
      this.clipboardService.copyToClipboard(emailValue);
    }
  }

  copyPasswordToClipboard(): void {
    const passwordValue = this.form.get('password')?.value;
    if (passwordValue) {
      this.clipboardService.copyToClipboard(passwordValue);
    }
  }

  ngOnDestroy() {
    if (this.loginStateSubscription){
      this.loginStateSubscription.unsubscribe();
    }
  }

  private toggleLoading(loginState: LoginState){
    if (loginState.isLoggingIn || loginState.isRecoveringPassword){
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    }
  }

  private onIsLoggedIn(loginState: LoginState){
    if (loginState.isLoggedIn){
      this.router.navigate(['home']);
    }
  }

  private onIsLoggingIn(loginstate: LoginState){
    if (loginstate.isLoggingIn){
      const email = this.form.get('email')?.value;
      const password =  this.form.get('password')?.value;
      this.authService.login(email, password).subscribe(user => {
        this.store.dispatch(loginSuccess({user}));
      }, error => {
        this.store.dispatch(loginFail({error}));
      })
    }
  }

  private async onError(loginState: LoginState){
    if (loginState.error){
      const toaster = await this.toastController.create({
        position: "bottom",
        message: loginState.error.message,
        color: "danger"
      });
      toaster.present();
    }
  }


  private onIsRecoveringPassword(loginState: LoginState){
    if (loginState.isRecoveringPassword){

      this.authService.recoverEmailPassword(this.form.get('email')?.value).subscribe(() =>{
        this.store.dispatch(recoverPasswordSuccess());
      }, error => {
        this.store.dispatch(recoverPasswordFail({error})) 
      });
    }
  }

  private async onIsRecoveredPassword(loginState: LoginState){
    if (loginState.isRecoveredPassword){
      const toaster = await this.toastController.create({
        position: "bottom",
        message: "Recovery email sent",
        color: "primary"
      });
      toaster.present();
    }

  }

  forgotEmailPassword(){
    this.store.dispatch(recoverPassword());

    // setTimeout(() => {
    //   this.store.dispatch(hide())
    // }, 3000)
  }

  login(){
    this.store.dispatch(login());
  }
  register(){
    this.router.navigate(['register']);
  }
}
