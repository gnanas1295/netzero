import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user/User';

import {setPersistence, signInWithEmailAndPassword, browserLocalPersistence} from 'firebase/auth';
import {Auth, UserCredential, sendPasswordResetEmail} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private auth: Auth = inject(Auth);
  constructor() { }

  recoverEmailPassword(email: string) : Observable<void>{
    return new Observable<void>(observer => {
      setTimeout(() => {
        if (email == "error@email.com"){
          observer.error({message: "Email not found"});
        }
        observer.next();
        observer.complete();
        },3000);
      // sendPasswordResetEmail(this.auth, email).then(() => {
      //   observer.next();
      //   observer.complete();
      // }).catch(error => {
      //   observer.error(error);
      //   observer.complete();
      // })
    })
  }

  login(email: string, password: string) : Observable<User>{
    return new Observable<User>(observer => {
      setTimeout(() => {
        if (email == "error@email.com"){
          observer.error({message: 'User not found'});
          observer.next();
        } else {
          const user = new User();
          user.email = email;
          user.id = "userId";
          observer.next(user);
        }
        observer.complete();
      }, 3000)
    })
  }
}


