"use client";
import Book from "@/types/TypeOfBooks";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Book as BookIcon,
  ShoppingCart,
  ChevronRight,
  Search,
  PlusCircle,
} from "lucide-react";
import Spinner from "./components/LoadingSpinner";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

//책 목록을 호출
const fetchBooks = async (
  page: number,
  searchTerm: string,
  searchOption: "title" | "author"
): Promise<{ books: Book[]; totalCount: number }> => {
  const response = await fetch(
    `/api/books?page=${page}&searchTerm=${encodeURIComponent(
      searchTerm
    )}&searchOption=${searchOption}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

//책 등록을 요청
const registerBook = async (bookData: Partial<Book>): Promise<Book> => {
  const response = await fetch("/api/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "책 등록에 실패했습니다");
  }

  return result.book;
};

const Books: React.FC = () => {
  //페이지 & 검색어관련 state
  const [page, setPage] = useState(1);
  const [inputSearchTerm, setInputSearchTerm] = useState("");
  const [inputSearchOption, setInputSearchOption] = useState<
    "title" | "author"
  >("title");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [activeSearchOption, setActiveSearchOption] = useState<
    "title" | "author"
  >("title");

  //등록관련 state
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newBook, setNewBook] = useState<Partial<Book>>({
    id: uuidv4(),
    title: "",
    author: "",
    price: 0,
    details: null,
  });
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const {
    data: { books, totalCount } = { books: [], totalCount: 0 },
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["books", page, activeSearchTerm, activeSearchOption],
    queryFn: () => fetchBooks(page, activeSearchTerm, activeSearchOption),
    enabled: !!activeSearchTerm,
  });

  const ITEMS_PER_PAGE = 10;
  const TOTAL_PAGES = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  const handleSearch = () => {
    setActiveSearchTerm(inputSearchTerm);
    setActiveSearchOption(inputSearchOption);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: name === "price" ? parseInt(value) || 0 : value,
    });
  };

  const handleRegisterBook = async () => {
    if (!newBook.title || !newBook.author) {
      setRegisterError("제목과 저자는 필수 입력사항입니다");
      return;
    }

    setRegistering(true);
    setRegisterError("");

    try {
      await registerBook(newBook);
      // 등록 성공 후 폼 초기화
      setNewBook({ title: "", author: "", price: 0, details: "" });
      setRegisterSuccess(true);
      // 책 목록 새로고침
      refetch();

      // 3초 후 성공 메시지 숨기기
      setTimeout(() => {
        setRegisterSuccess(false);
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setRegisterError(error.message);
      } else {
        setRegisterError("책 등록 중 오류가 발생했습니다");
      }
    } finally {
      setRegistering(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [activeSearchTerm, activeSearchOption, page, refetch]);

  return (
    <main className="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
        {/* 좌측: 책 목록 - 심플한 디자인 */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6">
              <h1
                className="text-2xl font-bold text-white flex items-center justify-center cursor-pointer hover:text-blue-50 transition-all duration-300"
                onClick={() => {
                  setActiveSearchTerm("");
                  setActiveSearchOption("title");
                  setPage(1);
                }}
              >
                <BookIcon className="mr-3" size={24} />책 목록
              </h1>
            </div>

            {/* 책 목록 */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner />
              </div>
            ) : books.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                검색결과가 없습니다
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="p-6 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <Link href={`/books/${book.id}`} className="group">
                          <h2 className="text-xl font-semibold text-blue-600 group-hover:text-blue-700 transition-colors flex items-center">
                            {book.title}
                            <ChevronRight
                              size={18}
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                            />
                          </h2>
                        </Link>
                        <p className="text-gray-600 mt-1">{book.author}</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-800 mr-4">
                          \{book.price}
                        </p>
                        <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gray-50 p-4 text-center text-gray-600 text-sm">
              총 <span className="font-medium">{totalCount}</span>권의 책이
              있습니다
            </div>

            {/* 페이지네이션 컨트롤 - 심플한 스타일 */}
            <div className="flex justify-center space-x-2 p-4 bg-white">
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    page === pageNumber
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 우측: 검색창 및 등록 폼 - 심플한 디자인 */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
              <Search className="mr-2 text-blue-500" size={20} />책 검색
            </h2>
            <div className="space-y-4">
              {/* 검색 옵션 선택 */}
              <div className="flex space-x-2 bg-gray-50 p-1 rounded-lg">
                <button
                  onClick={() => setInputSearchOption("title")}
                  className={`flex-1 px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                    inputSearchOption === "title"
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  제목
                </button>
                <button
                  onClick={() => setInputSearchOption("author")}
                  className={`flex-1 px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                    inputSearchOption === "author"
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  저자
                </button>
              </div>

              {/* 검색 입력창 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={inputSearchTerm}
                  onChange={(e) => setInputSearchTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <Search size={20} />
                </div>
              </div>

              {/* 검색 버튼 */}
              <button
                onClick={handleSearch}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm"
              >
                검색
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-600 flex items-center">
                <PlusCircle className="mr-2 text-blue-500" size={20} />책 등록
              </h2>
              <button
                onClick={() => setShowRegisterForm(!showRegisterForm)}
                className="text-blue-500 hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition-all duration-200"
              >
                {showRegisterForm ? "닫기" : "등록하기"}
              </button>
            </div>

            {showRegisterForm && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    제목 *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newBook.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder="책 제목"
                  />
                </div>

                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    저자 *
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={newBook.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder="저자명"
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    가격
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newBook.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder="가격"
                    min="0"
                  />
                </div>

                <div>
                  <label
                    htmlFor="details"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    줄거리
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    value={newBook.details || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder="책 줄거리"
                    rows={4}
                  />
                </div>

                {registerError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    {registerError}
                  </div>
                )}

                {registerSuccess && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">
                    책이 성공적으로 등록되었습니다!
                  </div>
                )}

                <button
                  onClick={handleRegisterBook}
                  disabled={registering}
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {registering ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      등록 중...
                    </span>
                  ) : (
                    "등록하기"
                  )}
                </button>
              </div>
            )}
            {!showRegisterForm && (
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                등록하기 버튼을 클릭하세요.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
export default Books;
