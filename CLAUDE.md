# TrackFit - Claude Development Guidelines

Este documento contém as diretrizes, padrões e melhores práticas para desenvolvimento do TrackFit usando Expo + React Native.

## Stack Tecnológica

- **Framework**: Expo SDK 52+ com React Native
- **Linguagem**: TypeScript (strict mode)
- **State Management**: Zustand com persist middleware
- **Navegação**: React Navigation (Native Stack)
- **Validação**: Zod para schemas
- **Storage**: expo-secure-store (dados sensíveis) + AsyncStorage (dados normais)
- **Crypto**: expo-crypto para hashing de senhas
- **Styling**: StyleSheet nativo do React Native

## Princípios Fundamentais

### 1. Type-Safety End-to-End
- Usar TypeScript strict mode, sem `any`
- Evitar uso de `as` (type assertions)
- Deixar o compilador inferir tipos sempre que possível
- Tipos devem estar próximos de onde são usados
- Preferir `type` ao invés de `interface`

### 2. Separação de Responsabilidades

```
src/
├── components/          # Componentes UI puros
├── screens/            # Telas da aplicação
├── navigation/         # Configuração de navegação
├── stores/             # Zustand stores
├── services/           # Lógica de negócio
│   ├── auth/          # Autenticação
│   ├── validation/    # Validadores
│   ├── storage/       # Abstração de storage
│   └── errors/        # Sistema de erros
├── hooks/              # Custom hooks
├── utils/              # Utilitários puros
├── config/             # Configurações
├── constants/          # Constantes da aplicação
└── types/              # Tipos compartilhados
```

### 3. State Management com Zustand

**Criar um novo store:**

```typescript
// src/stores/example-store.ts
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ExampleStore = {
  // State
  count: number;
  name: string;

  // Actions
  increment: () => void;
  setName: (name: string) => void;
  reset: () => void;
};

export const useExampleStore = create<ExampleStore>()(
  persist(
    (set) => ({
      // Initial state
      count: 0,
      name: '',

      // Actions
      increment: () => set((state) => ({count: state.count + 1})),
      setName: (name) => set({name}),
      reset: () => set({count: 0, name: ''}),
    }),
    {
      name: '@TrackFit:example-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

**Usar o store em componentes:**

```typescript
// Selecionar apenas o necessário (evita re-renders desnecessários)
const count = useExampleStore((state) => state.count);
const increment = useExampleStore((state) => state.increment);

// OU múltiplos valores
const {count, name, increment} = useExampleStore((state) => ({
  count: state.count,
  name: state.name,
  increment: state.increment,
}));
```

### 4. Validação e Segurança

**Validação de entrada:**

```typescript
// src/services/validation/example-validator.ts
import {z} from 'zod';

const exampleSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120),
});

type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export const exampleValidator = {
  validate(data: unknown): ValidationResult {
    const result = exampleSchema.safeParse(data);

    if (!result.success) {
      return {
        isValid: false,
        error: result.error.errors[0].message,
      };
    }

    return {isValid: true};
  },

  validateOrThrow(data: unknown): z.infer<typeof exampleSchema> {
    return exampleSchema.parse(data);
  },
};
```

**Segurança de senhas:**
- Mínimo 8 caracteres
- Uppercase, lowercase, número, caractere especial
- Entropia mínima: 40
- Hashing: PBKDF2-like com SHA512, 10.000 iterações
- Salt: 16 bytes gerados com expo-crypto

### 5. Tratamento de Erros

**Criar erros customizados:**

```typescript
// src/services/errors/custom-error.ts
export class CustomError extends Error {
  constructor(
    message: string,
    public code: string = 'CUSTOM_ERROR',
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CustomError';
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
```

**Usar ErrorBoundary:**

```typescript
// App.tsx
import {ErrorBoundary} from './src/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
```

**Logging estruturado:**

```typescript
import {errorLogger} from './services/errors/error-logger';

try {
  await riskyOperation();
} catch (error) {
  errorLogger.error('Operation failed', error as Error, {
    userId: user.id,
    operation: 'riskyOperation',
  });
}
```

### 6. Custom Hooks

**Padrão para custom hooks:**

```typescript
// src/hooks/use-example.ts
import {useCallback} from 'react';
import {useExampleStore} from '../stores/example-store';
import {exampleService} from '../services/example-service';

export function useExample() {
  const state = useExampleStore((state) => state);

  const doSomething = useCallback(async (data: string) => {
    try {
      const result = await exampleService.process(data);
      state.updateResult(result);
    } catch (error) {
      errorLogger.error('Failed to process', error as Error);
      throw error;
    }
  }, [state]);

  return {
    ...state,
    doSomething,
  };
}
```

### 7. Evitar useEffect

**❌ NÃO fazer:**

```typescript
// Buscar dados com useEffect
useEffect(() => {
  fetchData().then(setData);
}, []);
```

**✅ FAZER:**

```typescript
// Use React Query ou implemente no hook de autenticação
const {data, isLoading} = useQuery(['key'], fetchData);

// OU para inicialização única (como sessão)
useEffect(() => {
  const initAuth = async () => {
    const session = await authService.loadSession();
    if (session) setUser(session);
    await initialize();
  };
  initAuth();
}, []); // Apenas para inicialização, não para data fetching
```

### 8. Componentes

**Componentes devem ser puros:**

```typescript
// ❌ NÃO declarar constantes/funções dentro do componente
export const BadComponent = () => {
  const helper = () => {}; // Re-criado a cada render
  const CONSTANT = 'value'; // Re-criado a cada render

  return <View />;
};

// ✅ FAZER - mover para fora
const helper = () => {};
const CONSTANT = 'value';

export const GoodComponent = () => {
  return <View />;
};
```

**Validação em tempo real:**

```typescript
export const FormScreen = () => {
  const {errors, validateEmail, clearError} = useFormValidation();
  const [email, setEmail] = useState('');

  return (
    <View>
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) clearError('email');
        }}
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}
    </View>
  );
};
```

### 9. Nomenclatura

**Convenções:**
- SNAKE_CAPS para constantes: `MAX_RETRY_COUNT`
- camelCase para funções e variáveis: `handleLogin`, `isLoading`
- PascalCase para componentes e tipos: `LoginScreen`, `User`
- kebab-case para arquivos: `auth-service.ts`, `login-screen.tsx`

**Nomes descritivos:**
- ✅ `retryAfterMs` (específico)
- ❌ `timeout` (vago)
- ✅ `emailValidator` (concreto)
- ❌ `validator` (genérico)

**Evitar redundância:**
- ✅ `users` (limpo)
- ❌ `userList` (redundante)
- ✅ `isLoading` (claro)
- ❌ `loadingState` (verboso)

### 10. Storage

**Dados sensíveis (expo-secure-store):**

```typescript
import {secureStorage} from './services/storage/secure-storage';

// Salvar
await secureStorage.setSecure('auth-token', token);

// Ler
const token = await secureStorage.getSecure('auth-token');
```

**Dados normais (AsyncStorage):**

```typescript
// Salvar objeto
await secureStorage.setItem('user-preferences', {theme: 'dark'});

// Ler objeto
const prefs = await secureStorage.getItem<UserPreferences>('user-preferences');
```

**Sempre prefixar keys:** `@TrackFit:nome-da-key`

### 11. Autenticação

**Fluxo de autenticação:**

1. Usuário entra credenciais
2. Validação no cliente (formato, requisitos)
3. Normalização (email lowercase, trim)
4. Verificação de rate limit
5. Hash da senha (se signup)
6. Chamada ao serviço de auth
7. Salvar sessão (session-manager)
8. Atualizar store (auth-store)
9. Atualizar dias ativos (user-store)

**Rate limiting:**
- 3 tentativas por 15 minutos
- Bloqueia por email normalizado
- Reset automático após janela

**Session management:**
- Timeout: 7 dias
- Validação automática na inicialização
- Cleanup de sessões expiradas

### 12. Testes

**Estrutura de testes:**

```typescript
describe('AuthService', () => {
  describe('signIn', () => {
    it('authenticates user with valid credentials', async () => {
      // Arrange
      const email = 'user@example.com';
      const password = 'SecurePass123!';

      // Act
      const user = await authService.signIn(email, password);

      // Assert
      expect(user).toBeDefined();
      expect(user.email).toBe(email);
    });

    it('throws error with invalid credentials', async () => {
      await expect(
        authService.signIn('user@example.com', 'wrong')
      ).rejects.toThrow(AuthenticationError);
    });
  });
});
```

**Princípios:**
- Testar comportamento, não implementação
- Usar 3ª pessoa: `it('validates email format')`
- Não usar "should": ❌ `it('should validate')` → ✅ `it('validates')`
- Um teste por bug fixado (previne regressão)

### 13. Performance

**Otimizações:**

```typescript
// Selecionar apenas o necessário do store
const name = useUserStore((state) => state.name);

// Memoizar callbacks
const handlePress = useCallback(() => {
  doSomething();
}, [dependencies]);

// Evitar re-renders desnecessários
const MemoizedComponent = React.memo(ExpensiveComponent);
```

### 14. Acessibilidade

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Login button"
  accessibilityHint="Double tap to sign in">
  <Text>Login</Text>
</TouchableOpacity>
```

### 15. Git Commits

**Conventional Commits:**

```bash
# Features
feat: add password strength indicator
feat(auth): implement rate limiting

# Fixes
fix: resolve memory leak in useAuth hook
fix(validation): correct email regex pattern

# Refactoring
refactor: extract validation to service layer
refactor(stores): migrate from Context to Zustand

# Documentation
docs: add setup instructions to README
docs(api): document authentication endpoints

# Chores
chore: update dependencies
chore(deps): upgrade expo to 52.0.0
```

**Regras:**
- Não mencionar "Claude Code" nas mensagens
- Usar convenção: `tipo(escopo): descrição breve`
- Primeira letra minúscula
- Sem ponto final
- Máximo 72 caracteres no título

## Padrões de Arquivos

### Service Layer

```typescript
// src/services/example/example-service.ts
import {ValidationError} from '../errors/error-types';
import {errorLogger} from '../errors/error-logger';

class ExampleService {
  async process(input: string): Promise<Result> {
    try {
      // Validação
      if (!input) {
        throw new ValidationError('Input is required', 'INVALID_INPUT');
      }

      // Processamento
      const result = await this.doWork(input);

      return result;
    } catch (error) {
      errorLogger.error('Failed to process', error as Error, {input});
      throw error;
    }
  }

  private async doWork(input: string): Promise<Result> {
    // Implementação
  }
}

export const exampleService = new ExampleService();
```

### Validadores

```typescript
// src/services/validation/example-validator.ts
import {VALIDATION_RULES} from '../../constants/validation-rules';
import {ERROR_MESSAGES} from '../../constants/error-messages';

type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export const exampleValidator = {
  validate(value: string): ValidationResult {
    // Validações
    if (value.length < VALIDATION_RULES.example.minLength) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.exampleTooShort,
      };
    }

    return {isValid: true};
  },

  normalize(value: string): string {
    return value.trim().toLowerCase();
  },
};
```

### Constantes

```typescript
// src/constants/example-constants.ts
export const EXAMPLE_CONSTANTS = {
  maxRetries: 3,
  timeoutMs: 5000,
  apiUrl: 'https://api.example.com',
} as const;

// src/config/example-config.ts
export const EXAMPLE_CONFIG = {
  feature: {
    enabled: true,
    maxItems: 100,
  },
  performance: {
    cacheSize: 50,
    ttl: 3600,
  },
} as const;
```

## Checklist para PRs

- [ ] TypeScript compila sem erros (`npx tsc --noEmit`)
- [ ] Testes passam
- [ ] Sem `any`, `as` desnecessários
- [ ] Validação de inputs implementada
- [ ] Erros tratados adequadamente
- [ ] Logs estruturados adicionados
- [ ] Acessibilidade considerada
- [ ] Performance otimizada (memoization se necessário)
- [ ] Nomenclatura descritiva
- [ ] Código organizado por feature
- [ ] Commit messages seguem convenção

## Comandos Úteis

```bash
# Desenvolvimento
npm run ios                    # Rodar iOS
npm run android                # Rodar Android
npx tsc --noEmit              # Check TypeScript
npx expo start                 # Dev server

# Instalação de dependências
npx expo install <package>     # Instalar com versão compatível

# Linting
npm run lint                   # Rodar linter
npm run lint:fix              # Fix automático

# Testes
npm test                       # Rodar testes
npm test -- --watch           # Watch mode
```

## Recursos

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Zod Documentation](https://zod.dev/)
- [React Navigation](https://reactnavigation.org/)

---

**Última atualização:** 2025-11-15
**Versão:** 1.0.0
