#!/bin/bash

echo "🔍 Verificando build antes do deploy..."

# Verificar se há erros de TypeScript
echo "📝 Checando TypeScript..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
  echo "❌ Erros de TypeScript encontrados!"
  exit 1
fi

# Testar build local
echo "🏗️  Testando build..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build falhou!"
  exit 1
fi

echo "✅ Tudo certo! Pode fazer push."
