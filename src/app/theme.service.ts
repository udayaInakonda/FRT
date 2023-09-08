import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: string = 'default'; // Default theme

  constructor() {}

  setTheme(theme: string) {
    this.currentTheme = theme;
    // Save the selected theme in local storage or any other preferred storage method
  }

  getTheme() {
    // Retrieve the selected theme from local storage or any other preferred storage method
    return this.currentTheme;
  }
}