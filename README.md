# 포켓몬 데이터 검색 플랫폼
<br/>


![2024-03-2112 20 04-ezgif com-video-to-gif-converter](https://github.com/hyubbb/react-poke-app/assets/32926006/33ee22cd-7602-4610-8e9c-0d73d6398eed)



### 설명
- 개발 기술을 활용하기 위하여 포켓몬 데이터 검색 플랫폼 개발.
- React와 typescript, tailwindcss를 사용해서 만든 간단한 프로젝트.
- 다중 배열 구조의 데이터를 `map`과 `reduce`로 처리하는 방법과 `Tanstack-query` 학습을 위해 제작
<br/>

### 내용
- `React-Redux` 를 이용하여 데이터 상태 관리
- `Typescript` 사용으로 타입 안정성 확보, 코드 오류 가능성 감소 및 유지 보수 용이성 향상.
- `tailwindcss` 를 이용하여 간편하게 디자인
- `tanstack-query`의 `useInfiniteQuery`를 사용해서 무한스크롤링 가능하게 구현.

<br/>

- **동적 검색 기능으로** 사용자 입력에 따라 실시간으로 포켓몬 데이터를 필터링하고 검색 결과를 제공. 방향키로 검색결과 선택 가능
- 데이터 검색기능, 포켓몬의 이름 / 번호로 검색 가능 하게 구현
- 필터 기능으로 타입별로 필터링 된 포켓몬데이터 확인 가능
- 검색이나 디테일 페이지로 넘어갔다가 돌아와도 캐싱데이터를 이용해서 이전 보던 위치로 스크롤링
- favorite 마음에 드는 포켓몬 저장해서 별도의 페이지에서 확인 가능
- poke api를 활용하여 포켓몬의 이름, 설명, 타입 등 한글화 작업.
