# 포켓몬 데이터 검색 플랫폼
<br/>
 

# 소개

 

`React`와 `Tanstack-Query`,`poke Api`를 이용하여 만든 포켓몬스터 검색이 가능한 도감사이트 입니다.

- 배포페이지 : https://pokeapp-hyub.netlify.app/
- 관련 포스팅 : [poke api를 이용하여 한글화를 해보자](https://velog.io/@hyubbb/poke-api%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%98%EC%97%AC-%ED%95%9C%EA%B8%80%ED%99%94%EB%A5%BC-%ED%95%B4%EB%B3%B4%EC%9E%90)

<br>

# 스택


### **React , Redux, Tailwindcss, Typescript, Tanstack-query**

<br>

![2024-03-2112 20 04-ezgif com-video-to-gif-converter](https://github.com/hyubbb/react-poke-app/assets/32926006/33ee22cd-7602-4610-8e9c-0d73d6398eed)



# 설명


- 개발 기술을 활용하기 위하여 포켓몬 데이터 검색 플랫폼 개발.
- `React`와 `typescript`, `tailwindcss` 를 사용해서 만든 간단한 프로젝트입니다.
- 다중 배열 구조의 데이터를 **`map`**과 **`reduce`**로 처리하는 방법과 `Tanstack-query` 학습을 위해 제작
- `Poke API`를 사용하여 데이터를 가공하여, 포켓몬 데이터를 확인 할 수 있습니다.

<br>

# 기능

 

- `React-Redux`를 활용해 상태 관리를 구현, 애플리케이션의 상태 변화를 효율적으로 관리하기 위해 사용
    - 전체 데이터, 검색한 데이터, 좋아요 등 전역에서 데이터 처리하기 위해 사용
- `Typescript` 사용으로 타입 안정성 확보, 코드 오류 가능성 감소 및 유지 보수 용이성 향상.
- `tailwindcss` 를 이용하여 반응형 디자인으로 구현
- **동적 검색 기능으로** 사용자 입력에 따라 실시간으로 포켓몬 데이터를 필터링하고 검색 결과를 제공. 방향키로 검색결과 선택 가능
    - 데이터 검색기능, 포켓몬의 이름 / 번호로 검색 가능 하게 구현
- 필터 기능으로 타입별로 필터링 된 포켓몬 데이터 확인 가능.
- 검색이나 상세 페이지 방문 후 이전 위치로 돌아올 때 `Tanstack-query`의 캐싱 기능을 활용, 사용자는 캐싱된 데이터를 이용하여 이전에 보던 위치로 자연스럽게 돌아갈 수 있어, 불필요한 데이터 재로딩 없이 효율적인 탐색이 가능.
- `tanstack-query`의 `useInfiniteQuery`를 사용해서 무한 스크롤링 가능하게 구현.
- favorite 마음에 드는 포켓몬 저장해서 별도의 페이지에서 확인 가능
- `Poke API`를 활용하여 포켓몬의 이름, 타입 등의 정보들을  한글화 작업.
