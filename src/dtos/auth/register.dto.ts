import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @Matches(/^[a-zA-Z0-9_-]*$/, {
        message: 'Username can only contain letters, numbers, underscores and hyphens'
    })
    username!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(100)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    })
    password!: string;
} 