import Link from 'next/link'

export default function ComoVenderPage() {
  const steps = [
    {
      number: 1,
      title: 'Cadastre-se como vendedor',
      description: 'Crie sua conta e ative o perfil de vendedor em menos de 5 minutos.',
      icon: '🎯',
      tips: [
        'Preencha seus dados bancários para receber pagamentos',
        'Adicione uma bio atrativa ao seu perfil',
        'Confirme seu email e telefone',
        '100% gratuito, sem mensalidade'
      ]
    },
    {
      number: 2,
      title: 'Tire boas fotos',
      description: 'Fotos de qualidade vendem até 3x mais rápido!',
      icon: '📸',
      tips: [
        'Use boa iluminação natural',
        'Mostre todos os ângulos do produto',
        'Inclua fotos de detalhes e possíveis defeitos',
        'Fundo limpo e neutro valoriza o produto',
        'Mínimo 3 fotos, máximo 8 fotos'
      ]
    },
    {
      number: 3,
      title: 'Crie seu anúncio',
      description: 'Clique em "Vender Produto" e preencha as informações.',
      icon: '📝',
      tips: [
        'Título claro e descritivo',
        'Descreva o estado real do produto',
        'Informe marca, modelo e especificações',
        'Seja honesto sobre defeitos',
        'Escolha a categoria correta'
      ]
    },
    {
      number: 4,
      title: 'Defina o preço',
      description: 'Pesquise produtos similares e defina um preço competitivo.',
      icon: '💰',
      tips: [
        'Veja preços de produtos semelhantes',
        'Considere o estado e idade do produto',
        'Preços justos vendem mais rápido',
        'Taxa de 8% já inclusa no valor',
        'Você pode editar depois se necessário'
      ]
    },
    {
      number: 5,
      title: 'Configure frete e estoque',
      description: 'Informe peso, dimensões e quantidade disponível.',
      icon: '📦',
      tips: [
        'Pese e meça o produto com embalagem',
        'Informe estoque real disponível',
        'Frete é calculado automaticamente',
        'Embale bem para evitar danos'
      ]
    },
    {
      number: 6,
      title: 'Publique o anúncio',
      description: 'Revise tudo e clique em "Publicar". Seu anúncio ficará visível imediatamente!',
      icon: '🚀',
      tips: [
        'Anúncios aparecem instantaneamente',
        'Sem custo de publicação',
        'Você pode editar a qualquer momento',
        'Receba notificações de visualizações'
      ]
    },
    {
      number: 7,
      title: 'Receba pedidos',
      description: 'Quando alguém comprar, você receberá notificação por email e no app.',
      icon: '🔔',
      tips: [
        'Confirme o pedido em até 24h',
        'Prepare o produto para envio',
        'Responda dúvidas rapidamente',
        'Mantenha comunicação com o comprador'
      ]
    },
    {
      number: 8,
      title: 'Envie o produto',
      description: 'Embale com cuidado e envie pelos Correios em até 2 dias úteis.',
      icon: '📮',
      tips: [
        'Embale com bastante proteção',
        'Guarde o código de rastreamento',
        'Envie para o comprador via chat',
        'Atualize o status do pedido'
      ]
    },
    {
      number: 9,
      title: 'Receba seu pagamento',
      description: 'O dinheiro é liberado automaticamente 14 dias após a confirmação de entrega.',
      icon: '💸',
      tips: [
        'Pagamento direto na sua conta',
        'Sem burocracia',
        'Acompanhe em "Minhas Vendas"',
        'Nota fiscal opcional'
      ]
    }
  ]

  const benefits = [
    {
      icon: '🆓',
      title: 'Anúncios Grátis',
      description: 'Sem custo de cadastro ou mensalidade'
    },
    {
      icon: '📈',
      title: 'Milhares de compradores',
      description: 'Acesso ao maior público grow do Brasil'
    },
    {
      icon: '💳',
      title: 'Pagamento Garantido',
      description: 'Receba via Mercado Pago com segurança'
    },
    {
      icon: '⭐',
      title: 'Reputação Transparente',
      description: 'Avaliações ajudam a vender mais'
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
            <span className="text-gray-900 font-medium">Como Vender</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#2F5F39] to-[#3A7347] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <div className="text-6xl mb-4">💰</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Como Vender</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Transforme seus equipamentos parados em dinheiro de forma rápida e segura
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-block">
            <p className="text-2xl font-bold">Taxa de apenas 8%</p>
            <p className="text-sm text-white/80">sobre vendas concluídas</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="text-4xl mb-3">{benefit.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-[1280px] mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Passo a Passo</h2>
        
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#2F5F39] hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#2F5F39] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {step.number}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{step.icon}</span>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-4">{step.description}</p>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">💡 Dicas:</h4>
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

      {/* Pricing */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quanto você ganha?</h2>
          
          <div className="bg-gradient-to-r from-[#2F5F39] to-[#3A7347] rounded-2xl p-8 text-white max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <p className="text-xl mb-2">Exemplo prático:</p>
              <p className="text-5xl font-bold mb-2">R$ 500</p>
              <p className="text-white/80">Preço de venda</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span>Valor do produto</span>
                <span className="font-semibold">R$ 500,00</span>
              </div>
              <div className="flex justify-between items-center text-white/80">
                <span>Taxa Desapegrow (8%)</span>
                <span>- R$ 40,00</span>
              </div>
              <div className="border-t border-white/20 pt-3 flex justify-between items-center text-2xl font-bold">
                <span>Você recebe</span>
                <span>R$ 460,00</span>
              </div>
            </div>

            <p className="text-center text-white/80 text-sm mt-6">
              * Frete pago pelo comprador • Pagamento em 14 dias após entrega
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#2F5F39] to-[#3A7347] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para vender?</h2>
          <p className="text-xl text-white/90 mb-8">Comece agora e transforme seus equipamentos em dinheiro!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vendedor/produtos/novo">
              <button className="bg-white text-[#2F5F39] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition">
                Criar Primeiro Anúncio
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="bg-white/10 border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition">
                Cadastrar como Vendedor
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
