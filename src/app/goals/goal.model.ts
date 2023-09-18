export interface Goal {
  goal_name: string;
  goalduration: number;
  goaldistance: number;
  duration_progress?: number; // Add a "?" to make duration_progress optional
  distance_progress?: number;
  deadline_start:string;
  deadline_end:string;
  isExpired?: boolean;
}
