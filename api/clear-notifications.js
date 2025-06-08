import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(_, res) {
  const dateThreshold = new Date(
    Date.now() - 5 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { error } = await supabase
    .from("notifications")
    .delete()
    .lt("created_at", dateThreshold);

  if (error) {
    console.error("❌ Failed to delete notifications:", error);
    return res.status(500).json({ error: "Failed to delete notifications" });
  }

  return res.status(200).json({ success: true });
};
