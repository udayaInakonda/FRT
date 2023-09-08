import { Component,OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  signupUsers:any[]=[];
  signupObj:any={
    userName:'',
    email:'',
    password:''
  };
  loginObj:any={
    username:'',
    password:''
  };
  resetEmail: string;
  showResetForm = false;




  constructor(private router: Router){}
  ngOnInit(): void {
    const localData=localStorage.getItem('signUpUsers');
    if (localData!=null){
      this.signupUsers=JSON.parse(localData);
    }
  }
//SignUp Function
  onSignUp(){
    if (!this.signupObj.email.includes('@')) {
      alert('User registration failed, Please enter a valid email address.');
      return; // Stop the function execution if email is invalid
    }

    this.signupUsers.push(this.signupObj)
    localStorage.setItem('signUpUsers',JSON.stringify(this.signupUsers));

    this.signupObj={
      userName:'',
      email:'',
      password:''
    };
    
    alert ('User Registered Sucessfully! You can now login');
   
  }

//Login Function
  onLogin(){

    const fixedEmail = 'user@gmail.com';
    const fixedPassword = 'user';
    localStorage.setItem('loggedInUser', this.loginObj.email);
    const isUserExist=this.signupUsers.find(m=> m.email==this.loginObj.email &&
      m.password==this.loginObj.password);
    if(isUserExist!=undefined){
      alert('user login sucess');
      this.router.navigate(['/home']);
    }else if (this.loginObj.email === fixedEmail && this.loginObj.password === fixedPassword) {
      alert('user login sucess');
      this.router.navigate(['/home']);
    }
    else {
      alert('Invalid credentials');
    }
  }

//Forgot Password form
  onForgotPasswordClick(event: Event) {
    event.preventDefault(); 
    this.showResetForm = true; 
  }


//When reset Link is clicked
  sendResetLink() {
    alert('Thanks for reaching out! A reset Link will be sent to your Email shortly.');
    this.showResetForm = false; 
  }
}
