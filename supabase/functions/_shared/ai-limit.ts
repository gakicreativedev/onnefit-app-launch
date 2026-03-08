import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function checkAndRecordAIUsage(
  userId: string,
  functionName: string,
  corsHeaders: Record<string, string>
): Promise<Response | null> {
  // Use service role to bypass RLS for the check
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Check limit using the DB function
  const { data, error } = await supabaseAdmin.rpc("check_ai_limit", {
    _user_id: userId,
  });

  if (error) {
    console.error("check_ai_limit error:", error.message);
    return null; // Allow on error (fail open)
  }

  const result = data as { plan: string; limit: number; used: number; allowed: boolean };

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: "ai_limit_reached",
        message: `Limite de IA atingido (${result.used}/${result.limit} este mês). Faça upgrade do seu plano para continuar.`,
        usage: result,
      }),
      {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Record the usage
  await supabaseAdmin.from("ai_usage").insert({
    user_id: userId,
    function_name: functionName,
    usage_type: "query",
  });

  return null; // No error, proceed
}
