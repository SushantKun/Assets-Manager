"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const register_dto_1 = require("../dtos/auth/register.dto");
const login_dto_1 = require("../dtos/auth/login.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            try {
                // Transform plain object to class instance
                const registerDto = (0, class_transformer_1.plainToClass)(register_dto_1.RegisterDto, req.body);
                // Validate DTO
                const errors = await (0, class_validator_1.validate)(registerDto);
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
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.login = async (req, res) => {
            try {
                // Transform plain object to class instance
                const loginDto = (0, class_transformer_1.plainToClass)(login_dto_1.LoginDto, req.body);
                // Validate DTO
                const errors = await (0, class_validator_1.validate)(loginDto);
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
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(401).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
