import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AdminPost {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  tags: string[];
  created_at: string;
  author_name: string | null;
  author_avatar: string | null;
  likes_count: number;
  comments_count: number;
}

export function useAdminPosts() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (!postsData) { setPosts([]); setLoading(false); return; }

    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const { data: profiles } = await supabase.from("public_profiles").select("user_id, name, avatar_url, username").in("user_id", userIds);
    const profileMap: Record<string, any> = {};
    (profiles || []).forEach(p => { profileMap[p.user_id!] = p; });

    const postIds = postsData.map(p => p.id);
    const { data: likes } = await supabase.from("post_likes").select("post_id").in("post_id", postIds);
    const { data: comments } = await supabase.from("post_comments").select("post_id").in("post_id", postIds);

    const likesMap: Record<string, number> = {};
    (likes || []).forEach(l => { likesMap[l.post_id] = (likesMap[l.post_id] || 0) + 1; });
    const commentsMap: Record<string, number> = {};
    (comments || []).forEach(c => { commentsMap[c.post_id] = (commentsMap[c.post_id] || 0) + 1; });

    setPosts(postsData.map(p => ({
      ...p,
      tags: p.tags || [],
      author_name: profileMap[p.user_id]?.name || profileMap[p.user_id]?.username || "Usuário",
      author_avatar: profileMap[p.user_id]?.avatar_url || null,
      likes_count: likesMap[p.id] || 0,
      comments_count: commentsMap[p.id] || 0,
    })));
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const deletePost = async (id: string) => {
    await supabase.from("posts").delete().eq("id", id);
    await fetchPosts();
  };

  return { posts, loading, deletePost, refetch: fetchPosts };
}
