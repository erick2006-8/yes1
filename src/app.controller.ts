import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

@Controller()
export class AppController {
  @Post('users')
  createUser(
    @Body() data: { nombre: string; email: string; password: string },
  ) {
    return {
      mensaje: 'Usuario creado',
      datos: data,
    };
  }

  @Get('users')
  getUsers() {
    return 'Lista de usuarios';
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return `Usuario ${id}`;
  }

  @Put('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body()
    data: {
      nombre: string;
      email: string;
      password: string;
    },
  ) {
    return {
      mensaje: `Usuario ${id} actualizado completamente`,
      datos: data,
    };
  }

  @Patch('users/:id')
  updateUserPartial(
    @Param('id') id: string,
    @Body()
    data: {
      nombre?: string;
      email?: string;
      password?: string;
    },
  ) {
    return {
      mensaje: `Usuario ${id} actualizado parcialmente`,
      datos: data,
    };
  }
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return `Usuario ${id} eliminado`;
  }
}
