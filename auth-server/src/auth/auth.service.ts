import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, Role } from '../schemas/user.schema';
import { LoginResponseDto, TokenResponseDto, UserResponseDto, RoleResponseDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    // JWT 토큰 생성
    private generateTokens(userId: string, role: Role): { accessToken: string; refreshToken: string } {
        const payload = { id: userId, role };

        return {
            accessToken: this.jwtService.sign(payload, {
                expiresIn: '1h',
            }),
            refreshToken: this.jwtService.sign(payload, {
                expiresIn: '14d',
            }),
        };
    }

    // 비밀번호 해싱
    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    // 로그인
    async login(id: string, password: string): Promise<LoginResponseDto> {
        const user = await this.userModel.findOne({ id });

        if (!user) {
            throw new UnauthorizedException('사용자가 존재하지 않습니다');
        }

        if (!password || !user.password) {
            throw new UnauthorizedException('유효하지 않은 비밀번호입니다');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
        }

        const tokens = this.generateTokens(user.id, user.role);

        // 리프레시 토큰 저장
        user.refreshToken = tokens.refreshToken;
        await user.save();

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                name: user.name,
            },
        };
    }

    // 토큰 재발급
    async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
        try {
            // JWT 검증
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userModel.findOne({ id: payload.sub, refreshToken });

            if (!user) {
                throw new UnauthorizedException('유효하지 않은 토큰입니다');
            }

            const newAccessToken = this.jwtService.sign(
                { id: user.id, role: user.role },
                { expiresIn: '1h' },
            );

            return { accessToken: newAccessToken };
        } catch (error) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다');
        }
    }

    // 사용자 생성
    async createUser(id: string, name: string, password: string, role: Role): Promise<UserResponseDto> {
        const existingUser = await this.userModel.findOne({ id });
        if (existingUser) {
            throw new ConflictException('이미 존재하는 사용자 ID입니다');
        }

        if (!password) {
            throw new BadRequestException('비밀번호는 필수 입력값입니다');
        }

        const hashedPassword = await this.hashPassword(password);

        const newUser = new this.userModel({
            id,
            name,
            password: hashedPassword,
            role,
        });
        await newUser.save();

        return {
            id: newUser.id,
            name: newUser.name,
            role: newUser.role,
        };
    }

    // 사용자 역할 변경
    async updateUserRole(id: string, role: Role): Promise<RoleResponseDto> {
        const user = await this.userModel.findOne({ id });

        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다');
        }

        user.role = role;
        await user.save();

        return {
            id: user.id,
            role: user.role,
        };
    }
} 