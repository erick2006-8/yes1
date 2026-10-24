
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Verificar inventario: primero las rutas específicas
  @Get(':id/inventory')
  verificarInventario(
    @Param('id', ParseIntPipe) id: number,
    @Query('cantidad', ParseIntPipe) cantidad: number,
  ) {
    return {
      disponible: this.productsService.verificarInventario(id, cantidad),
    };
  }

  // Descontar inventario
  @Patch(':id/inventory')
  descontarInventario(
    @Param('id', ParseIntPipe) id: number,
    @Body('cantidad', ParseIntPipe) cantidad: number,
  ) {
    return this.productsService.descontarInventario(id, cantidad);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
