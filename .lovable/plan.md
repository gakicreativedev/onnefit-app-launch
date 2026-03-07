# Diagnóstico do OnneFit - Erros Identificados

## Situacao Atual

O codigo do OnneFit esta sincronizado corretamente no Lovable. No entanto, o app esta conectado a **dois projetos Supabase diferentes**:

- **Projeto antigo** (`cjqpetgzfctagftuomaj`): Usado pelo app em runtime (hardcoded no config.toml e nos requests). Tem dados e tabelas, mas com problemas.
- **Projeto novo** (`vfegxeoihucdjdnilzdo`): Conectado ao Lovable via .env. Esta completamente vazio (zero tabelas).

## Erros Identificados

### 1. Tabelas inexistentes (HTTP 404)

As seguintes tabelas nao existem no banco:

- `**body_measurements**` - usada em `/progress` para registrar medidas corporais
- `**progress_photos**` - usada em `/progress` para fotos de progresso

### 2. Recursao infinita em RLS Policies (HTTP 500)

- `**group_members**` e `**groups**` - as politicas de Row Level Security tem recursao infinita (`42P17`), impedindo qualquer operacao de leitura/escrita nos grupos

### 3. Coluna inexistente (HTTP 400)

- Tabela `groups` nao tem a coluna `**end_date**` - o codigo tenta inserir com esse campo mas ele nao existe no schema

### 4. Warning de React

- `MeasurementForm` esta recebendo `ref` mas nao usa `forwardRef` (warning, nao erro critico)

### 5. Conflito de projeto Supabase

- O `.env` aponta para o projeto novo (vazio), mas o app esta usando o projeto antigo que tem os dados. Isso precisa ser resolvido.

## Plano de Correcao

### Fase 1: Resolver o conflito de Supabase

Decidir qual projeto usar. Como o projeto antigo ja tem dados e tabelas, a opcao mais pratica e:

- Migrar todas as tabelas para o projeto novo (`vfegxeoihucdjdnilzdo`)

### Fase 2: Criar tabelas faltantes

Criar via SQL migration:

- `body_measurements` com colunas: weight_kg, body_fat_pct, waist_cm, hip_cm, chest_cm, arm_left_cm, arm_right_cm, thigh_left_cm, thigh_right_cm, neck_cm, notes, date
- `progress_photos` com colunas: photo_url, category, notes, date
- Adicionar coluna `end_date` na tabela `groups` (se nao existir)

### Fase 3: Corrigir RLS Policies

- Reescrever as policies de `group_members` e `groups` para eliminar a recursao infinita, usando funcoes `SECURITY DEFINER` para verificar membership sem recursao

### Fase 4: Fix menor no React

- Adicionar `forwardRef` ao componente `MeasurementForm`