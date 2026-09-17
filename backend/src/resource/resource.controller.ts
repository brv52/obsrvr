import { Controller, Req, Post, UseGuards, Body, Param, Get, NotFoundException, Delete } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResourceAccessGuard } from './resource.guard';
import { CreateResourceDto } from './resource.dto';
import { InternalServerErrorException } from '@nestjs/common';

@Controller('resource')
export class ResourceController {
    constructor(private readonly resourceService: ResourceService, private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Post('createResource')
    async create(@Req() req, @Body() createResourceDto: CreateResourceDto) {
        try {
            return await this.resourceService.create(createResourceDto.data, req.user.id);
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }
    
    @UseGuards(JwtAuthGuard, ResourceAccessGuard)
    @Get('getResource/:resourceId')
    async read(@Param('resourceId') resourceId: string, @Req() req) {
        try {
            return await this.resourceService.getResource(req.user.id, resourceId, 'VIEWER');
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('getResource/all/:ownerId')
    async readAll(@Param('ownerId') ownerId: string, @Req() req) {
        try {
            return await this.resourceService.getAllResources(req.user.id, ownerId, 'VIEWER');
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }
    
    @UseGuards(JwtAuthGuard, ResourceAccessGuard)
    @Post('updateResource/:resourceId')
    async update(@Param('resourceId') resourceId: string, @Req() req, @Body() createResourceDto: Partial<CreateResourceDto>) {
        try {
            return await this.resourceService.updateResource(
                req.user.id,
                resourceId,
                "EDITOR",
                createResourceDto ?? {}
            );
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    @UseGuards(JwtAuthGuard, ResourceAccessGuard)
    @Delete('deleteResource/:resourceId')
    async deleteByDelete(@Param('resourceId') resourceId: string, @Req() req) {
        try {
            return await this.resourceService.deleteResource(
                req.user.id,
                resourceId,
                "OWNER",
            );
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    @UseGuards(JwtAuthGuard, ResourceAccessGuard)
    @Post('grantAccess/:resourceId/:targetUserId')
    async grantAccess(@Param('resourceId') resourceId: string, @Param('targetUserId') targetUserId: string, @Req() req, @Body('role') role: 'VIEWER' | 'EDITOR' | 'OWNER') {
        try {
            return await this.resourceService.grantAccess(resourceId, req.user.id, targetUserId, role);
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    @UseGuards(JwtAuthGuard, ResourceAccessGuard)
    @Post('grantAccessByEmail/:resourceId')
    async grantAccessByEmail(
        @Param('resourceId') resourceId: string,
        @Req() req,
        @Body('email') email: string,
        @Body('role') role: 'VIEWER' | 'EDITOR' | 'OWNER'
    ) {
        try {
            if (!email || !email.trim()) throw new NotFoundException('Email required');
            const user = await this.userService.getUserByEmail(email.trim());
            if (!user) throw new NotFoundException('User not found');
            return await this.resourceService.grantAccess(resourceId, req.user.id, user.id, role);
        } catch (err: any) {
            if (err instanceof NotFoundException) throw err;
            throw new InternalServerErrorException(err.message);
        }
    }

    @UseGuards(JwtAuthGuard, ResourceAccessGuard)
    @Post('removeAccess/:resourceId/:targetUserId')
    async removeAccess(@Param('resourceId') resourceId: string, @Param('targetUserId') targetUserId: string, @Req() req) {
        try {
            return await this.resourceService.removeAccess(resourceId, req.user.id, targetUserId);
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    @UseGuards(JwtAuthGuard, ResourceAccessGuard)
    @Post('removeAccessByEmail/:resourceId')
    async removeAccessByEmail(
        @Param('resourceId') resourceId: string,
        @Req() req,
        @Body('email') email: string
    ) {
        try {
            if (!email || !email.trim()) throw new NotFoundException('Email required');
            const user = await this.userService.getUserByEmail(email.trim());
            if (!user) throw new NotFoundException('User not found');
            return await this.resourceService.removeAccess(resourceId, req.user.id, user.id);
        } catch (err: any) {
            if (err instanceof NotFoundException) throw err;
            throw new InternalServerErrorException(err.message);
        }
    }

    @UseGuards(JwtAuthGuard, ResourceAccessGuard)
    @Get('getAllUsersWithRoles/:resourceId')
    async getAllUsersWithRoles(@Param('resourceId') resourceId: string, @Req() req) {
        try {
            return await this.resourceService.getAllUsersWithRoles(resourceId, req.user.id);
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }
}
