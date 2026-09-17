import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ResourceBase } from './resource.base';

@Injectable()
export class DefaultResourceBase extends ResourceBase<Prisma.InputJsonValue> {
    type = 'default';

    constructor(protected prisma: PrismaService) {
        super(prisma);
    }
}