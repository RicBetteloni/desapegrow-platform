'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Sprout, 
  Lightbulb, 
  Droplets, 
  Bug, 
  ThermometerSun,
  Calendar,
  ArrowRight,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react'

interface FAQ {
  id: number
  question: string
  category: string
  icon: any
  answer: {
    summary: string
    details: string[]
    table?: {
      headers: string[]
      rows: string[][]
    }
    tips?: {
      type: 'success' | 'warning' | 'error'
      text: string
    }[]
    relatedProducts?: string[]
  }
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: 'Folhas em "Praying Mantis Mode" - É Normal?',
    category: 'Iniciantes',
    icon: Sprout,
    answer: {
      summary: 'SIM, é NORMAL e a planta está sendo INTELIGENTE! As folhas se dobram para propositalmente deixar passar mais luz para os botões inferiores.',
      details: [
        '✅ É um mecanismo de adaptação natural da planta',
        '✅ Significa que as folhas superiores estão "ajudando" ao se afastar',
        '⚠️ Se as folhas SEMPRE estão nessa posição = LUZ MUITO PERTO ou MUITO CALOR',
        '🔧 Solução: Afaste a luz 5-10cm e verifique temperatura',
        '',
        '📊 Causa mais comum:',
        '   • Luz LED muito próxima (menos de 30cm)',
        '   • Temperatura acima de 28°C',
        '   • Baixa umidade do ar'
      ],
      tips: [
        { type: 'success', text: 'Planta em posição de oração = comunicação ativa e saudável' },
        { type: 'warning', text: 'Se permanente, verifique temperatura e distância da luz' },
        { type: 'success', text: 'Entender esse comportamento reduz ansiedade de iniciantes' }
      ],
      relatedProducts: ['LED Full Spectrum', 'Termômetro Digital', 'Higrômetro']
    }
  },
  {
    id: 2,
    question: 'Preciso de tenda e luzes para começar?',
    category: 'Iniciantes',
    icon: Lightbulb,
    answer: {
      summary: 'NÃO! Você pode começar com luz solar na janela ou outdoor. Equipamentos indoor são investimento para depois.',
      details: [
        '✅ Opção 1: Janela/Outdoor (R$ 0) - Luz solar grátis, aprenda o básico',
        '✅ Opção 2: Investir depois (R$ 2.600) - Tenda 3x3 + LED 600W + Ventilação',
        '📊 Recomendação: 1ª colheita outdoor → 2ª colheita indoor com conhecimento'
      ],
      table: {
        headers: ['Item', 'Custo', 'Quando Comprar'],
        rows: [
          ['Sementes', 'R$ 50-150', 'Agora'],
          ['Vaso + Solo', 'R$ 30-80', 'Agora'],
          ['Tenda 3x3', 'R$ 800', 'Depois da 1ª colheita'],
          ['LED 600W', 'R$ 1.500', 'Depois da 1ª colheita'],
          ['Ventilação', 'R$ 300', 'Depois da 1ª colheita']
        ]
      },
      tips: [
        { type: 'success', text: 'Comece HOJE com zero gasto e ganhe experiência' },
        { type: 'warning', text: 'Outdoor: estações limitam tempo de cultivo' }
      ],
      relatedProducts: ['Kit Grow Box', 'LED Quantum Board', 'Exaustores']
    }
  },
  {
    id: 3,
    question: 'As folhas estão amareladas - O que fazer?',
    category: 'Problemas',
    icon: Bug,
    answer: {
      summary: 'Folhas amarelas têm várias causas. Diagnóstico correto salva a colheita!',
      details: [
        '🔍 Ordem de diagnóstico:',
        '1. Folhas antigas (de baixo) amarelam primeiro? = Normal (ciclo de vida)',
        '2. Folhas novas (de cima) amarelam? = Problema mais sério',
        '3. Toda a planta murcha + amarela? = Provavelmente excesso de água'
      ],
      table: {
        headers: ['Causa', 'Sintoma', 'Solução'],
        rows: [
          ['Excesso de Nitrogênio', 'Folhas verdes escuras → amarelo', 'Reduzir fertilizante'],
          ['Falta de Nitrogênio', 'Folhas velhas amarelam PRIMEIRO', 'Aumentar N'],
          ['pH errado', 'Bloqueio de nutrientes', 'Ajustar pH (6.0-7.0)'],
          ['Regas em excesso', 'Raízes apodrecem', 'Deixar secar entre regas'],
          ['Falta de Ferro', 'Veias verdes, resto amarelo', 'Aumentar Fe ou baixar pH']
        ]
      },
      tips: [
        { type: 'success', text: 'Diagnóstico rápido = ação rápida = colheita salva' },
        { type: 'error', text: 'Excesso de água é a causa #1 de problemas' }
      ],
      relatedProducts: ['Medidor de pH', 'Fertilizantes NPK']
    }
  },
  {
    id: 4,
    question: 'Posso misturar indoor + outdoor?',
    category: 'Avançado',
    icon: ThermometerSun,
    answer: {
      summary: 'SIM, COM CUIDADO. Germinar indoor e crescer outdoor é possível, mas exige aclimatação gradual.',
      details: [
        '✅ Vantagens: Começo controlado + luz solar grátis no final',
        '⚠️ Desvantagens: Estresse de transplante + pragas outdoor',
        '📋 Estratégia correta:',
        '   Passo 1: Germine indoor (controle total)',
        '   Passo 2: Acostume à luz solar (gradualmente, 1-2 semanas)',
        '   Passo 3: Plante outdoor na primavera (tempo certo)',
        '   Passo 4: Cuidado extra com mofo/pragas'
      ],
      table: {
        headers: ['Fase', 'Quando (Brasil)', 'Local'],
        rows: [
          ['Germinação', 'Junho-Julho', 'Indoor'],
          ['Vegetação', 'Agosto-Setembro', 'Transição Indoor→Outdoor'],
          ['Floração', 'Outubro-Fevereiro', 'Outdoor'],
          ['Colheita', 'Março', 'Outdoor']
        ]
      },
      tips: [
        { type: 'success', text: 'Melhor de dois mundos = mais educacional' },
        { type: 'warning', text: 'Ciclo de luz muda pode induzir floração precoce' }
      ]
    }
  },
  {
    id: 5,
    question: 'Qual é o melhor ciclo de luz para iniciantes?',
    category: 'Iluminação',
    icon: Lightbulb,
    answer: {
      summary: 'USE 18/6 (18h luz, 6h escuro). Economiza energia sem perder velocidade de crescimento.',
      details: [
        '💡 Comparação de ciclos:',
        '24/0 - Máximo crescimento MAS mais caro (energia)',
        '20/4 - Bom balanço (recomendado avançados)',
        '18/6 - IDEAL para iniciantes (econômico + eficiente)',
        '16/8 - Apenas para induzir floração no final da vegetação'
      ],
      table: {
        headers: ['Ciclo', 'Custo Energia/Mês', 'Crescimento', 'Recomendado Para'],
        rows: [
          ['24/0', 'R$ 240', '100%', 'Comercial'],
          ['20/4', 'R$ 200', '95%', 'Avançados'],
          ['18/6', 'R$ 180', '90%', '⭐ Iniciantes'],
          ['16/8', 'R$ 160', '80%', 'Pré-floração']
        ]
      },
      tips: [
        { type: 'success', text: 'Economiza 25% de energia vs 24/0' },
        { type: 'success', text: 'Plantas felizes com descanso noturno' }
      ],
      relatedProducts: ['Timer Digital', 'LED Full Spectrum']
    }
  },
  {
    id: 6,
    question: 'Quanto tempo leva para colher?',
    category: 'Planejamento',
    icon: Calendar,
    answer: {
      summary: 'De 7 a 20 semanas dependendo do tipo de genética. Fotos regulares: 12-20 semanas. Autos: 7-10 semanas.',
      details: [
        '📅 Timeline realista para iniciante:',
        'Semana 1-4: Planta cresce (vegetação)',
        'Semana 5-12: Flores se formam (floração)',
        'Semana 13: Corta e cura por 2 semanas',
        'Total: 3-4 meses do zero à colheita'
      ],
      table: {
        headers: ['Tipo', 'Vegetação', 'Floração', 'Total'],
        rows: [
          ['Foto Regular', '4-8 semanas', '8-12 semanas', '12-20 semanas'],
          ['Foto Fast', '2-4 semanas', '6-8 semanas', '8-12 semanas'],
          ['Autoflorescente', '2-3 semanas', '5-7 semanas', '⚡ 7-10 semanas']
        ]
      },
      tips: [
        { type: 'success', text: 'Expectativas realistas evitam ansiedade' },
        { type: 'warning', text: 'Nunca colha antes do tempo - paciência = qualidade' }
      ]
    }
  },
  {
    id: 7,
    question: 'As plantas estão crescendo muito lentamente',
    category: 'Problemas',
    icon: AlertCircle,
    answer: {
      summary: 'Crescimento lento = algum fator limitante. Checklist: Luz → Temperatura → Água → Nutrientes → pH.',
      details: [
        '🔍 Ordem de checklist (do mais comum ao menos):',
        '❌ Luz insuficiente → Planta fica esbelta',
        '   Solução: Aumentar luz (mais perto ou mais potente)',
        '❌ Temperatura baixa → Crescimento parado',
        '   Solução: 20-25°C é ideal para vegetação',
        '❌ Água em excesso → Raízes apodrecem',
        '   Solução: Deixar o solo secar entre regas',
        '❌ Nutrientes insuficientes → Amarelamento',
        '   Solução: Aumentar fertilizante gradualmente',
        '❌ pH errado → Bloqueio de nutrientes',
        '   Solução: pH 6.0-7.0 em solo (ideal 6.5)'
      ],
      tips: [
        { type: 'success', text: 'Diagnosticar rápido = solução rápida = crescimento retomado' },
        { type: 'warning', text: 'Plantas crescem 30% mais rápido em condições ideais' }
      ],
      relatedProducts: ['Termômetro', 'Medidor pH', 'LED Upgrade']
    }
  },
  {
    id: 8,
    question: 'Qual tipo de solo usar?',
    category: 'Substrato',
    icon: Sprout,
    answer: {
      summary: 'COCO + PERLITA é o melhor custo-benefício para iniciantes. NÃO use terra de jardim comum.',
      details: [
        '❌ NÃO USE:',
        '   • Terra de jardim comum (compactada, pragas)',
        '   • Terra de vaso normal (muito densa)',
        '',
        '✅ USE - Opção 1: Coco (Melhor para iniciantes)',
        '   • 70% coco coir + 20% perlita + 10% vermiculita',
        '   • Custo: ~R$ 50-100',
        '   • Vantagem: Leve, drena bem, reutilizável',
        '',
        '✅ USE - Opção 2: Solo Orgânico (Mais nutritivo)',
        '   • 50% solo orgânico + 30% coco + 20% perlita',
        '   • Custo: ~R$ 150',
        '   • Vantagem: Nutrientes naturais'
      ],
      tips: [
        { type: 'success', text: 'Plantas crescem 30% mais rápido em solo correto' },
        { type: 'success', text: 'Coco é reutilizável por 2-3 cultivos' }
      ],
      relatedProducts: ['Substrato Coco', 'Perlita', 'Vasos Feltro']
    }
  },
  {
    id: 9,
    question: 'Quanto regar? Com que frequência?',
    category: 'Irrigação',
    icon: Droplets,
    answer: {
      summary: 'REGRA DOS DEDOS: Coloque dedo 2cm no solo. Se seco → regar até drenar. Se úmido → esperar.',
      details: [
        '💧 Frequência média:',
        '   • Plantas jovens: A cada 2-3 dias',
        '   • Plantas médias: A cada 4-5 dias',
        '   • Plantas grandes (floração): A cada 5-7 dias',
        '',
        '📋 Dicas práticas:',
        '   ✅ Regar ao amanhecer (melhor absorção)',
        '   ✅ Use água em temperatura ambiente',
        '   ✅ Drene completamente (pote com furo obrigatório)',
        '',
        '⚠️ Sinais de EXCESSO: Raízes apodrecem, folhas amarelam, cheiro ruim',
        '⚠️ Sinais de FALTA: Folhas murcham, solo super seco'
      ],
      tips: [
        { type: 'success', text: 'Sistema simples funciona sempre - não precisa de relógio' },
        { type: 'error', text: 'Excesso de água mata mais plantas que falta de água' }
      ],
      relatedProducts: ['Vasos com Drenagem', 'Prato Coletor']
    }
  },
  {
    id: 10,
    question: 'Qual fertilizante usar?',
    category: 'Nutrição',
    icon: BookOpen,
    answer: {
      summary: 'Fertilizante líquido NPK é MAIS FÁCIL para iniciantes. Comece SEM fertilizante (solo bom tem nutrientes).',
      details: [
        '🧪 Opção 1: Fertilizante Líquido NPK (RECOMENDADO)',
        '   • Marcas: Maxigro (veg), Maxibloom (floração)',
        '   • Vantagem: Fácil medir, menos erro',
        '   • Custo: R$ 50-100/litro (rende 100L água)',
        '',
        '🌿 Opção 2: Composto Orgânico (NATURAL)',
        '   • Vermicomposto + Pó de osso + Farinha de algas',
        '   • Vantagem: Sem química, sustentável',
        '   • Desvantagem: Menos previsível',
        '',
        '📊 REGRA NPK (Nitrogênio-Fósforo-Potássio):',
        '   • Vegetação: Alto N (20-5-5)',
        '   • Floração: Alto P/K (5-15-15)',
        '   • Transição: Balanceado (10-10-10)'
      ],
      table: {
        headers: ['Fase', 'Proporção NPK', 'Exemplo'],
        rows: [
          ['Vegetação', 'Alto N (20-5-5)', 'Maxigro 20-20-20'],
          ['Floração', 'Alto P/K (5-15-15)', 'Maxibloom 5-30-30'],
          ['Transição', 'Balanceado (10-10-10)', 'Qualquer 1:1:1']
        ]
      },
      tips: [
        { type: 'success', text: 'Semana 3-4: Se ficar amarelo → adicione fertilizante' },
        { type: 'warning', text: 'Siga instruções do fabricante - não improvise!' }
      ],
      relatedProducts: ['Fertilizantes NPK', 'Medidor EC']
    }
  },
  {
    id: 11,
    question: 'Misturar genética Indoor com Outdoor - Pode?',
    category: 'Genética',
    icon: Sprout,
    answer: {
      summary: 'SIM! Cepas outdoor têm resistência a doenças e mofo naturalmente selecionada. Ideais para o clima brasileiro.',
      details: [
        '✅ Cepas outdoor brasileiras = adaptadas ao clima tropical',
        '✅ Resistência natural à umidade e fungos',
        '✅ Reduz necessidade de fungicidas químicos',
        '✅ Crucial em regiões com alta precipitação',
        '',
        '📊 Vantagens para Brasil:',
        '   • Suportam umidade 60-80% sem problemas',
        '   • Resistentes a temperaturas 20-35°C',
        '   • Ciclos adaptados às estações brasileiras'
      ],
      tips: [
        { type: 'success', text: 'Genética local = menos problemas no cultivo' },
        { type: 'success', text: 'Reduz 60% de doenças fúngicas comuns' }
      ],
      relatedProducts: ['Sementes Outdoor', 'Fungicida Orgânico']
    }
  },
  {
    id: 12,
    question: 'Autos que demoram MUITO para florir - Normal?',
    category: 'Floração',
    icon: Calendar,
    answer: {
      summary: 'SIM, algumas autos vêm atrasadas por semanas. Nem toda planta segue o cronograma da embalagem.',
      details: [
        '⏰ Tempo normal: 70-90 dias da germinação',
        '⏰ Autos atrasadas: 90-120 dias',
        '',
        '🔧 Como forçar floração (se passar de 80 dias):',
        '   Passo 1: Reduza luz para 16/8 (de 20/4 ou 18/6)',
        '   Passo 2: Adicione potássio (Ekosin Yoorin ou similar)',
        '   Passo 3: Aguarde 7-10 dias',
        '',
        '✅ Paciência é essencial - algumas têm genética de floração lenta',
        '✅ Crescimento é mais importante que timing'
      ],
      tips: [
        { type: 'warning', text: 'Variedade genética natural - não descarte plantas saudáveis' },
        { type: 'success', text: 'Plantas atrasadas geralmente compensam com rendimento maior' }
      ],
      relatedProducts: ['Timer Digital', 'Fertilizante PK']
    }
  },
  {
    id: 13,
    question: 'Clima QUENTE demais - Como germinar?',
    category: 'Germinação',
    icon: ThermometerSun,
    answer: {
      summary: 'Método PAPEL TOALHA + COPOS VERMELHOS funciona até em climas de 30-35°C. Luz solar natural economiza custos.',
      details: [
        '📋 Passo a passo para climas quentes:',
        '   1. Germine com papel toalha úmido (2-5 dias)',
        '   2. Transfira para copos vermelhos com solo (mantém raízes frescas)',
        '   3. Mantenha na SOMBRA até brotar (não no sol direto)',
        '   4. Após brotar, coloque em janela com luz indireta',
        '   5. Pulverize 2-3x ao dia (clima quente seca rápido)',
        '',
        '✅ Vantagens:',
        '   • Luz solar natural = R$ 0',
        '   • Copos vermelhos mantêm raízes mais frias',
        '   • Fotoperiodo natural sem custo'
      ],
      tips: [
        { type: 'success', text: 'Clima quente (28-32°C) é ideal para crescimento vegetativo rápido' },
        { type: 'warning', text: 'Evite sol direto nas primeiras 2 semanas - queima mudas' }
      ],
      relatedProducts: ['Vasos Feltro', 'Pulverizador', 'Substrato Leve']
    }
  },
  {
    id: 14,
    question: 'Nitrogênio em EXCESSO ou Água demais?',
    category: 'Problemas',
    icon: Bug,
    answer: {
      summary: 'Ambos mostram sintomas similares (folhas amarelando/murchando). Fotografia + checklist diagnostica corretamente.',
      details: [
        '🔍 Diagnóstico rápido:',
        '',
        '❌ Excesso de Nitrogênio:',
        '   • Folhas VERDE ESCURO brilhante antes de amarelar',
        '   • Pontas queimadas (marrom)',
        '   • Crescimento rápido mas fraco',
        '   Solução: Parar fertilizante por 1 semana, flush com água',
        '',
        '❌ Excesso de Água:',
        '   • Folhas AMARELAS e MURCHAS ao mesmo tempo',
        '   • Solo permanece úmido por +3 dias',
        '   • Cheiro de mofo/podre',
        '   Solução: Deixar secar completamente, melhorar drenagem'
      ],
      table: {
        headers: ['Sintoma', 'Nitrogênio Excessivo', 'Água Excessiva'],
        rows: [
          ['Cor das folhas', 'Verde escuro → amarelo', 'Amarelo + murcha'],
          ['Solo', 'Normal', 'Encharcado +3 dias'],
          ['Pontas das folhas', 'Queimadas (marrom)', 'Normais'],
          ['Cheiro', 'Normal', 'Mofo/podre'],
          ['Solução', 'Flush + parar fertilizante', 'Parar regas + drenar']
        ]
      },
      tips: [
        { type: 'success', text: 'Foto da planta + descrição ajuda comunidade diagnosticar' },
        { type: 'error', text: 'Soluções são OPOSTAS - diagnóstico correto salva colheita' }
      ],
      relatedProducts: ['Medidor de Umidade Solo', 'Fertilizantes NPK']
    }
  },
  {
    id: 15,
    question: 'Kit All-in-One para começar - Vale a pena?',
    category: 'Iniciantes',
    icon: BookOpen,
    answer: {
      summary: 'SIM! Kits padronizados (R$ 150-300) reduzem variáveis para iniciantes. Expectativa: 4-7 dias para germinação.',
      details: [
        '✅ O que vem nos kits básicos:',
        '   • Vasos/copos',
        '   • Substrato pré-misturado',
        '   • Fertilizante inicial',
        '   • Manual de instruções',
        '   ❌ Luz (precisa comprar separado)',
        '',
        '⏰ Timeline realista:',
        '   Dia 0-7: Germinação',
        '   Dia 7-30: Vegetação inicial',
        '   Dia 30+: Transferir para vaso maior',
        '',
        '💡 Dica: Nervosismo é saudável = significa cuidado'
      ],
      tips: [
        { type: 'success', text: 'Kits eliminam 80% dos erros de iniciantes' },
        { type: 'warning', text: 'Ainda precisa de luz adequada (LED ou janela)' }
      ],
      relatedProducts: ['Kit Iniciante', 'LED 100W', 'Timer']
    }
  },
  {
    id: 16,
    question: 'Estufa caseira - Como fazer?',
    category: 'DIY',
    icon: ThermometerSun,
    answer: {
      summary: 'EXCELENTE para Brasil! Protege de chuvas intensas, mantém calor natural, baixo custo (R$ 50-150).',
      details: [
        '🛠️ Materiais básicos:',
        '   • Canos PVC 20mm (estrutura)',
        '   • Plástico transparente agrícola 200 micras',
        '   • Arame galvanizado (fixação)',
        '   • Zíperes ou velcro (entrada)',
        '',
        '✅ Vantagens para Brasil:',
        '   • Protege de chuvas tropicais intensas',
        '   • Mantém 3-5°C a mais que ambiente',
        '   • Reduz perdas por apodrecimento (umidade)',
        '   • Permite controle de ventilação',
        '',
        '📐 Tamanho ideal: 1m² para 2-4 plantas'
      ],
      tips: [
        { type: 'success', text: 'Excelente para germinação em meses frios (Junho-Agosto)' },
        { type: 'warning', text: 'Precisa de ventilação - abrir durante dia quente' }
      ],
      relatedProducts: ['Plástico Agrícola', 'Canos PVC', 'Termômetro']
    }
  },
  {
    id: 17,
    question: 'Clones vs Sementes - Qual é melhor?',
    category: 'Genética',
    icon: Sprout,
    answer: {
      summary: 'CLONES eliminam fase vegetativa longa (2-3 semanas). Colheita em 4 meses vs 5-6 meses de sementes.',
      details: [
        '🌱 CLONES:',
        '   ✅ Eliminam espera por sexo (sempre fêmea)',
        '   ✅ Crescimento mais rápido (já têm idade)',
        '   ✅ Genética idêntica (previsível)',
        '   ❌ Difícil encontrar no Brasil',
        '   ❌ Risco de pragas/doenças herdadas',
        '',
        '🌰 SEMENTES:',
        '   ✅ Fácil encontrar',
        '   ✅ Livre de doenças (começo limpo)',
        '   ✅ Variação genética (pode achar fenótipo raro)',
        '   ❌ Espera 2-3 semanas para sexo',
        '   ❌ 50% chance de macho (se regular)',
        '',
        '⏰ Timeline outdoor → indoor:',
        '   Junho: Germine indoor',
        '   Julho-Agosto: Cresça indoor',
        '   Setembro+: Transfira outdoor (primavera)'
      ],
      tips: [
        { type: 'success', text: 'Transição outdoor→indoor mantém plantas ano todo' },
        { type: 'warning', text: 'Aclimatar gradualmente (1-2 semanas)' }
      ],
      relatedProducts: ['Sementes Feminizadas', 'Tenda 4x4']
    }
  },
  {
    id: 18,
    question: 'UMIDADE e CALOR ALTO - Como resolver?',
    category: 'Ambiente',
    icon: ThermometerSun,
    answer: {
      summary: 'Dois dos maiores problemas no Brasil tropical. Umidade >65% + calor >28°C = 60% das doenças de plantas.',
      details: [
        '🔥 CALOR EXCESSIVO (>28°C):',
        '   ❌ Causa stress hídrico',
        '   ❌ Queimadura de raízes',
        '   ✅ Solução: Ventiladores 24/7, regar ao amanhecer, sombrite 30%',
        '',
        '💧 UMIDADE ALTA (>65%):',
        '   ❌ Causa oídio (fungo branco)',
        '   ❌ Mofo nos botões',
        '   ❌ Apodrecimento de raízes',
        '   ✅ Solução: Desumidificador, espaçamento plantas, reduzir regas',
        '',
        '🛠️ Setup ideal Brasil:',
        '   • Ventiladores 24/7 (circulação)',
        '   • Higrômetro digital (monitorar)',
        '   • Espaçamento 50cm entre plantas',
        '   • Regar apenas quando solo seco'
      ],
      table: {
        headers: ['Problema', 'Ideal', 'Máximo Tolerável', 'Solução'],
        rows: [
          ['Temperatura', '22-26°C', '28°C', 'Ventiladores + sombrite'],
          ['Umidade', '50-60%', '65%', 'Desumidificador + circulação'],
          ['Circulação ar', 'Constante', '-', 'Ventiladores 24/7']
        ]
      },
      tips: [
        { type: 'error', text: 'Controlar estes 2 parâmetros previne 60% das doenças' },
        { type: 'success', text: 'Higrômetro digital (R$ 30) é investimento obrigatório' }
      ],
      relatedProducts: ['Ventilador Clip', 'Desumidificador', 'Higrômetro Digital', 'Sombrite 30%']
    }
  },
  {
    id: 19,
    question: 'Quando é o "Dia 1" - Como contar?',
    category: 'Planejamento',
    icon: Calendar,
    answer: {
      summary: 'NÃO existe "dia 1" universal. O que importa é CONSISTÊNCIA PESSOAL. Crescimento > timing.',
      details: [
        '📅 Métodos comuns de contagem:',
        '',
        '1️⃣ Método A: Semente no solo',
        '   • Mais usado comercialmente',
        '   • Inclui germinação (+ 7 dias)',
        '',
        '2️⃣ Método B: Primeira folha verdadeira',
        '   • Mais preciso para vegetação',
        '   • Exclui germinação',
        '',
        '3️⃣ Método C: Flip de luz (12/12)',
        '   • Apenas para floração',
        '   • Usado em fotos',
        '',
        '4️⃣ Método D: Primeiros pistilos',
        '   • Floração real começada',
        '   • + 7-10 dias que flip',
        '',
        '✅ DICA: Escolha UM método e seja consistente'
      ],
      tips: [
        { type: 'success', text: 'Autos fazem seu próprio timing (ignore cronogramas)' },
        { type: 'success', text: 'Reduz ansiedade sobre "estar atrasado"' },
        { type: 'warning', text: 'Comparar com outros só funciona se usarem mesmo método' }
      ]
    }
  }
]

export default function GuiaCultivoPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const categories = Array.from(new Set(faqs.map(f => f.category)))

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center space-y-6">
            <Badge className="bg-yellow-400 text-green-900 text-sm font-bold px-4 py-2">
              📚 Desapegrow Docs
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Guia Completo de<br />Cultivo Indoor
            </h1>
            <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">
              Tudo que você precisa saber para cultivar com sucesso.<br />
              De iniciante a expert. Grátis. Sempre atualizado.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar dúvidas... (ex: folhas amarelas, quanto regar)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-white/95 backdrop-blur-sm border-2 border-green-200 focus:border-green-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 md:px-6 max-w-6xl py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? 'bg-green-600' : ''}
          >
            Todas as Categorias
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-green-600' : ''}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="container mx-auto px-4 md:px-6 max-w-6xl pb-16">
        <div className="space-y-4">
          {filteredFAQs.map((faq) => {
            const Icon = faq.icon
            const isExpanded = expandedFAQ === faq.id

            return (
              <Card key={faq.id} className="border-2 hover:border-green-300 transition-all">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                        <Icon className="w-6 h-6 text-green-700" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2 text-xs">
                          {faq.category}
                        </Badge>
                        <CardTitle className="text-xl md:text-2xl text-left">
                          {faq.question}
                        </CardTitle>
                        <CardDescription className="text-left mt-2">
                          {faq.answer.summary}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-6 pt-0">
                    {/* Details */}
                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                      {faq.answer.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {detail}
                        </p>
                      ))}
                    </div>

                    {/* Table */}
                    {faq.answer.table && (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                          <thead className="bg-green-600 text-white">
                            <tr>
                              {faq.answer.table.headers.map((header, idx) => (
                                <th key={idx} className="px-4 py-3 text-left font-semibold text-sm">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {faq.answer.table.rows.map((row, rowIdx) => (
                              <tr key={rowIdx} className="border-b border-gray-200 hover:bg-gray-50">
                                {row.map((cell, cellIdx) => (
                                  <td key={cellIdx} className="px-4 py-3 text-sm text-gray-700">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Tips */}
                    {faq.answer.tips && (
                      <div className="space-y-2">
                        {faq.answer.tips.map((tip, idx) => (
                          <div
                            key={idx}
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              tip.type === 'success'
                                ? 'bg-green-50 border border-green-200'
                                : tip.type === 'warning'
                                ? 'bg-yellow-50 border border-yellow-200'
                                : 'bg-red-50 border border-red-200'
                            }`}
                          >
                            {tip.type === 'success' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : tip.type === 'warning' ? (
                              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            <p className="text-sm font-medium text-gray-800">{tip.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Related Products */}
                    {faq.answer.relatedProducts && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          🛒 Produtos Relacionados:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {faq.answer.relatedProducts.map((product, idx) => (
                            <Link key={idx} href="/marketplace">
                              <Badge className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                {product} <ArrowRight className="w-3 h-3 ml-1" />
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {filteredFAQs.length === 0 && (
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Nenhuma dúvida encontrada
            </h3>
            <p className="text-gray-500">
              Tente buscar com outras palavras-chave ou limpe os filtros.
            </p>
          </Card>
        )}
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-black">
            Pronto para começar seu cultivo?
          </h2>
          <p className="text-xl opacity-95">
            Encontre todos os equipamentos que você precisa no nosso marketplace
          </p>
          <Link href="/marketplace">
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold text-lg px-8 py-6">
              Ver Equipamentos <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
