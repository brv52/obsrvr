import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { userFieldConfig } from '../../lib/types/fieldConfig';
import { User } from '../../lib/types/userType';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { UpdateUserDto } from './update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async updateUser(
        @Param('id') id: string,
        @Body() patch: UpdateUserDto,
        @Req() req
    ) {
        const requester = req.user;
        if (requester.id !== id && requester.role !== 'admin')
            throw new ForbiddenException('Forbidden');

        const allowedPatch: Partial<User> = {};
        for (const [key, value] of Object.entries(patch)) {
            const field = userFieldConfig[key as keyof User];
            if (!field) continue;
            if (field.editableFor.includes(req.user.role))
                allowedPatch[key as keyof User] = value as any;
        }

        if (Object.keys(allowedPatch).length <= 0)
            throw new ForbiddenException('No editable fields provided');
        const updatedUser = await this.userService.updateUser(id, allowedPatch);
        return (this.userService.filterUserFields(updatedUser, requester.role));
    }

    @Delete('deleteUser/:id')
    @UseGuards(JwtAuthGuard)
    async removeUser(@Param() userId: string, @Req() req) {
        if (req.user.id !== userId && req.user.role !== 'admin')
            throw new ForbiddenException('Forbidden');

        const res = await this.userService.removeUser(userId);
        return res;
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getUser(@Param('id') id: string, @Req() req)
    {
        const requester = req.user;
        const targetUser = await this.userService.getUser(id);
        return (this.userService.filterUserFields(targetUser, requester.role));
    }

    @UseGuards(JwtAuthGuard)
    @Get('email/:email')
    async getUserByEmail(@Param('email') email: string, @Req() req)
    {
        const requester = req.user;
        const targetUser = await this.userService.getUserByEmail(email);
        return (this.userService.filterUserFields(targetUser, requester.role));
    }
}
