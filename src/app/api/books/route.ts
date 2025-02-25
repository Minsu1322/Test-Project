import { NextResponse } from "next/server";
import { createClient } from "@/app/supabase/server";

export async function GET(request: Request) {
  const ITEMS_PER_PAGE = 10;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const supabase = createClient();

  try {
    // 총 책 수 가져오기
    const { count: totalCount } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true });

    // 현재 페이지의 책 데이터 가져오기
    const { data: books, error } = await supabase
      .from("books")
      .select("*")
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // 총 책 수와 현재 페이지의 책 데이터 반환
    return NextResponse.json({ books, totalCount });
  } catch (error) {
    return NextResponse.json(
      { message: "Error loading books" },
      { status: 500 }
    );
  }
}
