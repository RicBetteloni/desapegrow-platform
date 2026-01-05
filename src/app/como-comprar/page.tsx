import Link from 'next/link'

export default function ComoComprarPage() {
  const steps = [
    {
      number: 1,
      title: 'Crie sua conta',
      description: 'Cadastre-se gratuitamente com email e senha. Leva menos de 1 minuto!',
      icon: '👤',
      tips: [
        'Use um email válido para receber atualizações',
        'Escolha uma senha segura',
        'Complete seu perfil para ganhar pontos'
      ]
    },
    {
      number: 2,
      title: 'Navegue pelo Marketplace',
      description: 'Explore milhares de produtos usados e seminovos para cultivo indoor.',
      icon: '🔍',
      tips: [
        'Use os filtros por categoria',
        'Pesquise por palavras-chave',
        'Compare preços entre vendedores',
        'Verifique as avaliações dos vendedores'
      ]
    },
    {
      number: 3,
      title: 'Escolha o produto',
      description: 'Veja fotos, descrição completa, estado do produto e avaliações do vendedor.',
      icon: '📦',
      tips: [
        'Leia a descrição completa',
        'Confira todas as fotos',
        'Veja o perfil do vendedor',
        'Calcule o frete para sua região'
      ]
    },
    {
      number: 4,
      title: 'Adicione ao carrinho',
      description: 'Clique em "Comprar agora" ou "Adicionar ao carrinho" para prosseguir.',
      icon: '🛒',
      tips: [
        'Você pode comprar de múltiplos vendedores',
        'Revise os itens antes de finalizar',
        'Aproveite cupons de desconto se tiver'
      ]
    },
    {
      number: 5,
      title: 'Preencha o endereço',
      description: 'Informe o endereço de entrega completo e correto.',
      icon: '📍',
      tips: [
        'Confirme CEP, número e complemento',
        'Adicione referência para facilitar',
        'Você pode salvar múltiplos endereços'
      ]
    },
    {
      number: 6,
      title: 'Escolha o pagamento',
      description: 'PIX (instantâneo) ou Cartão de Crédito em até 12x sem juros.',
      icon: '💳',
      tips: [
        'PIX: aprovação instantânea',
        'Cartão: parcele em até 12x',
        'Pagamento 100% seguro via Mercado Pago',
        'Seus dados são criptografados'
      ]
    },
    {
      number: 7,
      title: 'Confirme o pedido',
      description: 'Revise tudo e confirme. Você receberá um email de confirmação.',
      icon: '✅',
      tips: [
        'Guarde o número do pedido',
        'Acompanhe em "Meus Pedidos"',
        'Você receberá atualizações por email'
      ]
    },
    {
      number: 8,
      title: 'Acompanhe a entrega',
      description: 'O vendedor enviará o código de rastreamento em até 2 dias úteis.',
      icon: '🚚',
      tips: [
        'Acompanhe pelo site dos Correios',
        'Prazo médio: 7-15 dias úteis',
        'Entre em contato com o vendedor se precisar'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#2F5F39]">Início</Link>
            <span>/</span>
            <Link href="/ajuda" className="hover:text-[#2F5F39]">Central de Ajuda</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Como Comprar</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#2F5F39] to-[#3A7347] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Como Comprar</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Siga o passo a passo e faça sua primeira compra com segurança e economia
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#2F5F39] hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Number Badge */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#2F5F39] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{step.icon}</span>
                    <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-4">{step.description}</p>

                  {/* Tips */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">💡 Dicas:</h3>
                    <ul className="space-y-1">
                      {step.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-[#2F5F39] mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Banner */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sua segurança é prioridade</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">🔒</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Pagamento Seguro</h3>
              <p className="text-gray-600">Processado via Mercado Pago com criptografia SSL</p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Vendedores Verificados</h3>
              <p className="text-gray-600">Todos os vendedores passam por validação</p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-3">🛡️</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Garantia de Entrega</h3>
              <p className="text-gray-600">Dinheiro de volta se não receber</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#2F5F39] to-[#3A7347] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl text-white/90 mb-8">Explore milhares de produtos com até 40% de desconto!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <button className="bg-white text-[#2F5F39] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition">
                Ver Marketplace
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="bg-white/10 border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition">
                Criar Conta Grátis
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
