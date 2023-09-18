import { Component, OnInit } from '@angular/core';
import { Goal } from './goal.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {
  // default values
  selectedGoalType: string = 'weightLoss';
  customGoalTitle: string = '';
  duration: number | undefined;
  deadline_start: string = '';
  deadline_end:string='';
  distance: number | undefined;
  goalLog: Goal[] = [];
  tdurations: number = 0;
  tdistances: number = 0;
  isGoalFormOpen: boolean = false;
  distanceUnitPreference: string = 'kms'; // Default distance unit preference

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadGoalLog();
 
  }
  

  loadGoalLog() {
    const user = this.authService.getCurrentUserEmail();
    if (user) {
      // Load user's goals from localStorage
      const userGoalLog = localStorage.getItem(user + '-goalLog');
      if (userGoalLog) {
        this.goalLog = JSON.parse(userGoalLog);

        // Calculate progress for each goal based on date ranges
        this.goalLog.forEach((goal) => {
          const goalStartDate = new Date(goal.deadline_start);
          const goalEndDate = new Date(goal.deadline_end);

          // Filter workouts that fall within the date range of the goal
          const filteredWorkouts = this.filterWorkoutsByDate(user, goalStartDate, goalEndDate);

          // Calculate total duration and distance for filtered workouts
          const totalDuration = filteredWorkouts.reduce((sum: number, workout: any) => sum + (workout.duration || 0), 0);
          const totalDistance = filteredWorkouts.reduce((sum: number, workout: any) => sum + (workout.distance || 0), 0);

          // Calculate progress percentage
          goal.duration_progress = Math.min((totalDuration / goal.goalduration) * 100, 100);
          goal.distance_progress = Math.min((totalDistance / goal.goaldistance) * 100, 100);
        });
      }

      this.loadDistanceUnitPreference();
    }
  }

  filterWorkoutsByDate(user: string, startDate: Date, endDate: Date): any[] {
    const workoutLog = localStorage.getItem(user);
    if (workoutLog) {
      const workouts = JSON.parse(workoutLog);
      return workouts.filter((workout: any) => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= startDate && workoutDate <= endDate;
      });
    }
    return [];
  }

  // Load the user's distance unit preference from localStorage
  loadDistanceUnitPreference() {
    const user = this.authService.getCurrentUserEmail();
    if (user) {
      const distancePref = localStorage.getItem(`distanceUnitPreference_${user}`);
      this.distanceUnitPreference = distancePref || 'kms'; // Set the distance unit preference to 'kms' if not found
    }
  }

  // Method to set a new goal
  setGoal(): void {
    const user = this.authService.getCurrentUserEmail();
    if (user) {
     
      const goalTitle: string = this.selectedGoalType === 'other' ? this.customGoalTitle : this.selectedGoalType;

      if (!this.areRequiredFieldsFilled()) {
        alert('Please fill in all the required fields.');
        return;
      }

      // Create a new Goal object 
      const goal: Goal = {
        goal_name: goalTitle,
        goalduration: this.duration || 0,
        deadline_start: this.deadline_start,
        deadline_end:this.deadline_end,
        goaldistance: this.distance || 0,
       
        duration_progress: 0,
        distance_progress: 0
      };

      // Convert distance to kilometers if the preference is in miles
    

      // Add the new goal to the goalLog
      this.goalLog.push(goal);
     
      localStorage.setItem(user + '-goalLog', JSON.stringify(this.goalLog));

      
      
      this.loadGoalLog(); // Save the updated goalLog to localStorage
      this.clearForm(); 
    }
  }

  // Method to update progress for each goal in the goalLog
  private updateGoalProgress(): void {
    let remainingDuration = this.tdurations;
    let remainingDistance = this.tdistances;

   
    this.goalLog.forEach((goal) => {
      // Calculate progress percentage for duration and distance
      const goalDuration = goal.goalduration || 0;
      const durationProgress = Math.min((remainingDuration / goalDuration) * 100, 100);
      goal.duration_progress = durationProgress;

      

      const goalDistance = goal.goaldistance || 0;
      const distanceProgress = Math.min((remainingDistance / goalDistance) * 100, 100);
      goal.distance_progress = distanceProgress;

      // Update remaining duration and distance for the next iteration
      if (durationProgress === 100) {
        if (goalDuration) {
          remainingDuration -= goalDuration;
        }
      } else {
        remainingDuration -= Math.min(remainingDuration, goalDuration);
      }

      if (distanceProgress === 100) {
        if (goalDistance) {
          remainingDistance -= goalDistance;
        }
      } else {
        remainingDistance -= Math.min(remainingDistance, goalDistance);
      }
    });

    this.tdurations = remainingDuration;
    this.tdistances = remainingDistance;

    const user = this.authService.getCurrentUserEmail();
    if (user) {
      // Save the updated goalLog and remaining durations/distances to localStorage
      localStorage.setItem(user + '-goalLog', JSON.stringify(this.goalLog));

      


      localStorage.setItem('tdurations', this.tdurations.toString());
      localStorage.setItem('tdistances', this.tdistances.toString());
    }
  }

  // Method to clear the form fields
  private clearForm(): void {
    this.selectedGoalType = 'weightLoss';
    this.customGoalTitle = '';
    this.duration = undefined;
    this.deadline_start = '';
    this.deadline_end='';
    this.distance = undefined;
  }

  // Method to toggle the visibility of the goal form
  toggleGoalForm() {
    this.isGoalFormOpen = !this.isGoalFormOpen;
  }

  // Method to check if all required fields are filled
  private areRequiredFieldsFilled(): boolean {
    return (
      this.selectedGoalType.trim() !== '' &&
      (this.selectedGoalType !== 'other' || this.customGoalTitle.trim() !== '') &&
      this.duration !== undefined &&
      this.deadline_start.trim() !== '' &&
      this.deadline_end.trim() !== '' &&
      this.distance !== undefined
    );
  }


}
