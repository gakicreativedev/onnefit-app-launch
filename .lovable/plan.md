

# Correções de Inconsistências no App

## 1. Substituir emojis por Solar Icons

**Arquivos afetados** (19 arquivos com emojis na interface):

| Arquivo | Emojis | Substituição Solar Icon |
|---------|--------|------------------------|
| `CardioTracker.tsx` | 🏃🚶🏃‍♂️🚴🚵⚙️🪢🏊🚣🪜🎉 | `RunningBold`, `WalkingBold`, `RunningRoundBold`, `BicycleBold` (ou reutilizar Running variants), `SettingsBold`, `WaterdropsBold`, etc. |
| `ProgressPage.tsx` | 📏📈📷📅📊 | `RulerBold`, `GraphUpBold`, `CameraBold`, `CalendarBold`, `ChartSquareBold` |
| `PhotoGallery.tsx` | 📊🖼️📷🔄 | `ChartSquareBold`, `GalleryBold`, `CameraBold`, `RestartBold` |
| `MeasurementForm.tsx` | 📝 | `NoteBold` / `ClipboardTextBold` |
| `ProgressCharts.tsx` | 📈 | `GraphUpBold` |
| `CreatePostDialog.tsx` | 📷 | `CameraBold` |
| `DailyNutritionCard.tsx` | 💧 | `WaterdropsBold` |
| `TrainerDashboard.tsx` | 💪 | `DumbbellBold` |
| `GamificationPage.tsx` | 🏅 (badge_icon fallback) | `MedalRibbonBold` |
| `ErrorBoundary.tsx` | ⚠️ | `DangerTriangleBold` |
| `TreinAIPage.tsx` / `DietAIPage.tsx` | 📷🤖 | `CameraBold`, `BoltCircleBold` |
| `ProfilePage.tsx` | 🏋️ (placeholder) | Manter (é input do usuário) |
| `useGroupFeed.ts` | 🎉 (toast) | Remover emoji do toast |
| `useGroups.ts` | 🏆🥈🥉 (badge emojis salvos no DB) | Manter (dados persistidos) |
| `ActivityCard.tsx` | 🔥💪👏❤️🏆 fallback | Já usa Solar Icons para esses, apenas remover o fallback `<span>{emoji}</span>` |

**Nota**: Emojis que são dados do usuário (profile highlights, badge_icon do DB) serão mantidos como estão. Apenas emojis hardcoded na UI serão substituídos.

---

## 2. Contraste dos botões e hovers

O botão `default` já foi ajustado para `bg-foreground text-background hover:bg-white hover:text-black`. Vou revisar:

- Verificar botões `outline` e `secondary` para garantir contraste consistente
- Ajustar o variant `outline` para ter hover mais visível: `hover:bg-foreground hover:text-background`
- Garantir que badges de tab (WorkoutsPage) tenham contraste adequado no estado ativo/inativo

---

## 3. Treinos: Painéis de séries retráteis (ActiveWorkoutView)

**Estado atual**: Cada exercício no `ActiveWorkoutView` mostra todas as séries sempre expandidas, sem opção de retrair.

**Plano**:
- Adicionar estado `collapsedExercises` como `Set<number>` ao `ActiveWorkoutView`
- Salvar estado no `localStorage` (key: `fitsoul_exercise_collapse`)
- Iniciar **todos retraídos** por padrão
- Ao clicar no header do exercício, expandir/retrair as séries
- Mostrar indicador visual (chevron) e badge com progresso (`2/4 séries`)

---

## 4. TreinAI como botão abaixo de "Meus Treinos"

**Estado atual**: TreinAI é um card separado em `lg:col-span-2` ao lado do grid de treinos (`lg:col-span-3`), ocupando muito espaço visual.

**Plano**:
- Remover o card separado do TreinAI (a `<section className="lg:col-span-2">`)
- Remover o grid `grid-cols-1 lg:grid-cols-5`
- Adicionar um botão `BoltCircleBold + "Gerar treino com TreinAI"` logo abaixo do header "Meus Treinos", dentro da mesma section
- Estilo: botão `outline` com ícone, rounded-full, discreto mas acessível

---

## Resumo de arquivos a editar

| Arquivo | Mudança |
|---------|---------|
| `button.tsx` | Ajustar variant `outline` hover |
| `ActiveWorkoutView.tsx` | Adicionar collapse com localStorage |
| `WorkoutsPage.tsx` | Mover TreinAI para botão inline |
| `CardioTracker.tsx` | Emojis -> Solar Icons |
| `ProgressPage.tsx` | Emojis -> Solar Icons |
| `PhotoGallery.tsx` | Emojis -> Solar Icons |
| `MeasurementForm.tsx` | Emojis -> Solar Icons |
| `ProgressCharts.tsx` | Emojis -> Solar Icons |
| `CreatePostDialog.tsx` | Emojis -> Solar Icons |
| `DailyNutritionCard.tsx` | Emojis -> Solar Icons |
| `TrainerDashboard.tsx` | Emojis -> Solar Icons |
| `GamificationPage.tsx` | Emojis -> Solar Icons |
| `ErrorBoundary.tsx` | Emojis -> Solar Icons |
| `TreinAIPage.tsx` | Emojis -> Solar Icons |
| `DietAIPage.tsx` | Emojis -> Solar Icons |
| `useGroupFeed.ts` | Remover emoji do toast |

