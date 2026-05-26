# Polyglots 2.0

**Polyglots 2.0** é um aplicativo mobile de ensino de idiomas, com foco em experiências gamificadas e didáticas através de tarefas semanais, quizzes, vocabulários e controle financeiro. Construído com tecnologias modernas e arquitetura modular, o app oferece uma base sólida para expansão e personalização.

## 📱 Funcionalidades

- **Autenticação simulada** (mock, futura integração com API)
- **Seleção de idioma** com bandeiras e opções visuais
- **Tela Home** com cursos em destaque, progresso semanal e navegação intuitiva
- **Tarefas semanais**: Quiz, vocabulário e progresso individual
- **Tela de Perfil** com metas e conquistas
- **Tela Financeira** para controle de mensalidade e extrato
- **Sistema de feedback** após quizzes/tarefas: "YOU WIN" / "YOU LOST"

## 🛠️ Tecnologias Utilizadas

- **React Native** (Expo)
- **TypeScript**
- **Tailwind CSS** (NativeWind)
- **React Navigation** (Stack + Bottom Tabs)
- **Ionicons** via `@expo/vector-icons`
- **Safe Area Context**
- **SQLite** para armazenamento local
- **Expo Constants** para configurações do ambiente

## 📁 Estrutura de Pastas

```
/src
  /assets         # Imagens, ícones, bandeiras
    /flags        # Bandeiras dos idiomas
    /profile      # Avatares de perfil
  /context        # Contextos globais (ex: UserContext)
  /database       # Inicialização e schema do SQLite
  /navigation     # Configuração de rotas e navegação
  /screens        # Telas principais do app
    AuthNavigator.tsx
    FinanceScreen.tsx
    HomeScreen.tsx
    LanguageSelector.tsx
    LoginScreen.tsx
    MainTabs.tsx
    Onboarding.tsx
    ProfileScreen.tsx
    SignupScreen.tsx
    SplashScreen.tsx
    TaskQuizScreen.tsx
    TasksScreen.tsx
    TaskVocabularyScreen.tsx
  /services       # Serviços e integrações (API, storage, lógica de negócio)
    courseService.ts
    lessonService.ts
    paymentService.ts
    storage.ts
    taskQuizService.ts
    taskService.ts
    taskVocabularyService.ts
    userService.ts
  /types          # Definições de tipos TypeScript
    expo-sqlite.d.ts
    nativewind.d.ts
```

> **Observação:** Não há subpastas como `/auth`, `/home`, `/tasks`, `/profile`, `/financial` em `/screens` — cada tela está em um arquivo próprio.

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`)
- Git
- VS Code (recomendado) ou outro editor de código
- iOS Simulator (Mac) ou Android Studio (Windows/Linux)

### Passos para rodar

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/polyglots-2.0.git
   cd polyglots-2.0
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz do projeto com:
   ```env
   API_URL=sua_url_api
   API_BEARER_TOKEN=seu_token
   ```

4. **Configure o app.config.js** (se necessário)
   ```js
   export default {
     expo: {
       // ... outras configurações
       extra: {
         API_URL: process.env.API_URL,
         API_BEARER_TOKEN: process.env.API_BEARER_TOKEN
       }
     }
   };
   ```

5. **Inicie o projeto**
   ```bash
   npm start
   ```

### Scripts Disponíveis

- `npm start` — Inicia o servidor de desenvolvimento
- `npm run android` — Roda o app no emulador Android
- `npm run ios` — Roda o app no simulador iOS
- `npm run web` — Roda o app na versão web
- `npm run lint` — Executa o linter
- `npm run type-check` — Verifica os tipos TypeScript

## 👨‍💻 Guia de Desenvolvimento

### Padrões de Código

- Use componentes funcionais com hooks
- Mantenha a lógica de negócio em services
- Utilize TypeScript para todos os arquivos
- Use Tailwind CSS via NativeWind para estilização
- Organize as rotas em `/src/navigation`
- Documente funções e componentes complexos

### Banco de Dados

- Use SQLite para dados locais
- Queries e inicialização em `/src/database`

### Navegação

- React Navigation (Stack + Tabs)
- Rotas organizadas em `/src/navigation/index.tsx`
- Documente novas rotas ao adicionar


## 🏗️ Fluxo de Trabalho para Contribuição

1. **Crie uma branch para sua feature ou correção:**
   ```bash
   git checkout -b feature/nome-da-feature
   ```
2. **Faça suas alterações e commits:**
   ```bash
   git add .
   git commit -m "feat: descrição da feature"
   ```
3. **Envie para o repositório remoto:**
   ```bash
   git push origin feature/nome-da-feature
   ```
4. **Abra um Pull Request no GitHub e aguarde revisão.**

**Boas práticas:**
- Mantenha os componentes pequenos e focados
- Documente funções e trechos complexos
- Use TypeScript sempre que possível
- Siga o princípio DRY (Don't Repeat Yourself)
- Faça commits atômicos e bem descritos


## 📚 Documentação Adicional

- [Documentação do Expo](https://docs.expo.dev)
- [Documentação do React Native](https://reactnative.dev/docs/getting-started)
- [Documentação do NativeWind](https://www.nativewind.dev)
- [Documentação do React Navigation](https://reactnavigation.org/docs/getting-started)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por uma equipe apaixonada por idiomas e tecnologia.