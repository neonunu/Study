# GDB 디버깅 실습

C 프로그램의 실행 흐름과 변수 값을 추적하는 GDB 입문 자료

## 학습 목표

- 디버깅 정보가 포함된 실행 파일 생성
- 중단점 설정과 한 줄 단위 실행
- 변수, 함수 인자, 호출 스택 확인
- 논리 오류와 실행 중 오류의 원인 추적

## 1. 디버깅과 GDB

**디버깅(Debugging)**: 프로그램 오류의 원인을 찾고 수정하는 과정

| 오류 유형 | 주요 증상 | 대표 사례 |
| --- | --- | --- |
| 문법 오류 | 컴파일 실패 | 세미콜론 누락, 잘못된 변수명 |
| 논리 오류 | 실행 가능, 잘못된 결과 | 반복 범위 오류, 잘못된 계산식 |
| 실행 중 오류 | 실행 도중 비정상 종료 | NULL 포인터 역참조, 잘못된 메모리 접근 |

**GDB(GNU Debugger)**: 프로그램의 실행을 멈추고 내부 상태를 확인하는 GNU 디버거

- 특정 함수 또는 소스 코드 줄에 중단점 설정
- 한 줄씩 실행하며 흐름 추적
- 변수, 함수 인자, 지역 변수 확인
- 충돌 지점과 함수 호출 순서 확인

> `-g` 옵션의 역할은 디버깅 정보 삽입. 오류 자동 수정 기능과는 무관

## 2. 실습 준비

### Ubuntu 또는 Debian 계열

```bash
sudo apt update
sudo apt install gcc gdb
```

### 기본 컴파일 형식

```bash
gcc -g -o program source.c
gdb ./program
```

**`-g`**: 소스 코드의 함수명, 변수명, 줄 번호 등 디버깅 정보 포함

## 3. GDB 핵심 명령

| 명령 | 축약형 | 용도 |
| --- | --- | --- |
| `break main` | `b main` | `main` 함수 시작에 중단점 설정 |
| `break 함수명` | `b 함수명` | 지정 함수 시작에 중단점 설정 |
| `run` | `r` | 프로그램 실행 또는 처음부터 재실행 |
| `next` | `n` | 함수 내부로 들어가지 않고 다음 소스 줄로 이동 |
| `step` | `s` | 호출 함수 내부로 들어가며 다음 소스 줄로 이동 |
| `continue` | `c` | 다음 중단점까지 실행 계속 |
| `print 변수` | `p 변수` | 변수 또는 식의 현재 값 1회 출력 |
| `display 변수` | - | 프로그램 정지 때마다 값 자동 출력 |
| `info args` | - | 현재 함수의 인자 확인 |
| `info locals` | - | 현재 함수의 지역 변수 확인 |
| `list` | `l` | 현재 위치 주변의 소스 코드 확인 |
| `backtrace` | `bt` | 함수 호출 스택 확인 |
| `frame 번호` | `f 번호` | 지정 스택 프레임으로 이동 |
| `finish` | - | 현재 함수를 끝까지 실행한 뒤 호출 위치로 복귀 |
| `quit` | `q` | GDB 종료 |

## 4. 공통 디버깅 순서

1. `-g` 옵션으로 컴파일
2. `gdb ./실행파일` 형식으로 GDB 시작
3. `break` 명령으로 조사 위치 지정
4. `run` 명령으로 프로그램 실행
5. `next` 또는 `step` 명령으로 실행 흐름 추적
6. `print`, `display`, `info` 명령으로 데이터 확인
7. 충돌 발생 시 `backtrace` 명령으로 호출 경로 확인
8. 코드 수정 후 재컴파일과 재실행

> 실제 줄 번호는 코드 수정에 따라 변경 가능. `list` 명령으로 현재 위치를 먼저 확인

## 5. 예제 1 - BMI 계산 과정 추적

### 확인 목표

- 함수 중단점 사용
- 함수 인자와 계산 결과 확인
- 정상 프로그램의 실행 흐름 추적

### 소스 코드: `bmi_cal.c`

```c
#include <stdio.h>

double bmi_calculate(double height, double weight);

int main(void)
{
    double height;
    double weight;
    double bmi;

    printf("키(m)와 몸무게(kg) 입력: ");

    // 숫자 2개 입력 여부 확인
    if (scanf("%lf %lf", &height, &weight) != 2) {
        fprintf(stderr, "입력 오류\n");
        return 1;
    }

    // 별도 함수에서 BMI 계산
    bmi = bmi_calculate(height, weight);
    printf("BMI: %.2f\n", bmi);

    return 0;
}

double bmi_calculate(double height, double weight)
{
    // BMI 공식: 몸무게(kg) / 키(m)의 제곱
    double bmi = weight / (height * height);
    return bmi;
}
```

### GDB 디버깅 순서

```bash
# 1. 디버깅 정보 포함 컴파일
gcc -g -o bmi bmi_cal.c

# 2. GDB 실행
gdb ./bmi
```

```gdb
# 3. BMI 계산 함수에 중단점 설정
(gdb) break bmi_calculate
Breakpoint 1 at 0x00000000004011f0: file bmi_cal.c, line 29.

# 4. 프로그램 실행 후 예시 값 입력: 1.75 70
(gdb) run
Starting program: /실습경로/bmi
키(m)와 몸무게(kg) 입력: 1.75 70

Breakpoint 1, bmi_calculate (height=1.75, weight=70)
    at bmi_cal.c:29
29        double bmi = weight / (height * height);

# 5. 함수에 전달된 인자 확인
(gdb) info args
height = 1.75
weight = 70

(gdb) print height
$1 = 1.75

(gdb) print weight
$2 = 70

# 6. 계산 줄 실행 후 지역 변수 확인
(gdb) next
30        return bmi;

(gdb) print bmi
$3 = 22.857142857142858

# 7. 함수 종료 후 반환값 확인
(gdb) finish
Run till exit from #0  bmi_calculate (height=1.75, weight=70)
Value returned is $4 = 22.857142857142858

# 8. 프로그램 종료까지 실행
(gdb) continue
Continuing.
BMI: 22.86
[Inferior 1 exited normally]

(gdb) quit
# 종료된 프로그램이므로 추가 출력 없음
```

> 메모리 주소, 실행 경로, 프로세스 번호는 환경에 따라 차이. 변수 값과 실행 흐름 중심으로 확인

### 관찰 포인트

- 입력값 `1.75`, `70`의 함수 전달 여부
- 계산 결과 약 `22.8571`
- 출력 형식 `%.2f` 적용 결과 `22.86`

## 6. 예제 2 - 반복문의 범위 오류

### 문제 현상

1부터 5까지의 합으로 `15` 예상, 실제 결과는 `10`

### 오류 코드: `sum_bug.c`

```c
#include <stdio.h>

int main(void)
{
    int n = 5;
    int sum = 0;
    int i;

    // 오류 지점: i가 n과 같아지는 경우 제외
    for (i = 1; i < n; i++) {
        sum += i;
    }

    printf("1부터 %d까지의 합: %d\n", n, sum);
    return 0;
}
```

### GDB 디버깅 순서

```bash
# 1. 컴파일
gcc -g -o sum_bug sum_bug.c

# 2. GDB 실행
gdb ./sum_bug
```

```gdb
# 3. 누적 줄과 출력 줄에 중단점 설정
(gdb) break sum_bug.c:11
Breakpoint 1 at 0x0000000000401144: file sum_bug.c, line 11.

(gdb) break sum_bug.c:14
Breakpoint 2 at 0x0000000000401159: file sum_bug.c, line 14.

# 4. 첫 번째 반복까지 실행
(gdb) run
Starting program: /실습경로/sum_bug

Breakpoint 1, main () at sum_bug.c:11
11            sum += i;

# 5. 현재 코드와 변수 값 확인
(gdb) list
6       int sum = 0;
7       int i;
8
9       // 오류 지점: i가 n과 같아지는 경우 제외
10      for (i = 1; i < n; i++) {
11          sum += i;
12      }
13
14      printf("1부터 %d까지의 합: %d\n", n, sum);
15      return 0;

(gdb) display i
1: i = 1

(gdb) display sum
2: sum = 0

# 6. 다음 반복의 누적 줄까지 계속 실행
(gdb) continue
Continuing.
Breakpoint 1, main () at sum_bug.c:11
11            sum += i;
1: i = 2
2: sum = 1

(gdb) continue
Continuing.
Breakpoint 1, main () at sum_bug.c:11
11            sum += i;
1: i = 3
2: sum = 3

(gdb) continue
Continuing.
Breakpoint 1, main () at sum_bug.c:11
11            sum += i;
1: i = 4
2: sum = 6

# 7. 반복 종료 후 printf 줄까지 실행
(gdb) continue
Continuing.
Breakpoint 2, main () at sum_bug.c:14
14      printf("1부터 %d까지의 합: %d\n", n, sum);
1: i = 5
2: sum = 10

# 8. 마지막 i와 sum 확인
(gdb) print i
$1 = 5

(gdb) print sum
$2 = 10

(gdb) quit
A debugging session is active.
Quit anyway? (y or n) y
```

> 중단점 주소와 실행 경로는 환경에 따라 차이. `i`와 `sum`의 변화 순서 중심으로 확인

### 관찰 포인트

| 시점 | `i` | `sum` |
| --- | ---: | ---: |
| 첫 반복 전 | 1 | 0 |
| `1` 누적 후 | 2 | 1 |
| `2` 누적 후 | 3 | 3 |
| `3` 누적 후 | 4 | 6 |
| `4` 누적 후 | 5 | 10 |
| 반복 종료 | 5 | 10 |

**원인**: `i < n` 조건으로 마지막 값 `5` 제외

### 수정 코드

```c
// n까지 포함하는 반복 조건
for (i = 1; i <= n; i++) {
    sum += i;
}
```

### 수정 확인

```bash
gcc -g -o sum_bug sum_bug.c
./sum_bug
# 예상 출력: 1부터 5까지의 합: 15
```

## 7. 예제 3 - 정수 나눗셈 오류

### 문제 현상

`5`와 `2`의 평균으로 `3.5` 예상, 실제 결과는 `3.0`

### 오류 코드: `average_bug.c`

```c
#include <stdio.h>

double average(int a, int b)
{
    // 오류 지점: 정수끼리 먼저 나눗셈 수행
    double result = (a + b) / 2;
    return result;
}

int main(void)
{
    int x = 5;
    int y = 2;
    double answer;

    answer = average(x, y);
    printf("평균: %.1f\n", answer);

    return 0;
}
```

### GDB 디버깅 순서

```bash
# 1. 컴파일
gcc -g -o average_bug average_bug.c

# 2. GDB 실행
gdb ./average_bug
```

```gdb
# 3. average 함수에 중단점 설정
(gdb) break average
Breakpoint 1 at 0x000000000040112d: file average_bug.c, line 6.

(gdb) run
Starting program: /실습경로/average_bug

Breakpoint 1, average (a=5, b=2) at average_bug.c:6
6         double result = (a + b) / 2;

# 4. 함수 인자 확인
(gdb) info args
a = 5
b = 2

(gdb) print a
$1 = 5

(gdb) print b
$2 = 2

# 5. 부분 계산 결과 비교
(gdb) print a + b
$3 = 7

(gdb) print (a + b) / 2
$4 = 3

(gdb) print (double)(a + b) / 2.0
$5 = 3.5

# 6. 계산 줄 실행 후 result 확인
(gdb) next
7         return result;

(gdb) print result
$6 = 3

# 7. 함수 반환값과 최종 출력 확인
(gdb) finish
Run till exit from #0  average (a=5, b=2)
Value returned is $7 = 3

(gdb) continue
Continuing.
평균: 3.0
[Inferior 1 exited normally]

(gdb) quit
# 종료된 프로그램이므로 추가 출력 없음
```

> 중단점 주소와 실행 경로는 환경에 따라 차이. 정수 계산 결과 `3`과 실수 계산 결과 `3.5`를 비교

### 관찰 포인트

- `(a + b) / 2`의 결과 `3`
- 정수 나눗셈 이후 `double` 변수에 저장된 값 `3.0`
- 실수 연산을 먼저 적용한 결과 `3.5`

**원인**: 나눗셈 피연산자가 모두 `int` 형식이므로 소수 부분 제거

### 수정 코드

```c
// 2.0을 사용해 실수 나눗셈 적용
double result = (a + b) / 2.0;
```

### 수정 확인

```bash
gcc -g -o average_bug average_bug.c
./average_bug
# 예상 출력: 평균: 3.5
```

## 8. 예제 4 - NULL 포인터 접근 오류

### 문제 현상

프로그램 실행 중 `SIGSEGV` 발생 가능

### 오류 코드: `pointer_bug.c`

```c
#include <stdio.h>

void change_score(int *score_ptr)
{
    // NULL 주소 역참조 시 비정상 종료
    *score_ptr = 100;
}

void process_score(int *score_ptr)
{
    change_score(score_ptr);
}

int main(void)
{
    int score = 70;
    int *ptr = NULL;

    // 오류 지점: 유효한 주소가 아닌 NULL 전달
    process_score(ptr);
    printf("점수: %d\n", score);

    return 0;
}
```

### GDB 디버깅 순서

```bash
# 1. 컴파일
gcc -g -o pointer_bug pointer_bug.c

# 2. GDB 실행
gdb ./pointer_bug
```

```gdb
# 3. 프로그램 실행 후 충돌 지점까지 진행
(gdb) run
Starting program: /실습경로/pointer_bug

Program received signal SIGSEGV, Segmentation fault.
change_score (score_ptr=0x0) at pointer_bug.c:6
6         *score_ptr = 100;

# 4. 함수 호출 경로 확인
(gdb) backtrace
#0  change_score (score_ptr=0x0) at pointer_bug.c:6
#1  process_score (score_ptr=0x0) at pointer_bug.c:11
#2  main () at pointer_bug.c:20

# 5. 충돌이 발생한 프레임 선택
(gdb) frame 0
#0  change_score (score_ptr=0x0) at pointer_bug.c:6
6         *score_ptr = 100;

(gdb) list
1   #include <stdio.h>
2
3   void change_score(int *score_ptr)
4   {
5       // NULL 주소 역참조 시 비정상 종료
6       *score_ptr = 100;
7   }
8
9   void process_score(int *score_ptr)
10  {

# 6. 포인터 값 확인
(gdb) info args
score_ptr = 0x0

(gdb) print score_ptr
$1 = (int *) 0x0

# 7. 호출 함수와 main 프레임으로 이동
(gdb) up
#1  process_score (score_ptr=0x0) at pointer_bug.c:11
11      change_score(score_ptr);

(gdb) info args
score_ptr = 0x0

(gdb) up
#2  main () at pointer_bug.c:20
20      process_score(ptr);

(gdb) info locals
score = 70
ptr = 0x0

(gdb) print ptr
$2 = (int *) 0x0

(gdb) print &score
$3 = (int *) 0x7fffffffe2ac

# 8. GDB 종료
(gdb) quit
A debugging session is active.
Quit anyway? (y or n) y
```

> `&score`의 실제 주소와 중단점 주소는 환경에 따라 차이. `0x0`과 유효한 주소의 차이 중심으로 확인

### 예상 호출 스택

```text
#0  change_score (...)
#1  process_score (...)
#2  main ()
```

### 관찰 포인트

- 충돌 위치 `*score_ptr = 100`
- `score_ptr`과 `ptr`의 값 `0x0`
- 실제 변수 `score`의 주소와 NULL 포인터 값의 차이

**원인**: 저장 공간을 가리키지 않는 NULL 포인터 역참조

### 수정 코드

```c
int main(void)
{
    int score = 70;

    // score의 실제 주소 전달
    process_score(&score);
    printf("점수: %d\n", score);

    return 0;
}
```

### 수정 확인

```bash
gcc -g -o pointer_bug pointer_bug.c
./pointer_bug
# 예상 출력: 점수: 100
```
