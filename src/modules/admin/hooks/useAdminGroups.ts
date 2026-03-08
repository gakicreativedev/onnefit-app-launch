import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AdminGroup {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  is_official: boolean;
  created_by: string;
  created_at: string;
  image_url: string | null;
  group_type: string | null;
  member_count: number;
}

export function useAdminGroups() {
  const [groups, setGroups] = useState<AdminGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const { data: groupsData } = await supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (!groupsData) { setGroups([]); setLoading(false); return; }

    const groupIds = groupsData.map(g => g.id);
    const { data: members } = await supabase.from("group_members").select("group_id").in("group_id", groupIds);
    const memberMap: Record<string, number> = {};
    (members || []).forEach(m => { memberMap[m.group_id] = (memberMap[m.group_id] || 0) + 1; });

    setGroups(groupsData.map(g => ({
      ...g,
      is_official: (g as any).is_official || false,
      member_count: memberMap[g.id] || 0,
    })));
    setLoading(false);
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const toggleOfficial = async (id: string, current: boolean) => {
    await supabase.from("groups").update({ is_official: !current } as any).eq("id", id);
    await fetchGroups();
  };

  const deleteGroup = async (id: string) => {
    await supabase.from("group_members").delete().eq("group_id", id);
    await supabase.from("groups").delete().eq("id", id);
    await fetchGroups();
  };

  return { groups, loading, toggleOfficial, deleteGroup, refetch: fetchGroups };
}
