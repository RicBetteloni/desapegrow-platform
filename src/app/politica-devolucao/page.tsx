import Link from 'next/link'
import { Package, RefreshCw, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react'

export default function PoliticaDevolucaoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-10 h-10 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Política de Trocas e Devoluções</h1>
          </div>
          
          <div className="mb-8">
            <p className="text-sm text-gray-500">Última atualização: 02 de janeiro de 2026</p>
            <p className="mt-2 text-gray-600">
              Em conformidade com o Código de Defesa do Consumidor (Lei 8.078/1990)
            </p>
          </div>

          <div className="prose max-w-none">
            {/* Importante */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-yellow-900 m-0 mb-2">Importante</h3>
                  <p className="text-yellow-800 text-sm m-0">
                    A Desapegrow é um marketplace que conecta compradores e vendedores. Cada vendedor é 
                    responsável por seus produtos e deve seguir esta política. Em caso de problemas, 
                    a Desapegrow atuará como mediadora.
                  </p>
                </div>
              </div>
            </div>

            {/* Direito de Arrependimento */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">Direito de Arrependimento</h2>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-4">
                <h3 className="text-xl font-bold text-green-900 mb-2">7 Dias para Desistir</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Conforme o <strong>Art. 49 do Código de Defesa do Consumidor</strong>, você pode desistir 
                  da compra em até <strong>7 dias corridos</strong> após o recebimento do produto, sem 
                  necessidade de justificativa.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Condições para exercer o direito:</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Produto deve estar <strong>sem uso</strong>, com etiquetas e embalagem original</li>
                <li>Acessórios, manuais e brindes devem estar completos</li>
                <li>Nota fiscal ou comprovante de compra deve acompanhar</li>
                <li>O prazo conta a partir do <strong>recebimento do produto</strong></li>
              </ul>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>💡 Como solicitar:</strong> Acesse &quot;Meus Pedidos&quot;, selecione o produto e clique em 
                  &quot;Solicitar Devolução&quot;. O vendedor tem até 2 dias úteis para aprovar.
                </p>
              </div>
            </section>

            {/* Defeito ou Vício */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">Produto com Defeito ou Vício</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Garantia Legal (CDC)</h3>
              <p className="text-gray-700 mb-4">
                Conforme <strong>Art. 26 do CDC</strong>, você tem direito à reclamação por vícios aparentes:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                  <h4 className="font-bold text-gray-900 mb-2">Produtos Não Duráveis</h4>
                  <p className="text-sm text-gray-700">30 dias para reclamar</p>
                  <p className="text-xs text-gray-500 mt-1">(Ex: consumíveis, nutrientes)</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                  <h4 className="font-bold text-gray-900 mb-2">Produtos Duráveis</h4>
                  <p className="text-sm text-gray-700">90 dias para reclamar</p>
                  <p className="text-xs text-gray-500 mt-1">(Ex: LEDs, exaustores, tendas)</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Soluções Disponíveis (Art. 18)</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">1. Substituição do produto</p>
                    <p className="text-sm text-gray-600">Por outro da mesma espécie, em perfeitas condições</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">2. Restituição do valor pago</p>
                    <p className="text-sm text-gray-600">Devolução integral, corrigida monetariamente</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">3. Abatimento proporcional do preço</p>
                    <p className="text-sm text-gray-600">Se aceitar ficar com o produto com defeito</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>⚠️ Prazo para solução:</strong> O vendedor tem até <strong>30 dias</strong> para 
                  reparar o vício. Se não resolver, você pode escolher uma das 3 opções acima.
                </p>
              </div>
            </section>

            {/* Produto Diferente */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">Produto Diferente ou Danificado</h2>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recebeu produto errado ou danificado?</h3>
              <p className="text-gray-700 mb-4">
                Entre em contato <strong>imediatamente</strong> após o recebimento:
              </p>

              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>Tire fotos do produto e da embalagem</li>
                <li>Não use o produto</li>
                <li>Abra uma reclamação em &quot;Meus Pedidos&quot;</li>
                <li>Anexe as fotos como prova</li>
                <li>Aguarde análise do vendedor (até 2 dias úteis)</li>
              </ol>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  <strong>Importante:</strong> Nestes casos, o <strong>vendedor é obrigado</strong> a enviar 
                  o produto correto ou devolver 100% do valor, incluindo frete.
                </p>
              </div>
            </section>

            {/* Processo de Devolução */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">Como Funciona a Devolução</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Solicitação</h4>
                    <p className="text-sm text-gray-700">
                      Acesse &quot;Meus Pedidos&quot; e clique em &quot;Solicitar Devolução/Troca&quot;. Informe o motivo 
                      e anexe fotos se necessário.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Análise do Vendedor</h4>
                    <p className="text-sm text-gray-700">
                      O vendedor tem até <strong>2 dias úteis</strong> para aprovar ou recusar. 
                      Se recusar indevidamente, você pode acionar a Desapegrow.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Envio de Volta</h4>
                    <p className="text-sm text-gray-700">
                      Após aprovação, você receberá uma etiqueta de devolução (frete pago pelo vendedor 
                      em casos de defeito/erro). Poste o produto nos Correios.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Reembolso ou Troca</h4>
                    <p className="text-sm text-gray-700">
                      Após o vendedor receber e conferir o produto, você receberá o reembolso em até 
                      <strong> 5 dias úteis</strong> ou o produto de troca será enviado.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Custos */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quem Paga o Frete de Devolução?</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Vendedor paga o frete quando:</p>
                    <ul className="text-sm text-gray-700 mt-1 space-y-1">
                      <li>• Produto com defeito ou vício</li>
                      <li>• Produto diferente do anunciado</li>
                      <li>• Produto danificado no transporte</li>
                      <li>• Erro do vendedor (enviou item errado)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Comprador paga o frete quando:</p>
                    <ul className="text-sm text-gray-700 mt-1 space-y-1">
                      <li>• Desistência (arrependimento sem justificativa)</li>
                      <li>• Mudou de ideia sobre o produto</li>
                      <li>• Escolheu tamanho/modelo errado</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Produtos sem Devolução */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Produtos Sem Direito a Devolução</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <p className="text-gray-700 mb-3">
                  Por questões de higiene, segurança ou natureza do produto, os seguintes itens 
                  <strong> não podem ser devolvidos</strong> após abertos/usados:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Nutrientes e fertilizantes líquidos (após abertura da embalagem)</li>
                  <li>Substratos (após abertura do pacote)</li>
                  <li>Filtros e ventilação (após uso)</li>
                  <li>Produtos sob medida ou personalizados</li>
                </ul>
                <p className="text-sm text-gray-500 mt-3">
                  <strong>Exceção:</strong> Se apresentarem defeito de fabricação, mesmo abertos, 
                  você tem direito à garantia legal.
                </p>
              </div>
            </section>

            {/* Garantia do Fabricante */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Garantia do Fabricante</h2>
              
              <p className="text-gray-700 mb-4">
                Além da garantia legal (90 dias), muitos produtos têm garantia adicional do fabricante:
              </p>

              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>LEDs de cultivo:</strong> Geralmente 1 a 3 anos</li>
                <li><strong>Exaustores e ventiladores:</strong> 6 meses a 1 ano</li>
                <li><strong>Tendas e estruturas:</strong> Geralmente 6 meses</li>
                <li><strong>Equipamentos eletrônicos:</strong> Consultar fabricante</li>
              </ul>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>💡 Dica:</strong> Guarde sempre a nota fiscal e certificado de garantia. 
                  Para acionar garantia do fabricante, entre em contato direto com a assistência técnica 
                  autorizada.
                </p>
              </div>
            </section>

            {/* Cancelamento */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancelamento de Pedido</h2>
              
              <p className="text-gray-700 mb-4">
                Você pode cancelar o pedido sem custo nas seguintes situações:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-semibold text-gray-900">✓ Antes do Envio</p>
                  <p className="text-sm text-gray-700">
                    Se o vendedor ainda não postou, cancele diretamente em &quot;Meus Pedidos&quot;. 
                    Reembolso automático em até 24h.
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-gray-900">⚠️ Após o Envio</p>
                  <p className="text-sm text-gray-700">
                    Aguarde receber o produto e solicite devolução (direito de arrependimento). 
                    Você pode ter que pagar o frete de retorno.
                  </p>
                </div>
              </div>
            </section>

            {/* Mediação Desapegrow */}
            <section className="mb-8">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Mediação Desapegrow</h2>
                
                <p className="text-gray-700 mb-4">
                  Se houver desacordo entre comprador e vendedor, a Desapegrow atuará como mediadora:
                </p>

                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Analisaremos o caso com base em evidências (fotos, mensagens, rastreamento)</li>
                  <li>Decisão em até <strong>5 dias úteis</strong></li>
                  <li>Nossa decisão é final e vinculante</li>
                  <li>Vendedores que não cumprem a política podem ser suspensos</li>
                </ul>

                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>📧 Suporte:</strong> ajuda@desapegrow.com<br />
                    <strong>📱 WhatsApp:</strong> (11) 0000-0000<br />
                    <strong>⏰ Horário:</strong> Segunda a Sexta, 9h às 18h
                  </p>
                </div>
              </div>
            </section>

            {/* Legislação */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Base Legal</h2>
              
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>Lei 8.078/1990</strong> - Código de Defesa do Consumidor</p>
                <p>• <strong>Art. 49</strong> - Direito de arrependimento (7 dias)</p>
                <p>• <strong>Art. 18 a 25</strong> - Garantia legal e vícios do produto</p>
                <p>• <strong>Art. 26</strong> - Prazos para reclamação (30/90 dias)</p>
                <p>• <strong>Decreto 7.962/2013</strong> - Comércio eletrônico</p>
              </div>
            </section>
          </div>

          {/* Voltar */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/" className="text-green-600 hover:text-green-700 font-semibold">
              ← Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
