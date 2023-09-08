export interface Workout {
    isOutdoor: boolean;
    activity: string;
    intensity: string;
    duration: number;
    distance?: number;
    details: string;
    time: string;
    etime?: string;
    date: string;
    weight?: number;
    addAsPost: boolean;
    calories: number;
    userName?: string;
  }
  
export  interface FilterOption {
    label: string;
    filterFn: (workout: Workout, currentDate: Date) => boolean;
  }
  