import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const token =
    req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return new Response(
      JSON.stringify({ error: "No autorizado" }),
      { status: 401 }
    );
  }

  const supabaseUser = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabaseUser.auth.getUser();

  if (!user) {
    return new Response(
      JSON.stringify({ error: "Usuario inválido" }),
      { status: 401 }
    );
  }

  const { data: usuarioDB } =
    await supabaseAdmin
      .from("usuarios")
      .select("rol")
      .eq("id", user.id)
      .single();

  if (usuarioDB?.rol !== "admin") {
    return new Response(
      JSON.stringify({ error: "Solo admins" }),
      { status: 403 }
    );
  }

  const body = await req.json();

  const { email, password, nombres, apellidos, telefono } = body;

  const { data, error } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

  if (error) {
    return new Response(
      JSON.stringify(error),
      { status: 400 }
    );
  }

  await supabaseAdmin
    .from("usuarios")
    .insert({
      id: data.user.id,
      nombres,
      apellidos,
      telefono,
      rol: "admin"
    });

  return new Response(
    JSON.stringify({
      success: true
    }),
    { status: 200 }
  );
});