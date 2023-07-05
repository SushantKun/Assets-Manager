import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { UploadComponent } from './features/assets/components/upload/upload.component';
import { ProfileComponent } from './features/profile/profile.component';
import { EditAssetComponent } from './features/assets/components/edit/edit.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'assets',
    children: [
      { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
      { path: 'edit/:id', component: EditAssetComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
