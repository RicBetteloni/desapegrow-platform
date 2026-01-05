'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function CentralAjudaPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const faqs = [
    {
      category: 'Compras',
      questions: [
        {
          q: 'Como faço para comprar um produto?',
          a: 'Navegue pelo marketplace, escolha o produto, clique em "Comprar agora" e siga o processo de checkout. Você pode pagar via PIX ou cartão de crédito.'
        },
        {
          q: 'Quais são as formas de pagamento?',
          a: 'Aceitamos PIX (instantâneo) e cartões de crédito em até 12x. O pagamento é processado através do Mercado Pago com total segurança.'
        },
        {
          q: 'Como acompanho meu pedido?',
          a: 'Acesse "Meus Pedidos" no menu do seu perfil para ver o status atualizado de todos os seus pedidos e o código de rastreamento.'
        },
        {
          q: 'Qual o prazo de entrega?',
          a: 'O prazo varia conforme a localização do vendedor e do comprador. A média é de 7-15 dias úteis. Você verá o prazo estimado antes de finalizar a compra.'
        }
      ]
    },
    {
      category: 'Vendas',
      questions: [
        {
          q: 'Como me torno um vendedor?',
          a: 'Cadastre-se gratuitamente e acesse "Vender Produto" no menu. Preencha seus dados de vendedor e comece a anunciar seus equipamentos.'
        },
        {
          q: 'Quanto custa anunciar?',
          a: 'O cadastro e anúncios são GRATUITOS. Cobramos apenas uma pequena taxa de 8% sobre vendas concluídas, já incluída no valor do produto.'
        },
        {
          q: 'Como recebo o pagamento?',
          a: 'Os pagamentos são liberados automaticamente na sua conta bancária cadastrada em até 14 dias após a confirmação de entrega pelo comprador.'
        },
        {
          q: 'Posso cancelar um anúncio?',
          a: 'Sim! Acesse "Meus Anúncios" e você pode pausar, editar ou excluir seus anúncios a qualquer momento.'
        }
      ]
    },
    {
      category: 'Conta e Segurança',
      questions: [
        {
          q: 'Como altero minha senha?',
          a: 'Acesse "Meu Perfil", clique em "Segurança" e escolha "Alterar Senha". Você receberá um email de confirmação.'
        },
        {
          q: 'O Desapegrow é seguro?',
          a: 'Sim! Usamos criptografia SSL, autenticação segura e processamento de pagamentos via Mercado Pago. Nunca compartilhamos seus dados pessoais.'
        },
        {
          q: 'Como denuncio um anúncio suspeito?',
          a: 'Clique em "Denunciar" na página do produto. Nossa equipe analisa todas as denúncias em até 24h e toma as ações necessárias.'
        }
      ]
    },
    {
      category: 'Gamificação',
      questions: [
        {
          q: 'Como funcionam os pontos Grow?',
          a: 'Ganhe pontos fazendo login diariamente, comprando, vendendo e interagindo na plataforma. Use os pontos para descontos ou troque por prêmios!'
        },
        {
          q: 'O que são os níveis de jardineiro?',
          a: 'Quanto mais você usa a plataforma, mais você sobe de nível: Iniciante → Aprendiz → Cultivador → Mestre → Lendário. Cada nível destrava benefícios exclusivos.'
        }
      ]
    }
  ]

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0)

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#2F5F39] to-[#3A7347] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Central de Ajuda
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Tire suas dúvidas e encontre soluções rapidamente
            </p>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar dúvidas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/ajuda/fale-conosco" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#2F5F39] hover:shadow-lg transition text-center group">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#2F5F39] transition">Fale Conosco</h3>
            <p className="text-sm text-gray-600 mt-2">Envie sua mensagem</p>
          </Link>

          <Link href="/ajuda/como-comprar" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#2F5F39] hover:shadow-lg transition text-center group">
            <div className="text-4xl mb-3">🛒</div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#2F5F39] transition">Como Comprar</h3>
            <p className="text-sm text-gray-600 mt-2">Guia passo a passo</p>
          </Link>

          <Link href="/ajuda/como-vender" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#2F5F39] hover:shadow-lg transition text-center group">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#2F5F39] transition">Como Vender</h3>
            <p className="text-sm text-gray-600 mt-2">Anuncie seus produtos</p>
          </Link>

          <a href="https://wa.me/5511999999999" target="_blank" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-green-600 hover:shadow-lg transition text-center group">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-600 transition">WhatsApp</h3>
            <p className="text-sm text-gray-600 mt-2">Atendimento direto</p>
          </a>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-[1280px] mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Perguntas Frequentes</h2>

        <div className="space-y-8">
          {filteredFaqs.map((category, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-2xl font-semibold text-[#2F5F39] mb-6">{category.category}</h3>
              
              <div className="space-y-4">
                {category.questions.map((faq, faqIdx) => (
                  <details key={faqIdx} className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none p-4 rounded-lg hover:bg-gray-50 transition">
                      <span className="font-medium text-gray-900">{faq.q}</span>
                      <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-4 pb-4 pt-2 text-gray-700 leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-600">Tente pesquisar com outras palavras ou entre em contato conosco.</p>
          </div>
        )}
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-[#2F5F39] to-[#3A7347] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Não encontrou o que procurava?</h2>
          <p className="text-xl text-white/90 mb-8">Nossa equipe está pronta para ajudar você!</p>
          <Link href="/ajuda/fale-conosco">
            <button className="bg-white text-[#2F5F39] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition">
              Fale Conosco
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
