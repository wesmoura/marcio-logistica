# Marcio Logística

## Informações do projeto



## Como posso editar este código?

Existem várias formas de editar sua aplicação.


### **Usar seu IDE preferido**

Se preferir trabalhar localmente usando seu próprio ambiente de desenvolvimento (IDE), você pode clonar este repositório e enviar (push) as alterações. Essas alterações também serão refletidas no Lovable.

O único requisito é ter o Node.js e o npm instalados — [instale com o nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Siga estes passos:

```sh
# Passo 1: Clone o repositório usando a URL Git do projeto.
git clone <SUA_URL_GIT>

# Passo 2: Acesse o diretório do projeto.
cd <NOME_DO_SEU_PROJETO>

# Passo 3: Instale as dependências necessárias.
npm i

# Passo 4: Inicie o servidor de desenvolvimento com recarregamento automático e visualização instantânea.
npm run dev
```

### **Editar um arquivo diretamente no GitHub**

* Navegue até o(s) arquivo(s) desejado(s).
* Clique no botão "Edit" (ícone de lápis) no canto superior direito da visualização do arquivo.
* Faça suas alterações e confirme (commit) as mudanças.

### **Usar o GitHub Codespaces**

* Vá para a página principal do seu repositório.
* Clique no botão "Code" (botão verde) próximo ao canto superior direito.
* Selecione a aba "Codespaces".
* Clique em "New codespace" para iniciar um novo ambiente Codespace.
* Edite os arquivos diretamente no Codespace e, ao terminar, confirme e envie (push) suas alterações.

## Quais tecnologias são usadas neste projeto?

Este projeto foi construído com:

* Vite
* TypeScript
* React
* shadcn-ui
* Tailwind CSS

## Resetar o estado para este exato momento

Se precisar voltar a aplicação exatamente para o estado atual (antes de qualquer nova mudança), rode:

```bash
git reset --hard && git clean -fd
```

Caso esteja sem Git, recomendo criar um ponto de restauração agora:

```bash
git init
git add -A
git commit -m "snapshot: estado estável com pneus/abastecimentos/fretes e rastreamento simulado"
```

Depois, para voltar a este snapshot:

```bash
git reset --hard HEAD
git clean -fd
```

## Banco de Dados (Supabase)

O arquivo `supabase/001_schema.sql` define tabelas e relacionamentos:

- veículos ↔ motoristas (estado atual via FKs)
- pneus → veículos; `tire_cycles` e `tire_movements`
- abastecimentos → veículo, motorista
- fretes → veículo, motorista, risco
- manutenção → veículo, pneu
- rastreamento (`positions`) → veículo, motorista, frete
- alertas e documentos genéricos relacionados a qualquer entidade

Para aplicar no Supabase:

```bash
psql "$SUPABASE_DATABASE_URL" -f supabase/001_schema.sql
```

## Posso conectar um domínio personalizado ao meu projeto Lovable?

Sim, pode!

Para conectar um domínio, vá para **Project > Settings > Domains** e clique em **Connect Domain**.

Leia mais aqui: [Configurando um domínio personalizado](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

Se precisar de ajuda com algum dos comandos ou etapas, posso te orientar!
