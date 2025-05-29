"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const data_source_1 = require("../config/data-source");
const user_entity_1 = require("../entities/user.entity");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
class AuthService {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
    }
    async register(registerDto) {
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
    async login(loginDto) {
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
    generateToken(user) {
        return jwt.sign({
            id: user.user_id,
            email: user.email,
            username: user.username
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    }
}
exports.AuthService = AuthService;
