import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profilePicture: string | null = null; 
  username: string = ''; 
  email: string = ''; 
  weightUnitPreference: string = 'kgs'; 
  distanceUnitPreference: string = 'kms'; 
  constructor(private authService: AuthService,private router:Router) {}

  ngOnInit(): void {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    const signUpUsersData = localStorage.getItem('signUpUsers');
    if (loggedInUserEmail && signUpUsersData) {
      const signUpUsers = JSON.parse(signUpUsersData);
      const loggedInUser = signUpUsers.find((user: any) => user.email === loggedInUserEmail);
      if (loggedInUser) {
        this.username = loggedInUser.userName;
        this.email = loggedInUser.email;
        this.loadProfilePicture(this.username);

        // Load user's preferences from localStorage (if they exist)
        const weightPref = localStorage.getItem(`weightUnitPreference_${this.email}`);
        const distancePref = localStorage.getItem(`distanceUnitPreference_${this.email}`);
        if (weightPref) {
          this.weightUnitPreference = weightPref;
        }
        if (distancePref) {
          this.distanceUnitPreference = distancePref;
        }
      }
    }
  }


//  Function to upload profile picture
  uploadProfilePicture(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profilePicture = e.target.result;
      if (this.username) {
        this.saveProfilePicture(this.username, e.target.result); // Save using the username
      }
    };
    reader.readAsDataURL(file);
  }


  // to load the profile picture if it is already there
  loadProfilePicture(username: string) {
    const storedProfilePicture = localStorage.getItem(username); // Retrieve using the username
    if (storedProfilePicture) {
      this.profilePicture = storedProfilePicture;
    }
  }

  // saving profile picture based on the username
  saveProfilePicture(username: string, picture: string) {
    localStorage.setItem(username, picture); 
  }

  onSubmit() {
    // Save user's preferences to localStorage using the email as the key
    localStorage.setItem(`weightUnitPreference_${this.email}`, this.weightUnitPreference);
    localStorage.setItem(`distanceUnitPreference_${this.email}`, this.distanceUnitPreference);
    alert('Preferences Submitted Successfully');
  }


  // sweetalert for the logout
  osalert(){
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Log out ',
      cancelButtonText: 'No, keep me in'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
         this.router.navigate(['/login'])
      
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Login Redirected',
          'You are still in :)',
          'success'
        )
      }
    })
  }

  // to reload the applicaton when user submits Profile picture
  ProfilePicture(){
  window.location.reload();
  }

}
