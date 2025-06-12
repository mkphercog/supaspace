// @supabase/function_verify_jwt=false

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

import { corsHeaders } from "../cors.ts";
import { supabase } from "../supabase-client.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  const { id, title } = await req.json().catch(() => ({}));

  if (!id || !title) {
    return new Response("Missing title or id", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const response = new Response(
    JSON.stringify({
      message: "Started sending emails ✅",
    }),
    {
      status: 200,
      headers: corsHeaders,
    },
  );

  sendEmails(id, title);

  return response;
});

async function sendEmails(id: string, title: string) {
  const postUrl = `https://www.supaspace.website/post/${id}`;

  const { data: users, error } = await supabase
    .from("users")
    .select("email")
    .eq("email_subscribe", true);

  if (error) {
    console.error("Failed to fetch users:", error);
    return;
  }

  if (!users || users.length === 0) {
    console.log("No subscribers to notify");
    return;
  }

  const subject = `New post on Supa.space() 🚀 - "${
    title.length > 15 ? `${title.slice(0, 15)}...` : title
  }"`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; max-width: 600px; margin: auto;
      padding: 24px; background: #f3f4f6; border-radius: 12px; color: #374151; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
      <h2 style="color: #7c4dcc; margin-bottom: 0.6em; font-weight: 700;">"${title}"</h2>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 1em;">
        A new post was just published on <strong><a href="https://www.supaspace.website" style="color: #7c4dcc; text-decoration: none;">Supa.space</a></strong>!
      </p>
      <p style="margin-bottom: 2em;">
        <a href="${postUrl}" style="
          display: inline-block;
          background-color: #7c4dcc;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(124, 77, 204, 0.4);
          transition: background-color 0.3s ease;">
          Click here to read more 🚀
        </a>
      </p>
      <hr style="border: none; border-top: 1px solid #d1d5db; margin: 32px 0;" />
      <small style="color: #6b7280; font-size: 12px; line-height: 1.4;">
        You received this email because you subscribed to post notifications. You can change this in your account settings.
      </small>
    </div>
  `;

  for (const user of users) {
    if (!user.email) continue;

    try {
      await resend.emails.send({
        from: Deno.env.get("RESEND_FROM_EMAIL")!,
        to: user.email,
        subject,
        html,
      });
      console.log(`Email sent to ${user.email}`);
    } catch (err) {
      console.error(`Failed to send email to ${user.email}:`, err);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("Finished sending all emails");
}
