###Tailwind CSS를 활용해 UI 디자인을 제작했으며, React 및 Next.js를 기반으로 동작합니다.

Frontend: React, Next.js, TypeScript
DataBase: Supabase Database
Styling: Tailwind CSS
Icons: Lucide-react


#### 주요 기능
책 목록 조회
모든 책을 목록에서 확인할 수 있습니다.
페이지네이션(10개) 적용.
개별 책을 클릭하면 상세 페이지로 이동합니다.

#### 검색
제목 또는 저자명으로 책을 검색할 수 있습니다.

#### 등록
새로운 책을 제목, 저자, 가격과 함께 등록할 수 있습니다.
책 등록 폼을 열고 닫을 수 있습니다.


##프로젝트구조


![image](https://github.com/user-attachments/assets/139554f2-f61c-4a23-81e9-6b14f7cc809e)




### `books` 테이블 설계

| 컬럼 이름    | 데이터 타입   | 설명                          |
|--------------|---------------|-------------------------------|
| `id`         | UUID          | 책의 고유 식별자 (Primary Key) |
| `title`      | TEXT          | 책 제목                       |
| `author`     | TEXT          | 책 저자                       |
| `price`      | INTEGER       | 책 가격                       |
| `details`    | TEXT          | 책 줄거리                     |
| `created_at` | TIMESTAMP     | 책이 등록된 날짜              |


