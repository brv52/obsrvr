import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ResourceAccessGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const resourceId = request.params.resourceId;
        const requiredRole = Reflect.getMetadata('requiredRole', context.getHandler());

        if (user.role === 'admin') return true;

        const permission = await this.prisma.resourcePermission.findUnique({
            where: { resourceId_userId: { resourceId, userId: user.id } },
        });

        if (!permission) return false;

        const hierarchy = ['VIEWER', 'EDITOR', 'OWNER'];
        return hierarchy.indexOf(permission.role) >= hierarchy.indexOf(requiredRole);
    }
}