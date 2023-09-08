import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Detail } from './forum.model';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  forumWorkout: any;
  newDetail: string = '';
  newImage: File | null = null; // Holds the selected image file
  details: Detail[] = [];
  isFormOpen = false;
  InUser: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const username = this.authService.getCurrentUserUsername();
    if (username !== null) {
      this.InUser = username;
    } else {
      // Handle the case when the username is null
      this.InUser = "Guest";
    }
    const user = this.authService.getCurrentUserEmail();
    if (user) {
      const existingWorkoutLogStr = localStorage.getItem('forumWorkout') || '[]';
      const existingWorkoutLog: any[] = JSON.parse(existingWorkoutLogStr);
      const forumWorkouts = existingWorkoutLog.filter(workout => workout.addAsPost);
      this.forumWorkout = forumWorkouts;
    }
    const forumDetails = localStorage.getItem('forumDetails');
    if (forumDetails) {
      this.details = JSON.parse(forumDetails);
    }
  }

  submitDetails() {
    if (this.newDetail) {
      // Create an object with InUser, the new detail, and the image (if available)
      const newDetailObject: Detail = {
        username: this.InUser,
        detail: this.newDetail,
        image: undefined, // Initialize the image property as undefined
      };

      // If there's an image selected, read it as a data URL and save it to the object
      if (this.newImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newDetailObject.image = reader.result as string; // Cast the result to string since it's a data URL
          this.details.push(newDetailObject);
          this.saveDetailsToLocalStorage();
        };
        reader.readAsDataURL(this.newImage);
      } else {
        this.details.push(newDetailObject);
        this.saveDetailsToLocalStorage();
      }

      // Reset the form fields
      this.newDetail = '';
      this.newImage = null;
    }
  }


  // Helper function to save the updated details to local storage
  private saveDetailsToLocalStorage() {
    localStorage.setItem('forumDetails', JSON.stringify(this.details));
  }

  // to open the form to add any post
  toggleForm() {
    this.isFormOpen = !this.isFormOpen;
  }

  // Function to handle the image selection from the input
  onImageSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.newImage = inputElement.files[0];
    }
  }
}
