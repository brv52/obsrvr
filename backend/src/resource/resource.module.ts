import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { DefaultResourceBase } from './default-resource.base';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ResourceController } from './resource.controller';
import { UserModule } from '../user/user.module';

@Module({
      imports: [PrismaModule, UserModule],
            providers: [ResourceService, DefaultResourceBase],
      controllers: [ResourceController]
})
export class ResourceModule {}
