import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { WorkoutsComponent } from './workouts/workouts.component';


import { GoalsComponent } from './goals/goals.component';
import { ForumComponent } from './forum/forum.component';
import { ProfileComponent } from './profile/profile.component';
import { ProgressComponent } from './progress/progress.component';
import { HomeComponent } from './home/home.component';

import { NavbarComponent } from './navbar/navbar.component';
import { BotComponent } from './bot/bot.component';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WorkoutsComponent,
    GoalsComponent,
    ForumComponent,
    ProfileComponent,
    ProgressComponent,
    HomeComponent,

    NavbarComponent,
     BotComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    
     
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
