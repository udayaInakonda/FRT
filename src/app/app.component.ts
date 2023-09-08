import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { ThemeService } from './theme.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ftns';
  selectedTheme: string;
  isHomeRoute: boolean = true;
  showThemeSelector = false;
  showNavbar = false;
  profilePicture: string | null = null;
 

  constructor(private themeService: ThemeService, private router: Router,private authService: AuthService) {}


  setTheme(theme: string) {
    this.themeService.setTheme(theme);
  }

  getTheme() {
    return this.themeService.getTheme();
  }


 
  ngOnInit() {
   
    // const loggedInUsername = this.authService.getCurrentUserUsername();
    // console.log('',loggedInUsername)
    // if (loggedInUsername) {
    //   this.loadProfilePicture(loggedInUsername);
    // }

    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     if (event.url === '/login') {
    //       this.showNavbar = false;
    //     } else {
    //       this.showNavbar = true;
    //     }
    //   }
    // });
  }

  loadProfilePicture(username: string) {
    const storedProfilePicture = localStorage.getItem(username);
    if (storedProfilePicture) {
      this.profilePicture = storedProfilePicture;
    }
  }


  toggleThemeSelector() {
    this.showThemeSelector = !this.showThemeSelector;
  }


 
}
