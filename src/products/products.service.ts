
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

@Injectable()
export class ProductsService {
  private productos: Producto[] = [];
  private siguienteId = 1;

  // Crear producto
  create(createProductDto: CreateProductDto) {
    if (createProductDto.precio < 0) {
      throw new BadRequestException('El precio no puede ser negativo');
    }

    if (
      !Number.isInteger(createProductDto.stock) ||
      createProductDto.stock < 0
    ) {
      throw new BadRequestException(
        'El stock debe ser un entero mayor o igual a cero',
      );
    }

    const producto: Producto = {
      id: this.siguienteId++,
      nombre: createProductDto.nombre,
      descripcion: createProductDto.descripcion,
      precio: createProductDto.precio,
      stock: createProductDto.stock,
    };

    this.productos.push(producto);

    return {
      mensaje: 'Producto creado correctamente',
      datos: producto,
    };
  }

  // Listar productos
  findAll(): Producto[] {
    return this.productos;
  }

  // Buscar producto por ID
  findOne(id: number): Producto {
    this.validarId(id);

    const producto = this.productos.find((p) => p.id === id);

    if (!producto) {
      throw new NotFoundException(
        `No existe un producto con el ID ${id}`,
      );
    }

    return producto;
  }

  // Actualizar producto
  update(id: number, dto: UpdateProductDto) {
    const producto = this.findOne(id);

    if (dto.precio !== undefined && dto.precio < 0) {
      throw new BadRequestException('El precio no puede ser negativo');
    }

    if (
      dto.stock !== undefined &&
      (!Number.isInteger(dto.stock) || dto.stock < 0)
    ) {
      throw new BadRequestException(
        'El stock debe ser un entero mayor o igual a cero',
      );
    }

    Object.assign(producto, dto);

    return {
      mensaje: 'Producto actualizado correctamente',
      datos: producto,
    };
  }

  // Eliminar producto
  remove(id: number) {
    const producto = this.findOne(id);
    this.productos = this.productos.filter((p) => p.id !== producto.id);

    return {
      mensaje: `Producto ${id} eliminado correctamente`,
    };
  }

  // Verificar que el ID sea válido
  private validarId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException(
        'El ID debe ser un entero mayor que cero',
      );
    }
  }

  // Validar la cantidad solicitada
  private validarCantidad(cantidad: number): void {
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new BadRequestException(
        'La cantidad debe ser un entero mayor que cero',
      );
    }
  }

  // Consultar disponibilidad
  verificarInventario(id: number, cantidad: number) {
    const producto = this.findOne(id);
    this.validarCantidad(cantidad);

    return producto.stock >= cantidad;
  }

  // Descontar unidades del inventario
  descontarInventario(id: number, cantidad: number) {
    const producto = this.findOne(id);
    this.validarCantidad(cantidad);

    if (producto.stock < cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${producto.stock}`,
      );
    }

    producto.stock -= cantidad;

    return {
      mensaje: 'Inventario actualizado correctamente',
      datos: producto,
    };
  }
}
