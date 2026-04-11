import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock3 } from 'lucide-react'

export default function PaymentPendingPage({
  searchParams
}: {
  searchParams?: { orderId?: string }
}) {
  const orderId = searchParams?.orderId

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-xl text-center space-y-6">
        <Clock3 className="w-20 h-20 text-amber-600 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-900">Pagamento pendente</h1>
        <p className="text-gray-600">
          Seu pagamento está em análise. Assim que for aprovado, seu pedido será atualizado automaticamente.
        </p>

        {orderId && (
          <p className="text-xs text-gray-500">Pedido: {orderId}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/meus-pedidos" className="w-full">
            <Button className="w-full">Ver meus pedidos</Button>
          </Link>
          <Link href="/marketplace" className="w-full">
            <Button variant="outline" className="w-full">Continuar comprando</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
