import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span class="logo" routerLink="/">Asset Manager</span>
      
      <span class="spacer"></span>
      
      <ng-container *ngIf="!isLoggedIn">
        <button mat-button routerLink="/auth/login">
          <mat-icon>login</mat-icon>
          Sign In
        </button>
        <button mat-raised-button color="accent" routerLink="/auth/register">
          <mat-icon>person_add</mat-icon>
          Get Started
        </button>
      </ng-container>

      <ng-container *ngIf="isLoggedIn">
        <button mat-button routerLink="/dashboard">
          <mat-icon>dashboard</mat-icon>
          Dashboard
        </button>
        <button mat-button routerLink="/assets/upload">
          <mat-icon>cloud_upload</mat-icon>
          Upload
        </button>
        <button mat-button routerLink="/profile">
          <mat-icon>person</mat-icon>
          Profile
        </button>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Sign Out
        </button>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .logo {
      cursor: pointer;
      font-size: 20px;
      font-weight: 500;
      display: flex;
      align-items: center;
    }
    button {
      margin-left: 8px;
    }
    mat-icon {
      margin-right: 4px;
    }
  `]
})
export class NavComponent {
  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
} 