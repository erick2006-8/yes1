import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Query,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { Response } from 'express';

interface Reserva {
  id: number;
  laboratorio: string;
  docente: string;
  hora: number;
}

interface NuevaReserva {
  laboratorio: string;
  docente: string;
  hora: number;
}

@Controller('reservas')
export class ReservasController {
  private reservas: Reserva[] = [
    { id: 1, laboratorio: 'Lab 1', docente: 'Marta Loja', hora: 8 },
    { id: 2, laboratorio: 'Lab 2', docente: 'Luis Paredes', hora: 10 },
  ];

  @Get()
  listar(@Query('laboratorio') laboratorio?: string) {
    if (laboratorio === undefined) {
      return this.reservas;
    }

    return this.reservas.filter((r) => r.laboratorio === laboratorio);
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.buscar(id);
  }

  @Post()
  crear(
    @Body() datos: NuevaReserva,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (typeof datos?.docente !== 'string' || datos.docente.trim() === '') {
      throw new BadRequestException('El docente es obligatorio');
    }

    if (
      typeof datos.laboratorio !== 'string' ||
      datos.laboratorio.trim() === ''
    ) {
      throw new BadRequestException('El laboratorio es obligatorio');
    }

    if (typeof datos.hora !== 'number' || !Number.isInteger(datos.hora)) {
      throw new BadRequestException('La hora debe ser un número entero');
    }

    const permitidos = ['Lab 1', 'Lab 2', 'Lab 3'];

    if (!permitidos.includes(datos.laboratorio)) {
      throw new UnprocessableEntityException(
        `El laboratorio "${datos.laboratorio}" no existe`,
      );
    }

    if (datos.hora < 7 || datos.hora > 18) {
      throw new UnprocessableEntityException(
        'Solo se reserva entre las 7:00 y las 18:00',
      );
    }

    const ocupado = this.reservas.some(
      (r) => r.laboratorio === datos.laboratorio && r.hora === datos.hora,
    );

    if (ocupado) {
      throw new ConflictException(
        `${datos.laboratorio} ya está reservado a las ${datos.hora}:00`,
      );
    }

    let id = 1;

    while (this.reservas.some((r) => r.id === id)) {
      id++;
    }

    const nueva: Reserva = {
      id,
      docente: datos.docente.trim(),
      laboratorio: datos.laboratorio,
      hora: datos.hora,
    };

    this.reservas.push(nueva);

    response.setHeader('Location', `/reservas/${nueva.id}`);

    return nueva;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(@Param('id', ParseIntPipe) id: number) {
    this.buscar(id);

    this.reservas = this.reservas.filter((r) => r.id !== id);
  }

  private buscar(id: number): Reserva {
    const reserva = this.reservas.find((r) => r.id === id);

    if (!reserva) {
      throw new NotFoundException(`No existe la reserva ${id}`);
    }

    return reserva;
  }
}
