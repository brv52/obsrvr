import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    private signToken(user: any): string {
        const { password, createdAt, ...safeUser } = user;
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        return jwt.sign(
            payload,
            process.env.JWT_KEY,
            { 
                algorithm: 'HS256',
                expiresIn: '1h'
            }
        );
    }

    async register(email: string, password: string) {
        if (!email || !password) throw new BadRequestException('Email and password are required');
        const p_hashed = await bcrypt.hash(password, 10);

        try {
            const user = await this.prisma.user.create({
                data: { email, password: p_hashed },
            });

            const token = this.signToken(user);

            return { token };
        } catch (err) {
            if (err.code === 'P2002') throw new ConflictException('Email already registered');
            throw err;
        }
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: {email} });
        if (!user) throw new UnauthorizedException('Invalid email or password');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('Invalid email or password');
        if (!email || !password) throw new UnauthorizedException('Email and password are required');

        const token = this.signToken(user);
        return { token };
    }
}
