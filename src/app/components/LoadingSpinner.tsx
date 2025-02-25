import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <span className="ml-3 text-indigo-600">로딩 중...</span>
      </div>
    </div>
  );
};

export default Spinner;
