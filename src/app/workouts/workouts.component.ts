import { Component,OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import { Workout } from './workouts.model';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit {
  isOutdoorFormOpen = false;
  isIndoorFormOpen = false;
  weightUnitPreference: string = 'kgs'; 
  distanceUnitPreference: string = 'kms';
  InUser:string; 
 
  // outdoor form fields
  outdoorActivity = '';
  outdoorIntensity = '';
  outdoorDuration: number | undefined;
  outdoorDistance: number | undefined;
  outdoorDetails = '';
  outdoorTime = '';
  endTime = '';
  outdoorDate = '';
  outWeight: number | undefined;
  addAsPost = false;

   // Indoor form fields
  indoorActivity = '';
  indoorIntensity = '';
  indoorDuration: number | undefined;
  indoorDetails = '';
  indoorTime = '';
  indoorEndTime = '';
  indoorDate = '';
  inWeight: number | undefined;
  addIndoorAsPost = false;

  workoutLog: Workout[] = [];
  showWorkoutLog = true;
  filteredWorkouts: Workout[] = [];

// constructor to load all the values intitally from the local browser storage
  constructor(private authService: AuthService) {
    this.loadWorkoutLog();
    this.loadWeightUnitPreference();
    this.loadDistanceUnitPreference();
  }
  ngOnInit(): void {
    const username = this.authService.getCurrentUserUsername();
    if (username !== null) {
      this.InUser = username;
    } else {
      // Handle the case when the username is null (optional)
      this.InUser = "Guest"; // or any other default value
    }
    
  }


  // to load weightUnit Preference from the local browser storage
  loadWeightUnitPreference() {
    const user = this.authService.getCurrentUserEmail();
    if (user) {
      const weightPref = localStorage.getItem(`weightUnitPreference_${user}`);
      this.weightUnitPreference = weightPref || 'kgs';
    }
  }

   // to load Distance unit Preference from the local browser storage
  loadDistanceUnitPreference() {
    const user = this.authService.getCurrentUserEmail();
    if (user) {
      const distancePref = localStorage.getItem(`distanceUnitPreference_${user}`);
      this.distanceUnitPreference = distancePref || 'kms';
    }
  }


  // to submit outdoor form
  submitOutdoorForm() {
    const user = this.authService.getCurrentUserEmail();
    if (user) {
      if (!this.areRequiredFieldsFilled(true)) {
        alert('Please fill all required fields *');
        return;
      }
      const workout = this.createWorkout(true, this.outdoorActivity, this.outdoorIntensity, this.outdoorDuration, this.outdoorDistance, this.outdoorDetails, this.outdoorTime, this.endTime, this.outdoorDate, this.outWeight, this.addAsPost);
      this.addWorkoutToLog(user, workout);
      this.resetOutdoorFormFields();
      this.saveCaloriesBurned(workout.calories);
    }
    alert('workout added Successfully, Scroll down to view the workout Log')
  }

// to submit indoor form
  submitIndoorForm() {
    const user = this.authService.getCurrentUserEmail();
    if (user) {
      if (!this.areRequiredFieldsFilled(false)) {
        alert('Please fill all required fields');
        return;
      }
      const workout = this.createWorkout(false, this.indoorActivity, this.indoorIntensity, this.indoorDuration, undefined, this.indoorDetails, this.indoorTime, this.indoorEndTime, this.indoorDate, this.inWeight, this.addIndoorAsPost);
      this.addWorkoutToLog(user, workout);
      this.resetIndoorFormFields();
      this.saveCaloriesBurned(workout.calories);
    }
    alert('workout added Successfully, Scroll down to view the workout Log')
  }

  // Create a Workout object 
  createWorkout(
    isOutdoor: boolean,
    activity: string,
    intensity: string,
    duration: number | undefined,
    distance: number | undefined,
    details: string,
    time: string,
    etime: string,
    date: string,
    weight: number | undefined,
    addAsPost: boolean
  ): Workout {
    const calories = this.calculateCaloriesBurned(activity, intensity, duration || 0, weight || 0);
    return {
      isOutdoor,
      activity,
      intensity,
      duration: duration || 0,
      distance,
      details,
      time,
      etime,
      date,
      weight,
      addAsPost,
      calories
    };
  }

  // Add a workout to the user's workout log
  addWorkoutToLog(user: string, workout: Workout) {
    const loggedIn = this.authService.getCurrentUserUsername();
    console.log('',loggedIn)
    const existingWorkoutLogStr = localStorage.getItem(user) || '[]';
    const existingWorkoutLog: Workout[] = JSON.parse(existingWorkoutLogStr);
    
    // Add the new workout to the log
    existingWorkoutLog.push(workout);
    localStorage.setItem(user, JSON.stringify(existingWorkoutLog));
    this.workoutLog = existingWorkoutLog;
    workout.userName = this.InUser;

    // Update the filteredWorkouts array after adding the new workout
    this.filterWorkoutsByDate();
    const forumWorkout = JSON.parse(localStorage.getItem('forumWorkout') || '[]');
    if (workout.addAsPost) {
      forumWorkout.push(workout);
    }
    localStorage.setItem('forumWorkout', JSON.stringify(forumWorkout));
  }

// Save the calculated calories burned to local storage
  saveCaloriesBurned(calories: number) {
    localStorage.setItem('calories', calories.toString());
  }


// Reset the outdoor form fields t
  resetOutdoorFormFields() {
    this.outdoorActivity = '';
    this.outdoorIntensity = '';
    this.outdoorDuration = undefined;
    this.outdoorDistance = undefined;
    this.outdoorDetails = '';
    this.outdoorTime = '';
    this.endTime = '';
    this.outdoorDate = '';
    this.outWeight = undefined;
    this.addAsPost = false;
  }

  // Reset the indoor form fields
  resetIndoorFormFields() {
    this.indoorActivity = '';
    this.indoorIntensity = '';
    this.indoorDuration = undefined;
    this.indoorDetails = '';
    this.indoorTime = '';
    this.indoorEndTime = '';
    this.indoorDate = '';
    this.inWeight = undefined;
    this.addIndoorAsPost = false;
  }

  openOutdoorForm() {
    this.isOutdoorFormOpen = true;
    this.isIndoorFormOpen = false;
  }

  openIndoorForm() {
    this.isOutdoorFormOpen = false;
    this.isIndoorFormOpen = true;
  }

  loadWorkoutLog() {
    const user = this.authService.getCurrentUserEmail();
    if (user) {
      const existingWorkoutLogStr = localStorage.getItem(user) || '[]';
      this.workoutLog = JSON.parse(existingWorkoutLogStr);
      this.filteredWorkouts = this.workoutLog;
      this.showWorkoutLog = true;
    }
  }
  
  // to filter the workouts based on date
startDate: string;
endDate: string;

  filterWorkoutsByDate() {
    if (!this.startDate || !this.endDate) {
      this.filteredWorkouts = this.workoutLog;
      return;
    }
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    this.filteredWorkouts = this.workoutLog.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= start && workoutDate <= end;
    });
  }
  

  // Calculate the calories
  calculateCaloriesBurned(
    activity: string,
    intensity: string,
    duration: number,
    weight: number
  ): number {
    const metLookup: { [key: string]: { [key: string]: number } } = {
      Outdoor: { High: 5, Moderate: 3.5, Low: 2.5 },
      Indoor: { High: 2.8, Moderate: 2.3, Low: 1.6 }
    };

    let weightInKgs = weight;
    if (this.weightUnitPreference === 'lbs') {
      // Convert weight to kilograms
      weightInKgs = weight * 0.453592;
    }
    const met = metLookup[this.isOutdoorFormOpen ? 'Outdoor' : 'Indoor']?.[intensity] || 0;
    return (duration * met * weightInKgs) / 200;
  }


  toggleOutdoorForm() {
    this.isOutdoorFormOpen = !this.isOutdoorFormOpen;
  }


  toggleIndoorForm() {
    this.isIndoorFormOpen = !this.isIndoorFormOpen;
  }


  // Check if the required form fields are filled 
  private areRequiredFieldsFilled(isOutdoor: boolean): boolean {
    if (isOutdoor) {
      return (
        this.outdoorActivity.trim() !== '' &&
        this.outdoorIntensity.trim() !== '' &&
        this.outdoorDuration !== undefined &&
        this.outdoorDate.trim() !== ''
      );
    }  return (
      this.indoorActivity.trim() !== '' &&
      this.indoorIntensity.trim() !== '' &&
      this.indoorDuration !== undefined &&
      this.indoorEndTime.trim() !== '' && 
      this.indoorDate.trim() !== ''
    );
  }
    
  }

