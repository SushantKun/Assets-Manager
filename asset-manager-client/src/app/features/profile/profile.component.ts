import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetService, Asset } from '../../core/services/asset.service';
import { AuthService, User } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  loading = false;
  error: string | null = null;
  success: string | null = null;
  userAssets: Asset[] = [];
  userProfile: User | null = null;
  
  // Form states
  isEditingProfile = false;
  isChangingPassword = false;
  editedProfile: ProfileUpdateData = {
    firstName: '',
    lastName: '',
    email: ''
  };
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    public assetService: AssetService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserAssets();
  }

  loadUserProfile(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.userProfile = user;
        if (user) {
          this.editedProfile = {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email
          };
        }
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Failed to load user profile';
        console.error('Error loading user profile:', error);
      }
    });
  }

  loadUserAssets(): void {
    this.loading = true;
    this.error = null;

    this.assetService.getUserAssets().subscribe({
      next: (assets) => {
        this.userAssets = assets;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.userAssets = [];
        console.error('Error loading assets:', error);
      }
    });
  }

  startEditingProfile(): void {
    this.isEditingProfile = true;
    this.error = null;
    this.success = null;
  }

  cancelEditingProfile(): void {
    this.isEditingProfile = false;
    if (this.userProfile) {
      this.editedProfile = {
        firstName: this.userProfile.firstName || '',
        lastName: this.userProfile.lastName || '',
        email: this.userProfile.email
      };
    }
  }

  saveProfile(): void {
    if (!this.userProfile) return;

    this.loading = true;
    this.error = null;
    this.success = null;

    this.authService.updateProfile(this.editedProfile).subscribe({
      next: (updatedUser: User) => {
        this.userProfile = updatedUser;
        this.isEditingProfile = false;
        this.success = 'Profile updated successfully';
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Failed to update profile';
        this.loading = false;
        console.error('Error updating profile:', error);
      }
    });
  }

  startChangingPassword(): void {
    this.isChangingPassword = true;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.error = null;
    this.success = null;
  }

  cancelChangingPassword(): void {
    this.isChangingPassword = false;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  changePassword(): void {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.error = 'New passwords do not match';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    this.authService.changePassword(
      this.passwordForm.currentPassword,
      this.passwordForm.newPassword
    ).subscribe({
      next: () => {
        this.success = 'Password changed successfully';
        this.isChangingPassword = false;
        this.loading = false;
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Failed to change password';
        this.loading = false;
        console.error('Error changing password:', error);
      }
    });
  }

  editAsset(asset: Asset): void {
    this.router.navigate(['/assets/edit', asset.id]);
  }

  deleteAsset(asset: Asset): void {
    if (!confirm('Are you sure you want to delete this asset?')) {
      return;
    }

    this.loading = true;
    this.assetService.deleteAsset(asset.id).subscribe({
      next: () => {
        this.userAssets = this.userAssets.filter(a => a.id !== asset.id);
        this.loading = false;
        this.success = 'Asset deleted successfully';
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Failed to delete asset';
        this.loading = false;
        console.error('Error deleting asset:', error);
      }
    });
  }
}