

# Melhorias no Painel Admin

Este plano cobre 6 áreas de melhoria no painel administrativo.

---

## 1. Receitas — Igual ao painel de atleta

**Problema**: A página admin de receitas usa um formulário simples com ingredientes como texto separado por vírgula. A versão do atleta (`DietPage`) usa `CreateRecipeDialog` e `EditRecipeDialog` com ingredientes detalhados (nome, peso, macros por ingrediente), steps, imagem, custo, servings.

**Plano**:
- Reescrever `AdminRecipesPage` para reutilizar `CreateRecipeDialog` e `EditRecipeDialog` do módulo `diet/components`
- Reutilizar `RecipeDetailDialog` para visualização
- Usar o hook `src/modules/diet/hooks/useRecipes.ts` (do atleta, com ratings) em vez do `admin/hooks/useRecipes.ts`
- Adicionar filtros por categoria e busca, como no `DietPage`

---

## 2. Treinos — Gerenciar treinos padrão do app

**Problema**: `AdminWorkoutsPage` já existe com CRUD básico. Precisa melhorias para ser a fonte de treinos padrão visíveis para personais e atletas.

**Plano**:
- Manter a estrutura atual mas melhorar o formulário: adicionar `duration_minutes`, preview dos exercícios com drag-to-reorder
- Adicionar filtros por dificuldade e grupo muscular na listagem
- Adicionar busca por nome

---

## 3. Treinos — Biblioteca de Exercícios (CRUD)

**Problema**: Atualmente a `ExerciseLibrary` busca da API externa wger.de. O admin precisa poder criar, editar e excluir exercícios próprios na biblioteca interna.

**Plano**:
- Criar tabela `exercises` no banco: `id`, `name`, `category`, `muscle_groups[]`, `image_url`, `description`, `created_by`, `created_at`
- Criar nova página `AdminExercisesPage` em `/admin/exercises` com CRUD completo
- Adicionar um sub-tab ou link na página de treinos admin para navegar à biblioteca
- Upload de imagem do exercício para o bucket de storage

**Migration SQL**:
```sql
CREATE TABLE public.exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  muscle_groups text[] DEFAULT '{}',
  image_url text,
  description text,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercises_select" ON public.exercises FOR SELECT USING (true);
CREATE POLICY "exercises_admin" ON public.exercises FOR ALL USING (has_role(auth.uid(), 'admin'));
```

---

## 4. Posts — Feed de posts no admin

**Problema**: A página `AdminUpdatesPage` gerencia `app_updates` (changelog), não posts do feed social. O admin precisa ver e moderar o feed de posts (`posts` table).

**Plano**:
- Criar nova página `AdminPostsPage` que lista todos os posts da tabela `posts` com autor, imagem, conteúdo
- Permitir excluir posts (moderação)
- Exibir stats (likes, comments) por post
- Manter a rota `/admin/updates` para o changelog existente, e usar `/admin/posts` para o feed
- Adicionar RLS policy para admin deletar qualquer post
- Atualizar sidebar e bottom nav para incluir "Posts" como item separado de "Updates"

**Migration SQL**:
```sql
CREATE POLICY "posts_admin_delete" ON public.posts FOR DELETE USING (has_role(auth.uid(), 'admin'));
```

---

## 5. Grupos — Criar grupos oficiais e especiais

**Problema**: A rota `/admin/groups` já renderiza `GroupsPage` do módulo de grupos. Funciona, mas não tem diferenciação de grupos "oficiais".

**Plano**:
- Adicionar coluna `is_official boolean DEFAULT false` à tabela `groups`
- Na `GroupsPage`, quando acessada via admin, permitir marcar grupo como "oficial" com badge especial
- Criar `AdminGroupsPage` dedicada que mostra todos os grupos do sistema (não só os do admin), com opção de marcar como oficial, excluir, editar
- Admin pode deletar qualquer grupo

**Migration SQL**:
```sql
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS is_official boolean DEFAULT false;
CREATE POLICY "groups_admin_all" ON public.groups FOR ALL USING (has_role(auth.uid(), 'admin'));
```

---

## 6. Analytics — Visualizações completas

**Problema**: O dashboard atual mostra métricas básicas. Falta analytics detalhado de uso de IA, engagement, etc.

**Plano**:
- Criar nova página `AdminAnalyticsPage` em `/admin/analytics` (substituir `TrainerAnalyticsPage` que está sendo usada atualmente)
- Seções:
  - **Usuários**: total, novos por semana, taxa de onboarding, DAU/WAU/MAU
  - **Uso de IA**: total de queries por mês, breakdown por função (dietai/treinai), top usuários
  - **Engagement**: posts/dia, comentários/dia, likes/dia
  - **Treinos**: treinos completados por dia/semana, exercícios mais populares
  - **Planos**: distribuição de planos (free/essential/pro/premium)
- Atualizar a edge function `admin-metrics` para retornar dados adicionais de IA e engagement
- Usar `recharts` para gráficos (já instalado)

---

## Resumo de mudanças

| Área | Arquivos novos/editados |
|------|------------------------|
| Receitas | Editar `AdminRecipesPage.tsx` |
| Treinos | Editar `AdminWorkoutsPage.tsx` |
| Exercícios | Nova tabela + `AdminExercisesPage.tsx` |
| Posts | Nova policy + `AdminPostsPage.tsx` |
| Grupos | Nova coluna + `AdminGroupsPage.tsx` |
| Analytics | Novo `AdminAnalyticsPage.tsx` + edge function update |
| Routing | Editar `App.tsx`, `AdminSidebar.tsx`, `AdminBottomNav.tsx` |

São mudanças significativas. Recomendo implementar em fases, começando pelas que não precisam de migration (Receitas, melhorias nos Treinos) e depois as que precisam (Exercícios, Posts moderation, Grupos oficiais, Analytics).

