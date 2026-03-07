

## Plano: Tornar o OnneFit Real

### Passo 1: Conectar ao GitHub e trazer o código
1. Vá em **Settings** (configurações do projeto, canto superior) → **GitHub** → **Connect project**
2. Autorize o Lovable no GitHub se ainda não fez
3. **Importante**: Como o repositório `onnefit` já existe, você precisa conectar a ele. Selecione sua conta GitHub e o repositório `gakicreativedev/onnefit`
4. O código será sincronizado automaticamente para este projeto Lovable

### Passo 2: Conectar o Supabase externo
1. Depois que o código estiver sincronizado, vá em **Settings** → **Supabase** → **Connect**
2. Insira a **URL** e a **anon key** do seu projeto Supabase
3. Isso permitirá que o app se conecte ao banco de dados real

### Passo 3: Verificar migrations e banco de dados
1. O repositório já tem uma pasta `supabase/` com migrations SQL
2. Precisaremos garantir que essas migrations foram aplicadas no seu projeto Supabase
3. Verificar se as tabelas, RLS policies e edge functions estão configuradas corretamente

### Passo 4: Testar o app end-to-end
1. Testar autenticação (login/signup)
2. Verificar se os módulos principais funcionam com dados reais (workouts, diet, groups, etc.)
3. Corrigir quaisquer erros de conexão com o banco

---

**⚠️ Primeiro passo necessário**: Você precisa conectar o GitHub manualmente nas configurações do projeto. Depois que o código estiver aqui, posso ajudar com a integração do Supabase e ajustes necessários.

