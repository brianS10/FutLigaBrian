#!/bin/bash

# Quick Start Script para FutLigam
# Ejecuta este script para configurar el proyecto rápidamente

echo "🚀 FutLigam - Setup Rápido"
echo "================================"
echo ""

# Verificar Node.js
echo "✓ Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js no está instalado. Descárgalo de https://nodejs.org"
    exit 1
fi
echo "  Node.js versión: $(node --version)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "✗ Error instalando dependencias"
    exit 1
fi
echo "✓ Dependencias instaladas"
echo ""

# Verificar .env.local
echo "⚙️  Configurando variables de entorno..."
if [ ! -f .env.local ]; then
    echo "  Creando .env.local desde .env.example..."
    cp .env.example .env.local
    echo "  ⚠️  IMPORTANTE: Edita .env.local con tus credenciales de Supabase"
else
    echo "  .env.local ya existe"
fi
echo ""

# Type check
echo "🔍 Verificando tipos TypeScript..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "⚠️  Hay errores de TypeScript. Revísalos antes de continuar."
    exit 1
fi
echo "✓ TypeScript OK"
echo ""

# Lint
echo "📋 Ejecutando linter..."
npm run lint
echo "✓ Lint completado"
echo ""

echo "✅ Setup completado!"
echo ""
echo "Próximos pasos:"
echo "1. Edita .env.local con tus credenciales de Supabase"
echo "2. Ejecuta 'npm run dev' para iniciar el servidor"
echo "3. Abre http://localhost:3000 en tu navegador"
echo ""
echo "Para más información, consulta:"
echo "- INDEX.md (punto de inicio)"
echo "- INSTALLATION_GUIDE.md (guía de instalación)"
echo "- DEVELOPMENT_CHECKLIST.md (qué desarrollar)"
echo ""
