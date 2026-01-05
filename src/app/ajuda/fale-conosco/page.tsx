'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FaleConoscoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    // Simular envio (você pode integrar com uma API real depois)
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1500)
  }

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
            <span className="text-gray-900 font-medium">Fale Conosco</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left - Form */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Fale Conosco</h1>
            <p className="text-lg text-gray-600 mb-8">
              Envie sua mensagem e nossa equipe responderá em até 24 horas.
            </p>

            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">Mensagem enviada com sucesso!</h3>
                    <p className="text-sm text-green-700">Responderemos em breve no email cadastrado.</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2F5F39] focus:border-transparent"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2F5F39] focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2F5F39] focus:border-transparent"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="duvida-compra">Dúvida sobre compra</option>
                  <option value="duvida-venda">Dúvida sobre venda</option>
                  <option value="problema-pagamento">Problema com pagamento</option>
                  <option value="problema-entrega">Problema com entrega</option>
                  <option value="denuncia">Denúncia</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2F5F39] focus:border-transparent resize-none"
                  placeholder="Descreva sua dúvida ou problema..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-[#2F5F39] hover:bg-[#3A7347] text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50"
              >
                {status === 'sending' ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>

          {/* Right - Contact Info */}
          <div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Outras formas de contato</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📧</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:contato@desapegrow.com.br" className="text-[#2F5F39] hover:underline">
                      contato@desapegrow.com.br
                    </a>
                    <p className="text-sm text-gray-600 mt-1">Respondemos em até 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl">📱</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                    <a href="https://wa.me/5511999999999" target="_blank" className="text-[#2F5F39] hover:underline">
                      (11) 99999-9999
                    </a>
                    <p className="text-sm text-gray-600 mt-1">Seg a Sex, 9h às 18h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl">🕐</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Horário de atendimento</h3>
                    <p className="text-gray-700">Segunda a Sexta</p>
                    <p className="text-gray-700">9:00 - 18:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Precisa de ajuda imediata?</h3>
                <Link href="/ajuda">
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold transition">
                    Ver Central de Ajuda
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
