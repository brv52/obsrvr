import { ForbiddenException, Injectable } from '@nestjs/common';
import { DefaultResourceBase } from './default-resource.base';
import { InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourceService {
    constructor(private resourceBase: DefaultResourceBase, private prisma: PrismaService) {}
    
    async create(data: any, ownerId: string) {
        try {
            return await this.resourceBase.create(data, ownerId);
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async getResource(userId: string, resourceId: string, requiredRole: 'VIEWER') {
        try {
            const access = await this.resourceBase.canAccess(userId, resourceId, requiredRole); 
            if (access)
                    return this.prisma.resource.findUnique({ 
                where: { id: resourceId },
                include: { owner: { select: { email: true } } }                        
            });
            else throw new ForbiddenException('Resource access was not guaranteed');
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async getAllResources(userId: string, ownerId: string, requiredRole: 'VIEWER') {
        try {
            const where = ownerId ? { ownerId } : {};
            const resources = await this.prisma.resource.findMany({ 
                where,
                include: { owner: { select: { email: true } } }
            });
            const accessChecks = await Promise.all(
                resources.map(resource =>
                    this.resourceBase.canAccess(userId, resource.id, requiredRole)
                )
            );
            const filtered = resources.filter((_, i) => accessChecks[i]);
            return filtered.map(resource => ({ ...resource, ownerEmail: resource.owner.email }));
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async updateResource(userId: string, resourceId: string, requiredRole: 'EDITOR', patch: Partial<any>) {
        try {
            const access = await this.resourceBase.canAccess(userId, resourceId, requiredRole); 
            if (access)
                    return this.prisma.resource.update({
                        where: { id: resourceId },
                        data: patch
                    });
            else throw new ForbiddenException('Resource access was not guaranteed');
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async deleteResource(userId: string, resourceId: string, requiredRole: 'OWNER') {
        try {
            const access = await this.resourceBase.canAccess(userId, resourceId, requiredRole);
            if (access)
                return this.prisma.resource.delete({ where: { id: resourceId } });
            else throw new ForbiddenException('Resource access was not guaranteed');
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async grantAccess(resourceId: string, ownerId: string, targetUserId: string, newRole: 'VIEWER' | 'EDITOR' | 'OWNER') {
        const access = await this.resourceBase.canAccess(ownerId, resourceId, 'OWNER');
        if (!access) throw new Error('Access denied');

        return this.prisma.resourcePermission.upsert({
            where: { resourceId_userId: {resourceId, userId: targetUserId} },
            update: { role: newRole },
            create: { resourceId, userId: targetUserId, role: newRole },
        });
    }

    async removeAccess(resourceId: string, ownerId: string, targetUserId: string) {
        const access = await this.resourceBase.canAccess(ownerId, resourceId, 'OWNER');
        if (!access) throw new Error('Access denied');
        return this.prisma.resourcePermission.delete({
            where: { resourceId_userId: { resourceId, userId: targetUserId } },
        });
    }

    async getAllUsersWithRoles(resourceId: string, ownerId: string) {
        const access = await this.resourceBase.canAccess(ownerId, resourceId, 'OWNER');
        if (!access) throw new Error('Access denied');
        const permissions = await this.prisma.resourcePermission.findMany({
            where: { resourceId },
            include: { user: { select: { email: true } } },
        });
        return permissions.map(p => ({ email: p.user.email, role: p.role }));
    }
}
