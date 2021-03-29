import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { EventsGateway } from './event/service/event-gateway.service';

@Module({
    imports: [
        UserModule,
    ],
    controllers: [],
    providers: [
        EventsGateway,
    ],
    exports: [
        EventsGateway,
    ]
})
export class WebsoketModule { }
