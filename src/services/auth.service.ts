import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export class AuthService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; token: string }> {
        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
            where: [
                { email: registerDto.email },
                { username: registerDto.username }
            ]
        });

        if (existingUser) {
            throw new Error('User with this email or username already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Create new user
        const user = this.userRepository.create({
            username: registerDto.username,
            email: registerDto.email,
            password_hash: hashedPassword
        });

        await this.userRepository.save(user);

        // Generate JWT token
        const token = this.generateToken(user);

        // Return user (without password) and token
        const { password_hash, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    async login(loginDto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
        // Find user by email
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email }
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = this.generateToken(user);

        // Return user (without password) and token
        const { password_hash, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    private generateToken(user: User): string {
        const payload = {
            id: user.user_id,
            email: user.email,
            username: user.username
        };

        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const options = { expiresIn: process.env.JWT_EXPIRES_IN || '1h' };

        return jwt.sign(payload, secret, options);
    }
} 