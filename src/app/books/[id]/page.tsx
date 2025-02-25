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
    queryKey: ["book", id],
    queryFn: () => fetchBookDetails(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <main className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          목록으로 돌아가기
        </Link>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-white">{book.title}</h1>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-gray-500 w-24">저자</span>
                  <span className="font-medium">{book.author}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-24">가격</span>
                  <span className="font-medium text-lg text-indigo-600">
                    ${book.price}
                  </span>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-indigo-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                상세정보
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {book.details}
                </p>
              </div>
            </div>

            <div className="mt-8 flex space-x-3">
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                수정
              </button>
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
