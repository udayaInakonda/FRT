import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private readonly userKey = 'signUpUsers';

  constructor() {}


  getCurrentUserUsername(): string | null {
    const localData = localStorage.getItem(this.userKey);
    if (localData) {
      const signupUsers = JSON.parse(localData);
      const currentUser = signupUsers.find((user: any) => user.email === localStorage.getItem('loggedInUser'));
      if (currentUser) {
        return currentUser.userName; // Return the username instead of email
      }
    }
    return null;
  }

  getCurrentUserEmail(): string | null {
    const localData = localStorage.getItem(this.userKey);
    if (localData) {
      const signupUsers = JSON.parse(localData);
      const currentUser = signupUsers.find((user: any) => user.email === localStorage.getItem('loggedInUser'));
      if (currentUser) {
        return currentUser.email;
      }
    }
    return null;
  }

  logout() {

    localStorage.removeItem('userToken');
    localStorage.removeItem('loggedInUser'); 
  }
 
}
