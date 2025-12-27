# 🌱 Sistema de Boas-Vindas e Cultivo Virtual

## 📦 Pacote de Boas-Vindas

Quando um usuário cria sua conta, ele recebe automaticamente um pacote de boas-vindas contendo:

### Seeds Iniciais
- **🌱 Northern Lights Auto** (COMUM) - Ideal para iniciantes
  - THC: 18-22%
  - Floração: 8-9 semanas
  - Dificuldade: Fácil
  
- **🌿 Blue Dream** (INCOMUM) - Alta produtividade
  - THC: 17-24%
  - Floração: 9-10 semanas
  - Dificuldade: Média
  
- **✨ White Widow** (RARA) - Qualidade premium
  - THC: 20-25%
  - Floração: 8-9 semanas
  - Dificuldade: Média

### Bônus
- 💰 200 CultivoCoins iniciais para cuidados básicos

## 🌿 Sistema de Plantio e Crescimento

### Estágios de Crescimento
1. **🌱 Semente** (2 dias) - Germinação inicial
2. **🌿 Muda** (7 dias) - Desenvolvimento das primeiras folhas
3. **🪴 Vegetativo** (14 dias) - Crescimento acelerado
4. **🌸 Pré-Floração** (7 dias) - Transição para floração
5. **🌺 Floração** (21 dias) - Formação das flores
6. **✨ Pronta para Colher** - Colheita disponível

### Cuidados Necessários

#### 💧 Regar (Gratuito)
- Restaura 50% do nível de água
- Essencial para manter a planta viva
- Água abaixo de 30%: penalidade de saúde

#### 🌡️ Ajustar VPD (10 coins)
- Define o Vapor Pressure Deficit ideal (1.2)
- Afeta diretamente a saúde da planta
- Fora da faixa 0.8-1.6: penalidade de saúde

#### 💡 Ajustar Iluminação (Gratuito)
- Configura horas de luz (12-24h)
- 18h recomendado para fase vegetativa
- Afeta velocidade de crescimento

#### 🧪 Aplicar Nutrientes (15 coins)
- Restaura 15% de saúde
- Acelera crescimento
- Melhora qualidade final

### Mecânicas de Crescimento

#### Degradação Natural
- **Água**: -2% por hora sem cuidados
- **Saúde**: Penalidades baseadas em negligência
  - Água < 30%: -10% saúde
  - Água < 50%: -5% saúde
  - VPD fora da faixa: -5% saúde

#### Progressão
- Planta só avança de estágio se:
  - ✅ Tempo necessário completado (100% progress)
  - ✅ Saúde acima de 50%
- Plantas negligenciadas ficam estagnadas

## 🏆 Sistema de Colheita e Cards NFT

### Qualidade da Colheita

A qualidade depende de:
- **Saúde final da planta**
- **Tamanho alcançado**
- **Tempo de cultivo**

#### Classificação de Qualidade
- **Perfect** (Saúde ≥90%, Tamanho ≥5g)
  - Raridade: LEGENDARY
  - Recompensa: 900 coins + 30 gems
  
- **Excellent** (Saúde ≥75%, Tamanho ≥4g)
  - Raridade: EPIC  
  - Recompensa: 750 coins + 25 gems
  
- **Good** (Saúde ≥60%, Tamanho ≥3g)
  - Raridade: RARE
  - Recompensa: 600 coins + 20 gems
  
- **Fair** (Saúde ≥45%, Tamanho ≥2g)
  - Raridade: UNCOMMON
  - Recompensa: 450 coins + 15 gems
  
- **Poor** (Abaixo dos requisitos)
  - Raridade: COMMON
  - Recompensa: 300 coins + 10 gems

### Card NFT-Style

Ao colher, é gerado um **Card colecionável** contendo:
- 📊 Estatísticas da planta
- 🧬 Genética completa
- ⏱️ Tempo de cultivo
- 💚 Saúde final
- ⚖️ Yield total
- 🏆 Qualidade alcançada

Esses cards ficam no inventário como recordação das colheitas.

## 🎯 Estratégia Recomendada

### Primeira Semana
1. Resgatar pacote de boas-vindas
2. Plantar **Northern Lights Auto** (mais fácil)
3. Regar diariamente
4. Ajustar luz para 18h

### Durante o Crescimento
- Regar sempre que água < 50%
- Aplicar nutrientes se saúde < 70%
- Manter VPD entre 0.8-1.6
- Monitorar progresso regularmente

### Colheita Optimal
- Esperar **HARVEST_READY**
- Garantir saúde > 90%
- Colher para gerar card LEGENDARY

## 📱 APIs Disponíveis

### `POST /api/grow/welcome-pack`
Resgata o pacote de boas-vindas

### `GET /api/grow/welcome-pack`
Verifica se já resgatou o pacote

### `POST /api/grow/plant`
Planta uma seed do inventário
```json
{
  "seedItemId": "...",
  "plantName": "Minha Planta"
}
```

### `POST /api/grow/plant/care`
Cuida da planta
```json
{
  "plantId": "...",
  "careType": "WATER|VPD_ADJUST|LIGHT_ADJUST|NUTRIENT",
  "value": 50
}
```

### `PATCH /api/grow/plant/care`
Atualiza crescimento (automático)
```json
{
  "plantId": "..."
}
```

### `POST /api/grow/plant/harvest`
Colhe a planta e gera card
```json
{
  "plantId": "..."
}
```

## 🚀 Próximas Melhorias

- [ ] Sistema de automação (itens que cuidam automaticamente)
- [ ] Cruzamento de genéticas
- [ ] Pragas e doenças
- [ ] Competições de cultivo
- [ ] Trading de cards NFT
- [ ] Integração com produtos reais do marketplace

---

Desenvolvido com 💚 para a comunidade Desapegrow
