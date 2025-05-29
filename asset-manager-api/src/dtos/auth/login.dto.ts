import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;
} 