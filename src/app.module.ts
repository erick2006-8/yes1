import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ReservasController } from './reservas/reservas.controller.';
import { PedidosModule } from './pedidos/pedidos.module';
import { PrismaModule } from './prisma/prisma.modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    PedidosModule,
    PrismaModule,
  ],
  controllers: [AppController, ReservasController],
  providers: [AppService],
})
export class AppModule {}
