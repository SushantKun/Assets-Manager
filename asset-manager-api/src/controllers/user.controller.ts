import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { compare, hash } from 'bcrypt';
import { Not } from 'typeorm';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { firstName, lastName, email } = req.body;

      // Check if email is already taken by another user
      if (email) {
        const existingUser = await this.userRepository.findOne({
          where: { email, id: Not(userId) }
        });
        if (existingUser) {
          return res.status(400).json({ message: 'Email is already taken' });
        }
      }

      // Get current user
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user profile
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;

      const updatedUser = await this.userRepository.save(user);

      // Transform the response to match the frontend User interface
      const userResponse = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      };

      res.json(userResponse);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { currentPassword, newPassword } = req.body;

      // Get user
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isPasswordValid = await compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await hash(newPassword, 10);

      // Update password
      user.password = hashedPassword;
      await this.userRepository.save(user);

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Transform the response to match the frontend User interface
      const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };

      res.json(userResponse);
    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
} 