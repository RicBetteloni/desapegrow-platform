import { OrderStatus, ProductStatus, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function simulateApprovedWebhook(orderId: string) {
  await prisma.$transaction(async tx => {
    const claimed = await tx.order.updateMany({
      where: {
        id: orderId,
        status: OrderStatus.PENDING
      },
      data: {
        status: OrderStatus.PROCESSING
      }
    })

    if (claimed.count === 0) {
      return { applied: false }
    }

    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    })

    if (!order) {
      throw new Error(`Pedido ${orderId} não encontrado`)
    }

    for (const item of order.items) {
      const stockUpdated = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: { gte: item.quantity }
        },
        data: {
          stock: { decrement: item.quantity }
        }
      })

      if (stockUpdated.count === 0) {
        throw new Error(
          `Estoque insuficiente ao confirmar pagamento para produto ${item.productId}`
        )
      }

      const currentProduct = await tx.product.findUnique({
        where: { id: item.productId },
        select: { stock: true }
      })

      if (currentProduct && currentProduct.stock === 0) {
        await tx.product.update({
          where: { id: item.productId },
          data: { status: ProductStatus.INACTIVE }
        })
      }
    }

    return { applied: true }
  })
}

async function simulateCanceledWebhook(orderId: string) {
  await prisma.order.updateMany({
    where: {
      id: orderId,
      status: OrderStatus.PENDING
    },
    data: {
      status: OrderStatus.CANCELED
    }
  })
}

async function main() {
  console.log('🧪 Teste de fluxo pagamento + estoque (simulação)')

  const user =
    (await prisma.user.findUnique({ where: { email: 'joao@msn.com' } })) ||
    (await prisma.user.findFirst())

  if (!user) {
    throw new Error('Nenhum usuário encontrado para teste')
  }

  const product = await prisma.product.findFirst({
    where: {
      stock: { gte: 2 },
      status: ProductStatus.ACTIVE
    },
    orderBy: { updatedAt: 'desc' }
  })

  if (!product) {
    throw new Error('Nenhum produto ativo com estoque >= 2 encontrado')
  }

  const qty = 2
  const initialStock = product.stock

  console.log(`👤 Usuário: ${user.email}`)
  console.log(`📦 Produto: ${product.name}`)
  console.log(`📊 Estoque inicial: ${initialStock}`)

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: OrderStatus.PENDING,
      items: {
        create: {
          productId: product.id,
          quantity: qty,
          price: product.price
        }
      }
    },
    include: { items: true }
  })

  const stockAfterOrder = await prisma.product.findUnique({
    where: { id: product.id },
    select: { stock: true }
  })

  console.log(`🧾 Pedido criado: ${order.id} (status ${order.status})`)
  console.log(`📊 Estoque após criar pedido: ${stockAfterOrder?.stock}`)

  if (stockAfterOrder?.stock !== initialStock) {
    throw new Error('Falha: estoque mudou antes da aprovação')
  }

  await simulateApprovedWebhook(order.id)

  const afterApproval = await prisma.product.findUnique({
    where: { id: product.id },
    select: { stock: true, status: true }
  })

  const orderAfterApproval = await prisma.order.findUnique({
    where: { id: order.id },
    select: { status: true }
  })

  console.log(`✅ Após aprovação:`)
  console.log(`   - Status do pedido: ${orderAfterApproval?.status}`)
  console.log(`   - Estoque: ${afterApproval?.stock}`)

  const expectedStock = initialStock - qty
  if (afterApproval?.stock !== expectedStock) {
    throw new Error(
      `Falha: estoque esperado ${expectedStock}, encontrado ${afterApproval?.stock}`
    )
  }

  // Reprocesso idempotente (simula webhook duplicado)
  await simulateApprovedWebhook(order.id)

  const afterDuplicate = await prisma.product.findUnique({
    where: { id: product.id },
    select: { stock: true }
  })

  if (afterDuplicate?.stock !== expectedStock) {
    throw new Error('Falha: webhook duplicado debitou estoque novamente')
  }

  console.log(`🛡️ Reprocesso idempotente ok: estoque permaneceu em ${afterDuplicate?.stock}`)

  // Cenário cancelado: não deve debitar estoque
  const cancelOrder = await prisma.order.create({
    data: {
      userId: user.id,
      status: OrderStatus.PENDING,
      items: {
        create: {
          productId: product.id,
          quantity: 1,
          price: product.price
        }
      }
    }
  })

  const stockBeforeCancel = await prisma.product.findUnique({
    where: { id: product.id },
    select: { stock: true }
  })

  await simulateCanceledWebhook(cancelOrder.id)

  const stockAfterCancel = await prisma.product.findUnique({
    where: { id: product.id },
    select: { stock: true }
  })

  const orderAfterCancel = await prisma.order.findUnique({
    where: { id: cancelOrder.id },
    select: { status: true }
  })

  if (stockAfterCancel?.stock !== stockBeforeCancel?.stock) {
    throw new Error('Falha: pedido cancelado alterou estoque')
  }

  if (orderAfterCancel?.status !== OrderStatus.CANCELED) {
    throw new Error('Falha: pedido cancelado não ficou com status CANCELED')
  }

  console.log('🚫 Cenário cancelado ok: status CANCELED sem alterar estoque')
  console.log('🎉 Teste concluído com sucesso!')
}

main()
  .catch(error => {
    console.error('❌ Erro no teste:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
