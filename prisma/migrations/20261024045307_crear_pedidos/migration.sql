-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'ENTREGADO', 'NEGADO');

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE',
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pedido_clienteId_estado_productoId_idx" ON "Pedido"("clienteId", "estado", "productoId");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
