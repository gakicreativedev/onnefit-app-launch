import { useState } from "react";
import { motion } from "framer-motion";
import { useAdminPosts } from "../hooks/useAdminPosts";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  MagniferBold, TrashBinTrashBold, HeartBold, ChatRoundDotsBold, GalleryBold
} from "solar-icon-set";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function AdminPostsPage() {
  const { posts, loading, deletePost } = useAdminPosts();
  const [search, setSearch] = useState("");

  const filtered = posts.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.content || "").toLowerCase().includes(q) || (p.author_name || "").toLowerCase().includes(q);
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este post?")) return;
    await deletePost(id);
    toast.success("Post excluído");
  };

  return (
    <motion.div className="flex flex-col gap-4 md:gap-6 max-w-3xl mx-auto w-full" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-foreground">Moderação de <span className="text-primary">Posts</span></h1>
          <p className="text-sm text-muted-foreground">{posts.length} post(s) no feed</p>
        </div>
        <div className="relative w-full sm:w-60">
          <MagniferBold size={16} color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 rounded-2xl bg-muted/50 border-0 h-9 text-sm" />
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-3">
        {loading ? (
          <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-muted-foreground">
            <GalleryBold size={48} color="currentColor" />
            <p className="text-base font-semibold">Nenhum post encontrado</p>
          </div>
        ) : (
          filtered.map((post) => (
            <div key={post.id} className="rounded-[16px] bg-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={post.author_avatar || ""} />
                  <AvatarFallback className="text-xs">{(post.author_name || "U")[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{post.author_name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
                <button onClick={() => handleDelete(post.id)} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                  <TrashBinTrashBold size={16} color="currentColor" />
                </button>
              </div>

              {post.content && <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>}
              {post.image_url && <img src={post.image_url} alt="" className="w-full h-40 object-cover rounded-xl" />}

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><HeartBold size={14} color="currentColor" className="text-red-400" /> {post.likes_count}</span>
                <span className="flex items-center gap-1"><ChatRoundDotsBold size={14} color="currentColor" /> {post.comments_count}</span>
                {post.tags.length > 0 && (
                  <span className="truncate">#{post.tags.join(" #")}</span>
                )}
              </div>
            </div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
