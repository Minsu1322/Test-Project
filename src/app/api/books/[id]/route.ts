import { supabase } from "@/app/supabase/supabaseClient";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase.from("books").delete().eq("id", id);

  if (error) {
    return new Response("Error deleting book", { status: 500 });
  }

  return new Response("Book deleted successfully", { status: 200 });
}
