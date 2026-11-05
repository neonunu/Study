# 10주차 Spring 강의 정리

- **프로젝트**: `articleProjectC` (Spring Boot, Gradle, Mustache, JPA, H2)
- **주제**: 게시글 작성 흐름, IoC·DI, JPA Entity·Repository, Lombok
- **표기 규칙**
  - **강의 시연**: 강의 중 강사가 직접 실행해 확인한 결과
  - **예상 결과 (실행 전)**: 설명을 위해 만든 예시이며 직접 실행하지 않은 결과

## 1. 전체 흐름

```text
브라우저 (글쓰기 클릭)
  → GET  /article/new  → 폼 화면 (articles/new.mustache)
  → 폼 제출
  → POST /article/new  → ArticleDTO 자동 생성
  → DTO → Entity 변환
  → Repository.save(entity)  → INSERT
  → H2 메모리 DB의 board 테이블
```

- **계층 분담**: Controller(요청 처리) → Repository(DB 접근)
- **직접 처리 vs 협업**: 컨트롤러가 혼자 응답할 수도 있으나, 대부분 서비스·데이터 접근 계층과 협업

## 2. @Controller와 @RestController

> **쉬운 정의:** 컨트롤러는 요청을 받아 처리하고, 어떤 화면(또는 데이터)을 돌려줄지 정하는 클래스

- **@Controller**: 메서드가 뷰 이름(String)을 반환하는 컨트롤러
- **@RestController**: 반환 타입 제한이 없고(void, String, 객체 모두 가능), ViewResolver를 거치지 않고 처리 결과를 바로 응답으로 전송하는 컨트롤러

**왜 나뉘는가**

- 화면(HTML)을 만들어 응답하는 방식과 데이터 자체를 응답하는 방식의 처리 경로가 다름

**@Controller 처리 순서**

1. 메서드가 뷰 이름 문자열 반환
2. DispatcherServlet이 문자열을 ViewResolver에 전달
3. ViewResolver가 템플릿 엔진 의존성에 맞는 확장자를 붙임 (JSP면 `.jsp`, Mustache면 `.mustache`)
4. 서버에서 템플릿 실행 → 동적 콘텐츠가 담긴 HTML 생성
5. HTML을 응답 메시지 바디에 담아 클라이언트로 전송

**아주 간단한 핵심 예시**

```java
@Controller
public class ArticleController {
    @GetMapping("/article/new")
    public String newArticleForm() {
        return "articles/new";   // → templates/articles/new.mustache 실행
    }
}
```

- **예상 결과 (실행 전)**: `/article/new` 접속 시 글쓰기 폼 HTML 표시
- **이유**: 반환된 `"articles/new"`에 ViewResolver가 `.mustache`를 붙여 템플릿을 실행하고, 결과 HTML이 응답 바디에 담김

**주의점**

- **뷰 이름 규칙**: `templates` 폴더가 루트이므로 앞 `/`는 써도 되고 생략해도 됨
- **HTTP 메시지 구조** (시험 출제 언급): 시작 줄 / 헤더 / 빈 줄 / 바디
- **@RestController**: 동작을 분리해서 이해할 것 (ViewResolver를 거치지 않는 점이 핵심)

## 3. 요청 매핑 (GET/POST)

> **쉬운 정의:** 어떤 주소로, 어떤 방식으로 들어온 요청을 어느 메서드가 처리할지 정해두는 표시

**아주 간단한 핵심 예시**

```java
@GetMapping("/article/new")     // 글쓰기 메뉴 클릭 (a 태그 = GET)
public String newArticleForm() { return "articles/new"; }

@PostMapping("/article/new")    // 완료 버튼 (form method="post")
public String createArticle(ArticleDTO dto) { ... }
```

- **예상 결과 (실행 전)**: 같은 주소라도 링크 클릭은 첫 메서드, 폼 제출은 둘째 메서드가 처리
- **이유**: URL뿐 아니라 HTTP 메서드(GET/POST)까지 함께 비교해 매핑 대상 결정

**주의점**

- **같은 URL 허용**: 전송 방식이 다르면 가능
- **같은 메서드명 허용**: 매개변수가 다른 오버로딩이므로 에러 아님 (강의에서 같은 이름을 쓴 이유)
- **요청 메시지 시작 줄**: 서버 주소(URL)와 HTTP 메서드가 필수
- **form 태그의 한계**: HTML에서는 사실상 GET/POST만 사용, REST API에서는 PUT·DELETE 등도 사용
- **URL 오답 처리**: URL 주소가 틀리면 부분 점수 없이 오답 (슬래시 위치 포함, 강의 중 강조)

## 4. DTO 자동 바인딩

> **쉬운 정의:** 폼에 입력한 값을 스프링이 객체에 대신 담아서 메서드에 넘겨주는 기능

**정확한 개념**

- 컨트롤러 메서드의 매개변수에 객체 타입을 쓰면, 요청 파라미터를 그 객체의 필드에 채워서 전달

**아주 간단한 핵심 예시**

```html
<input type="text" name="title">
<textarea name="content"></textarea>
```

```java
public String createArticle(ArticleDTO dto) { ... }
```

- **예상 결과 (실행 전)**: 제목 `Hello`, 내용 `World` 제출 시 `dto.getTitle()`은 `"Hello"`, `dto.getContent()`는 `"World"`
- **이유**: 파라미터 이름(`name` 속성)과 같은 이름의 필드에 Setter로 값 대입

**스프링이 하는 일**

1. 요청 파라미터 확인
2. `ArticleDTO` 객체 생성
3. Setter로 `title`, `content` 필드에 값 대입
4. 완성된 객체를 매개변수에 전달

**주의점**

- **서블릿과 비교**: 서블릿에서는 위 과정을 `request.getParameter()`로 직접 코딩
- **전제 조건**: DTO에 기본 생성자와 Setter 필요
- **이름 일치**: 폼의 `name`과 DTO 필드명이 다르면 값이 채워지지 않음

## 5. 스프링 컨테이너 특징

### 5-1. 컨테이너와 빈

> **쉬운 정의:** 컨테이너는 객체를 만들고 없애는 일을 대신 맡아주는 관리자

- **서블릿 컨테이너**: 서블릿 객체를 싱글톤으로 생성 → 요청 매핑 → 오래 일이 없으면 메모리에서 제거 (라이프 사이클 관리)
- **스프링 컨테이너**: 스프링의 자바 객체인 **빈(Bean)**의 라이프 사이클 관리

### 5-2. IoC

> **쉬운 정의:** 객체를 만드는 일을 개발자가 아니라 시스템이 대신 하는 방식

- **IoC (Inversion of Control, 제어의 역전)**: 개발자가 하던 객체 생성·관리를 컨테이너가 대신 수행

**왜 필요한가**

- 웹은 24시간 동작하므로 요청이 올 때마다 개발자가 `new`로 만들 수 없음
- 메모리가 한정적이어서 미리 다 만들어 둘 수 없으므로, 필요한 순간 시스템이 생성

**아주 간단한 핵심 예시**

```java
// 개발자가 직접 생성 (IoC 아님)
ArticleController c = new ArticleController();

// 스프링: 클래스에 표시만 해두면 컨테이너가 생성·관리
@Controller
public class ArticleController { }
```

- **예상 결과 (실행 전)**: 앱 시작 시 컨테이너가 `ArticleController` 객체를 만들어 빈으로 관리
- **이유**: 생성 시점과 주체가 개발자 코드에서 컨테이너로 이동

**주의점**

- **서블릿과 차이**: 서블릿 컨테이너도 객체는 대신 생성하지만, IoC 특징은 DI까지 해줄 때 성립

### 5-3. DI

> **쉬운 정의:** 서로 관련 있는 객체를 컨테이너가 알아서 연결해주는 것

- **DI (Dependency Injection, 의존성 주입)**: 의존 관계에 있는 객체를 컨테이너가 찾아서 넣어주는 것
- **자동차 비유**: 서블릿은 본체·타이어 객체를 각각 만들어주는 데서 끝, 스프링은 타이어를 본체에 끼워 완성품까지 조립

**아주 간단한 핵심 예시**

```java
public class Car {
    private Tire tire;     // Car는 Tire에 의존
}
```

- **예상 결과 (실행 전)**: 컨테이너가 `Car`와 `Tire` 객체를 만들고 `Car`의 `tire`에 `Tire` 객체를 넣어줌
- **이유**: 관련성 있는 객체끼리 연결하는 작업까지 컨테이너가 담당

**정리**

- **서블릿 컨테이너**: 필요한 객체 생성
- **스프링 컨테이너**: 생성 + 객체 간 주입

### 5-4. POJO와 경량

> **쉬운 정의:** 부모 클래스를 꼭 상속받지 않아도 되는 순수한 자바 클래스

- **POJO**: 특정 클래스를 상속받아야 한다는 전제 없이 그 클래스만으로 객체가 만들어지는 순수 자바 객체

**아주 간단한 핵심 예시**

```java
public class MyServlet extends HttpServlet { }   // 상속 필수 → 비POJO

@Controller
public class ArticleController { }                // 상속 없음 → POJO
```

- **서블릿 클래스**: `HttpServlet` 상속이 필수라 비POJO (부모의 의무를 같이 받아 무거움)
- **스프링 빈**: 컨트롤러 클래스에 `extends`가 없어 가벼움 (경량)
- **AOP**: 이번 강의에서는 다루지 않음

## 6. @Autowired

> **쉬운 정의:** 필요한 객체를 내가 만들지 않고 스프링이 찾아서 넣어달라는 표시

**아주 간단한 핵심 예시**

```java
@Autowired
private ArticleRepository articleRepository;
```

- **예상 결과 (실행 전)**: 컨트롤러 생성 시 `articleRepository`에 구현 객체가 들어가 `null`이 아님
- **이유**: DI 요청에 따라 컨테이너가 이 타입에 넣을 수 있는 객체를 찾아 주입

**동작 규칙**

- **후보가 메모리에 있음**: 그 객체를 끌어다 주입
- **후보 없음**: 컨테이너가 인터페이스를 구현한 객체를 생성해서 주입
- **후보 2개 이상**: 무엇을 넣을지 모호하므로 에러
- **하위 타입 허용**: 직속 구현체뿐 아니라 같은 계열의 하위 객체 모두 주입 가능

**확인 방법**

- `articleRepository.` 입력 시 쿼리 메서드가 자동완성되면 주입 정상

## 7. JPA 핵심 객체

> **쉬운 정의:** SQL을 직접 쓰지 않고 자바 객체와 메서드로 DB를 다루게 해주는 도구

- **Repository**: DAO 역할 (DB 연동, 쿼리 실행)
- **Entity**: DTO 역할 (데이터 운반) + 테이블 매핑 구조
- **이 강의의 선택**: MyBatis, Hibernate, Spring JDBC 등 중 JPA 채택

### 7-0. 모델 객체와 JDBC 맥락

- **서블릿의 모델 객체**: DAO와 DTO 두 종류 (서블릿에서는 MVC 중 모델 역할)
- **JPA 대응 관계**: Repository는 DAO에, Entity는 DTO에 해당
- **Repository의 역할**: JDBC 4단계 중 DB 연결이 된 상태에서 쿼리를 실행하는 단계를 메서드로 선언한 것

### 7-1. Entity

> **쉬운 정의:** DB 테이블 한 개와 짝이 되는 자바 클래스

**정확한 개념**

- **Entity**: 테이블 구조를 정의하고 데이터를 운반하는 클래스
- 서블릿의 DTO와 달리 구조에 맞는 테이블이 없으면 이 구조로 테이블을 생성

| 구분 | DTO (서블릿 때) | Entity |
| --- | --- | --- |
| 목적 | 데이터 이동 | 테이블 매핑 + 데이터 이동 |
| 구성 | private 필드 + Getter/Setter | 필드 + Getter/Setter + 비즈니스 메서드 가능 |
| 테이블 | 무관 | 구조에 맞는 테이블이 없으면 이 구조로 생성 |

**아주 간단한 핵심 예시**

```java
@Entity
@Table(name = "board")
public class ArticleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String title;
    @Column
    private String content;
}
```

- **예상 결과 (실행 전)**: `board` 테이블 생성, 컬럼은 `id`(정수, PK, 자동 증가), `title`·`content`(VARCHAR)
- **이유**: 어노테이션이 테이블 이름과 PK, 자동 증가, 컬럼 정보를 지정하고, 필드 타입이 컬럼 타입으로 변환

| 어노테이션 | 의미 |
| --- | --- |
| `@Entity` | JPA가 관리하는 Entity 클래스, 테이블 생성 기준 |
| `@Id` | 해당 필드를 PK로 선언 |
| `@GeneratedValue` | PK 자동 증가 (정수형일 때, Auto Increment) |
| `@Column` | 일반 컬럼 (현재는 생략 가능, 강의에서는 명시) |
| `@Table(name="board")` | 테이블 이름 지정 (생략 시 Entity 클래스 이름 기반) |

**주의점**

- **테이블 어노테이션 출처**: `jakarta.persistence`
- **필드 타입 → 컬럼 타입**: `String` → VARCHAR, `Long` → 정수형

### 7-2. Lombok

> **쉬운 정의:** Getter, Setter, 생성자 같은 뻔한 코드를 어노테이션 한 줄로 대신 만들어주는 라이브러리

**Gradle 의존성 규칙**

- **위치**: Spring Boot·JDK 버전 정보는 상단 블록에 있고, 나머지 라이브러리는 `dependencies { }` 안에 작성
- **순서**: 의존성 순서는 무관
- **문장 확인**: 추가할 문장을 모르면 검색해서 복사

**적용 절차**

1. `build.gradle`의 `dependencies { }`에 추가
   ```gradle
   compileOnly 'org.projectlombok:lombok'
   annotationProcessor 'org.projectlombok:lombok'
   ```
2. Gradle 새로고침 (코끼리 아이콘 또는 Gradle 패널의 새로고침)
   - IntelliJ는 자동 저장이라 별도 저장 불필요
3. 의존성 트리에 lombok 표시 확인
4. 어노테이션이 인식되지 않으면 빌드 실패 상태로 판단

**아주 간단한 핵심 예시**

```java
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArticleEntity { ... }
```

- **예상 결과 (실행 전)**: `getTitle()`, `setTitle()`, 기본 생성자, 전체 필드 생성자를 직접 쓰지 않아도 사용 가능
- **이유**: 컴파일 시점에 Lombok이 해당 메서드와 생성자를 자동 생성

| 어노테이션 | 생성 대상 |
| --- | --- |
| `@Getter` / `@Setter` | Getter / Setter |
| `@NoArgsConstructor` | 기본 생성자 (매개변수 없음) |
| `@AllArgsConstructor` | 모든 필드를 받는 생성자 |
| `@ToString` | 모든 필드를 문자열로 조합하는 `toString()` (디버깅용) |

**기본 생성자 규칙**

- 생성자를 하나도 선언하지 않으면 컴파일러가 기본 생성자를 자동 추가
- 생성자를 하나라도 선언하면 기본 생성자는 추가되지 않으므로 직접 선언 필요
- 스프링 클래스는 기본 생성자가 있어야 하므로 `@NoArgsConstructor` 사용 (IntelliJ의 Generate → Select None으로도 가능)

### 7-3. Repository

> **쉬운 정의:** 인터페이스만 선언해두면 DB에 넣고 꺼내는 기능을 스프링이 만들어주는 DB 담당 객체

**아주 간단한 핵심 예시**

```java
public interface ArticleRepository extends CrudRepository<ArticleEntity, Long> {
    ArticleEntity findByTitle(String title);   // 직접 추가한 쿼리 메서드
}
```

- **예상 결과 (실행 전)**: 구현 클래스를 작성하지 않아도 `save`, `findById`, `findAll`, `findByTitle` 호출 가능
- **이유**: 스프링이 `@Autowired` 시점에 인터페이스의 구현 객체를 생성해 주입 (서블릿 방식이라면 구현 클래스를 직접 작성)

**정확한 개념**

- **제네릭 `<T, ID>`**: T = Entity 타입, ID = `@Id`(PK) 필드의 타입
  - 이 프로젝트: `<ArticleEntity, Long>`
- **대표 인터페이스 2종**
  - `CrudRepository`: JDBC 4단계 중 쿼리 단계의 간단한 CRUD 메서드 제공
  - `JpaRepository`: CRUD + 페이징, 정렬 등 복잡한 쿼리 메서드 제공 (실무에서 많이 사용, 강의는 CRUD부터 시작)
- **쿼리 메서드**: 쿼리문이 추상 메서드 형태로 선언된 것 (`CrudRepository` 안에 열몇 개)

| 메서드 | 쿼리 의미 |
| --- | --- |
| `save(entity)` | INSERT |
| 여러 개 저장 (`Iterable` 파라미터) | 목록을 한 번에 INSERT (녹취록 표현은 "세이브 올", 실제 메서드명은 `saveAll`) |
| `findById(id)` | `SELECT * FROM board WHERE id = ?` |
| `findAll()` | WHERE 절 없는 SELECT |
| `findByTitle(String)` | `SELECT * FROM board WHERE title = ?` |

- **여러 개 저장 예시**: Entity 10개를 목록으로 묶어 한 번 호출하면 되므로 `save`를 10번 호출할 필요가 없음
  - 파라미터가 `Iterable`이므로 `ArrayList` 등 자식 객체를 넘길 수 있음 (11장 업캐스팅 참고)

**쿼리 메서드 이름 패턴**

- `find`로 시작하면 SELECT, `delete`는 DELETE, `By` 뒤가 WHERE 조건 필드
- 패턴으로 표현할 수 없는 쿼리는 직접 쿼리문을 붙일 수 있음 (`@Query`, 강의에서는 이름 없이 언급)

**쿼리 메서드 예상 결과**

```java
articleRepository.findByTitle("Hello");
```

- **예상 결과 (실행 전)**: `title`이 `Hello`인 레코드를 `ArticleEntity`로 반환
- **이유**: 메서드 이름의 `findBy` + `Title`이 `SELECT ... WHERE title = ?`로 해석

**주의점**

- **DBMS 독립성**: MySQL, Oracle 등 연결된 DB에 맞는 쿼리로 JPA가 재정의하므로 개발자는 DBMS별 문법을 신경 쓰지 않아도 됨
- **구현 클래스 불필요**: 위 핵심 예시에서 설명한 대로 구현 객체는 스프링이 생성

## 8. 컨트롤러 구현 (DTO → Entity → save)

> **쉬운 정의:** 폼으로 받은 데이터를 DB 저장용 객체로 바꿔서 Repository에 맡기는 처리

**아주 간단한 핵심 예시**

```java
@PostMapping("/article/new")
public String createArticle(ArticleDTO dto) {
    // 1. dto -> Entity
    ArticleEntity an = dto.toEntity();
    // 2. repository.save()
    articleRepository.save(an);
    return "";
}
```

- **예상 결과 (실행 전)**: `board` 테이블에 새 레코드 1건 추가, 뷰 이름이 비어 있어 화면은 404
- **이유**: `save`가 INSERT를 수행하고, 반환할 뷰가 지정되지 않음

**설계 포인트**

- **DTO → Entity 변환 이유**: Repository는 Entity만 받으므로
- **id 처리**: 자동 증가 필드이므로 값을 줄 필요 없음 (`null` 전달)
- **컨트롤러 설계 원칙**: 요청 처리 단계만 간결하게 보이는 것이 좋음

**변환 방식 비교 (강의에서 세 가지로 설명)**

1. 컨트롤러에서 `new` + Setter
   ```java
   ArticleEntity an = new ArticleEntity();
   an.setTitle(dto.getTitle());
   an.setContent(dto.getContent());
   ```
2. DTO의 `toEntity()` 메서드 (현재 프로젝트 방식, 컨트롤러가 가장 깔끔)
   ```java
   // ArticleDTO
   public ArticleEntity toEntity() {
       return new ArticleEntity(null, title, content);
   }
   ```
3. Entity에 생성자를 추가해 호출
   - `new ArticleEntity(title, content)` 형태, 위 `toEntity()` 안에서 사용

**IntelliJ 생성자 추가**

- 오른쪽 클릭 → Generate → Constructor
- 필드를 Ctrl/Shift로 선택 (`id` 제외, `title`과 `content`만)
- OK 클릭 시 선택한 필드만 받는 생성자 추가
- 컴파일 에러는 매칭되는 생성자가 생기면 해소

## 9. H2 콘솔로 확인 (강의 시연)

> **쉬운 정의:** 메모리에 만들어지는 테스트용 DB를 브라우저에서 들여다보는 화면

**설정**: `application.properties`

```properties
spring.h2.console.enabled=true
```

**절차**

1. 앱 실행
2. 글쓰기 화면에서 제목·내용 입력 후 완료 버튼 클릭
3. 새 탭에서 `http://localhost:포트/h2-console` 접속
4. 부팅 로그에서 `jdbc:h2:mem:...`으로 시작하는 주소 복사 (따옴표 제외)
5. 콘솔의 JDBC URL에 붙여넣고 Connect
6. `BOARD` 테이블 클릭 → `SELECT * FROM BOARD` 실행
7. 입력한 레코드와 자동 증가된 `id` 확인

**강의 시연 결과**

- **Whitelabel Error Page(404)**: 반환할 뷰를 지정하지 않아서 발생하는 것이 정상 (데이터는 저장됨)
- **테이블 이름 `BOARD`**: `@Table(name="board")` 적용 결과
- **두 번째 글 추가**: 제목만 바꿔 다시 제출하면 `id`가 이어서 증가한 레코드 추가

**주의점**

- **JDBC URL이 매번 다름**: 메모리 DB 주소가 실행마다 랜덤 생성, 중간고사 이후 고정 예정
- **운영 시 변경**: 현재 H2는 테스트용, 프로젝트에서는 로컬 DB·클라우드 DB 의존성 추가 필요
  - 데이터 소스(아이디·패스워드 등)는 `application.properties`에 설정

## 10. 파라미터 전달 방식

> **쉬운 정의:** 클라이언트가 요청하면서 서버에 같이 보내는 데이터를 담는 두 가지 방법

| 구분 | 쿼리 스트링 | 패스 베리어블 |
| --- | --- | --- |
| 형태 | `/login?id=chang&pw=123` | `/articles/1` |
| 전달 내용 | 이름과 값의 쌍 | 값만 |
| 구분자 | `?` 이후, 파라미터 사이는 `&` | URL 경로의 일부 |

- **쿼리 스트링**: `<input name="id">`의 `name`이 파라미터 이름
- **패스 베리어블 해석**: 값(1)을 추출해 작업 대상 테이블의 PK 값으로 사용, 동작은 HTTP 메서드가 결정
  - `GET /articles/1` → PK 1 레코드 조회(SELECT)
  - `DELETE /articles/1` → PK 1 레코드 삭제(DELETE)
- **REST API**: 패스 베리어블 방식을 더 많이 사용
- **시험 범위**: 패스 베리어블 관련 어노테이션 실습은 제외, 쿼리 스트링은 서블릿 문제로 출제된 이력이 있음

## 11. 자바 복습 (인터페이스)

> **쉬운 정의:** 인터페이스는 "이런 메서드를 반드시 만들어야 한다"는 규격만 적어둔 설계도

- **추상 메서드**: `abstract` 키워드가 붙고 중괄호 몸체가 아예 없는 메서드
- **포함 가능한 클래스**: 추상 클래스, 인터페이스
- **추상 클래스 vs 인터페이스**
  - 추상 클래스: 일반 메서드 포함 가능, `extends`로 상속, `abstract` 키워드 필수
  - 인터페이스: 기본적으로 추상 메서드만 구성, `implements`로 구현, 메서드의 `abstract` 키워드 생략 가능
- **객체 생성**: 둘 다 직접 불가, 모든 추상 메서드를 오버라이딩한 자식 클래스로만 가능
- **추상 메서드를 두는 이유**: 자식 클래스의 메서드 구성을 규격화(통일)

**아주 간단한 핵심 예시** (인터페이스 상속, 강의 예제)

```java
interface B { void eat(); }
interface C extends B { void study(); }
class D implements C {
    public void study() { }
    public void eat() { }     // B의 추상 메서드도 구현해야 함
}
```

- **예상 결과 (실행 전)**: `eat()` 또는 `study()` 중 하나라도 빠지면 `D`는 컴파일 에러, 둘 다 있으면 `new D()` 가능
- **이유**: 인터페이스끼리의 `extends`는 상위 추상 메서드를 모두 물려받고, 일반 클래스는 전부 오버라이딩해야 완성
- **연결**: 이 때문에 `ArticleRepository`가 `CrudRepository`의 메서드를 물려받고 메서드를 더 추가 가능

### 컬렉션 계층과 업캐스팅

> **쉬운 정의:** 업캐스팅은 부모 타입 자리에 자식 객체를 넣는 것

- **계층**: `Iterable` → `Collection` → `List` → `ArrayList` (위가 부모 인터페이스, 아래로 상속·구현)
- **업캐스팅**: 부모 타입 변수(파라미터)에 자식 객체를 대입하는 것
- **연결 개념**: 업캐스팅은 자바의 다형성 특징으로 이어지며, 자바가 유연하게 처리되는 근거

**아주 간단한 핵심 예시**

```java
Iterable<ArticleEntity> list = new ArrayList<>();   // 업캐스팅
```

- **예상 결과 (실행 전)**: 컴파일 정상, `saveAll(list)` 같은 `Iterable` 파라미터에 전달 가능
- **이유**: `ArrayList`는 `Iterable`의 자손이므로 부모 타입으로 받을 수 있음

**주의점**

- 인터페이스로 객체를 직접 만들 수 없으므로 실제로는 구현한 클래스의 객체가 전달됨

## 12. 시험 대비 체크리스트

**출제 방식 (강의 중 언급)**

- 서블릿 파트와 스프링 파트 문제가 랜덤으로 섞여 출제
- 단답형 중심, 라이브러리 설명을 읽고 라이브러리명 쓰기 유형 포함
- 수업에서 다루지 않은 내용은 출제하지 않음 (자바도 수업에서 언급한 범위)
- 새로 배운 어노테이션은 전부 출제 가능

**스프링 어노테이션**

- `@Controller`, `@RestController`, `@GetMapping`, `@PostMapping`
- `@Autowired`
- `@Entity`, `@Id`, `@GeneratedValue`, `@Column`, `@Table`
- `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@ToString`

**개념 서술**

- IoC와 DI의 정의, `@Autowired`의 동작 과정
- 서블릿 컨테이너와 스프링 컨테이너의 차이
- POJO의 의미와 서블릿 클래스와의 차이
- Entity와 서블릿 DTO의 차이
- `CrudRepository`와 `JpaRepository`의 차이
- 쿼리 메서드 이름에서 쿼리문 유추 (예: `findByTitle`을 SQL로)
- HTTP 메시지 구조, @Controller 반환 시 처리 흐름

**서블릿 복습 (별도 출제)**

- 4개 영역(page, request, session, application)과 `setAttribute`
- redirect와 forward
- `@WebServlet` 매핑
