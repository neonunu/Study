# C 기본 라이브러리와 프로그램 인터페이스
## 1. POSIX 표준

**POSIX(Portable Operating System Interface)**: 운영체제 사이의 호환성을 위한 표준 인터페이스

### 주요 배경

- 1988년 IEEE의 초기 POSIX.1 발표
- 1998년 The Open Group, IEEE, ISO/IEC 관계자 중심의 Austin Group 결성
- 2001년 IEEE Std 1003.1-2001 제정
- 시스템 호출, 표준 라이브러리, 셸, 명령줄 도구 등의 공통 인터페이스 제공

### 주요 범위

| 구분 | 내용 |
| --- | --- |
| 시스템 인터페이스 | 파일, 프로세스, 신호, 장치 접근 |
| 셸과 유틸리티 | 표준 셸 문법과 명령줄 도구 |
| 스레드 | POSIX Threads 기반 스레드 생성과 동기화 |
| 보안 | 사용자 권한과 접근 제어 관련 인터페이스 |
| 언어 바인딩 | C 이외 언어에서 POSIX 기능을 사용하는 규약 |

> POSIX 함수는 UNIX 계열 운영체제에서 폭넓게 지원. ISO C 표준 라이브러리와 지원 범위 구분 필요

## 2. 표준 C 라이브러리

**표준 C 라이브러리**: 입출력, 문자열, 메모리, 수학 계산 등에 필요한 함수와 자료형의 모음

### 주요 헤더와 함수

| 헤더 | 분류 | 대표 함수 |
| --- | --- | --- |
| `<stdio.h>` | 표준 입출력 | `printf()`, `scanf()`, `putchar()`, `getchar()` |
| `<stdio.h>` | 파일 입출력 | `fopen()`, `fclose()`, `fprintf()`, `fscanf()` |
| `<stdlib.h>` | 문자열과 수치 변환 | `strtol()`, `strtod()`, `atoi()` |
| `<stdlib.h>` | 난수 | `rand()`, `srand()` |
| `<stdlib.h>` | 탐색과 정렬 | `bsearch()`, `qsort()` |
| `<stdlib.h>` | 동적 메모리 | `malloc()`, `calloc()`, `realloc()`, `free()` |
| `<ctype.h>` | 문자 변환 | `tolower()`, `toupper()` |
| `<ctype.h>` | 문자 판별 | `isalpha()`, `isdigit()`, `isupper()` |
| `<string.h>` | 문자열 처리 | `strcpy()`, `strlen()`, `strcmp()` |
| `<string.h>` | 메모리 처리 | `memcpy()`, `memset()`, `memchr()` |
| `<math.h>` | 수학 계산 | `sin()`, `cos()`, `sqrt()` |
| `<time.h>` | 날짜와 시간 | `time()`, `difftime()`, `ctime()` |

### POSIX 전용 헤더 예

| 헤더 | 분류 | 대표 함수 |
| --- | --- | --- |
| `<search.h>` | 탐색 자료 구조 | `lsearch()`, `hsearch()`, `tsearch()` |

### 표기 주의

- 헤더 이름은 소문자 사용: `<string.h>`, `<math.h>`, `<time.h>`
- `itoa()`는 ISO C 표준 함수가 아닌 구현체별 확장 기능
- 정수를 문자열로 변환할 때 `snprintf()` 또는 `sprintf()` 사용 가능
- `<search.h>`는 POSIX 헤더로 분류, ISO C 표준 라이브러리와 별도 구분

## 3. 표준 라이브러리 사용 예

### 예제 목표

- `<math.h>`의 `sqrt()` 사용
- `<ctype.h>`의 `tolower()` 사용
- 수학 라이브러리 링크 옵션 `-lm` 확인

### 소스 코드: `library.c`

```c
#include <stdio.h>
#include <math.h>
#include <ctype.h>

int main(void)
{
    int number = 4;
    char letter = 'A';

    // number의 제곱근 출력
    printf("sqrt(%d) = %f\n", number, sqrt(number));

    // 영문 대문자를 소문자로 변환
    printf("tolower(%c) = %c\n", letter, tolower(letter));

    return 0;
}
```

### 컴파일과 실행

```bash
gcc -o library library.c -lm
./library
```

### 실행 결과

```text
sqrt(4) = 2.000000
tolower(A) = a
```

### 코드 확인

- `sqrt(number)`: `number`의 제곱근 계산
- `tolower(letter)`: 대문자를 소문자로 변환
- `-lm`: Linux 환경에서 수학 라이브러리 링크
- `%f`: 기본 소수점 이하 6자리 출력

## 4. 프로그램 인터페이스

### main 함수의 매개변수

```c
int main(int argc, char *argv[])
{
    // 프로그램 명령
}
```

**`argc`**: 프로그램 이름을 포함한 명령행 인자의 개수

**`argv`**: 각 명령행 인자를 문자열로 저장한 배열

### 인자 구조

다음 명령을 기준으로 한 인자 배치

```bash
./main a b c
```

| 값 | 내용 |
| --- | --- |
| `argc` | `4` |
| `argv[0]` | `"./main"` |
| `argv[1]` | `"a"` |
| `argv[2]` | `"b"` |
| `argv[3]` | `"c"` |
| `argv[argc]` | `NULL` |

### 명령행 인자 예제: `main.c`

```c
#include <stdio.h>

int main(int argc, char *argv[])
{
    // 전달받은 인자 개수 출력
    printf("argc -> %d\n", argc);

    // 프로그램 이름부터 마지막 인자까지 순서대로 출력
    for (int i = 0; i < argc; i++) {
        printf("argv[%d] -> %s\n", i, argv[i]);
    }

    return 0;
}
```

### 컴파일과 실행

```bash
gcc -o main main.c
./main string 10
```

### 실행 결과

```text
argc -> 3
argv[0] -> ./main
argv[1] -> string
argv[2] -> 10
```

### 코드 확인

- `argc` 값 `3`: 프로그램 이름, `string`, `10`
- `argv[0]`: 실행 파일의 이름 또는 경로
- `argv[1]` 이후: 사용자가 전달한 문자열 인자
- 숫자 `10`도 문자열 형태로 전달

## 5. 환경변수 처리

**환경변수(Environment Variable)**: 운영체제와 셸이 프로그램에 전달하는 `이름=값` 형식의 설정 정보

### main 함수의 확장형

```c
int main(int argc, char *argv[], char *envp[])
{
    // 프로그램 명령
}
```

**`envp`**: 환경변수 문자열을 가리키는 포인터 배열

> 세 번째 매개변수 `envp`는 POSIX 계열에서 널리 지원하는 확장 형식. ISO C의 표준 `main` 형식은 매개변수 0개 또는 2개

### 주요 환경변수

| 환경변수 | 내용 |
| --- | --- |
| `USER` | 로그인 사용자 이름 |
| `LOGNAME` | 현재 프로세스와 관련된 로그인 사용자 이름 |
| `HOME` | 사용자의 홈 디렉터리 |
| `LANG` | 다른 로케일 변수가 없을 때 적용할 기본 로케일 |
| `LC_ALL` | 모든 로케일 범주에 우선 적용할 값 |
| `PATH` | 실행 파일을 검색할 디렉터리 목록 |
| `PWD` | 현재 작업 디렉터리 |
| `SHELL` | 사용자의 로그인 셸 경로 |
| `TERM` | 출력 터미널 유형 |
| `TMPDIR` | 임시 파일을 저장할 디렉터리 경로 |
| `LD_LIBRARY_PATH` | 동적 라이브러리 검색 경로 |

### 환경변수 출력 예제: `envp.c`

```c
#include <stdio.h>

int main(int argc, char *argv[], char *envp[])
{
    // 이 예제에서 사용하지 않는 매개변수 표시
    (void)argc;
    (void)argv;

    // NULL 포인터가 나올 때까지 환경변수 출력
    for (int i = 0; envp[i] != NULL; i++) {
        printf("%s\n", envp[i]);
    }

    return 0;
}
```

### 컴파일과 실행

```bash
gcc -o envp envp.c
./envp
```

### 실행 결과 예

```text
USER=student
HOME=/home/student
LANG=ko_KR.UTF-8
PATH=/usr/local/bin:/usr/bin:/bin
PWD=/home/student/c-project
SHELL=/bin/bash
TERM=xterm-256color
...
_=./envp
```

> 환경변수의 종류와 값은 운영체제, 셸, 사용자 설정에 따라 차이

### 특정 환경변수 확인

셸에서 개별 값 확인

```bash
echo "$HOME"
echo "$PATH"
```

C 프로그램에서 `getenv()` 사용

```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    // HOME 환경변수 조회
    const char *home = getenv("HOME");

    if (home != NULL) {
        printf("HOME=%s\n", home);
    } else {
        printf("HOME 환경변수 없음\n");
    }

    return 0;
}
```

