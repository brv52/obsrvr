import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../lib/types/userType';
import { userFieldConfig } from '../../lib/types/fieldConfig';


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    filterUserFields(user: any, role: 'user' | 'admin'): Partial<User> | null {
        if   (!user) return null;

        const allowedFields: Partial<User> = {};

        for (const key of Object.keys(userFieldConfig) as (keyof User)[]) {
            const field = userFieldConfig[key];
            if (field.visibleFor.includes(role) && user[key] !== undefined)
                allowedFields[key] = user[key];
        }

        return allowedFields;
    }
    
    async updateUser(userId: string, patch: Partial<User>) {
        return this.prisma.user.update({
            where: { id: userId },
            data: patch,
        });
    }
    
    async getUser(userId: string) {
        return (this.prisma.user.findUnique({ where: { id: userId } }))
    }

    async getUserByEmail(userEmail: string) {
        const cleaned = userEmail.trim();
        return this.prisma.user.findFirst({ where: { email: { equals: cleaned, mode: 'insensitive' } } });
    }

    async removeUser(userId: string) {
        return this.prisma.user.delete({ where: {id: userId} });
    }
}
