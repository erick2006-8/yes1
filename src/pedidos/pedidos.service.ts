import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearPedidoDto) {
    return this.prisma.$transaction(async (tx) => {
      const producto = await tx.producto.findUnique({
        where: { id: dto.productoId },
      });

      if (!producto) {
        throw new UnprocessableEntityException('El producto no existe');
      }

      const pendiente = await tx.pedido.findFirst({
        where: {
          clienteId: dto.clienteId,
          productoId: dto.productoId,
          estado: 'PENDIENTE',
        },
      });

      if (pendiente) {
        throw new ConflictException(
          'El cliente ya tiene un pedido pendiente de este producto',
        );
      }

      const actualizado = await tx.producto.updateMany({
        where: {
          id: dto.productoId,
          stock: { gte: dto.cantidad },
        },
        data: {
          stock: { decrement: dto.cantidad },
        },
      });

      if (actualizado.count === 0) {
        throw new UnprocessableEntityException('Stock insuficiente');
      }

      return tx.pedido.create({
        data: {
          clienteId: dto.clienteId,
          productoId: dto.productoId,
          cantidad: dto.cantidad,
        },
      });
    });
  }

  async listar() {
    return this.prisma.pedido.findMany({
      include: { producto: true },
    });
  }

  async buscarPorId(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { producto: true },
    });

    if (!pedido) {
      throw new UnprocessableEntityException('El pedido no existe');
    }

    return pedido;
  }

  async cambiarEstado(id: number, estado: 'ENTREGADO' | 'NEGADO') {
    if (!['ENTREGADO', 'NEGADO'].includes(estado)) {
      throw new UnprocessableEntityException('Estado inválido');
    }

    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
    });

    if (!pedido) {
      throw new UnprocessableEntityException('El pedido no existe');
    }

    if (pedido.estado !== 'PENDIENTE') {
      throw new ConflictException('Solo se pueden cambiar pedidos pendientes');
    }

    return this.prisma.pedido.update({
      where: { id },
      data: { estado },
    });
  }
}
