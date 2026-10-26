# 스프링 부트 수업 전체 정리


## 1. 수업 전체 흐름

1. Spring Boot 프로젝트 생성 및 Gradle 설정
2. Servlet과 Spring Framework의 차이
3. 3-Layered Architecture 구조
4. Spring MVC와 REST API의 차이
5. HTTP 요청·응답 메시지와 상태 코드
6. JPA, H2, Mustache 의존성 추가
7. 프로젝트 폴더 구조와 환경 설정
8. DispatcherServlet과 ViewResolver 처리 흐름
9. Spring Bean과 주요 어노테이션
10. Controller 구현 및 웹페이지 연결 실습

# 2. Spring Boot 프로젝트 생성

녹취 00:01\~04:00

## 2-1. Spring Boot가 필요한 이유

기존 Spring Framework에서는 개발자가 라이브러리, 서버, 환경 설정 등을 상당 부분 직접 구성해야 했다.

Spring Boot는 이러한 작업을 자동화하고, 기본 설정을 제공해 프로젝트를 빠르게 시작할 수 있도록 만든 기술이다.

| 구분     | Spring Framework | Spring Boot  |
| ------ | ---------------- | ------------ |
| 초기 설정  | 상대적으로 복잡         | 자동 설정 제공     |
| 서버     | 별도 구성 가능         | 내장 서버 사용 가능  |
| 의존성 관리 | 개발자가 직접 구성       | Starter 제공   |
| 개발 속도  | 초기 설정 부담         | 빠른 시작        |
| 관계     | 기반 프레임워크         | Spring 기반 도구 |

비유: Spring Framework가 건물의 기본 골조라면 Spring Boot는 전기·수도·기본 설비까지 상당 부분 준비된 건물과 비슷하다.

## 2-2. Spring Initializr 설정

사이트: [Spring Initializr](https://start.spring.io?utm_source=chatgpt.com)

| 설정 항목         | 수업에서 선택한 값                 |
| ------------- | -------------------------- |
| Project       | Gradle                     |
| Language      | Java                       |
| Spring Boot   | 강의에서 4.1.1 언급              |
| Group         | `com.동향`으로 인식됨 (확인 필요)     |
| Artifact      | `articleprojectc`에 해당하는 이름 |
| Packaging     | Jar                        |
| Java          | 17                         |
| Configuration | `application.properties`   |

주의: Spring Boot 4.1.1과 Java 17은 호환성을 확인해야 한다. Spring Boot 4 계열은 Java 17 이상을 요구하지만, 4.1.1이라는 세부 버전은 녹취 인식 오류일 수 있다. 실습실 프로젝트에 생성된 버전을 우선 확인하자.

### 용어 정리

- Gradle: 프로젝트 빌드와 의존성 관리를 자동화하는 도구.
- Dependency: 의존성. 프로그램이 실행되거나 빌드될 때 필요한 외부 라이브러리.
- Artifact: 빌드 결과물 또는 프로젝트를 식별하는 이름.
- Package: 관련된 Java 클래스를 묶는 논리적 단위.
- JAR: Java 클래스와 리소스를 묶어 배포하는 파일 형식.

### Java 버전 확인

```
java -version
```

# 3. Servlet과 Spring Framework 비교

녹취 04:00\~06:30

시험 강조

교수님은 Servlet과 Spring Framework의 차이를 시험에 출제할 수 있다고 강조했다.

| 구분     | Servlet            | Spring Framework      |
| ------ | ------------------ | --------------------- |
| 개념     | Java 웹 요청·응답 처리 기술 | 애플리케이션 개발 프레임워크       |
| 구조     | 개발자가 직접 설계         | 계층화와 DI 등 지원          |
| DB 접근  | JDBC/DAO 직접 구현 가능  | JDBC, JPA 등과 통합       |
| 보안     | 별도 구현·통합 필요        | Spring Security 활용 가능 |
| 적합한 규모 | 단순 웹 기능에도 적합       | 복잡한 기업용 시스템에 강점       |

교수님 설명의 핵심은 다음과 같다.

- 단순하고 작은 시스템은 Servlet만으로 구현할 수 있다.
- 복잡하고 큰 시스템은 Spring을 사용하면 유지보수에 유리하다.
- Spring은 엔터프라이즈(Enterprise, 기업용) 시스템 개발에 적합하다.

정확한 기술적 구분: Servlet은 구식 기술이라서 Spring보다 무조건 성능이 떨어지는 것이 아니다. Spring MVC 자체도 Servlet 기술을 기반으로 작동한다.

따라서 시험에서는 교수님이 강조한 규모와 유지보수 차이를 기억하되, 실제로는 Spring이 Servlet 위에 편리한 추상화와 기능을 제공한다고 이해하는 것이 정확하다.

# 4. 3-Layered Architecture

녹취 06:30\~11:45

시험 강조

Layer는 영어로 '층'이라는 뜻이다. 프로그래밍에서는 역할에 따라 프로그램을 나누는 구조를 의미한다.

하나의 거대한 프로그램으로 모든 기능을 구현하면 수정과 유지보수가 어려워진다. 그래서 Spring에서는 역할에 따라 3개의 계층으로 분리하는 방식을 많이 사용한다.

Presentation Layer

Controller — 클라이언트 요청·응답

Service Layer

Service — 핵심 비즈니스 로직

Data Access Layer

Repository / DAO — 데이터 접근

Database

## 4-1. Presentation Layer

은행의 창구 역할이다.

고객이 은행 창구에 업무를 요청하는 것처럼, 클라이언트가 보낸 HTTP 요청을 받아 적절한 처리를 수행하고 결과를 반환한다.

대표 기술은 Spring MVC, Spring Web, `@Controller`, `@RestController`이다.

## 4-2. Service Layer

은행의 실제 업무 처리 부서다.

예를 들어 계좌이체 요청이 들어오면 잔액 확인, 송금 가능 여부 판단, 거래 규칙 적용 등의 비즈니스 로직을 처리한다.

대표 어노테이션은 `@Service`다.

## 4-3. Data Access Layer

은행의 고객 정보 및 거래 기록을 관리하는 부서다.

데이터베이스에 데이터를 저장하고, 조회하고, 수정하고, 삭제하는 작업을 담당한다.

대표 기술은 다음과 같다.

| 기술              | 특징                      |
| --------------- | ----------------------- |
| JDBC            | Java의 기본 DB 접근 API      |
| Spring JDBC     | JDBC 코드의 반복 작업을 줄임      |
| MyBatis         | SQL 중심의 데이터 매핑 프레임워크    |
| Hibernate       | JPA 구현체인 ORM 프레임워크      |
| Spring Data JPA | JPA 기반 Repository 개발 지원 |

### DAO와 Repository

DAO는 Data Access Object, 즉 데이터 접근 객체라는 뜻이다.

Repository는 저장소라는 뜻으로, 데이터 접근을 추상화한 구성 요소다.

둘은 유사한 역할을 하지만 완전히 같은 개념은 아니다.

## 4-4. DataSource

시험 강조

교수님이 특히 강조한 개념이다.

데이터베이스에 연결하려면 일반적으로 다음 정보가 필요하다.

- DB 주소(IP 또는 호스트명), 포트, 데이터베이스 이름
- 사용자 계정
- 비밀번호

이 정보를 바탕으로 DB 연결을 관리하는 것이 `DataSource`다.

예시:

```
spring.datasource.url=jdbc:mysql://localhost:3306/school
spring.datasource.username=root
spring.datasource.password=example
```

단, 엄밀히 말하면 DataSource는 단순히 세 가지 정보를 합친 문자열이 아니라 DB 연결을 제공하는 객체 또는 인터페이스다.

Spring Boot는 위 설정을 사용해 DataSource를 구성할 수 있다.

실제 운영 환경에서는 비밀번호를 Git에 올리지 않고 환경변수나 비밀 관리 시스템으로 관리한다.

# 5. Spring MVC와 REST API

녹취 11:45\~19:20

시험 강조

## 5-1. MVC의 의미

MVC는 Model, View, Controller의 약자다.

| 구성         | 원뜻  | 역할              |
| ---------- | --- | --------------- |
| Model      | 모델  | 데이터와 애플리케이션 상태  |
| View       | 화면  | 사용자에게 보여줄 결과    |
| Controller | 제어자 | 요청을 받아 처리 흐름 제어 |

Spring MVC는 이 구조를 기반으로 `DispatcherServlet`, `HandlerMapping`, `ViewResolver` 등 요청 처리에 필요한 기능을 제공한다.

## 5-2. Spring MVC의 요청 처리 과정

클라이언트 요청

DispatcherServlet

HandlerMapping을 통한 컨트롤러 탐색

Controller → Service → Repository

ViewResolver → Mustache 템플릿

HTML 응답 → 브라우저 렌더링

주요 구성 요소

- `DispatcherServlet`: 모든 요청을 접수하는 중앙 창구(Front Controller).
- `HandlerMapping`: 요청 URL과 HTTP 메서드에 맞는 컨트롤러 메서드를 찾는 구성 요소.
- `ViewResolver`: 컨트롤러가 반환한 뷰 이름을 실제 화면 템플릿과 연결하는 구성 요소.

실제로는 `HandlerAdapter` 등 추가 구성 요소도 처리에 관여한다.

## 5-3. MVC 방식과 REST API 방식 비교

| 구분       | 서버 렌더링 MVC    | REST API 방식       |
| -------- | ------------- | ----------------- |
| 주된 응답    | HTML          | JSON 등 데이터        |
| 화면 생성    | 주로 서버         | 주로 클라이언트          |
| 컨트롤러     | `@Controller` | `@RestController` |
| 템플릿 엔진   | Mustache 등    | 필수 아님             |
| React 연동 | 가능            | 흔히 사용             |

예를 들어 로그인을 처리한다면 다음과 같다.

서버 렌더링 MVC

1. 사용자가 로그인 요청
2. Spring에서 로그인 처리
3. 서버가 HTML 화면 생성
4. 브라우저가 HTML 표시

React + Spring REST API

1. React에서 로그인 요청
2. Spring에서 로그인 처리
3. Spring이 JSON 데이터 응답
4. React가 데이터를 받아 화면 렌더링

JSON 예시:

```
{
  "name": "Kim",
  "message": "로그인 성공"
}
```

### REST에 대한 정확한 이해

교수님은 REST API를 '백엔드가 화면 대신 데이터를 반환하는 방식'이라고 설명했다.

입문용 설명으로는 유용하지만, JSON을 반환한다고 무조건 REST API인 것은 아니다.

REST는 Resource(자원)를 URI로 식별하고 HTTP 메서드와 상태 코드 등을 활용하는 아키텍처 스타일이다.

또한 REST API는 반드시 JSON만 사용해야 하는 것도 아니다.

# 6. HTTP 메시지 구조와 상태 코드

녹취 13:00\~18:00

시험 강조

HTTP 메시지는 다음 네 부분으로 구성된다.

1\. Start Line (시작 줄)

요청: 메서드, 요청 대상, HTTP 버전

2\. Headers (헤더)

Host, Content-Type 등 부가 정보

3\. 빈 줄 — 헤더와 본문 구분

4\. Body (본문)

JSON, HTML 등 실제 데이터. 없을 수도 있음

### 요청 메시지 예시

```
POST /login HTTP/1.1
Host: localhost:8081
Content-Type: application/json

{"id":"user1","password":"1234"}
```

요청 시작 줄에는 HTTP 메서드, 요청 대상, HTTP 버전이 들어간다.

### 응답 메시지 예시

```
HTTP/1.1 200 OK
Content-Type: application/json

{"name":"Kim"}
```

응답 시작 줄에는 HTTP 버전, 상태 코드, 상태 설명이 들어간다.

주의: 교수님 설명과 달리 일반적인 HTTP/1.1 응답 시작 줄에는 프론트엔드 주소가 들어가지 않는다.

## 6-1. HTTP 상태 코드

| 범위  | 의미         | 대표 코드               |
| --- | ---------- | ------------------- |
| 1xx | 정보성 응답     | 100 Continue        |
| 2xx | 성공         | 200 OK, 201 Created |
| 3xx | 리다이렉션      | 301, 302            |
| 4xx | 클라이언트 측 오류 | 400, 401, 403, 404  |
| 5xx | 서버 측 오류    | 500, 503            |

시험 핵심은 200 성공 / 302 리다이렉트 / 404 리소스 없음 / 500 서버 오류다.

다만 모든 4xx가 단순히 사용자의 잘못이라는 뜻은 아니다. 요청 자체나 인증·권한·리소스 상태 등에 문제가 있다는 의미다.

## 6-2. HTTP 메서드와 CRUD

| CRUD   | 의미 | HTTP 메서드   |
| ------ | -- | ---------- |
| Create | 생성 | POST       |
| Read   | 조회 | GET        |
| Update | 수정 | PUT, PATCH |
| Delete | 삭제 | DELETE     |

`PUT`은 자원을 전체 교체하는 의미로 많이 사용하고, `PATCH`는 부분 수정에 사용한다. 단, 실제 동작은 API 설계에 따라 달라진다.

# 7. 의존성(Dependency) 추가

녹취 19:20\~25:30

이번 프로젝트에서 선택한 핵심 의존성은 네 가지다.

| 의존성             | 역할                     | 관련 계층        |
| --------------- | ---------------------- | ------------ |
| Spring Web      | HTTP 요청 처리, Spring MVC | Presentation |
| Spring Data JPA | DB 접근 및 Repository     | Data Access  |
| H2 Database     | 개발·테스트용 데이터베이스         | Database     |
| Mustache        | 서버 HTML 템플릿 엔진         | View         |

## 7-1. H2 Database

H2는 Java 기반의 경량 관계형 데이터베이스다.

메모리 모드로 사용하면 서버가 종료될 때 데이터가 사라질 수 있어 실습과 테스트에 유용하다. 파일 기반 저장 방식도 지원한다.

교수님은 중간 실습에는 H2를 사용하고, 기말 프로젝트에서는 실제 DBMS를 연결해야 한다고 설명했다.

## 7-2. HTML, JSP, Thymeleaf, Mustache 비교

시험 강조

교수님이 성격이 다른 하나를 고르는 문제를 강조했다.

| 기술        | 실행·처리 위치  | 특징                 |
| --------- | --------- | ------------------ |
| 일반 HTML   | 브라우저에서 해석 | 정적 문서              |
| JSP       | 서버에서 처리   | Java 기반 동적 HTML 생성 |
| Thymeleaf | 서버에서 처리   | HTML 친화적 템플릿 엔진    |
| Mustache  | 서버에서 처리   | 문법이 단순한 템플릿 엔진     |

시험 예상 정답: 일반 HTML

JSP, Thymeleaf, Mustache는 서버 측에서 데이터를 반영해 HTML을 생성할 수 있다.

반면 일반 정적 HTML은 서버가 별도로 템플릿 처리하지 않고 그대로 전달할 수 있다.

Mustache를 선택한 이유는 문법이 비교적 간단하고, 이번 수업에서 화면보다 백엔드 처리 구조를 중점적으로 다루기 때문이다.

# 8. Spring Boot 프로젝트 폴더 구조

녹취 26:00\~37:00

시험 강조

```
articleprojectc/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── .../
│   │   │       └── ArticleprojectcApplication.java
│   │   └── resources/
│   │       ├── static/
│   │       ├── templates/
│   │       └── application.properties
│   └── test/
│       └── java/
├── build.gradle
├── settings.gradle
└── gradlew
```

## 8-1. main과 test 차이

| 폴더                   | 용도                    |
| -------------------- | --------------------- |
| `src/main/java`      | 실제 애플리케이션 Java 코드     |
| `src/test/java`      | 테스트용 Java 코드          |
| `src/main/resources` | 설정 및 리소스              |
| `static`             | 정적 HTML, CSS, JS, 이미지 |
| `templates`          | Mustache 등 서버 템플릿     |

`src/test/java`에는 JUnit 테스트 클래스를 작성한다.

## 8-2. JUnit

시험 강조

JUnit은 Java에서 사용하는 단위 테스트(Unit Test) 프레임워크다.

전체 프로그램이 완성되지 않았더라도 특정 메서드나 기능을 독립적으로 테스트하는 데 사용한다.

```
@Test
void additionTest() {
    int result = 2 + 3;
    assertEquals(5, result);
}
```

`assertEquals(5, result)`는 예상값 5와 실제 결과가 같은지 검증한다.

다만 다른 계층과의 실제 연동을 검증하는 테스트는 단위 테스트보다는 통합 테스트에 해당할 수 있다.

## 8-3. static과 templates

static

파일을 그대로 제공

logo.png, style.css, 일반 index.html

templates

템플릿 엔진으로 처리

index.mustache, intro.mustache

예를 들어 `index.html`이라도 Thymeleaf 문법을 사용한다면 일반적으로 `templates`에 배치한다.

# 9. 환경 설정 파일 비교

녹취 37:00\~43:50

시험 강조

교수님이 구분을 강조한 세 가지 설정이다.

| 항목                       | 설정 대상              |
| ------------------------ | ------------------ |
| `application.properties` | Spring Boot 애플리케이션 |
| `build.gradle`           | Gradle 빌드 및 의존성    |
| IntelliJ Settings        | IDE 자체 환경          |

## 9-1. 포트 번호 변경

Spring Boot 내장 웹 서버는 별도 설정이 없다면 일반적으로 8080 포트를 사용한다.

이번 수업에서는 8081로 변경했다.

```
spring.application.name=articleprojectc
server.port=8081
```

서버 실행 후 접속 주소:

```
http://localhost:8081/
```

기존 외부 Tomcat 환경에서는 `server.xml`을 수정하는 경우가 있었지만, Spring Boot에서는 `server.port` 설정으로 변경할 수 있다.

## 9-2. properties와 YAML 비교

Properties

```
server.port=8081
spring.application.name=articleprojectc
```

YAML

```
server:
  port: 8081
spring:
  application:
    name: articleprojectc
```

두 방식 모두 설정을 표현할 수 있다. 이번 실습은 Properties를 사용했다.

## 9-3. CORS와 CSRF 구분

교수님은 React와 Spring의 통신 보안도 언급했다.

여기서 반드시 구분해야 할 개념이 있다.

| 개념   | 역할                       |
| ---- | ------------------------ |
| CORS | 브라우저의 교차 출처 요청 허용 정책     |
| CSRF | 사용자 권한을 악용한 위조 요청 공격     |
| 인증   | 요청자가 누구인지 확인             |
| 인가   | 요청자가 해당 작업을 할 권한이 있는지 확인 |

CORS를 설정한다고 클라이언트의 신원이 인증되거나 메시지의 무결성이 보장되는 것은 아니다.

React와 Spring 사이의 통신을 안전하게 구현하려면 HTTPS, 인증·인가, CSRF 방어 등 필요한 보안 수단을 별도로 적용해야 한다.

# 10. DispatcherServlet과 ViewResolver

녹취 59:00\~01:05:50

시험 강조

이번 수업에서 가장 중요한 처리 흐름 중 하나다.

## 10-1. 요청이 들어왔을 때의 동작

클라이언트가 다음 주소로 접속한다고 가정하자.

```
http://localhost:8081/
```

Spring MVC는 다음 순서로 처리한다.

1. 클라이언트가 GET 요청

   GET /
2. DispatcherServlet이 요청 접수

   중앙 요청 처리 담당
3. HandlerMapping으로 컨트롤러 검색

   `@GetMapping("/")`에 해당하는 메서드 찾기
4. Controller 메서드 실행

   `return "index";`
5. ViewResolver가 뷰 이름 해석

   index → index.mustache
6. Mustache 엔진으로 HTML 생성

   templates/index.mustache 사용
7. HTML을 응답하고 브라우저에서 렌더링

## 10-2. ViewResolver의 역할

ViewResolver는 영어로 \*View(화면) + Resolver(해결하는 것)\*이다.

컨트롤러가 반환한 논리적 뷰 이름을 실제 뷰와 연결하는 역할을 한다.

예를 들어 다음과 같다.

Controller 반환

`"index"`

ViewResolver

실제 템플릿

index.mustache

Spring Boot의 일반적인 Mustache 기본 설정에서는 다음 위치의 템플릿을 찾는다.

```
classpath:/templates/index.mustache
```

교수님은 접두어(Prefix)와 접미어(Suffix)를 붙여 파일명을 완성한다고 설명했다.

- Prefix: `classpath:/templates/`
- View name: `index`
- Suffix: `.mustache`

이 개념은 시험에서 반드시 기억할 필요가 있다.

# 11. Mustache 파일 생성 및 IntelliJ 설정

녹취 01:06:00\~01:11:15

## 11-1. Mustache 파일 생성

IntelliJ에서 다음 경로로 이동한다.

```
src/main/resources/templates/
```

여기서 `index.mustache` 파일을 생성한다.

IntelliJ에서 Mustache 문법이 제대로 인식되지 않는다면 다음 절차를 따른다.

1. Settings → Plugins
2. Marketplace에서 Mustache 검색
3. 플러그인 설치
4. 필요하면 Gradle 새로고침 또는 IntelliJ 재시작

플러그인은 IDE에서 문법 강조와 편집 기능을 제공한다. 플러그인 설치 자체가 서버의 Mustache 의존성을 추가하는 것은 아니다.

## 11-2. 첫 번째 화면 구현

`index.mustache`

```
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>홈</title>
</head>
<body>
    <h1>메인 메뉴</h1>
    <main>게시판 시스템에 오신 것을 환영합니다.</main>
</body>
</html>
```

현재는 Mustache 변수를 사용하지 않았으므로 일반 HTML과 거의 동일하다.

추후 다음과 같이 데이터를 삽입할 수 있다.

```
<h1>안녕하세요, {{name}}님!</h1>
```

`{{name}}`은 서버가 템플릿에 전달한 데이터를 출력하는 Mustache 문법이다.

# 12. URL과 URI의 차이

녹취 01:00:00\~01:02:20

시험 강조

교수님은 요청 주소를 URL과 URI로 구분해서 설명했다.

예시:

```
http://localhost:8081/intro
```

URL 구성

http\://

프로토콜

localhost

호스트

:8081

포트

/intro

경로(Path)

교수님은 전체 주소를 URL, `/intro` 부분을 URI라고 설명했다.

시험에서는 교수님이 의도한 구분을 기억하면 된다.

다만 기술적으로 더 정확하게는 다음과 같다.

- URI (Uniform Resource Identifier): 자원을 식별하는 식별자
- URL (Uniform Resource Locator): 자원의 위치 또는 접근 방법을 나타내는 URI
- Path: `/intro`와 같은 경로 부분

즉, `/intro`는 URI 전체가 아니라 URL의 경로에 해당한다.

# 13. GET, POST, Redirect, Forward

녹취 01:11:15\~01:21:30

시험 강조

## 13-1. GET 요청이 발생하는 경우

교수님이 강조한 GET 요청의 대표적인 세 가지 경우다.

| 동작                   | HTTP 메서드 |
| -------------------- | -------- |
| 브라우저 주소창에 URL 입력     | GET      |
| HTML `<a>` 링크 클릭     | GET      |
| 일반적인 Redirect 이후 재요청 | GET      |

예를 들어 다음 코드는 링크를 클릭하면 GET 요청을 발생시킨다.

```
<a href="/intro">대학 소개</a>
```

반면 HTML Form은 GET 또는 POST를 사용할 수 있다.

```
<form action="/login" method="post">
    <input name="id">
    <button type="submit">로그인</button>
</form>
```

이 경우 POST 요청이 만들어진다.

## 13-2. Redirect와 Forward

| 구분      | Redirect                | Forward         |
| ------- | ----------------------- | --------------- |
| 동작      | 클라이언트에게 다른 주소로 이동하도록 지시 | 서버 내부에서 요청 전달   |
| 추가 요청   | 일반적으로 발생                | 발생하지 않음         |
| 주소창     | 변경됨                     | 일반적으로 유지        |
| HTTP 상태 | 주로 3xx                  | 별도의 리다이렉트 응답 없음 |
| 사용 예    | 로그인 후 페이지 이동            | 서버 내부 처리 위임     |

Redirect

브라우저

서버 A

A 요청 → 302 응답 → 브라우저가 B로 재요청

Forward

브라우저

서버 내부 A → B

하나의 클라이언트 요청 안에서 서버 내부 전달

### Redirect 코드

```
@GetMapping("/old")
public String oldPage() {
    return "redirect:/intro";
}
```

브라우저가 `/old`를 요청하면 서버가 `/intro`로 이동하도록 지시한다.

### Forward 코드

```
@GetMapping("/old")
public String oldPage() {
    return "forward:/intro";
}
```

서버 내부에서 `/intro` 처리로 요청을 전달한다.

중요한 예외: 302 리다이렉트는 POST 요청 이후 브라우저가 GET으로 재요청하는 경우가 일반적이지만, 307·308은 원래 HTTP 메서드를 유지하도록 정의되어 있다. 따라서 모든 Redirect가 무조건 GET인 것은 아니다.

# 14. Spring Bean과 어노테이션

녹취 01:23:00\~01:30:30

시험 강조

## 14-1. Bean이란?

Bean의 일반적인 영어 뜻은 '콩'이지만, Spring에서는 Spring 컨테이너가 생성하고 관리하는 객체를 의미한다.

예를 들어 Java에서는 객체를 직접 생성할 수 있다.

```
Student student = new Student();
```

반면 Spring에서는 적절한 설정이나 어노테이션을 통해 Spring 컨테이너가 객체를 관리하도록 할 수 있다.

그렇게 관리되는 객체가 Spring Bean이다.

교수님은 이를 회사의 직원에 비유했다.

- Bean: 직원
- Spring Container: 직원 관리 시스템
- 어노테이션: 직원의 담당 업무 표시

## 14-2. 핵심 어노테이션 4개

| 어노테이션         | 의미               | 계층           |
| ------------- | ---------------- | ------------ |
| `@Component`  | 일반적인 Spring Bean | 공통           |
| `@Controller` | 요청 처리 컨트롤러       | Presentation |
| `@Service`    | 비즈니스 로직 담당       | Service      |
| `@Repository` | 데이터 접근 담당        | Data Access  |

`@Controller`, `@Service`, `@Repository`는 모두 `@Component`를 기반으로 하는 특수화된 어노테이션이다.

### 코드 예시

```
@Controller
public class MainController {
}
```

Spring이 컴포넌트 스캔을 통해 이 클래스를 발견하면 Bean으로 등록할 수 있다.

```
@Service
public class UserService {
}
```

서비스 계층에서 동작할 객체임을 표현한다.

```
@Repository
public class UserRepository {
}
```

데이터 접근을 담당하는 객체임을 표현한다.

`@Repository`는 단순한 역할 표시 외에도 특정 데이터 접근 예외를 Spring 예외 체계로 변환하는 데 관여할 수 있다.

Spring Data JPA의 Repository 인터페이스는 일반적으로 `@Repository`를 직접 붙이지 않아도 자동으로 구현체가 등록될 수 있다.

## 14-3. @Controller와 @RestController

시험 강조

| 구분           | `@Controller`      | `@RestController` |
| ------------ | ------------------ | ----------------- |
| 주된 용도        | 서버 렌더링 MVC         | REST API          |
| String 반환    | 기본적으로 뷰 이름으로 해석 가능 | 응답 본문 데이터         |
| ViewResolver | 뷰 반환 시 사용          | 일반적인 데이터 응답 시 불필요 |
| React 연동     | 가능                 | 일반적으로 많이 사용       |

### @Controller

```
@Controller
public class PageController {
    @GetMapping("/")
    public String home() {
        return "index";
    }
}
```

`"index"`는 뷰 이름으로 해석된다.

### @RestController

```
@RestController
public class ApiController {
    @GetMapping("/api/hello")
    public String hello() {
        return "Hello";
    }
}
```

이 경우 `"Hello"`가 HTTP 응답 본문으로 전달된다.

`@RestController`는 실질적으로 `@Controller`와 `@ResponseBody`의 기능을 결합한 어노테이션이다.

### 교수님 설명에서 바로잡을 점

교수님은 `@Controller`가 붙은 클래스의 메서드는 반드시 `String`을 반환한다고 설명했지만, 이는 정확하지 않다.

실제로는 `ModelAndView`, `ResponseEntity`, `void` 등 다양한 반환 타입을 사용할 수 있다. `@ResponseBody`를 붙여 JSON 등의 데이터를 직접 반환할 수도 있다.

시험에서는 일반적인 MVC 뷰 반환과 REST 데이터 반환의 차이를 중점적으로 기억하면 된다.

# 15. 인터페이스와 추상 메서드

녹취 01:30:30\~01:34:00

교수님은 Java의 인터페이스 개념도 복습했다.

## 15-1. Interface

Interface의 영어 원뜻은 '접점' 또는 '인터페이스'다. 프로그래밍에서는 구현 클래스가 따라야 할 계약 또는 규격을 정의한다.

```
interface Animal {
    void sound();
}
```

`void sound();`는 메서드 본문이 없는 추상 메서드다.

이를 구현하는 클래스는 다음과 같다.

```
class Dog implements Animal {
    @Override
    public void sound() {
        System.out.println("멍멍");
    }
}
```

`Dog` 클래스는 `Animal` 인터페이스가 요구하는 `sound()`를 구현해야 한다.

## 15-2. implements와 extends

| 키워드          | 역할                 |
| ------------ | ------------------ |
| `implements` | 인터페이스 구현           |
| `extends`    | 클래스 상속 또는 인터페이스 확장 |
| `abstract`   | 추상 클래스·추상 메서드 선언   |
| `@Override`  | 상위 타입의 메서드 재정의 표시  |

단, 인터페이스가 추상 메서드로만 구성된다는 설명은 오래된 Java 기준의 단순화다.

현재 Java 인터페이스에는 `default`, `static`, `private` 메서드처럼 본문을 가진 메서드도 존재할 수 있다.

## 15-3. Spring Controller 인터페이스에 대한 주의점

교수님은 `@Controller`가 내부적으로 Spring의 `Controller` 인터페이스를 구현하는 것과 같다고 설명했다.

하지만 `@Controller` 어노테이션을 붙인다고 자동으로 `org.springframework.web.servlet.mvc.Controller` 인터페이스를 구현하는 것은 아니다.

현대 Spring MVC에서는 `@GetMapping` 등의 어노테이션을 기반으로 컨트롤러 메서드를 호출한다.

따라서 `handleRequest()`라는 메서드를 반드시 구현할 필요도 없고, 모든 컨트롤러 메서드가 `String`을 반환해야 하는 것도 아니다.

# 16. HTTP 매핑 어노테이션

녹취 01:34:00\~01:39:30

시험 강조

Servlet에서는 다음과 같은 코드를 사용했다.

```
@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    @Override
    protected void doGet(
        HttpServletRequest req,
        HttpServletResponse resp) {
    }
}
```

Spring MVC에서는 메서드 위에 HTTP 매핑 어노테이션을 붙여 요청을 연결할 수 있다.

| 어노테이션            | HTTP 메서드 | CRUD   |
| ---------------- | -------- | ------ |
| `@GetMapping`    | GET      | Read   |
| `@PostMapping`   | POST     | Create |
| `@PutMapping`    | PUT      | Update |
| `@PatchMapping`  | PATCH    | Update |
| `@DeleteMapping` | DELETE   | Delete |

### GET 매핑 예시

```
@GetMapping("/intro")
public String intro() {
    return "intro";
}
```

이 코드의 의미는 다음과 같다.

- `@GetMapping`: GET 방식 요청
- `"/intro"`: 요청 경로
- `intro()`: 실행할 Java 메서드
- `"intro"`: 반환할 뷰 이름

교수님은 시험에서 경로 앞의 `/`를 빠뜨리면 오답 처리하겠다고 강조했다.

실제 Spring에서는 일부 매핑 표기가 정규화되어 동작할 수 있지만, 수업 및 시험에서는 `/intro`처럼 앞에 슬래시를 명시하는 것이 안전하다.

# 17. Spring Boot 실습 전체 재현

녹취 01:39:30\~01:49:00

이번 수업의 최종 실습 목표는 홈 화면과 대학 소개 화면을 만들고, 링크를 클릭해 서로 이동하는 것이다.

## 17-1. 최종 폴더 구조

```
articleprojectc/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/articleprojectc/
│       │       ├── ArticleprojectcApplication.java
│       │       └── controller/
│       │           └── MainController.java
│       └── resources/
│           ├── static/
│           ├── templates/
│           │   ├── index.mustache
│           │   └── intro.mustache
│           └── application.properties
└── build.gradle
```

패키지명 `com.example.articleprojectc`는 실행 가능한 예시다. 실제 수업에서 만든 프로젝트의 패키지명은 녹취만으로 정확히 확인되지 않는다.

## 17-2. application.properties

```
spring.application.name=articleprojectc
server.port=8081
```

포트 번호를 8081로 설정한다.

## 17-3. MainController.java

```
package com.example.articleprojectc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/intro")
    public String intro() {
        return "intro";
    }
}
```

이 코드가 이번 수업에서 작성한 가장 핵심적인 Java 코드다.

`@Controller`는 이 클래스를 웹 요청 처리용 Bean으로 등록할 수 있도록 표시한다.

`@GetMapping("/")`는 루트 경로로 GET 요청이 들어왔을 때 `home()` 메서드를 실행한다.

`return "index";`는 `index.mustache` 템플릿을 선택하게 한다.

`@GetMapping("/intro")`는 `/intro` 경로를 `intro()` 메서드와 연결한다.

## 17-4. index.mustache

```
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>홈</title>
</head>
<body>
    <h1>메뉴</h1>
    <nav>
        <a href="/">홈</a>
        <a href="/intro">대학 소개</a>
    </nav>
    <main>게시판 시스템에 오신 것을 환영합니다.</main>
</body>
</html>
```

## 17-5. intro.mustache

```
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>대학 소개</title>
</head>
<body>
    <h1>메뉴</h1>
    <nav>
        <a href="/">홈</a>
        <a href="/intro">대학 소개</a>
    </nav>
    <main>우리 대학을 소개합니다.</main>
</body>
</html>
```

## 17-6. 실행 결과

[http://localhost:8081/](http://localhost:8081/?utm_source=chatgpt.com)

## 메뉴

홈

대학 소개

게시판 시스템에 오신 것을 환영합니다.

홈 화면의 예상 렌더링 결과

[http://localhost:8081/intro](http://localhost:8081/intro?utm_source=chatgpt.com)

## 메뉴

홈

대학 소개

우리 대학을 소개합니다.

대학 소개 화면의 예상 렌더링 결과

## 17-7. 실행 절차

1. IntelliJ에서 프로젝트 루트 폴더를 연다.
2. Gradle 의존성 다운로드와 동기화가 완료될 때까지 기다린다.
3. `ArticleprojectcApplication.java`의 `main()`을 실행한다.
4. 콘솔에 `Started ...` 메시지가 나타나는지 확인한다.
5. 브라우저에서 `http://localhost:8081/`에 접속한다.
6. 대학 소개 메뉴를 클릭하고 `/intro` 페이지가 나오는지 확인한다.
7. 홈 메뉴를 클릭해 다시 `/`로 돌아오는지 확인한다.

빌드 실행 문제가 발생하면 교수님이 설명한 다음 설정도 확인한다.

`Settings → Build, Execution, Deployment → Build Tools → Gradle`

Gradle 실행 설정에서 IntelliJ IDEA를 사용하도록 변경해 볼 수 있다. 다만 모든 빌드 오류가 이 설정으로 해결되는 것은 아니다.

## 17-8. 페이지 이동 과정

1\. 사용자가 대학 소개 클릭

`<a href="/intro">`

2\. 브라우저가 GET /intro 요청

DispatcherServlet이 요청 접수

3\. MainController.intro() 실행

`return "intro";`

4\. ViewResolver가 템플릿 선택

`intro.mustache`

5\. HTML 응답

브라우저가 대학 소개 화면 표시

# 18. 교수님이 시험 출제를 강조한 내용 총정리

녹취록에서 교수님이 직접 시험 출제를 언급하거나 답을 요구하며 반복 강조한 개념들을 정리했다.

| 중요도 | 시험 개념                      | 핵심 정답                                           |
| --- | -------------------------- | ----------------------------------------------- |
| 최상  | Servlet과 Spring 차이         | 구조, 규모, 유지보수                                    |
| 최상  | 3-Layered Architecture     | Presentation, Service, Data Access              |
| 최상  | DAO 관련 기술                  | JDBC, MyBatis, Hibernate, JPA                   |
| 최상  | DataSource                 | DB 연결 정보 및 연결 관리                                |
| 최상  | Spring MVC                 | DispatcherServlet, HandlerMapping, ViewResolver |
| 최상  | HTTP 메시지 구조                | 시작 줄, 헤더, 빈 줄, 바디                               |
| 최상  | HTTP 상태 코드                 | 2xx, 3xx, 4xx, 5xx                              |
| 최상  | Controller와 RestController | 뷰 반환과 데이터 반환                                    |
| 최상  | GET 매핑                     | `@GetMapping("/경로")`                            |
| 높음  | HTML과 템플릿 엔진               | 정적 HTML vs JSP·Thymeleaf·Mustache               |
| 높음  | static과 templates          | 정적 파일 vs 서버 템플릿                                 |
| 높음  | main과 test                 | 실제 코드 vs 테스트 코드                                 |
| 높음  | JUnit                      | Java 단위 테스트                                     |
| 높음  | 환경 설정 파일                   | properties, Gradle, IDE Settings                |
| 높음  | 서버 포트 설정                   | `server.port=8081`                              |
| 높음  | Bean 관련 어노테이션              | Component, Controller, Service, Repository      |
| 높음  | Redirect와 Forward          | 재요청 vs 서버 내부 전달                                 |
| 높음  | GET 요청 발생                  | 주소창, a 태그, 일반적 Redirect                         |
| 높음  | ViewResolver               | 뷰 이름을 템플릿과 연결                                   |
| 보통  | 인터페이스                      | 구현 클래스가 따르는 규격                                  |
| 보통  | URL과 URI                   | 전체 주소와 경로 구분                                    |

중요도는 녹취록에서의 반복·강조 정도를 기준으로 분류한 것이며, 실제 시험 배점이 공개된 것은 아니다.

# 19. 헷갈리기 쉬운 개념 비교

| 개념 A              | 개념 B                   | 결정적 차이                        |
| ----------------- | ---------------------- | ----------------------------- |
| Spring            | Spring Boot            | 프레임워크 / 자동 설정·실행 편의성          |
| Servlet           | Spring MVC             | 웹 처리 기반 기술 / 이를 활용한 MVC 프레임워크 |
| Controller        | Service                | 요청 처리 / 비즈니스 로직               |
| Service           | Repository             | 업무 규칙 / 데이터 접근                |
| Controller        | RestController         | 기본적인 뷰 해석 / 응답 본문 반환          |
| DispatcherServlet | HandlerMapping         | 요청 처리 총괄 / 처리 메서드 탐색          |
| HandlerMapping    | ViewResolver           | 컨트롤러 탐색 / 뷰 해석                |
| static            | templates              | 정적 파일 / 템플릿 처리                |
| Gradle            | application.properties | 빌드 관리 / 앱 설정                  |
| Redirect          | Forward                | 새 클라이언트 요청 / 내부 전달            |
| GET               | POST                   | 조회 / 데이터 제출·생성                |
| PUT               | PATCH                  | 전체 교체 / 부분 수정                 |
| JPA               | Hibernate              | ORM 명세 / 구현체                  |
| CORS              | CSRF                   | 교차 출처 정책 / 요청 위조 공격           |

# 20. 예상 시험 문제

실제 교수님의 출제 방식에 맞춰 객관식, OX, 빈칸, 코드 해석을 혼합했다. 정답은 접어두었으며, 먼저 풀어본 뒤 확인할 수 있다.

## 예상 객관식 12문제

4지선다 · 녹취록 기반

0/12 응답

1\. Spring의 3-Layered Architecture에 포함되지 않는 것은?

1\. Presentation Layer

2\. Service Layer

3\. Data Access Layer

4\. Compilation Layer

2\. Spring MVC에서 요청을 처음 받아 처리 흐름을 총괄하는 구성 요소는?

1\. ViewResolver

2\. DispatcherServlet

3\. Repository

4\. DataSource

3\. HandlerMapping의 역할은?

1\. DB 연결

2\. 템플릿 확장자 변경

3\. 요청을 처리할 컨트롤러 메서드 탐색

4\. HTML을 브라우저에서 렌더링

4\. Data Access Layer와 가장 관련이 적은 기술은?

1\. MyBatis

2\. Hibernate

3\. Spring Data JPA

4\. Mustache

5\. 일반 HTML, JSP, Thymeleaf, Mustache 중 서버 측 템플릿 기술이 아닌 것은?

1\. 일반 HTML

2\. JSP

3\. Thymeleaf

4\. Mustache

6\. HTTP 응답 상태 코드 404의 의미는?

1\. 요청 성공

2\. 리다이렉트

3\. 요청한 리소스를 찾을 수 없음

4\. 서버 내부 오류

7\. Spring Boot의 서버 포트 번호를 설정하는 올바른 구문은?

1\. port.server=8081

2\. server.port=8081

3\. spring.port:8081

4\. gradle.port=8081

8\. @GetMapping("/intro")가 붙은 메서드가 처리하는 요청은?

1\. POST /intro

2\. GET /intro

3\. DELETE /intro

4\. GET /index

9\. 일반적인 @Controller 메서드가 return "index"를 반환할 때 그 문자열의 의미는?

1\. 반드시 HTTP 응답 본문

2\. 데이터베이스 테이블 이름

3\. 뷰 이름

4\. 서버 포트 이름

10\. Spring에서 일반적으로 Bean을 등록하는 어노테이션이 아닌 것은?

1\. @Component

2\. @Service

3\. @Repository

4\. @GetMapping

11\. src/main/resources/templates의 일반적인 용도는?

1\. Java 단위 테스트

2\. 서버 템플릿 보관

3\. Gradle 실행 파일

4\. 이미지 전용 저장소

12\. Redirect와 Forward의 차이를 가장 정확하게 설명한 것은?

1\. 둘 다 항상 브라우저 재요청 발생

2\. Redirect는 일반적으로 재요청, Forward는 서버 내부 전달

3\. Forward는 항상 302 응답

4\. Redirect는 주소창이 절대 변경되지 않음

채점 및 해설 확인

## 20-2. OX 예상 문제

1\. Spring Boot는 기본적으로 내장 웹 서버를 사용할 수 있다.

OX

2\. Spring Bean은 개발자가 new로 만든 모든 Java 객체를 의미한다.

OX

3\. @RestController는 일반적으로 반환 데이터를 HTTP 응답 본문에 작성한다.

OX

4\. 브라우저 주소창에 URL을 입력하면 일반적으로 GET 요청이 발생한다.

OX

5\. HTTP 응답 시작 줄에는 반드시 HTTP 메서드가 들어간다.

OX

6\. @Controller의 모든 메서드는 반드시 String을 반환해야 한다.

OX

OX 채점하기

## 20-3. 주관식·코드 예상 문제

다음은 교수님이 강조한 실습 문법을 기반으로 한 문제다.

문제 1. Spring의 3-Layered Architecture를 구성하는 세 계층을 작성하시오.

문제 2. Spring MVC에서 클라이언트의 요청을 처음 접수하는 구성 요소와 적절한 컨트롤러를 찾는 구성 요소를 각각 작성하시오.

문제 3. Spring Boot에서 서버 포트를 9090으로 변경하는 설정 구문을 작성하시오.

문제 4. 다음 코드의 빈칸을 채우시오.

```
@Controller
public class MainController {

    @________("/intro")
    public String intro() {
        return "________";
    }
}
```

조건: GET 방식으로 `/intro` 요청을 처리하고 `intro.mustache` 화면을 반환해야 한다.

문제 5. 다음 코드를 실행했을 때 클라이언트가 받는 응답은 무엇인지 설명하시오.

```
@RestController
public class TestController {
    @GetMapping("/test")
    public String test() {
        return "hello";
    }
}
```

문제 6. Redirect와 Forward의 차이를 클라이언트의 재요청 여부와 브라우저 주소창의 변화를 기준으로 서술하시오.

주관식 모범답안 보기

# 21. 최종 암기 노트

시험 직전에 확인할 수 있도록 핵심만 압축했다.

Spring 구조

Presentation → Service → Data Access

Spring MVC 처리 순서

DispatcherServlet → HandlerMapping → Controller → ViewResolver → View → Response

핵심 어노테이션

`@Component`, `@Controller`, `@RestController`, `@Service`, `@Repository`, `@GetMapping`, `@PostMapping`

HTTP

시작 줄 → 헤더 → 빈 줄 → 바디

200 성공 / 302 이동 / 404 없음 / 500 서버 오류

프로젝트 구조

main = 실제 코드, test = 테스트, static = 정적 파일, templates = 템플릿

설정

`build.gradle` = 의존성·빌드

`application.properties` = Spring Boot 설정

`server.port=8081` = 포트 변경

이번 실습의 핵심

`@GetMapping("/")` → `return "index"` → `index.mustache`

`@GetMapping("/intro")` → `return "intro"` → `intro.mustache`

## 수업에서 다음 시간까지 해야 할 일

교수님은 이번에 만든 Spring Boot 프로젝트를 계속 누적해서 사용할 것이라고 설명했다. 따라서 프로젝트 전체 폴더를 보관해야 한다.

다음 수업 전까지는 `index.mustache`, `intro.mustache`, `MainController.java`, `application.properties`가 정상적으로 구성되어 있고 두 페이지가 모두 열리는지 확인하면 된다.

특히 시험 준비에서는 Spring MVC의 요청 처리 순서, 3계층 구조, 어노테이션 역할, HTTP 메시지, 설정 파일의 차이를 최우선으로 복습하는 것이 효율적이다.
