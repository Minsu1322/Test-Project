import { NextResponse } from "next/server";
import { createClient } from "@/app/supabase/server";

export async function GET(request: Request) {
  const ITEMS_PER_PAGE = 10;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchTerm = searchParams.get("searchTerm") || "";
  const searchOption = searchParams.get("searchOption") || "title";
  const supabase = await createClient();

  try {
    // 총 책 수 가져오기
    const { count: totalCount } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .ilike(searchOption, `%${searchTerm}%`);

    // 현재 페이지의 책 데이터 가져오기
    const { data: books, error } = await supabase
      .from("books")
      .select("*")
      .ilike(searchOption, `%${searchTerm}%`)
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // 총 책 수와 현재 페이지의 책 데이터 반환
    return NextResponse.json({ books, totalCount });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error loading books",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const bookData = await request.json();

    if (!bookData.title || !bookData.author) {
      return NextResponse.json(
        { message: "Title and author are required" },
        { status: 400 }
      );
    }

    if (!bookData.created_at) {
      bookData.created_at = new Date().toISOString();
    }

    if (bookData.price && typeof bookData.price !== "number") {
      return NextResponse.json(
        { message: "Price must be a number" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("books")
      .insert([bookData])
      .select();

    if (error) throw error;

    return NextResponse.json(
      { message: "Book created successfully", book: data[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      {
        message: "Error creating book",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
