# 🚚 Marcio Logística - Sistema de Gestão de Frota

## Visão Geral

**Marcio Logística** é uma plataforma completa de gestão de frota desenvolvida com as tecnologias mais modernas. O sistema oferece controle em tempo real de veículos, motoristas, pneus, combustível, manutenção e documentação, proporcionando eficiência operacional máxima.

## ✨ Principais Funcionalidades

- 📊 **Dashboard** - Visão geral em tempo real com métricas e KPIs
- 🚗 **Gestão de Veículos** - Cadastro, rastreamento e manutenção
- 👥 **Gestão de Motoristas** - Validação de CNH e desempenho
- ⛽ **Controle de Combustível** - Abastecimento e análise de consumo
- 🔧 **Manutenção** - Agendamento e histórico de serviços
- 🛞 **Gestão de Pneus** - Rastreamento e cálculo de vida útil
- 📄 **Documentação** - Gestão centralizada de documentos
- 📍 **Rastreamento** - Monitoramento em tempo real
- ⚠️ **Alertas** - Notificações e avisos automáticos
- 📈 **Relatórios** - Análises detalhadas e exportação de dados

## 🛠 Stack Tecnológico

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Autenticação**: Row Level Security (RLS)
- **Qualidade**: ESLint, TypeScript Strict Mode

## 📋 Estrutura do Banco de Dados

- **vehicles** - Informações dos veículos
- **drivers** - Dados dos motoristas
- **tires** - Gestão de pneus
- **fuel** - Controle de combustível
- **maintenance** - Histórico de manutenção
- **documents** - Documentação
- **tracking** - Rastreamento em tempo real

## 🚀 Instalação e Deploy

### Pré-requisitos
- Node.js 16+
- Bun ou npm

### Setup Rápido

```bash
# Clone o repositório
git clone https://github.com/wesmoura/marcio-logistica.git
cd marcio-logistica

# Instale as dependências
bun install
# ou
npm install
```

## 🔌 Integração com Supabase

A aplicação está conectada ao Supabase (PostgreSQL em nuvem) com:

- **Project ID**: `czmcecbespcgfzugbayx`
- **URL**: `https://czmcecbespcgfzugbayx.supabase.co`

## 🔐 Segurança

- Autenticação JWT com Supabase
- Row Level Security para controle de acesso granular
- Credenciais protegidas com Environment Variables
- Type-safe com TypeScript

## 📊 Performance

- Bundle otimizado com Vite
- Lazy loading de componentes
- CSS purging com Tailwind
- Fast Refresh instantâneo

## 📞 Contato

Desenvolvido com ❤️ para otimizar sua operação logística.

**Tecnologias**: React • TypeScript • Vite • Tailwind CSS • Supabase • PostgreSQL

Sim, pode!

Para conectar um domínio, vá para **Project > Settings > Domains** e clique em **Connect Domain**.

Leia mais aqui: [Configurando um domínio personalizado](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

Se precisar de ajuda com algum dos comandos ou etapas, posso te orientar!
