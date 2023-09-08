import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import Chart from 'chart.js/auto';

// Interface for Workout object
interface Workout {
  isOutdoor: boolean;
  activity: string;
  intensity: string;
  calories: number | undefined;
  duration: number | undefined;
  distance: number | undefined;
  details: string;
  time: string;
  etime: string;
  date: string;
  weight: number | undefined;
  addAsPost: boolean;
}

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit, AfterViewInit {
  @ViewChild('lineChart') lineChartRef!: ElementRef;
  userWorkouts: Workout[] = []; 
  totalCalories: number = 0; 
  totalDistance: number = 0; 
  totalDuration:number=0;
  distanceUnitPreference: string = 'kms';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserData();
    this.loadDistanceUnitPreference();
  }
  loadDistanceUnitPreference() {
    const user = this.authService.getCurrentUserEmail();
    if (user) {
      const distancePref = localStorage.getItem(`distanceUnitPreference_${user}`);
      this.distanceUnitPreference = distancePref || 'kms'; // Set the distance unit preference to 'kms' if not found
    }
  }
  
  // Function to load user's workout data from localStorage
  loadUserData() {
    const user = this.authService.getCurrentUserEmail();
    if (user) {
      const existingWorkoutLogStr = localStorage.getItem(user);
      if (existingWorkoutLogStr) {
        const workoutLog: Workout[] = JSON.parse(existingWorkoutLogStr);
        this.userWorkouts = workoutLog;
         // Calculate total calories, total distance, and total duration for the user
        this.totalCalories = this.calculateTotalCalories();
        this.totalDistance = this.calculateTotalDistance();
        this.totalDuration = this.calculateTotalDuration();
      }
    }
  }

   // Function to calculate total calories of all workouts
  calculateTotalCalories(): number {
    return this.userWorkouts.reduce((totalCalories, workout) => totalCalories + (workout.calories || 0), 0);
  }

   // Function to calculate total distance of all workouts
  calculateTotalDistance(): number {
    return this.userWorkouts.reduce((totalDistance, workout) => totalDistance + (workout.distance || 0), 0);
  }

   // Function to calculate total duration of all workouts
  calculateTotalDuration(): number {
    return this.userWorkouts.reduce((totalDuration, workout) => totalDuration + (workout.duration || 0), 0);
  }

  ngAfterViewInit() {
    // to draw the graph after view is initialised
    this.drawLineGraph();
  }

  drawLineGraph() {
    const ctx = this.lineChartRef.nativeElement.getContext('2d');
    const monthlyData = this.getMonthlyData();
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthlyData.labels,
        datasets: [
          {
            label: 'Total Distance',
            data: monthlyData.totalDistance,
            borderColor: 'blue',
            fill: false,
          },
          {
            label: 'Total Calories',
            data: monthlyData.totalCalories,
            borderColor: 'red',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Months',
              font: { weight: 'bold' },
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value',
              font: { weight: 'bold' },
            },
          },
        },
      },
    });
  }

  getMonthlyData() {
    const monthlyData = {
      labels: [] as string[], 
      totalDistance: [] as number[], 
      totalCalories: [] as number[], 
    };

    // Map to store total distance and total calories for each month
    const monthMap = new Map<number, { totalDistance: number; totalCalories: number }>();

    // Iterate through userWorkouts to calculate monthly totals
    for (const workout of this.userWorkouts) {
      const month = new Date(workout.date).getMonth();

      if (!monthMap.has(month)) {
        monthMap.set(month, { totalDistance: 0, totalCalories: 0 });
      }

      const monthData = monthMap.get(month)!;

      if (workout.distance) {
        monthData.totalDistance += workout.distance;
      }

      if (workout.calories) {
        monthData.totalCalories += workout.calories;
      }
    }

    // Convert data from map to arrays for chart labels and datasets
    for (const [month, data] of monthMap.entries()) {
      monthlyData.labels.push(this.getMonthName(month));
      monthlyData.totalDistance.push(data.totalDistance);
      monthlyData.totalCalories.push(data.totalCalories);
    }

    return monthlyData;
  }

  // Function to get the name of the month based on its index
  getMonthName(monthIndex: number) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'];
        return months[monthIndex];
}
}