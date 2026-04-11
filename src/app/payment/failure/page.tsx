import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export default function PaymentFailurePage({
  searchParams
}: {
  searchParams?: { orderId?: string }
}) {
  const orderId = searchParams?.orderId

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-xl text-center space-y-6">
        <XCircle className="w-20 h-20 text-red-600 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-900">Pagamento não concluído</h1>
        <p className="text-gray-600">
          Não foi possível confirmar o seu pagamento. Você pode tentar novamente.
        </p>

        {orderId && (
          <p className="text-xs text-gray-500">Pedido: {orderId}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/checkout" className="w-full">
            <Button className="w-full">Tentar novamente</Button>
          </Link>
          <Link href="/marketplace" className="w-full">
            <Button variant="outline" className="w-full">Voltar ao marketplace</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
