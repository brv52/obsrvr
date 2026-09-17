import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

export abstract class ResourceBase<T extends Prisma.InputJsonValue> {
    abstract type: string;

    constructor(protected prisma: PrismaService) {}

    async create(data: T, ownerId: string) {
        const resource = await this.prisma.resource.create({
            data: {
                type: this.type,
                ownerId,
                data
            },
        });

        await this.prisma.resourcePermission.create({
            data: {
                resourceId: resource.id,
                userId: ownerId,
                role: 'OWNER',
            },
        });

        return resource;
    }

    async canAccess(userId: string, resourceId: string, requiredRole: 'VIEWER' | 'EDITOR' | 'OWNER') {
        const user = await this.prisma.user.findUnique({where: {id: userId}});
        const adminBypass = user?.role === 'admin';
        if (adminBypass) return true;

        const perm = await this.prisma.resourcePermission.findUnique({
            where: { resourceId_userId: {resourceId, userId} },
        });

        if (!perm) return false;

        const hierarchy = ['VIEWER', 'EDITOR','OWNER'];
        return hierarchy.indexOf(perm.role) >= hierarchy.indexOf(requiredRole);
    }
}