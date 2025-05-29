import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req: Request, res: Response): Promise<Response> => {
        try {
            // Transform plain object to class instance
            const registerDto = plainToClass(RegisterDto, req.body);

            // Validate DTO
            const errors = await validate(registerDto);
            if (errors.length > 0) {
                return res.status(400).json({ 
                    message: 'Validation failed',
                    errors: errors.map(error => ({
                        property: error.property,
                        constraints: error.constraints
                    }))
                });
            }

            // Process registration
            const result = await this.authService.register(registerDto);
            return res.status(201).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    login = async (req: Request, res: Response): Promise<Response> => {
        try {
            // Transform plain object to class instance
            const loginDto = plainToClass(LoginDto, req.body);

            // Validate DTO
            const errors = await validate(loginDto);
            if (errors.length > 0) {
                return res.status(400).json({ 
                    message: 'Validation failed',
                    errors: errors.map(error => ({
                        property: error.property,
                        constraints: error.constraints
                    }))
                });
            }

            // Process login
            const result = await this.authService.login(loginDto);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
} 