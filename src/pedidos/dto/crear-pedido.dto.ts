import { IsInt, IsPositive } from 'class-validator';

export class CrearPedidoDto {
  @IsInt()
  @IsPositive()
  clienteId: number;

  @IsInt()
  @IsPositive()
  productoId: number;

  @IsInt()
  @IsPositive()
  cantidad: number;
}
