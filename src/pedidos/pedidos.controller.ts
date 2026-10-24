import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { PedidosService } from './pedidos.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  crear(@Body() dto: CrearPedidoDto) {
    return this.pedidosService.crear(dto);
  }

  @Get()
  listar() {
    return this.pedidosService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.buscarPorId(id);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: 'ENTREGADO' | 'NEGADO',
  ) {
    return this.pedidosService.cambiarEstado(id, estado);
  }
}
