# Gemini Assistant Configuration for Language Teacher Admin Portal

## 🧠 Contexto do Projeto

Este projeto é um portal web administrativo voltado para professores de idiomas, permitindo gerenciar:

- Alunos e seus dados
- Lições e progresso semanal
- Tarefas (quizzes, vocabulário)
- Pagamentos via Stripe
- Configurações individuais de professores

O frontend é feito em **React com TypeScript** e usa **TailwindCSS** com estilos personalizados em `App.css`. O backend já está implementado com **NestJS + PostgreSQL**.

Na pasta ./example voce pode achar uma image png que é nossa referecia de desegin, e um arquivo txt que contem o Schama atual do Banco de dados.
---

## 🗂️ Estrutura do Projeto
src/
├── components/ # Navbar, Sidebar, Cards, etc
├── pages/ # LandingPage, DashboardPage, AlunosPage, StudentDetailPage, etc
├── hooks/ # useAlunos, useAlunoDetail, useAuth, etc
├── services/ # alunosService.ts, authService.ts
├── contexts/ # AuthContext
├── assets/ # Imagens locais e logos
├── App.css # Estilo principal inspirado no Stripe
└── App.tsx # Configuração de rotas com PrivateRoute

---

## 💻 Tecnologias e Padrões

- **React 18+**
- **TypeScript**
- **React Router DOM v6**
- **TailwindCSS** customizado
- **Autenticação via contexto (AuthContext)**
- **Consumo de APIs do backend NestJS**
- Componentes funcionais com `useEffect`, `useState`, `useContext`

---

## 🔧 Tarefas comuns que você pode ajudar

### 🌐 Rotas
- Criar novas páginas protegidas por autenticação (`PrivateRoute`)
- Adicionar rota dinâmica `/alunos/:id`

### 🧩 Componentes
- Criar `CardResumo`, `TabelaAluno`, `TabsAlunoDetail`
- Criar `ChartProgressoSemanal` com Recharts

### 🧠 Regras de Negócio
- Buscar alunos do teacher logado (`userId`)
- Mostrar progresso semanal baseado em tarefas concluídas
- Exibir histórico de aulas e pagamentos

### 🎨 Estilo
- Aplicar estilo inspirado em [`stripe.css`](https://stripe.com/)
- Garantir responsividade e clareza visual
- Corrigir imagens e ícones quebrados

---

## ✅ Convenções

- Funções assíncronas com `try/catch`
- Nomes de hooks: `useAlunoDetail`, `useAlunos`, etc
- Pastas e arquivos organizados por domínio
- Estilo em `App.css` + utilitários Tailwind
- Código limpo e tipado com `interface Aluno { ... }`

---

## 🔍 Exemplos de prompts úteis para este projeto

> 🧠 "Crie uma tabela que liste todos os alunos com nome, e-mail, status e botão de ver mais."  
> 💡 "Adicione um gráfico de barras para progresso semanal do aluno com dados mock."  
> ⚙️ "Crie um serviço `getProgressoSemanal(studentId)` no alunoService.ts."

---

## 🔒 Backend

- Toda autenticação é feita via contexto (`AuthContext`)
- `userId` está disponível via `useAuth()`
- O backend NestJS expõe endpoints REST:
  - `GET /teachers/:id/students`
  - `GET /students/:id/progress`
  - `GET /students/:id/classes`
  - `GET /students/:id/payments`

---

## 🧪 Testes e Evoluções Futuras

- Integrar `Recharts` ou `Chart.js` na aba de progresso
- Paginação e filtros no AlunosPage
- Adicionar testes unitários com React Testing Library
- Upload de imagens de perfil via form

---

## 🙋‍♂️ Como você pode me ajudar

> Me ajude a criar novos componentes, conectar APIs, organizar estados e aplicar estilos modernos.  
> Você pode sugerir melhores práticas e estruturar o código em componentes reutilizáveis.

----

# 🎨 Style Guide — Mindro

## 📌 Identidade Visual

### Logo
- **Ícone**: cérebro minimalista formado por **nós e conexões** (remetendo a redes neurais e aprendizado).
- **Tipografia**: *Montserrat Bold* ou *Manrope SemiBold* para modernidade e solidez.
- **Estilo**: formas arredondadas, acessíveis e confiáveis.

---

## 🌈 Paleta de Cores

| Papel         | Hex       | Descrição |
|---------------|-----------|-----------|
| **Primária**  | `#8B5CF6` | Roxo vibrante — criatividade e inovação |
| **Secundária**| `#1E40AF` | Azul profundo — confiança e tecnologia |
| **Fundo Claro**| `#F3F4F6` | Cinza claro neutro |
| **Texto Base**| `#111827` | Cinza quase preto para boa legibilidade |
| **Destaques** | `#FACC15` | Amarelo — energia e foco |

---

## 🔤 Tipografia

- **Título / Headings** → Montserrat Bold (36px, 28px, 20px)
- **Subtítulos** → Manrope SemiBold (18px)
- **Texto Corrido** → Inter Regular (16px, 14px)

Exemplo em CSS:

```css
h1, h2, h3 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
}

p, span, li {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}
