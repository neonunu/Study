## 1. 파일 생성 및 내용 확인

### `touch` — 빈 파일 생성

```bash
touch student.txt           # 빈 student.txt 파일 생성
```

- 파일이 없으면 새 파일을 만든다.
- 파일이 이미 있으면 내용은 유지되고 수정 시간만 갱신된다.

### `cat` — 파일 내용 출력

```bash
cat student.txt             # student.txt 내용 출력
```

여러 파일을 이어서 출력할 수도 있다.

```bash
cat file1.txt file2.txt     # 두 파일 내용을 순서대로 출력
```

### `cat >` — 파일 생성 또는 덮어쓰기

```bash
cat > student.txt           # 내용을 입력해 파일 생성
```

내용을 입력한 후 새로운 빈 줄에서 `Ctrl + D`를 누르면 저장하고 종료한다.

```text
김지훈
이유진
박동현
Ctrl + D
```

기존 파일에 `>`를 사용하면 원래 내용은 삭제되고 새로운 내용으로 덮어쓴다.

### `cat >>` — 기존 파일에 내용 추가

```bash
cat >> student.txt          # 기존 파일 끝에 내용 추가
```

내용을 입력한 후 `Ctrl + D`를 누른다. 기존 내용은 유지된다.

### `>`와 `>>` 차이

| 기호 | 의미 | 기존 내용 |
|---|---|---|
| `>` | 출력을 파일에 저장 | 기존 내용을 덮어씀 |
| `>>` | 출력을 파일 끝에 추가 | 기존 내용을 유지함 |

```bash
echo "김지훈" > student.txt    # 새로 저장
echo "이유진" >> student.txt   # 기존 내용 뒤에 추가
```

---

## 2. 문자열 출력과 파일 편집

### `echo` — 문자열 또는 변수 출력

```bash
echo "Hello Linux"          # 문자열 출력
echo $HOME                  # HOME 환경 변수 출력
echo "박동현" >> student.txt # 문자열을 파일 끝에 추가
```

### `gedit` — GUI 텍스트 편집기

```bash
gedit student.txt           # 그래픽 편집기로 파일 열기
```

터미널도 계속 사용하려면 `&`를 붙인다.

```bash
gedit student.txt &         # 백그라운드에서 편집기 실행
```

Ubuntu 환경에 따라 `gedit`이 설치되어 있지 않을 수 있다.

---

## 3. 파일 복사·이동·이름 변경

### `cp` — 파일 복사

기본 문법:

```bash
cp 대상파일 만들파일
```

예시:

```bash
cp student.txt backup.txt   # student.txt를 backup.txt로 복사
```

디렉터리를 복사할 때는 `-r`을 사용한다.

```bash
cp -r data data_backup      # data 디렉터리 전체 복사
```

### `mv` — 파일 이동 또는 이름 변경

파일 이름 변경:

```bash
mv old.txt new.txt          # old.txt를 new.txt로 이름 변경
```

파일 이동:

```bash
mv student.txt documents/   # student.txt를 documents 디렉터리로 이동
```

- 목적지가 파일명이면 이름이 변경된다.
- 목적지가 디렉터리면 파일이 이동된다.

---

## 4. inode

Linux 파일 시스템은 파일을 만들 때 파일 정보를 관리하는 `inode`를 생성한다.

inode에 저장되는 정보:

- 파일 종류
- 파일 크기
- 파일 소유자
- 파일 소유 그룹
- 파일 접근 권한
- 파일 접근·수정 시간
- 실제 데이터가 저장된 위치
- 하드 링크 개수

파일 이름은 inode에 직접 저장되지 않는다. 디렉터리가 파일 이름과 inode 번호를 연결한다.

inode 번호 확인:

```bash
ls -li                     # 파일들의 inode 번호 확인
```

예시:

```text
12345 -rw-r--r-- 2 user group 20 student.txt
```

맨 앞의 `12345`가 inode 번호이다.

---

## 5. 링크

### `ln` — 하드 링크 생성

```bash
ln student.txt student_hard.txt # 하드 링크 생성
```

하드 링크 특징:

- 원본과 같은 inode를 사용한다.
- 원본과 하드 링크는 같은 데이터를 가리킨다.
- 한쪽을 수정하면 다른 쪽에서도 변경된 내용이 보인다.
- 원본 파일 이름을 삭제해도 하드 링크가 남아 있으면 데이터는 유지된다.
- 일반적으로 디렉터리에는 생성할 수 없다.
- 다른 파일 시스템에는 만들 수 없다.

확인:

```bash
ls -li                     # inode 번호가 같은지 확인
```

### `ln -s` — 소프트 링크 생성

소프트 링크는 심볼릭 링크라고도 한다.

```bash
ln -s student.txt student_soft.txt # 소프트 링크 생성
```

소프트 링크 특징:

- 원본 파일의 경로를 저장한다.
- 원본과 inode 번호가 다르다.
- 디렉터리에도 만들 수 있다.
- 다른 파일 시스템의 파일도 연결할 수 있다.
- 원본이 삭제되거나 이동하면 링크가 깨질 수 있다.

### 하드 링크와 소프트 링크 비교

| 구분 | 하드 링크 | 소프트 링크 |
|---|---|---|
| 명령어 | `ln 원본 링크` | `ln -s 원본 링크` |
| inode | 원본과 같음 | 원본과 다름 |
| 원본 삭제 | 계속 사용 가능 | 링크가 깨질 수 있음 |
| 디렉터리 연결 | 일반적으로 불가능 | 가능 |
| 다른 파일 시스템 | 불가능 | 가능 |

---

## 6. 날짜와 시간

### `date` — 현재 날짜와 시간 출력

```bash
date                        # 현재 날짜와 시간 출력
```

출력 형식 지정:

```bash
date "+%Y-%m-%d"            # 연도-월-일
date "+%Y-%m-%d %H:%M:%S"   # 연도-월-일 시:분:초
```

주요 형식:

| 형식 | 의미 |
|---|---|
| `%Y` | 네 자리 연도 |
| `%m` | 월 |
| `%d` | 일 |
| `%H` | 시 |
| `%M` | 분 |
| `%S` | 초 |

---

## 7. 텍스트 계산과 정렬

### `wc` — 행·단어·문자 수 계산

```bash
wc student.txt             # 행, 단어, 바이트 수 출력
wc -l student.txt          # 행 수
wc -w student.txt          # 단어 수
wc -c student.txt          # 바이트 수
wc -m student.txt          # 문자 수
```

### `sort` — 내용 정렬

```bash
sort student.txt           # 오름차순 정렬
sort -r student.txt        # 내림차순 정렬
sort -n numbers.txt        # 숫자 크기 기준 정렬
sort -u student.txt        # 정렬하면서 중복 제거
```

`sort`는 결과만 출력하며 원본 파일은 변경하지 않는다.

정렬 결과를 파일로 저장:

```bash
sort student.txt > sorted.txt # 정렬 결과를 새 파일에 저장
```

---

## 8. 문자열과 파일 검색

### `grep` — 파일 내용에서 문자열 검색

```bash
grep "김민지" student.txt   # 김민지가 들어 있는 줄 검색
```

주요 옵션:

```bash
grep -n "김민지" student.txt # 줄 번호 함께 출력
grep -i "linux" note.txt     # 영어 대소문자 무시
grep -v "linux" note.txt     # linux가 없는 줄 출력
grep -r "linux" notes/       # 디렉터리 내부 재귀 검색
```

### `find` — 파일과 디렉터리 검색

```bash
find . -name "student.txt"  # 현재 위치부터 이름 검색
```

주요 옵션:

```bash
find . -iname "student.txt" # 대소문자 무시
find . -type f -name "*.txt" # txt 파일만 검색
find . -type d -name "data" # data 디렉터리 검색
```

- `.`: 현재 디렉터리
- `-type f`: 파일
- `-type d`: 디렉터리
- `-name`: 이름 검색
- `-iname`: 대소문자를 무시하고 이름 검색

---

## 9. 파이프

### `|` — 앞 명령의 출력을 뒤 명령에 전달

기본 구조:

```bash
명령어1 | 명령어2           # 명령어1 출력 → 명령어2 입력
```

예시:

```bash
cat student.txt | sort      # 파일 내용을 정렬
ps -ef | grep firefox       # Firefox 프로세스 검색
who | wc -l                 # 로그인한 사용자 수 계산
```

---

## 10. 프로세스 확인

### `ps` — 현재 프로세스 확인

```bash
ps                          # 현재 터미널 관련 프로세스 확인
```

### `ps -ef` — 전체 프로세스 확인

```bash
ps -ef                      # 시스템 전체 프로세스 상세 출력
```

특정 프로세스 검색:

```bash
ps -ef | grep firefox       # Firefox 관련 프로세스 검색
```

주요 항목:

| 항목 | 의미 |
|---|---|
| `UID` | 프로세스를 실행한 사용자 |
| `PID` | 프로세스 번호 |
| `PPID` | 부모 프로세스 번호 |
| `CMD` | 실행된 명령어 |

---

## 11. 사용자 정보 확인

### `whoami` — 현재 사용자 이름 확인

```bash
whoami                      # 현재 로그인한 사용자 이름 출력
```

### `who` — 로그인 사용자 확인

```bash
who                         # 현재 시스템에 로그인한 사용자 출력
```

### `id` — UID와 GID 확인

```bash
id                          # 현재 사용자 정보 확인
id hong                     # hong 사용자 정보 확인
```

주요 항목:

- `uid`: 사용자 번호
- `gid`: 기본 그룹 번호
- `groups`: 사용자가 속한 그룹 목록

### `groups` — 사용자가 속한 그룹 확인

```bash
groups                      # 현재 사용자가 속한 그룹 출력
groups hong                 # hong 사용자의 그룹 출력
```

---

## 12. 사용자 계정 관리

사용자 관리 명령은 일반적으로 관리자 권한이 필요하다.

### `adduser` — 사용자 생성

```bash
sudo adduser hong           # hong 사용자 생성
```

사용자 생성 과정에서 다음 정보를 설정한다.

- 홈 디렉터리
- 비밀번호
- 사용자 정보

### `passwd` — 비밀번호 변경

현재 사용자 비밀번호 변경:

```bash
passwd                      # 현재 사용자 비밀번호 변경
```

다른 사용자 비밀번호 변경:

```bash
sudo passwd hong            # hong 사용자 비밀번호 변경
```

### `deluser` — 사용자 삭제

```bash
sudo deluser hong           # 계정만 삭제
```

홈 디렉터리까지 삭제:

```bash
sudo deluser --remove-home hong # 계정과 홈 디렉터리 삭제
```

`--remove-home`은 사용자 파일까지 삭제하므로 주의해야 한다.

### `su` — 다른 사용자로 전환

```bash
su - hong                   # hong 사용자 환경으로 전환
```

원래 사용자로 돌아가기:

```bash
exit                        # 현재 사용자 세션 종료
```

### `sudo` — 관리자 권한으로 명령 실행

```bash
sudo 명령어                 # 명령 하나를 관리자 권한으로 실행
```

예시:

```bash
sudo apt update             # 관리자 권한으로 패키지 목록 갱신
sudo adduser hong           # 관리자 권한으로 사용자 생성
```

`sudo`는 시스템을 변경할 수 있으므로 명령을 확인한 후 실행한다.

---

## 13. 그룹 관리

### `groupadd` — 그룹 생성

```bash
sudo groupadd developers    # developers 그룹 생성
```

### `groupdel` — 그룹 삭제

```bash
sudo groupdel developers    # developers 그룹 삭제
```

### `usermod -aG` — 사용자를 그룹에 추가

```bash
sudo usermod -aG developers hong # hong을 developers 그룹에 추가
```

옵션 의미:

- `-G`: 보조 그룹 지정
- `-a`: 기존 그룹을 유지하면서 추가

`-a`를 빼고 `-G`만 사용하면 기존 보조 그룹에서 빠질 수 있으므로 주의한다.

그룹 추가 확인:

```bash
groups hong                 # hong의 소속 그룹 확인
```

그룹 변경은 로그아웃 후 다시 로그인해야 반영되는 경우가 있다.

---

## 14. 파일 권한

파일 권한 확인:

```bash
ls -l student.txt           # 권한, 소유자, 그룹 확인
```

권한 문자:

| 문자 | 의미 |
|---|---|
| `r` | 읽기 |
| `w` | 쓰기 |
| `x` | 실행 |

권한 숫자:

| 숫자 | 권한 |
|---:|---|
| `4` | 읽기 |
| `2` | 쓰기 |
| `1` | 실행 |

### `chmod` — 파일 권한 변경

```bash
chmod 644 student.txt       # 소유자 rw-, 그룹 r--, 기타 r--
chmod 755 script.sh         # 소유자 rwx, 그룹 r-x, 기타 r-x
```

문자 방식:

```bash
chmod u+x script.sh         # 소유자에게 실행 권한 추가
chmod g-w student.txt       # 그룹의 쓰기 권한 제거
chmod o-r student.txt       # 기타 사용자의 읽기 권한 제거
```

대상 문자:

- `u`: 소유자
- `g`: 그룹
- `o`: 기타 사용자
- `a`: 모든 사용자

`644`의 의미:

```text
6 = 4 + 2 = rw-  소유자
4 = 4     = r--  그룹
4 = 4     = r--  기타 사용자
```

---

## 15. 파일 소유자와 그룹

### `chown` — 파일 소유자 변경

```bash
sudo chown hong student.txt # 소유자를 hong으로 변경
```

소유자와 그룹을 함께 변경:

```bash
sudo chown hong:developers student.txt # 소유자와 그룹 변경
```

### `chgrp` — 파일 소유 그룹 변경

```bash
sudo chgrp developers student.txt # 소유 그룹 변경
```

확인:

```bash
ls -l student.txt           # 변경된 소유자와 그룹 확인
```

---

## 16. `/etc` 디렉터리

`/etc`는 Linux 시스템의 설정 파일이 저장되는 디렉터리이다.

```bash
ls /etc                     # /etc 내부 파일 확인
```

대표 파일:

| 경로 | 내용 |
|---|---|
| `/etc/passwd` | 사용자 계정 기본 정보 |
| `/etc/group` | 그룹 정보 |
| `/etc/hostname` | 컴퓨터 이름 |
| `/etc/hosts` | 호스트 이름과 IP 주소 연결 정보 |

예시:

```bash
cat /etc/passwd             # 사용자 계정 정보 출력
cat /etc/group              # 그룹 정보 출력
cat /etc/hostname           # 컴퓨터 이름 출력
```

`/etc` 파일을 잘못 수정하면 시스템에 문제가 생길 수 있으므로 주의한다.

---

## 17. 패키지 관리

### `apt` — Ubuntu 패키지 관리

패키지 목록 갱신:

```bash
sudo apt update             # 설치 가능한 패키지 목록 갱신
```

설치된 패키지 업데이트:

```bash
sudo apt upgrade            # 설치된 패키지 업데이트
```

패키지 설치:

```bash
sudo apt install tree       # tree 패키지 설치
```

패키지 제거:

```bash
sudo apt remove tree        # tree 패키지 제거
```

패키지 검색:

```bash
apt search tree             # tree 관련 패키지 검색
```

일반적으로 패키지 설치 전 `sudo apt update`를 실행한다.

### `snap` — Snap 패키지 관리

설치된 Snap 확인:

```bash
snap list                   # 설치된 Snap 패키지 출력
```

패키지 검색:

```bash
snap find code              # code 관련 Snap 검색
```

패키지 설치:

```bash
sudo snap install hello-world # hello-world 설치
```

패키지 제거:

```bash
sudo snap remove hello-world # hello-world 제거
```

패키지 업데이트:

```bash
sudo snap refresh           # Snap 패키지 업데이트
```

### `apt`와 `snap` 비교

| 구분 | `apt` | `snap` |
|---|---|---|
| 형식 | Debian 패키지 | Snap 패키지 |
| 의존성 | 시스템 라이브러리 공유 | 필요한 라이브러리를 함께 포함 가능 |
| 업데이트 | `apt upgrade`로 실행 | 자동 업데이트가 기본 |
| 특징 | Ubuntu의 전통적인 방식 | 격리와 배포 편의성 중심 |

---

## 18. 전체 명령어 요약

| 분야 | 명령어 | 기능 | 예시 |
|---|---|---|---|
| 파일 | `touch` | 빈 파일 생성 | `touch a.txt` |
| 파일 | `cat` | 내용 출력 | `cat a.txt` |
| 파일 | `cat >` | 생성·덮어쓰기 | `cat > a.txt` |
| 파일 | `cat >>` | 내용 추가 | `cat >> a.txt` |
| 출력 | `echo` | 문자열 출력 | `echo "hello"` |
| 편집 | `gedit` | GUI 편집 | `gedit a.txt` |
| 파일 | `cp` | 복사 | `cp a.txt b.txt` |
| 파일 | `mv` | 이동·이름 변경 | `mv a.txt b.txt` |
| 링크 | `ln` | 하드 링크 생성 | `ln a.txt hard.txt` |
| 링크 | `ln -s` | 소프트 링크 생성 | `ln -s a.txt soft.txt` |
| 날짜 | `date` | 날짜·시간 출력 | `date` |
| 계산 | `wc` | 행·단어·문자 수 | `wc -l a.txt` |
| 정렬 | `sort` | 행 정렬 | `sort a.txt` |
| 검색 | `grep` | 내용 검색 | `grep "kim" a.txt` |
| 검색 | `find` | 파일 검색 | `find . -name "a.txt"` |
| 프로세스 | `ps` | 현재 프로세스 확인 | `ps` |
| 프로세스 | `ps -ef` | 전체 프로세스 확인 | `ps -ef` |
| 연결 | `\|` | 명령 출력 연결 | `ps -ef \| grep ssh` |
| 사용자 | `whoami` | 현재 사용자 확인 | `whoami` |
| 사용자 | `who` | 로그인 사용자 확인 | `who` |
| 사용자 | `id` | UID·GID 확인 | `id hong` |
| 사용자 | `groups` | 소속 그룹 확인 | `groups hong` |
| 사용자 | `adduser` | 사용자 생성 | `sudo adduser hong` |
| 사용자 | `passwd` | 비밀번호 변경 | `sudo passwd hong` |
| 사용자 | `deluser` | 사용자 삭제 | `sudo deluser hong` |
| 사용자 | `su` | 사용자 전환 | `su - hong` |
| 권한 | `sudo` | 관리자 권한 실행 | `sudo apt update` |
| 그룹 | `groupadd` | 그룹 생성 | `sudo groupadd dev` |
| 그룹 | `groupdel` | 그룹 삭제 | `sudo groupdel dev` |
| 그룹 | `usermod -aG` | 사용자를 그룹에 추가 | `sudo usermod -aG dev hong` |
| 권한 | `chmod` | 접근 권한 변경 | `chmod 644 a.txt` |
| 소유권 | `chown` | 소유자 변경 | `sudo chown hong a.txt` |
| 소유권 | `chgrp` | 소유 그룹 변경 | `sudo chgrp dev a.txt` |
| 설정 | `/etc` | 시스템 설정 저장 | `ls /etc` |
| 패키지 | `apt` | APT 패키지 관리 | `sudo apt install tree` |
| 패키지 | `snap` | Snap 패키지 관리 | `snap list` |
