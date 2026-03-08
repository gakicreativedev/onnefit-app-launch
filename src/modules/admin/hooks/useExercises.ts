import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Exercise {
  id: string;
  name: string;
  category: string | null;
  muscle_groups: string[];
  image_url: string | null;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("exercises")
      .select("*")
      .order("name", { ascending: true });
    setExercises((data as Exercise[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchExercises(); }, [fetchExercises]);

  const addExercise = async (exercise: Omit<Exercise, "id" | "created_at">) => {
    const { error } = await supabase.from("exercises").insert(exercise);
    if (!error) await fetchExercises();
    return { error };
  };

  const updateExercise = async (id: string, exercise: Partial<Omit<Exercise, "id" | "created_at">>) => {
    const { error } = await supabase.from("exercises").update(exercise).eq("id", id);
    if (!error) await fetchExercises();
    return { error };
  };

  const deleteExercise = async (id: string) => {
    await supabase.from("exercises").delete().eq("id", id);
    await fetchExercises();
  };

  return { exercises, loading, addExercise, updateExercise, deleteExercise, refetch: fetchExercises };
}
