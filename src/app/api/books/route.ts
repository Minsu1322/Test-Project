import { NextResponse } from "next/server";
import { createClient } from "@/app/supabase/server";

export async function GET() {
  const ITEMS_PER_PAGE = 10;
  const supabase = createClient();

  try {
    const { data: books, error } = await supabase
      .from("books")
      .select("*")
      .range(0, ITEMS_PER_PAGE - 1)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { message: "Error loading books" },
      { status: 500 }
    );
  }
}
