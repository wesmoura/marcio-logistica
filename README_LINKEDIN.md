# 🚚 Marcio Logística - Sistema de Gestão de Frota

## Visão Geral

**Marcio Logística** é uma plataforma completa de gestão de frota desenvolvida com as tecnologias mais modernas. O sistema oferece controle em tempo real de veículos, motoristas, pneus, combustível, manutenção e documentação, proporcionando eficiência operacional máxima.

## ✨ Principais Funcionalidades

### 📊 Dashboard
- Visão geral em tempo real da frota
- Métricas e KPIs principais
- Gráficos e análises visuais

### 🚗 Gestão de Veículos
- Cadastro completo de frotas
- Rastreamento de localização
- Histórico de manutenção
- Status operacional

### 👥 Gestão de Motoristas
- Cadastro de motoristas
- Validação de CNH e documentos
- Acompanhamento de conformidade
- Histórico de desempenho

### ⛽ Combustível
- Controle de abastecimento
- Análise de consumo
- Alertas de anomalias

### 🔧 Manutenção
- Agendamento de manutenção preventiva
- Registro de manutenções realizadas
- Histórico completo de serviços

### 🛞 Gestão de Pneus
- Rastreamento de pneus
- Cálculo de vida útil
- Status de recapagem

### 📄 Documentação
- Gestão centralizada de documentos
- Controle de prazos e validades
- Conformidade regulatória

### 📍 Rastreamento
- Monitoramento em tempo real
- Histórico de localização
- Alertas de desvios

### ⚠️ Alertas
- Notificações de anomalias
- Alertas de manutenção preventiva
- Avisos de documentação vencida

### 📈 Relatórios
- Análises detalhadas
- Exportação de dados
- Insights operacionais

## 🛠 Stack Tecnológico

### Frontend
- **React 18** - UI dinâmica e interativa
- **TypeScript** - Type-safe development
- **Vite** - Build tool moderno e rápido
- **Tailwind CSS** - Estilização responsiva
- **shadcn/ui** - Componentes acessíveis e customizáveis
- **Radix UI** - Primitivas de componentes

### Backend & Banco de Dados
- **Supabase** - PostgreSQL em nuvem
- **Autenticação** - Row Level Security (RLS)

### Qualidade de Código
- **ESLint** - Linting de JavaScript/TypeScript
- **TypeScript Strict Mode** - Type checking rigoroso

## 📋 Estrutura do Banco de Dados

### Principais Tabelas
- **vehicles** - Informações dos veículos
- **drivers** - Dados dos motoristas
- **tires** - Gestão de pneus
- **fuel** - Controle de combustível
- **maintenance** - Histórico de manutenção
- **documents** - Documentação
- **tracking** - Rastreamento em tempo real

## 🚀 Como Começar

### Pré-requisitos
- Node.js 16+
- Bun (recomendado) ou npm

### Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Instale as dependências
bun install
# ou
npm install

# Configure as variáveis de ambiente
# Copie .env.example para .env.local e adicione suas credenciais
```

## 🔌 Integração com Supabase

A aplicação está conectada ao Supabase (PostgreSQL em nuvem) com as seguintes credenciais:

- **Project ID**: `czmcecbespcgfzugbayx`
- **URL**: `https://czmcecbespcgfzugbayx.supabase.co`

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Dashboard/
│   ├── Vehicles/
│   ├── Drivers/
│   ├── Fuel/
│   ├── Maintenance/
│   ├── Tires/
│   ├── Documents/
│   ├── Tracking/
│   ├── Reports/
│   ├── Alerts/
│   ├── Settings/
│   ├── Layout/
│   └── ui/
├── integrations/supabase/
├── pages/
├── lib/
├── hooks/
└── App.tsx

supabase/
├── config.toml
└── 001_schema.sql
```

## 🔐 Segurança

- **Autenticação Supabase** - Integrada com JWT
- **Row Level Security** - Policies de acesso granular
- **Environment Variables** - Credenciais protegidas
- **TypeScript** - Type safety em toda aplicação

## 📊 Performance

- **Vite** - Bundle size otimizado
- **React Fast Refresh** - HMR instantâneo
- **Lazy Loading** - Componentes carregados sob demanda
- **CSS Purging** - Tailwind remove CSS não utilizado

## 🤝 Contribuindo

Este é um projeto em desenvolvimento. Melhorias e feedback são bem-vindos!

## 📞 Contato

Desenvolvido com ❤️ para otimizar sua operação logística.

---

**Tecnologias**: React • TypeScript • Vite • Tailwind CSS • Supabase • PostgreSQL

**Status**: Em Produção ✅
