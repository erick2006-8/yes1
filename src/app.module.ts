
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma/prisma.service';
import { ReservasController } from './reservas/reservas.controller.';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [ProductsModule, PedidosModule],
  controllers: [AppController, ReservasController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
