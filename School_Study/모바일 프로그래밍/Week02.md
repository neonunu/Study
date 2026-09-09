# Kotlin

Kotlin은 **JetBrains가 만든 JVM 기반 프로그래밍 언어**이다.

주요 특징:

* Java와 높은 호환성
* 문법이 간결함
* `Null Safety` 지원
* Android 개발에서 주로 사용됨
* Coroutine으로 비동기 처리에 강함

### Null Safety

Java는 `null` 객체를 잘못 사용하면 `NullPointerException`이 발생할 수 있다.

```java
String name = null;
name.length(); // NullPointerException
```

Kotlin은 null 가능성을 타입으로 구분한다.

```kotlin
var name: String? = null
println(name?.length)
```

즉, **Java의 불편한 점을 개선하면서 Java 생태계를 그대로 활용할 수 있는 언어**라고 볼 수 있다.

git-scm.com

## `git branch -M main`

현재 브랜치의 이름을 `main`으로 변경하는 명령어이다.

```bash
git branch -M main
```

### 의미

* `git branch` : 브랜치 관련 명령어
* `-M` : 브랜치 이름을 강제로 변경
* `main` : 변경할 브랜치 이름

예를 들어 현재 브랜치가 `master`라면:

```text
master → main
```

```text
git init          = Git 저장소 생성
git branch -M main = 기본 브랜치 이름을 main으로 변경
```

`main`은 현재 GitHub에서 기본 브랜치 이름으로 많이 사용된다.

## `git add`

변경된 파일을 **커밋할 준비 상태(Staging Area)**에 올리는 명령어이다.

```bash
git add 파일명
```

예:

```bash
git add Main.java
```

현재 폴더의 변경사항을 전부 추가하려면:

```bash
git add .
```

### `.`과 `..`

```text
.  = 현재 디렉터리
.. = 상위 디렉터리
```

따라서:

```bash
git add .
```

은 **현재 폴더와 하위 폴더의 변경사항을 추가**한다는 뜻이다.

---

## `git commit`

Staging Area에 올라간 변경사항을 하나의 버전으로 저장한다.

```bash
git commit -m "git basics"
```

* `commit` : 변경사항 저장
* `-m` : 커밋 메시지 작성
* `"git basics"` : 커밋 내용 설명

흐름:

```text
파일 수정
   ↓
git add .
   ↓
git commit -m "git basics"
   ↓
하나의 버전으로 저장
```

---

## Git 사용자 정보 설정

Git에서 커밋한 사람이 누구인지 설정한다.

### 이메일

```bash
git config --global user.email "abc@example.com"
```

### 이름

```bash
git config --global user.name "Hong Gil Dong"
```

여기서 이름은 **GitHub 아이디가 아니라 커밋에 표시할 이름**이다.

본명, 영어 이름, 닉네임 등을 사용할 수 있다.

예:

```bash
git config --global user.name "Seonghyeok"
```

`--global`은 이 컴퓨터의 모든 Git 프로젝트에 같은 설정을 적용한다는 뜻이다.

> 참고: `--glibal`이 아니라 `--global`이 올바른 명령어이다.

# Git 기본 명령어

## 저장소 시작

```bash
git init
```

현재 폴더를 Git 저장소로 만든다.

```bash
git status
```

현재 변경사항을 확인한다.

---

## 사용자 설정

```bash
git config --global user.name "이름"
git config --global user.email "abc@example.com"
```

설정 확인:

```bash
git config --list
```

---

## 파일 저장

```bash
git add .
```

현재 폴더의 변경사항을 Staging Area에 올린다.

```bash
git commit -m "git basics"
```

변경사항을 하나의 커밋으로 저장한다.

* `-m` : 커밋 메시지 작성

---

## 브랜치

```bash
git branch
```

브랜치 목록 확인.

```bash
git branch -M main
```

현재 브랜치 이름을 `main`으로 강제 변경한다.

* `-m` : 브랜치 이름 변경
* `-M` : 브랜치 이름 강제 변경

---

## GitHub 연결

```bash
git remote add origin https://github.com/neonunu/dm.git
```

로컬 저장소와 GitHub 저장소를 연결한다.

```bash
git remote -v
```

연결된 원격 저장소를 확인한다.

---

## GitHub 업로드

처음 업로드:

```bash
git push -u origin main
```

* `-u` : 현재 브랜치와 원격 브랜치를 연결
* `origin` : 원격 저장소 이름
* `main` : 업로드할 브랜치

이후에는:

```bash
git push
```

만 사용하면 된다.

---

## GitHub에서 가져오기

```bash
git pull
```

원격 저장소의 변경사항을 가져와 현재 브랜치에 합친다.

```bash
git fetch
```

변경사항을 가져오기만 하고 자동으로 합치지는 않는다.

```text
fetch = 가져오기
pull  = 가져오기 + merge
```

---

## 기록 확인

```bash
git log
```

커밋 기록을 확인한다.

```bash
git log --oneline
```

커밋 기록을 한 줄씩 간단하게 확인한다.

---

## 변경사항 확인

```bash
git diff
```

수정된 코드의 차이를 확인한다.

---

## Patch

`git patch`라는 기본 명령어는 없다.

Patch 파일 생성:

```bash
git diff > change.patch
```

Patch 적용:

```bash
git apply change.patch
```

---

## 자주 사용하는 흐름

```bash
git status
git add .
git commit -m "수정 내용"
git push
```

처음 GitHub에 올릴 때:

```bash
git init
git branch -M main
git remote add origin https://github.com/neonunu/dm.git
git add .
git commit -m "first commit"
git push -u origin main
```
