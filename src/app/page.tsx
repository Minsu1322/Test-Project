"use client";
import Book from "@/types/TypeOfBooks";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Book as BookIcon, ShoppingCart, ChevronRight } from "lucide-react";
import Spinner from "./components/LoadingSpinner";
import { useState } from "react";

// Book 타입 정의

const fetchBooks = async (
  page: number
): Promise<{ books: Book[]; totalCount: number }> => {
  const response = await fetch(`/api/books?page=${page}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const Books: React.FC = () => {
  const [page, setPage] = useState(1);
  const {
    data: { books, totalCount } = { books: [], totalCount: 0 },
    error,
    isLoading,
  } = useQuery({
    queryKey: ["books", page],
    queryFn: () => fetchBooks(page),
  });

  const ITEMS_PER_PAGE = 10;
  const TOTAL_PAGES = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 페이지 번호 배열 생성
  const pageNumbers = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  if (isLoading) return <Spinner />;
  if (!books || books.length === 0) return <div>책이 없어요!</div>;

  return (
    <main className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 p-6">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center">
              <BookIcon className="mr-2" size={24} />책 목록
            </h1>
          </div>

          {/* 책 목록 */}
          <div className="divide-y divide-gray-200">
            {books.map((book) => (
              <div
                key={book.id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <Link href={`/books/${book.id}`} className="group">
                      <h2 className="text-xl font-semibold text-indigo-600 group-hover:text-indigo-800 transition-colors flex items-center">
                        {book.title}
                        <ChevronRight
                          size={18}
                          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </h2>
                    </Link>
                    <p className="text-gray-600 mt-1">{book.author}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-lg font-medium text-gray-800 mr-3">
                      \{book.price}
                    </p>
                    <button className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 text-center text-gray-500 text-sm">
            총 {totalCount}권의 책이 있습니다
          </div>
          <div className="flex justify-center space-x-2 p-4">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-4 py-2 rounded ${
                  page === pageNumber
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
export default Books;
