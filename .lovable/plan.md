

## Plano: Atualizar o tier Free com IA limitada

### O que muda

O plano Grátis deixa de excluir IA completamente e passa a incluir 3 features limitadas:
- 1 consulta IA/mês
- 1 análise avançada/mês  
- 1 geração de plano/mês

### Alterações

**1. `src/modules/landing/LandingPage.tsx`**
- Adicionar novos feature keys ao plano Free: `"f10"`, `"f11"`, `"f12"` (IA limitada)
- Remover `"x0"`, `"x1"`, `"x3"` dos excluded do Free (manter apenas `"x2"` — suporte prioritário)

**2. Arquivos de tradução (`en.json`, `pt.json`, `es.json`)**
- Adicionar nas `pricing.features`:
  - `f10`: "1 consulta IA por mês" 
  - `f11`: "1 análise avançada por mês"
  - `f12`: "1 geração de plano por mês"
- Remover `x0` e `x3` dos excluded (já não se aplicam ao Free)

Isso mantém o custo estimado de ~R$0,90/mês por usuário free, viável com taxa de conversão de 3-5%.

