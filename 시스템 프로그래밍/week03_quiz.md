# Shell Script 실습 문제와 답안

Linux Shell과 Bash Shell Script의 기초 문법을 연습하기 위한 문제와 답안이다.

## 실행 방법

스크립트 파일의 첫 줄에는 다음 내용을 작성한다.

```bash
#!/bin/bash
```

작성한 스크립트에 실행 권한을 추가한 후 실행한다.

```bash
chmod +x 파일이름.sh
./파일이름.sh
```

---

## 1. 현재 사용 중인 Shell 확인

**문제:** 현재 사용 중인 Shell을 확인하는 명령어를 작성하시오.

**답:**

```bash
echo "$SHELL"
```

현재 실행 중인 Shell 프로세스는 다음 명령으로 확인할 수 있다.

```bash
ps -p $$ -o comm=
```

## 2. 설치된 Shell 목록 확인

**문제:** 시스템에 설치된 Shell의 목록을 확인하시오.

**답:**

```bash
cat /etc/shells
```

## 3. Hello Linux 출력

**문제:** `hello.sh` 파일을 만들고 `Hello Linux`를 출력하는 Shell Script를 작성하시오.

**답:**

```bash
#!/bin/bash

echo "Hello Linux"
```

## 4. 실행 권한 추가

**문제:** `hello.sh` 파일에 실행 권한을 추가하시오.

**답:**

```bash
chmod +x hello.sh
```

## 5. 스크립트 실행

**문제:** `hello.sh`를 `./hello.sh` 방식으로 실행하시오.

**답:**

```bash
./hello.sh
```

## 6. Shebang의 역할

**문제:** Shell Script의 첫 번째 줄에 사용하는 `#!/bin/bash`의 역할을 설명하시오.

**답:** `#!`는 Shebang이라고 한다. 운영체제에 해당 스크립트를 `/bin/bash` 인터프리터로 실행하도록 알려준다.

## 7. 변수 저장 및 출력

**문제:** `name` 변수에 `Ubuntu`를 저장하고 출력하시오.

**답:**

```bash
name="Ubuntu"
echo "$name"
```

## 8. 나이 출력

**문제:** `age` 변수에 `20`을 저장한 후 `나이는 20세입니다.` 형식으로 출력하시오.

**답:**

```bash
age=20
echo "나이는 ${age}세입니다."
```

## 9. 이름 입력받기

**문제:** 사용자에게 이름을 입력받아 `안녕하세요. ○○님`이라고 출력하는 프로그램을 작성하시오.

**답:**

```bash
#!/bin/bash

read -p "이름을 입력하세요: " name
echo "안녕하세요. ${name}님"
```

## 10. 숫자 두 개 입력받기

**문제:** 사용자에게 숫자 두 개를 입력받으시오.

**답:**

```bash
read -p "숫자 두 개를 입력하세요: " num1 num2
```

## 11. 두 숫자의 합

**문제:** 입력받은 두 숫자의 합을 출력하시오.

**답:**

```bash
#!/bin/bash

read -p "숫자 두 개를 입력하세요: " num1 num2
sum=$((num1 + num2))
echo "합: $sum"
```

## 12. 명령어 실행 결과 저장

**문제:** `date` 명령어의 실행 결과를 `today` 변수에 저장한 후 출력하시오.

**답:**

```bash
today=$(date)
echo "$today"
```

## 13. 명령줄 인수 확인

**문제:** 다음 명령을 실행했을 때 `$1`과 `$2`에 저장되는 값을 쓰시오.

```bash
./test.sh apple banana
```

**답:**

- `$1`: `apple`
- `$2`: `banana`

## 14. 스크립트 파일 이름

**문제:** 스크립트 파일 이름을 나타내는 특별 변수를 쓰시오.

**답:** `$0`

```bash
echo "스크립트 이름: $0"
```

## 15. 명령줄 인수 개수

**문제:** 명령행에서 전달받은 인수의 개수를 출력하는 스크립트를 작성하시오.

**답:**

```bash
#!/bin/bash

echo "인수 개수: $#"
```

## 16. 명령줄 인수 두 개 더하기

**문제:** 첫 번째 인수와 두 번째 인수를 더하여 결과를 출력하는 `add.sh`를 작성하시오.

**답:**

```bash
#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "사용법: $0 숫자1 숫자2"
    exit 1
fi

echo $(($1 + $2))
```

실행 예시:

```bash
chmod +x add.sh
./add.sh 10 20
```

출력:

```text
30
```

## 17. 숫자 크기 비교

**문제:** 변수 `num=10`일 때 `num`이 5보다 크면 `5보다 큽니다.`를 출력하시오.

**답:**

```bash
#!/bin/bash

num=10

if [ "$num" -gt 5 ]; then
    echo "5보다 큽니다."
fi
```

## 18. 양수 판단

**문제:** 사용자에게 숫자를 입력받아 양수인지 아닌지 판단하시오.

**답:**

```bash
#!/bin/bash

read -p "숫자를 입력하세요: " num

if [ "$num" -gt 0 ]; then
    echo "양수입니다."
else
    echo "양수가 아닙니다."
fi
```

## 19. 성인 여부 판단

**문제:** 사용자에게 나이를 입력받아 20세 이상이면 `성인`, 그렇지 않으면 `20세 미만`을 출력하시오.

**답:**

```bash
#!/bin/bash

read -p "나이를 입력하세요: " age

if [ "$age" -ge 20 ]; then
    echo "성인"
else
    echo "20세 미만"
fi
```

## 20. 점수에 따른 학점 출력

**문제:** 점수를 입력받아 다음 기준에 따라 학점을 출력하시오.

- 90점 이상: A
- 80점 이상: B
- 70점 이상: C
- 그 외: D

**답:**

```bash
#!/bin/bash

read -p "점수를 입력하세요: " score

if [ "$score" -ge 90 ]; then
    echo "A"
elif [ "$score" -ge 80 ]; then
    echo "B"
elif [ "$score" -ge 70 ]; then
    echo "C"
else
    echo "D"
fi
```

## 21. 두 숫자 비교

**문제:** 사용자에게 두 숫자를 입력받아 두 숫자가 같은지 판단하시오.

**답:**

```bash
#!/bin/bash

read -p "숫자 두 개를 입력하세요: " num1 num2

if [ "$num1" -eq "$num2" ]; then
    echo "두 숫자가 같습니다."
else
    echo "두 숫자가 다릅니다."
fi
```

## 22. 짝수와 홀수 판단

**문제:** 입력받은 숫자가 짝수인지 홀수인지 판단하는 스크립트를 작성하시오.

**답:**

```bash
#!/bin/bash

read -p "숫자를 입력하세요: " num

if (( num % 2 == 0 )); then
    echo "짝수입니다."
else
    echo "홀수입니다."
fi
```

## 23. 파일 존재 여부 확인

**문제:** 현재 디렉터리에 `test.txt`가 존재하는지 검사하시오.

**답:**

```bash
#!/bin/bash

if [ -e "test.txt" ]; then
    echo "test.txt가 존재합니다."
else
    echo "test.txt가 존재하지 않습니다."
fi
```

## 24. 일반 파일 확인

**문제:** `test.txt`가 일반 파일이면 `일반 파일입니다.`를 출력하시오.

**답:**

```bash
#!/bin/bash

if [ -f "test.txt" ]; then
    echo "일반 파일입니다."
else
    echo "일반 파일이 아닙니다."
fi
```

## 25. 디렉터리 생성

**문제:** `backup` 디렉터리가 존재하는지 확인하고, 없으면 생성하시오.

**답:**

```bash
#!/bin/bash

if [ ! -d "backup" ]; then
    mkdir "backup"
    echo "backup 디렉터리를 생성했습니다."
else
    echo "backup 디렉터리가 이미 존재합니다."
fi
```

## 26. `for`문으로 1부터 5까지 출력

**문제:** `for`문을 이용하여 숫자 1부터 5까지 출력하시오.

**답:**

```bash
#!/bin/bash

for num in {1..5}; do
    echo "$num"
done
```

## 27. 1부터 10까지의 합

**문제:** `for`문을 이용하여 1부터 10까지 숫자의 합을 구하시오.

**답:**

```bash
#!/bin/bash

sum=0

for num in {1..10}; do
    sum=$((sum + num))
done

echo "합: $sum"
```

출력:

```text
합: 55
```

## 28. `while`문으로 1부터 5까지 출력

**문제:** `while`문을 이용하여 숫자 1부터 5까지 출력하시오.

**답:**

```bash
#!/bin/bash

num=1

while [ "$num" -le 5 ]; do
    echo "$num"
    num=$((num + 1))
done
```

## 29. 메뉴 선택 프로그램

**문제:** 다음 기능을 제공하는 Linux 관리 메뉴를 `case`문으로 작성하시오.

1. 현재 날짜: `date`
2. 현재 사용자: `whoami`
3. 현재 디렉터리: `pwd`
4. 파일 목록: `ls`

**답:**

```bash
#!/bin/bash

echo "==================="
echo "Linux 관리 메뉴"
echo "==================="
echo "1. 현재 날짜"
echo "2. 현재 사용자"
echo "3. 현재 디렉터리"
echo "4. 파일 목록"
echo "==================="
read -p "번호 선택: " choice

case "$choice" in
    1)
        date
        ;;
    2)
        whoami
        ;;
    3)
        pwd
        ;;
    4)
        ls
        ;;
    *)
        echo "잘못된 번호입니다."
        ;;
esac
```

## 30. 디렉터리 백업 프로그램

**문제:** 사용자에게 백업할 디렉터리를 입력받는다. 디렉터리가 존재하면 현재 날짜가 포함된 `backup_YYYYMMDD.tar.gz` 파일을 생성하고, 존재하지 않으면 오류 메시지를 출력하시오.

**답:**

```bash
#!/bin/bash

read -p "백업할 디렉터리: " directory

if [ -d "$directory" ]; then
    today=$(date +%Y%m%d)
    backup_file="backup_${today}.tar.gz"

    tar -czf "$backup_file" "$directory"
    echo "$backup_file 파일을 생성했습니다."
else
    echo "디렉터리가 존재하지 않습니다."
fi
```

실행 방법:

```bash
chmod +x backup.sh
./backup.sh
```

---

## 주요 문법 요약

| 문법 | 의미 |
|---|---|
| `$0` | 스크립트 이름 |
| `$1`, `$2` | 첫 번째, 두 번째 명령줄 인수 |
| `$#` | 명령줄 인수 개수 |
| `$(명령어)` | 명령어 실행 결과 저장 |
| `$((수식))` | 산술 연산 |
| `-gt` | 크다 |
| `-ge` | 크거나 같다 |
| `-eq` | 같다 |
| `-e` | 파일 또는 디렉터리가 존재한다 |
| `-f` | 일반 파일이다 |
| `-d` | 디렉터리이다 |
| `chmod +x` | 실행 권한을 추가한다 |

