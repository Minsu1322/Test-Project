"use client";
import Spinner from "@/app/components/LoadingSpinner";
import Book from "@/types/TypeOfBooks";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

const fetchBookDetails = async (id: string): Promise<Book> => {
  const response = await fetch(`/api/books/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const deleteBook = async (id: string) => {
  const response = await fetch(`/api/books/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error deleting book");
  }

  return response.json();
};

export default function BookDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();

  const {
    data: book,
    error,
    isLoading,
  } = useQuery<Book, Error>({
    queryKey: ["book", id],
    queryFn: () => fetchBookDetails(id),
  });

  const handleDelete = async () => {
    if (confirm("정말로 이 책을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`/api/books/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete book");
        }

        alert("책이 삭제되었습니다.");
        router.push("/"); // 목록 페이지로 리다이렉트
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("책 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <main className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6">
              <h1 className="text-2xl font-bold text-white">{book?.title}</h1>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-gray-500 w-24">저자</span>
                    <span className="font-medium">{book?.author}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-24">가격</span>
                    <span className="font-medium text-lg text-blue-600">
                      ${book?.price}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-blue-300"
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
                    {book?.details}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center shadow-sm"
                >
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
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M7 4h10l1 2h4v2h-2l-2 10H6L4 8H2V6h4l1-2zm2 4l1 6h6l1-6H9z" />
                  </svg>
                  구매(미구현)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
