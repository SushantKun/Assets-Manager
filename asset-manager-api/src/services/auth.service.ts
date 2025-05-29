import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    async register(registerDto: RegisterDto) {
        const { username, email, password } = registerDto;

        // Check if user already exists
        const existingUser = await this.userRepository.findOne({ 
            where: [{ email }, { username }] 
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = this.userRepository.create({
            username,
            email,
            password: hashedPassword
        });

        await this.userRepository.save(user);

        return {
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };
    }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;

        // Find user
        const user = await this.userRepository.findOne({ 
            where: { username } 
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };
    }
} 