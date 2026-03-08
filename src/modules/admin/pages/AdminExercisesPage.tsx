import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useExercises, type Exercise } from "../hooks/useExercises";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  AddCircleBold, PenBold, TrashBinTrashBold, MagniferBold, CloseCircleBold,
  DumbbellBold
} from "solar-icon-set";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

interface ExerciseForm {
  name: string;
  category: string;
  muscle_groups: string;
  description: string;
}

const emptyForm = (): ExerciseForm => ({ name: "", category: "", muscle_groups: "", description: "" });

export default function AdminExercisesPage() {
  const { user } = useAuth();
  const { exercises, loading, addExercise, updateExercise, deleteExercise } = useExercises();
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExerciseForm>(emptyForm());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => { setEditingId(null); setForm(emptyForm()); setImageFile(null); setImagePreview(null); setShowDialog(true); };

  const openEdit = (e: Exercise) => {
    setEditingId(e.id);
    setForm({ name: e.name, category: e.category || "", muscle_groups: (e.muscle_groups || []).join(", "), description: e.description || "" });
    setImagePreview(e.image_url || null);
    setImageFile(null);
    setShowDialog(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Imagem deve ter no máximo 5MB"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;
    const ext = imageFile.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("exercise-images").upload(path, imageFile, { contentType: imageFile.type });
    if (error) { toast.error("Erro ao enviar imagem"); return null; }
    return supabase.storage.from("exercise-images").getPublicUrl(path).data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name.trim() || !user) return;
    setSaving(true);

    let image_url: string | null = imagePreview;
    if (imageFile) {
      const uploaded = await uploadImage();
      if (!uploaded) { setSaving(false); return; }
      image_url = uploaded;
    }

    const data = {
      name: form.name.trim(),
      category: form.category.trim() || null,
      muscle_groups: form.muscle_groups.split(",").map(s => s.trim()).filter(Boolean),
      description: form.description.trim() || null,
      image_url,
      created_by: user.id,
    };

    if (editingId) {
      const { error } = await updateExercise(editingId, data);
      if (error) toast.error("Erro ao atualizar"); else { toast.success("Exercício atualizado!"); setShowDialog(false); }
    } else {
      const { error } = await addExercise(data);
      if (error) toast.error("Erro ao criar"); else { toast.success("Exercício criado!"); setShowDialog(false); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir "${name}"?`)) return;
    await deleteExercise(id);
    toast.success(`"${name}" removido`);
  };

  const filtered = exercises.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || (e.category || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div className="flex flex-col gap-4 md:gap-6 max-w-3xl mx-auto w-full" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-foreground">Biblioteca de <span className="text-primary">Exercícios</span></h1>
          <p className="text-sm text-muted-foreground">{exercises.length} exercício(s)</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <MagniferBold size={16} color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 rounded-2xl bg-muted/50 border-0 h-9 text-sm" />
          </div>
          <Button onClick={openCreate} className="rounded-xl gap-2 shrink-0">
            <AddCircleBold size={18} color="currentColor" />
            Novo
          </Button>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        {loading ? (
          <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-muted-foreground">
            <DumbbellBold size={48} color="currentColor" />
            <p className="text-base font-semibold">Nenhum exercício encontrado</p>
          </div>
        ) : (
          filtered.map((ex) => (
            <div key={ex.id} className="flex items-center gap-3 rounded-[16px] bg-card p-3">
              {ex.image_url ? (
                <img src={ex.image_url} alt={ex.name} className="h-12 w-12 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <DumbbellBold size={20} color="currentColor" className="text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{ex.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {ex.category && <span>{ex.category}</span>}
                  {ex.muscle_groups.length > 0 && <span> · {ex.muscle_groups.join(", ")}</span>}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(ex)} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary transition-colors">
                  <PenBold size={16} color="currentColor" />
                </button>
                <button onClick={() => handleDelete(ex.id, ex.name)} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                  <TrashBinTrashBold size={16} color="currentColor" />
                </button>
              </div>
            </div>
          ))
        )}
      </motion.div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Exercício" : "Novo Exercício"}</DialogTitle>
            <DialogDescription>Exercícios ficam disponíveis na biblioteca para todos os usuários</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Imagem</Label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-2xl" />
                  <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1">
                    <CloseCircleBold size={20} color="currentColor" className="text-destructive" />
                  </button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="w-full h-24 rounded-2xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors bg-muted/30 flex items-center justify-center text-muted-foreground text-sm">
                  Clique para adicionar imagem
                </button>
              )}
            </div>
            <div className="space-y-1">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Supino reto" />
            </div>
            <div className="space-y-1">
              <Label>Categoria</Label>
              <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Ex: Peito, Costas, Pernas..." />
            </div>
            <div className="space-y-1">
              <Label>Grupos Musculares (separados por vírgula)</Label>
              <Input value={form.muscle_groups} onChange={e => setForm({ ...form, muscle_groups: e.target.value })} placeholder="Peitoral maior, Deltóide anterior..." />
            </div>
            <div className="space-y-1">
              <Label>Descrição</Label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Instruções de execução..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.name.trim() || saving}>{saving ? "Salvando..." : editingId ? "Salvar" : "Criar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
