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
    error,
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
    // 입력 유효성 검사
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
    <main className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto flex space-x-8">
        {/* 좌측: 책 목록 */}
        <div className="w-2/3">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-indigo-600 p-6">
              <h1
                className="text-3xl font-bold text-white flex items-center justify-center cursor-pointer hover:text-gray-200 transition-colors"
                onClick={() => {
                  setActiveSearchTerm("");
                  setActiveSearchOption("title");
                  setPage(1);
                }}
              >
                <BookIcon className="mr-2" size={24} />책 목록
              </h1>
            </div>

            {/* 책 목록 */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner />
              </div>
            ) : books.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                검색결과가 없습니다
              </div>
            ) : (
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
            )}

            <div className="bg-gray-50 p-4 text-center text-gray-500 text-sm">
              총 {totalCount}권의 책이 있습니다
            </div>

            {/* 페이지네이션 컨트롤 */}
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

        {/* 우측: 검색창 */}
        <div className="w-1/3">
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center">
              <Search className="mr-2" size={20} />책 검색
            </h2>
            <div className="space-y-4">
              {/* 검색 옵션 선택 */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setInputSearchOption("title")}
                  className={`px-4 py-2 rounded ${
                    inputSearchOption === "title"
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                  }`}
                >
                  제목
                </button>
                <button
                  onClick={() => setInputSearchOption("author")}
                  className={`px-4 py-2 rounded ${
                    inputSearchOption === "author"
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                  }`}
                >
                  저자
                </button>
              </div>

              {/* 검색 입력창 */}
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={inputSearchTerm}
                onChange={(e) => setInputSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* 검색 버튼 */}
              <button
                onClick={handleSearch}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                검색
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-600 flex items-center">
                <PlusCircle className="mr-2" size={20} />책 등록
              </h2>
              <button
                onClick={() => setShowRegisterForm(!showRegisterForm)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="책 줄거리"
                    rows={4}
                  />
                </div>

                {registerError && (
                  <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                    {registerError}
                  </div>
                )}

                {registerSuccess && (
                  <div className="p-3 bg-green-100 text-green-600 rounded-lg text-sm">
                    책이 성공적으로 등록되었습니다!
                  </div>
                )}

                <button
                  onClick={handleRegisterBook}
                  disabled={registering}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                >
                  {registering ? "등록 중..." : "등록하기"}
                </button>
              </div>
            )}
            {!showRegisterForm && (
              <p className="text-sm text-gray-500">
                새 책을 등록하려면 '등록하기' 버튼을 클릭하세요.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
export default Books;
