import Link from 'next/link'
import { Shield, Lock, Eye, FileText, UserCheck, AlertTriangle } from 'lucide-react'

export default function LGPDPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-10 h-10 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Lei Geral de Proteção de Dados</h1>
          </div>
          
          <div className="mb-8">
            <p className="text-sm text-gray-500">Última atualização: 02 de janeiro de 2026</p>
            <p className="mt-2 text-gray-600">
              Em conformidade com a Lei nº 13.709/2018 (LGPD)
            </p>
          </div>

          <div className="prose max-w-none">
            {/* Introdução */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">Introdução</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A Desapegrow respeita a privacidade e a proteção de dados de todos os seus usuários. 
                Este documento explica como tratamos seus dados pessoais de acordo com a Lei Geral de 
                Proteção de Dados Pessoais (Lei 13.709/2018).
              </p>
            </section>

            {/* Responsável pelo Tratamento */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">Responsável pelo Tratamento</h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Empresa:</strong> Desapegrow Ltda</p>
                <p className="text-gray-700 mb-2"><strong>CNPJ:</strong> 00.000.000/0001-00</p>
                <p className="text-gray-700 mb-2"><strong>Endereço:</strong> São Paulo - SP</p>
                <p className="text-gray-700"><strong>DPO (Encarregado):</strong> dpo@desapegrow.com</p>
              </div>
            </section>

            {/* Dados Coletados */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">Dados Pessoais Coletados</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">1. Dados de Cadastro</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Nome completo</li>
                <li>E-mail</li>
                <li>CPF</li>
                <li>Data de nascimento (para verificação de maioridade)</li>
                <li>Telefone</li>
                <li>Endereço completo (para entrega)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">2. Dados de Navegação</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Endereço IP</li>
                <li>Cookies e identificadores únicos</li>
                <li>Páginas visitadas</li>
                <li>Produtos visualizados e comprados</li>
                <li>Dispositivo e navegador utilizados</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">3. Dados de Transação</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Histórico de compras e vendas</li>
                <li>Dados de pagamento (criptografados)</li>
                <li>Informações de envio e rastreamento</li>
              </ul>
            </section>

            {/* Finalidade do Tratamento */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">Finalidade do Tratamento</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Execução do Contrato (Art. 7º, V)</h3>
                  <p className="text-gray-700 text-sm">
                    Processamento de pedidos, pagamentos, entregas e comunicação relacionada às transações.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Cumprimento de Obrigação Legal (Art. 7º, II)</h3>
                  <p className="text-gray-700 text-sm">
                    Emissão de notas fiscais, cumprimento de obrigações tributárias e regulatórias.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Legítimo Interesse (Art. 7º, IX)</h3>
                  <p className="text-gray-700 text-sm">
                    Prevenção de fraudes, segurança da plataforma, melhorias no serviço e análise de dados.
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Consentimento (Art. 7º, I)</h3>
                  <p className="text-gray-700 text-sm">
                    Marketing, comunicações promocionais e personalização da experiência (pode ser revogado).
                  </p>
                </div>
              </div>
            </section>

            {/* Compartilhamento de Dados */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Compartilhamento de Dados</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Compartilhamos seus dados com:</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Vendedores e Compradores:</strong> Dados necessários para execução da transação 
                  (nome, endereço de entrega, telefone).
                </li>
                <li>
                  <strong>Processadores de Pagamento:</strong> Mercado Pago e outros para processar transações 
                  (dados tokenizados).
                </li>
                <li>
                  <strong>Transportadoras:</strong> Correios e transportadoras parceiras para entrega dos produtos.
                </li>
                <li>
                  <strong>Serviços de Cloud:</strong> Vercel, AWS ou similares para hospedagem segura.
                </li>
                <li>
                  <strong>Autoridades Competentes:</strong> Quando exigido por lei ou ordem judicial.
                </li>
              </ul>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
                <p className="text-sm text-red-800">
                  <strong>⚠️ Importante:</strong> Nunca vendemos seus dados pessoais para terceiros.
                </p>
              </div>
            </section>

            {/* Direitos do Titular */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Seus Direitos (Art. 18 da LGPD)</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Confirmação e Acesso</h4>
                  <p className="text-sm text-gray-700">Saber se tratamos seus dados e acessá-los.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Correção</h4>
                  <p className="text-sm text-gray-700">Corrigir dados incompletos ou desatualizados.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Anonimização ou Eliminação</h4>
                  <p className="text-sm text-gray-700">Solicitar exclusão de dados desnecessários.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Portabilidade</h4>
                  <p className="text-sm text-gray-700">Receber seus dados em formato estruturado.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Revogação do Consentimento</h4>
                  <p className="text-sm text-gray-700">Retirar consentimento a qualquer momento.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Oposição</h4>
                  <p className="text-sm text-gray-700">Opor-se a tratamentos realizados.</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  Para exercer seus direitos, entre em contato através de: <strong>dpo@desapegrow.com</strong>
                  <br />
                  Responderemos em até 15 dias úteis, conforme Art. 19 da LGPD.
                </p>
              </div>
            </section>

            {/* Segurança */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">Segurança dos Dados</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                Adotamos medidas técnicas e organizacionais apropriadas para proteger seus dados:
              </p>

              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Criptografia de dados sensíveis em repouso</li>
                <li>Controle de acesso restrito aos dados</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backup regular de dados</li>
                <li>Treinamento de equipe em proteção de dados</li>
              </ul>
            </section>

            {/* Retenção de Dados */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Prazo de Retenção</h2>
              
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Dados de cadastro:</strong> Enquanto a conta estiver ativa + 5 anos após 
                  encerramento (obrigações legais).
                </li>
                <li>
                  <strong>Dados de transação:</strong> 5 anos conforme Código de Defesa do Consumidor e 
                  legislação tributária.
                </li>
                <li>
                  <strong>Dados de marketing:</strong> Até revogação do consentimento.
                </li>
                <li>
                  <strong>Logs de acesso:</strong> 6 meses conforme Marco Civil da Internet (Lei 12.965/2014).
                </li>
              </ul>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies e Tecnologias Similares</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos cookies para melhorar sua experiência. Você pode gerenciar cookies através das 
                configurações do navegador.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>Tipos de cookies:</strong> Essenciais (funcionamento do site), Performance 
                  (análise), Funcionais (preferências) e Marketing (publicidade direcionada).
                </p>
              </div>
            </section>

            {/* Menores de Idade */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Menores de Idade</h2>
              
              <p className="text-gray-700 leading-relaxed">
                Nossos serviços são destinados exclusivamente a maiores de 18 anos. Não coletamos 
                intencionalmente dados de menores. Verificamos a maioridade durante o cadastro.
              </p>
            </section>

            {/* Transferência Internacional */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Transferência Internacional</h2>
              
              <p className="text-gray-700 leading-relaxed">
                Alguns serviços de terceiros podem estar localizados fora do Brasil. Garantimos que 
                essas transferências atendem aos requisitos da LGPD (Art. 33), utilizando cláusulas 
                contratuais padrão e certificações adequadas.
              </p>
            </section>

            {/* Alterações */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Alterações desta Política</h2>
              
              <p className="text-gray-700 leading-relaxed">
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
                por e-mail ou aviso na plataforma. A versão atualizada sempre estará disponível nesta página.
              </p>
            </section>

            {/* Contato */}
            <section className="mb-8">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Dúvidas sobre LGPD?</h2>
                
                <p className="text-gray-700 mb-4">
                  Entre em contato com nosso Encarregado de Proteção de Dados (DPO):
                </p>

                <div className="space-y-2 text-gray-700">
                  <p><strong>E-mail:</strong> dpo@desapegrow.com</p>
                  <p><strong>Telefone:</strong> (11) 0000-0000</p>
                  <p><strong>Endereço:</strong> São Paulo - SP</p>
                </div>

                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-gray-600">
                    Você também pode registrar reclamações junto à Autoridade Nacional de Proteção de Dados (ANPD): 
                    <br />
                    <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" 
                       className="text-green-600 hover:underline">
                      www.gov.br/anpd
                    </a>
                  </p>
                </div>
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
