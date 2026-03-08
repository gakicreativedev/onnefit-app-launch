import { useState } from "react";
import { motion } from "framer-motion";
import { useAdminGroups } from "../hooks/useAdminGroups";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  MagniferBold, TrashBinTrashBold, CupBold, UsersGroupRoundedBold,
  VerifiedCheckBold, GlobalBold, ShieldStarBold
} from "solar-icon-set";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function AdminGroupsPage() {
  const { groups, loading, toggleOfficial, deleteGroup } = useAdminGroups();
  const [search, setSearch] = useState("");

  const filtered = groups.filter(g => !search || g.name.toLowerCase().includes(search.toLowerCase()));

  const handleToggleOfficial = async (id: string, current: boolean) => {
    await toggleOfficial(id, current);
    toast.success(current ? "Grupo removido como oficial" : "Grupo marcado como oficial!");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir o grupo "${name}" e todos os membros?`)) return;
    await deleteGroup(id);
    toast.success("Grupo excluído");
  };

  return (
    <motion.div className="flex flex-col gap-4 md:gap-6 max-w-3xl mx-auto w-full" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-foreground">Gerenciar <span className="text-primary">Grupos</span></h1>
          <p className="text-sm text-muted-foreground">{groups.length} grupo(s) · {groups.filter(g => g.is_official).length} oficiais</p>
        </div>
        <div className="relative w-full sm:w-60">
          <MagniferBold size={16} color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 rounded-2xl bg-muted/50 border-0 h-9 text-sm" />
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        {loading ? (
          <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-muted-foreground">
            <CupBold size={48} color="currentColor" />
            <p className="text-base font-semibold">Nenhum grupo encontrado</p>
          </div>
        ) : (
          filtered.map((group) => (
            <div key={group.id} className="flex items-center gap-3 rounded-[16px] bg-card p-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 relative">
                {group.image_url ? (
                  <img src={group.image_url} alt="" className="h-12 w-12 rounded-xl object-cover" />
                ) : (
                  <CupBold size={24} color="currentColor" className="text-primary" />
                )}
                {group.is_official && (
                  <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                    <VerifiedCheckBold size={12} color="currentColor" className="text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground truncate">{group.name}</p>
                  {group.is_official && (
                    <span className="text-[9px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full shrink-0">OFICIAL</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="flex items-center gap-1"><UsersGroupRoundedBold size={12} color="currentColor" /> {group.member_count}</span>
                  <span>{group.is_public ? "Público" : "Privado"}</span>
                  {group.group_type && <span>· {group.group_type}</span>}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggleOfficial(group.id, group.is_official)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors ${group.is_official ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  title={group.is_official ? "Remover oficial" : "Marcar como oficial"}
                >
                  <ShieldStarBold size={16} color="currentColor" />
                </button>
                <button onClick={() => handleDelete(group.id, group.name)} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                  <TrashBinTrashBold size={16} color="currentColor" />
                </button>
              </div>
            </div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
