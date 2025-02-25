import { supabase } from "@/app/supabase/supabaseClient";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return new Response("Error loading book", { status: 500 });
  }

  if (!data) {
    return new Response("Book not found", { status: 404 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
