"use client";
import Book from "@/types/TypeOfBooks";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const fetchBookDetails = async (id: string): Promise<Book> => {
  const response = await fetch(`/api/books/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function BookDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const {
    data: book,
    error,
    isLoading,
  } = useQuery<Book, Error>({
    queryKey: ["book", id], // 쿼리의 고유 키
    queryFn: () => fetchBookDetails(id), // 데이터 페칭 함수
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <main className="p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-500 mb-4 block">
          ← 목록으로 돌아가기
        </Link>

        <div className="border p-6 rounded">
          <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
          <div className="space-y-2">
            <p>
              <strong>저자:</strong> {book.author}
            </p>
            <p>
              <strong>가격:</strong> ${book.price}
            </p>
            <p>
              <strong>상세정보:</strong>
            </p>
            <p className="whitespace-pre-wrap">{book.details}</p>
          </div>

          <div className="mt-6 space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              수정
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded">
              삭제
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
