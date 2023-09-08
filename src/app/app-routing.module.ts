import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { GoalsComponent } from './goals/goals.component';
import { ForumComponent } from './forum/forum.component';
import { ProfileComponent } from './profile/profile.component';
import { ProgressComponent } from './progress/progress.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BotComponent } from './bot/bot.component';



const routes: Routes = [
  { path: '',  component: LoginComponent},
  { path: 'login', component: LoginComponent },
  { path: 'workouts', component: WorkoutsComponent },
  { path: 'goals', component: GoalsComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'progress', component: ProgressComponent },
  { path: 'home', component: HomeComponent },
  {path:'nav',component:NavbarComponent},
  {path:'bot',component:BotComponent}
 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
