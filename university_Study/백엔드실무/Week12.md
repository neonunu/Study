# Spring 강의 정리: 파라미터 유형·상세 글 페이지·Redirect

- **강의 코드**: `articleProjectC` (Spring Boot + Mustache + JPA)
- **오늘 범위**: 파라미터 유형, 상세 글 보기, 검색 폼, 저장 후 리다이렉트, forward/redirect 비교
- **프로젝트 공지**: 기획서 제출 (마지막 절)

---

## 1. 한눈에 보는 오늘 내용

| 구분 | 내용 |
|---|---|
| 목표 | 글 저장 후 상세 페이지로 이동, 검색어를 컨트롤러로 전달 |
| 핵심 개념 | 쿼리 스트링, 패스 베리어블, `Model`, `redirect:` |
| 새로 만든 파일 | `articles/show.mustache` |
| 수정한 파일 | `ArticleController`, `MainController`, `layouts/header.mustache` |
| 사용한 어노테이션 | `@GetMapping`, `@PathVariable`, `@RequestParam` |

---

## 2. 파라미터 유형

- **파라미터**: 클라이언트가 요청하면서 백엔드로 넘기는 데이터
- **쿼리 스트링(Query String)**: `?키=값&키=값` 형태, 키 이름과 함께 전달
  - 예: 네이트 검색 `?q=검색어`
  - 키가 필요한 이유: 값만 넘기면 `창`과 `123` 중 무엇이 아이디인지 구분 불가
  - 수신: `@RequestParam` (서블릿의 `request.getParameter()`에 해당)
- **패스 베리어블(Path Variable)**: 키 없이 값만 URL 경로에 포함
  - 예: 오늘의집 `/products/3457551` (뒤의 값이 상품의 PK)
  - 수신: `@PathVariable`
  - 값이 여러 개면 `/` 구분자로 연결
  - REST API에서 많이 사용
- 두 유형은 **혼합 가능**, 한 가지 유형만 고집할 필요 없음

### REST API와 HTTP 메서드

- **API**: 요청한 데이터를 형식에 맞춰 응답으로 제공하는 인터페이스
- **풀스택 구조**: 백엔드는 데이터만 응답, 프론트 프로젝트가 받아서 UI 구성
- 같은 URL이라도 메서드에 따라 해석이 달라짐

| 메서드 | 같은 URL `/article/3457551` 요청의 의미 |
|---|---|
| GET | PK에 해당하는 레코드 조회 후 응답 |
| DELETE | PK에 해당하는 레코드 삭제 |
| PUT | PK에 해당하는 레코드를 요청 바디의 JSON 값으로 수정 |

---

## 3. 상세 글 보기 구현

### 컨트롤러

```java
@GetMapping("/article/{ID}")
public String show(@PathVariable("ID") Long id, Model model) {
    ArticleEntity an = articleRepository.findById(id).orElse(null);
    model.addAttribute("resultAn", an);
    return "articles/show";
}
```

- **`{ID}`**: 중괄호로 표시한 변수명, 이름은 자유
  - `@PathVariable("ID")`의 속성으로 URL의 변수명과 매칭
  - 매개변수명과 URL 변수명이 같으면 속성 생략 가능
- **`findById()`**: `Optional<ArticleEntity>` 반환
  - 레코드가 없을 때 예외 대신 `null`을 돌려받으려고 `orElse(null)` 사용
  - `null`일 때의 처리 코드(404 응답 등)는 강의에서 생략
- **반환 문자열**: 뷰 리졸버를 거쳐 `templates/articles/show.mustache`로 연결

### Model 객체

- **`Model`**: 컨트롤러에서 뷰로 데이터를 옮기는 객체, 서블릿의 **request 영역**에 해당
- **import 주의**: `org.springframework.ui.Model` (lombok 등 같은 이름의 다른 클래스 선택 금지)
- **사용법**: 매개변수에 선언하면 스프링 컨테이너가 객체를 주입
- **`addAttribute(이름, 값)`**: 서블릿의 `request.setAttribute()`와 같은 역할
- **전달 비유**: 안방에서 거실로 짐을 들고 이동할 수 없으니 짐은 천장에 올려 두고, 이동 후 꺼내 쓰는 방식
- 값이 많을 때: List에 담아 `addAttribute`를 한 번만 호출

### 뷰: `show.mustache`

```html
<input readonly value="{{resultAn.title}}" type="text" class="form-control">
<textarea readonly class="form-control" rows="3">{{resultAn.content}}</textarea>
```

- **`new.mustache` 복사 후 수정**: 제목을 `상세 글 보기`로 변경
- **`{{ }}`**: 머스타치 표현식 (서블릿의 `${ }`에 해당)
  - 단일 값: `{{속성명}}`
  - 객체: `{{속성명.필드}}` (private 필드도 getter로 접근)
- **삭제**: `<form>` 태그, 완료(submit) 버튼
- **`readonly`**: 값만 보이고 편집 불가
- **`<textarea>`**: `value` 속성 없음, 시작·종료 태그 사이에 값 삽입
- **강의 지시**: 제목 라벨 옆에 `{{resultAn.id}}` 표시 (현재 `show.mustache`에는 미반영)

### 테스트 순서

- H2 DB라서 재부팅 시 데이터 초기화, 글을 먼저 2개 등록
- 주소 줄에 `/article/1` 직접 입력 → 첫 번째 레코드 표시 확인
- 메뉴에 연결하지 않았으므로 URL 직접 입력으로 요청

---

## 4. 검색 폼

### 헤더 (`layouts/header.mustache`)

```html
<form class="d-flex" role="search" action="/search" method="GET">
    <input name="mainSearch" class="form-control me-2" type="search" placeholder="Search"/>
    <button class="btn btn-outline-success" type="submit">Search</button>
</form>
```

- **`name`**: 파라미터의 키 이름이 되는 속성
- **`action` / `method`**: 서브밋 시 만들어질 요청의 URL과 전송 방식
- **전달되는 요청**: `/search?mainSearch=점심` (쿼리 스트링)

### 컨트롤러 (`MainController`)

```java
@GetMapping("/search")
public String mainSearch(@RequestParam("mainSearch") String keyword){
    System.out.println(keyword);
    return "";
}
```

- **`@RequestParam`**: 쿼리 스트링 형태의 파라미터 값을 매개변수에 바인딩
  - 위치에 따라 동작이 달라지는 어노테이션, 다음 시간에 추가 설명 예정
  - 속성 `name`: 파라미터의 키 이름
- **현재 상태**: 검색 결과 뷰 없이 `""`를 반환하므로 화이트라벨 404 발생, 콘솔 출력만 확인
- **한글 로그**: 콘솔 인코딩 미설정 시 깨질 수 있어 테스트는 `hello` 사용
- **이후 계획**: 서버가 `LIKE` 쿼리로 검색 결과 페이지 생성

---

## 5. 저장 후 상세 페이지로 이동

```java
@PostMapping("/article/new")
public String createArticle(ArticleDTO dto){
    ArticleEntity an = dto.toEntity();
    ArticleEntity saved = articleRepository.save(an);
    return "redirect:/article/" + saved.getId();
}
```

- **`save()` 반환값**: 인서트에 성공한 엔티티
  - 원본 `an`의 id는 `null` (auto increment는 인서트 시점에 값 생성)
  - 따라서 URL에 붙일 id는 반환된 `saved`에서 추출
  - 인서트 결과가 필요 없으면 반환값 없이 `save()`만 호출해도 됨
- **직접 뷰로 이동하면 실패하는 두 경우**
  - `return "articles/show"`: 모델에 값이 없어 에러
  - `return "/article/1"`: 뷰 리졸버가 템플릿 파일명(`article/1.mustache`)으로 해석, 404
- **접두어 규칙**: 반환 문자열에 `redirect:` 또는 `forward:`를 붙이면 뷰 리졸버를 거치지 않고 요청 URL로 인식
- **서블릿 대비**: 서블릿은 수십 줄, 스프링은 4~5줄로 처리

---

## 6. forward와 redirect

| 구분 | forward | redirect |
|---|---|---|
| 이동 방식 | 서버 내부에서 해당 지점에서 즉시 이동 | 응답 후 클라이언트가 재요청 |
| 응답 상태 | 없음 (응답 전 이동) | 302 |
| 요청 객체 | 유지 (request 영역 공유) | 새로 생성 (기존 영역 소멸) |
| 재요청 메서드 | 원래 메서드 유지 | 항상 GET |
| URL 표시 | 변경 없음 | 새 URL로 변경 |

- **redirect 동작**
  - 해당 지점에서 바로 302 응답
  - 응답 메시지에 재요청할 주소 포함
  - 브라우저가 GET으로 재요청해서 이동
- **forward 제약**: 요청의 메서드가 유지되므로 POST 요청은 `@PostMapping`이 붙은 메서드로만 이동 가능
  - 예: `@GetMapping`인 `show`로는 forward 불가
  - 해결: `@PostMapping`을 붙인 복사본(`show1`)을 만들어 연결
- **현재 구현이 동작하는 이유**: redirect는 항상 
