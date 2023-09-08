import { Component,OnInit } from '@angular/core';
import { ThemeService } from '../theme.service';
import { AuthService } from '../auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  selectedTheme: string;
  showThemeSelector = false;
  profilePicture: string | null = null;
 
  constructor(private themeService: ThemeService, private router: Router,private authService: AuthService) {}
  setTheme(theme: string) {
    this.themeService.setTheme(theme);
  }

  getTheme() {
    return this.themeService.getTheme();
  }

  ngOnInit() {
    // to retrieve username from the local browser storage
    const loggedInUsername = this.authService.getCurrentUserUsername();
    if (loggedInUsername) {
      this.loadProfilePicture(loggedInUsername);
    }

  }
  // to load Profile Picture
  loadProfilePicture(username: string) {
    const storedProfilePicture = localStorage.getItem(username);
    if (storedProfilePicture) {
      this.profilePicture = storedProfilePicture;
    }
  }

  // for the theme selector to work
  toggleThemeSelector() {
    this.showThemeSelector = !this.showThemeSelector;
  }
}
