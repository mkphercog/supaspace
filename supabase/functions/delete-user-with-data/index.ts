import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { corsHeaders } from "../cors.ts";
import { supabase } from "../supabase-client.ts";

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

  const { data: userPostImagesFiles, error: userPostImagesError } =
    await supabase
      .storage
      .from("post-images")
      .list(userId);

  const { data: userAvatarFiles, error: userAvatarError } = await supabase
    .storage
    .from("avatars")
    .list(userId);

  const postImagesPathsToDelete = userPostImagesFiles?.map((file) =>
    `${userId}/${file.name}`
  ) ?? [];

  const userAvatarsPathsToDelete =
    userAvatarFiles?.map((file) => `${userId}/${file.name}`) ?? [];

  if (userPostImagesError || userAvatarError) {
    return new Response(
      JSON.stringify({ message: userPostImagesError || userAvatarError }),
      { status: 500, headers: corsHeaders },
    );
  }

  try {
    const responses = await Promise.all([
      supabase.from("users").delete().eq(
        "id",
        userId,
      ),
      supabase
        .storage
        .from("post-images")
        .remove(postImagesPathsToDelete),
      supabase
        .storage
        .from("avatars")
        .remove(userAvatarsPathsToDelete),
      supabase.auth.admin.deleteUser(userId),
    ]);

    return new Response(
      JSON.stringify({
        message: `User and data deleted successfully`,
        responses: [...responses],
      }),
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
