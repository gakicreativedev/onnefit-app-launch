import { useState } from "react";
import { motion } from "framer-motion";
import { useRecipes, useRecipeBookmarks, type Recipe } from "@/modules/diet/hooks/useRecipes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChefHatBold, MagniferBold, AddCircleBold, StarBold, WalletMoneyBold,
  SunBold, CupHotBold, MoonBold, ClipboardTextBold, TagBold, ChefHatHeartBold,
  PenBold, TrashBinTrashBold
} from "solar-icon-set";
import RecipeDetailDialog from "@/modules/diet/components/RecipeDetailDialog";
import CreateRecipeDialog from "@/modules/diet/components/CreateRecipeDialog";
import EditRecipeDialog from "@/modules/diet/components/EditRecipeDialog";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const COST_COLORS = ["", "text-green-500", "text-yellow-500", "text-red-500"];

export default function AdminRecipesPage() {
  const { recipes, loading, addRecipe, updateRecipe, deleteRecipe } = useRecipes();
  const { isBookmarked, toggle: toggleBookmark } = useRecipeBookmarks();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [costFilter, setCostFilter] = useState("all");

  const filtered = recipes.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !search || r.title.toLowerCase().includes(q) || r.ingredients?.some(i => i.toLowerCase().includes(q));
    const matchCategory = categoryFilter === "all" || r.category === categoryFilter;
    const matchCost = costFilter === "all" || String(r.cost_level || 1) === costFilter;
    return matchSearch && matchCategory && matchCost;
  });

  return (
    <>
      <motion.div
        className="flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto w-full"
        initial="hidden" animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-foreground">Receitas <span className="text-primary">Oficiais</span></h1>
            <p className="text-sm text-muted-foreground">{recipes.length} receita(s) na base</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <MagniferBold size={18} color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar receita..." className="pl-10 rounded-2xl bg-muted/50 border-0" />
            </div>
            <Button onClick={() => setShowCreate(true)} className="rounded-xl gap-2 shrink-0">
              <AddCircleBold size={18} color="currentColor" />
              Nova
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Todas" },
            { value: "breakfast", label: "Café", icon: SunBold },
            { value: "lunch", label: "Almoço", icon: ChefHatBold },
            { value: "snack", label: "Lanche", icon: CupHotBold },
            { value: "dinner", label: "Janta", icon: MoonBold },
            { value: "general", label: "Geral", icon: ClipboardTextBold },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${categoryFilter === cat.value ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}
            >
              {cat.icon && <cat.icon size={12} color="currentColor" />}
              {cat.label}
            </button>
          ))}
          <div className="h-6 w-px bg-muted-foreground/20 mx-1 self-center" />
          {[
            { value: "all", label: "Todos", icon: WalletMoneyBold },
            { value: "1", label: "Barato", className: "text-green-500" },
            { value: "2", label: "Médio", className: "text-yellow-500" },
            { value: "3", label: "Caro", className: "text-red-500" },
          ].map((cost: any) => (
            <button
              key={cost.value}
              onClick={() => setCostFilter(cost.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${costFilter === cost.value ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}
            >
              {cost.icon ? <cost.icon size={12} color="currentColor" /> : <TagBold size={12} color="currentColor" className={cost.className} />}
              {cost.label}
            </button>
          ))}
        </motion.div>

        {/* Recipe grid */}
        <motion.div variants={fadeUp}>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-muted-foreground">
              <ChefHatHeartBold size={48} color="currentColor" />
              <p className="text-base font-semibold">Nenhuma receita encontrada</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="flex flex-col rounded-2xl bg-card overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all text-left"
                >
                  {recipe.image_url ? (
                    <img src={recipe.image_url} alt={recipe.title} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 bg-primary/10 flex items-center justify-center">
                      <ChefHatBold size={32} color="currentColor" className="text-primary/40" />
                    </div>
                  )}
                  <div className="p-3 flex-1 flex flex-col gap-1">
                    <p className="text-sm font-bold text-foreground truncate">{recipe.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {recipe.calories ?? 0} kcal · {recipe.protein ?? 0}g prot
                    </p>
                    <div className="flex items-center gap-2 mt-auto pt-1">
                      {(recipe.avg_rating ?? 0) > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-yellow-500">
                          <StarBold size={12} color="currentColor" />
                          {(recipe.avg_rating ?? 0).toFixed(1)}
                        </span>
                      )}
                      {recipe.cost_level && (
                        <span className={`text-xs font-bold ${COST_COLORS[recipe.cost_level]}`}>
                          {"$".repeat(recipe.cost_level)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      <RecipeDetailDialog
        recipe={selectedRecipe}
        open={!!selectedRecipe}
        onOpenChange={(open) => !open && setSelectedRecipe(null)}
        isBookmarked={selectedRecipe ? isBookmarked(selectedRecipe.id) : false}
        onToggleBookmark={toggleBookmark}
        onEdit={(r) => { setSelectedRecipe(null); setEditingRecipe(r); }}
        onDelete={(id) => { deleteRecipe(id); setSelectedRecipe(null); }}
      />

      <CreateRecipeDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSubmit={addRecipe}
      />

      {editingRecipe && (
        <EditRecipeDialog
          recipe={editingRecipe}
          open={!!editingRecipe}
          onOpenChange={(open) => !open && setEditingRecipe(null)}
          onSubmit={updateRecipe}
        />
      )}
    </>
  );
}
