import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase } from "../supabase-client.ts";
import { corsHeaders } from "../cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(
    req.headers.get("Authorization")?.replace("Bearer ", ""),
  );

  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: `Unauthorized: ${authError}` }),
      {
        status: 401,
        headers: corsHeaders,
      },
    );
  }

  const userId = user.id;

  const { data: userFiles, error: userFilesError } = await supabase
    .storage
    .from("post-images")
    .list(userId);

  const pathsToDelete = userFiles?.map((file) => `${userId}/${file.name}`) ??
    [];

  if (userFilesError) {
    return new Response(
      JSON.stringify({ message: userFilesError }),
      { status: 500, headers: corsHeaders },
    );
  }

  try {
    await Promise.all([
      supabase.from("comments").delete().eq("user_id", userId),
      supabase.from("votes").delete().eq("user_id", userId),
      supabase.from("posts").delete().eq("user_id", userId),
      supabase.auth.admin.deleteUser(userId),
      supabase
        .storage
        .from("post-images")
        .remove(pathsToDelete),
    ]);

    return new Response(
      JSON.stringify({ message: "User and data deleted successfully" }),
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: `${error}` }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
