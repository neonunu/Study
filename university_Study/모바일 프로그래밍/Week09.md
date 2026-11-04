# Week 09 - 멀티 모드 앱 통합과 ListView

- **날짜**: 2026-11-02
- **과목**: 모바일 프로그래밍 (Kotlin, Android)
- **프로젝트**: `AppWeek09` (`com.appweek09`)
- **주제**: Student List, Shopping Cart, Task Manager 앱의 하나의 화면 통합

## 학습 목표

- 지난주 코드를 새 프로젝트로 이전하는 포팅 절차 이해
- 브랜치 분기, 병합 시점에 따라 달라지는 충돌 상황 이해
- `data class`, `enum class`로 데이터 모델 설계
- `ArrayList` → `ArrayAdapter` → `ListView` 연결 구조 이해
- `lateinit`, 리스너, `notifyDataSetChanged()` 동작 흐름 이해
- 레거시 방식(`ListView`)과 다음 주 `RecyclerView`의 차이 예습

## 수업 흐름

| 순서 | 내용 |
| --- | --- |
| 1 | 새 프로젝트 `AppWeek09` 생성, 지난주 코드 이전 |
| 2 | 동작 확인 후 초기 커밋, 푸시, `main` 병합 |
| 3 | 일정 관리 브랜치 생성, Task Manager 코드 이식 |
| 4 | 커밋, 푸시, `main` 병합 |
| 5 | 데이터 모델과 `MainActivity` 코드 분석 |
| 6 | `RecyclerView`, `LazyColumn` 예고 |

## 1. 프로젝트 이전

### 새 프로젝트 생성

- 템플릿: Empty Views Activity
- 이름: `AppWeek09`
- 저장 위치: C반 폴더 (A, B반 폴더 혼동 주의)
- 기본 예제 코드(`Example`) 삭제 후 시작

### 지난주 파일 복사

AppWeek07의 소스에서 3개 파일을 복사해 덮어쓰기

| 파일 | 위치 |
| --- | --- |
| `DataModels.kt` | `app/src/main/java/com/appweek09/` |
| `MainActivity.kt` | `app/src/main/java/com/appweek09/` |
| `activity_main.xml` | `app/src/main/res/layout/` |

### 이전 후 수정 항목

- 패키지명: `appweek07` → `appweek09` (`DataModels.kt`, `MainActivity.kt`)
- 모듈 `build.gradle.kts`: AppWeek07의 해당 부분 2줄 복사 후 Gradle Sync
- 문자열 안의 주차 표기(`TAG`, 로그, 화면 하단 문구): 7주 → 9주
- 전체 치환: `Ctrl + H`

> 패키지명이 어긋나면 `DataModels.kt`와 `MainActivity.kt`가 서로 인식되지 않아 에러 발생

### 동작 확인

- 항목 길게 누르기: 삭제
- 짧게 누르기: 상세 정보 팝업 (연월일 시분초 포함)
- 빈 입력 후 추가: 입력 요청 팝업
- `CLEAR ALL`: 현재 목록 전체 삭제

## 2. Git 브랜치와 병합

### 상황 비교

| 구분 | 작년 (A반) | 올해 (C반) |
| --- | --- | --- |
| 개발 방식 | 브랜치를 미리 나눠 각자 개발 | 쇼핑 카트 병합 후 그 위에서 새 브랜치 생성 |
| 일정 관리 브랜치의 시작 상태 | 쇼핑 카트 코드 없음 | 쇼핑 카트 코드 포함 |
| 병합 시 충돌 | 같은 파일을 서로 수정해 충돌 가능 | 추가만 발생해 충돌 없음 |

- **병합(merge)**: 다른 브랜치의 변경 이력을 현재 브랜치로 가져오는 작업
- **충돌(conflict)**: 같은 위치를 서로 다르게 수정해 Git이 자동 병합하지 못하는 상태
- 협업 시 먼저 끝난 작업이 병합된 상태라면 그 결과를 기반으로 이어서 작업

### 작업 순서

1. 현재 브랜치(쇼핑 카트)에서 변경 파일 확인

```bash
git status
git add .
git commit
git push
```

2. `main`으로 이동 후 병합

```bash
git switch main
git merge <쇼핑 카트 브랜치>
```

3. 일정 관리 브랜치를 만들고 바로 이동

```bash
git checkout -b <일정 관리 브랜치>
```

4. Task Manager 코드 이식 후 커밋, 최초 푸시

```bash
git add .
git commit
git push -u origin <일정 관리 브랜치>
```

5. `main`에 병합 후 원격에 반영

```bash
git switch main
git merge <일정 관리 브랜치>
git push
```

### 명령어 정리

- **`git checkout -b`**: 브랜치 생성과 이동을 한 번에 처리 (`git branch` + `git switch`와 동일)
- **`git push -u origin <브랜치>`**: 처음 올리는 브랜치의 원격 추적 설정 (최초 1회)
- 푸시한 브랜치에서 작업해도 원격 `main`에는 반영되지 않음. `main`에서 병합 후 별도 푸시 필요
- 병합이 끝난 서브 브랜치는 삭제하지 않으면 원격에 계속 남음

### 이번 프로젝트 커밋 이력

```text
4e7543d AppWeek09 v0.2
1d2d932 Task manager v0.1
19d89df week07 : Shopping Cart App v0.1 (UI & Backend)
```

## 3. Task Manager 코드 이식

### 변경 대상 3개 파일

- `DataModels.kt`
- `MainActivity.kt`
- `activity_main.xml`

### 덮어쓰기 대신 추가 이식하는 이유

- 일정 관리 브랜치의 코드를 통째로 덮으면 쇼핑 카트 코드가 삭제됨
- 이미 병합된 `main`의 결과를 기준으로 Task 관련 부분만 추가
- Android Studio의 Git 로그에서 병합 커밋의 변경 내용을 열면 추가된 코드(파란색)만 골라 복사 가능

### 파일별 추가 내용

| 파일 | 추가된 내용 |
| --- | --- |
| `DataModels.kt` | `import android.graphics.Color`, `Task`, `TaskPriority`, `AppMode.TASK_MANAGER` |
| `activity_main.xml` | 세 번째 라디오 버튼, 일정 관리 전용 입력 영역 |
| `MainActivity.kt` | 작업 목록, 어댑터, `Spinner` 설정, 추가·삭제·완료 전환 로직 |

## 4. 데이터 모델 분석

### 열거형

```kotlin
enum class TaskPriority(val displayName: String, val color: Int) {
    HIGH("High", Color.RED),
    MEDIUM("Medium", Color.BLUE),
    LOW("Low", Color.GREEN)
}

enum class AppMode(val displayName: String) {
    STUDENT_LIST("Student List"),
    SHOPPING_CART("Shopping Cart"),
    TASK_MANAGER("Task Manager"),
}
```

- **`enum class`**: 정해진 값 집합을 타입으로 표현. 문자열 비교보다 오타 방지에 유리
- **`TaskPriority`**: 표시 이름(`Spinner`용)과 색상값을 함께 보관. 이번 프로젝트에서 색상값은 미사용
- **`AppMode`**: 현재 화면이 어떤 앱인지 구분하는 값

### 데이터 클래스

```kotlin
data class Task(
    val title: String,
    val description: String = "",
    var isCompleted: Boolean = false,
    val priority: TaskPriority,
    val dueDate: Date? = null,
    val id: String = UUID.randomUUID().toString(),
    val createdDate: Date = Date()
)
```

- **필수 인수**: `title`, `priority` (기본값 없음)
- **기본값 인수**: 설명(빈 문자열), 완료 여부(`false`), 마감일(`null`), 아이디, 생성 시각
- **`Date?`**: 마감일이 없을 수 있음을 나타내는 nullable 타입
- **`UUID`**: 중복되지 않는 고유 식별 문자열 생성. DB의 `AUTO_INCREMENT` 역할과 유사
- 호출 시 `Task(title, description, false, priority)`처럼 필요한 값만 전달하면 나머지는 기본값 사용

### `toString()` 재정의

```kotlin
override fun toString(): String {
    val status = if (isCompleted) "✓" else "○"
    val priorityIcon = when (priority) {
        TaskPriority.HIGH -> "!!!"
        TaskPriority.MEDIUM -> "!!"
        TaskPriority.LOW -> "!"
    }
    return "$status $priorityIcon $title"
}
```

- `ArrayAdapter`는 객체의 `toString()` 결과를 목록 한 줄로 표시
- 출력 형식: 완료 기호, 우선순위 기호, 제목 순서
- Java의 `Object.toString()` 오버라이드와 동일한 원리

### `when` 표현식

- 값을 변수에 대입하거나 `return`에 바로 사용 가능
- `when`은 Java의 `switch`와 대응
- Java 14부터 `switch` 표현식도 값 반환 가능 (구버전 `switch`와 문법 차이 확인 필요)

## 5. MainActivity 분석

### 전체 구조

```text
onCreate()
 ├─ initializeData()   : 세 개의 ArrayList 생성
 ├─ setupViews()       : findViewById로 위젯 연결, Spinner 설정
 ├─ setupAdapters()    : 모드별 ArrayAdapter 생성
 ├─ setupListeners()   : 라디오, 버튼, ListView 이벤트 등록
 ├─ setMode()          : 초기 모드(Student List) 적용
 └─ addInitialData()   : 실습용 초기 데이터 추가
```

- `onCreate()`: 다른 언어의 `main()`과 유사한 진입점
- 호출 순서 중요: 위젯이나 리스트가 초기화되기 전에 접근하면 예외 발생

### `lateinit`

```kotlin
private lateinit var listView: ListView
private lateinit var taskList: ArrayList<Task>
```

- **`lateinit`**: 선언 시점이 아닌 나중에 초기화하겠다는 약속
- 필요한 이유: Kotlin은 변수 선언과 동시에 초기화가 원칙인데, 위젯은 `setContentView()` 이후에만 `findViewById()`로 연결 가능
- 초기화 전 접근 시 `UninitializedPropertyAccessException` 발생

### 데이터 → 어댑터 → 화면

```text
ArrayList<Task>  →  ArrayAdapter<Task>  →  ListView
   (저장소)            (변환·연결)            (표시)
```

- **어댑터**: 서로 다른 데이터 구조를 하나의 `ListView`에 맞춰 연결하는 중간 계층
- 해외에서 전원 규격이 다른 기기를 쓸 때 쓰는 변환 플러그와 같은 역할
- 모드마다 어댑터를 따로 두고 `setMode()`에서 `listView.adapter`만 교체
- 저장소가 단순 `ArrayList`인 현재 구조는 이후 데이터베이스로 대체 가능
- 메모리에만 저장되므로 앱을 완전히 종료하면 입력한 데이터 소멸

### 모드 전환

```kotlin
radioGroup.setOnCheckedChangeListener { _, checkedId ->
    when (checkedId) {
        R.id.radioStudentList -> setMode(AppMode.STUDENT_LIST)
        R.id.radioShoppingCart -> setMode(AppMode.SHOPPING_CART)
        R.id.radioTaskManager -> setMode(AppMode.TASK_MANAGER)
    }
}
```

- `_`: 사용하지 않는 첫 번째 인수 표시
- `checkedId`: 선택된 라디오 버튼의 아이디. 변수명은 임의 지정 가능
- `setMode()`가 한 번에 변경하는 항목
  - 입력창 힌트
  - 추가 버튼 문구
  - 전용 입력 영역의 `View.VISIBLE` / `View.GONE`
  - `ListView`에 연결된 어댑터
  - 하단 집계 문구

### 레이아웃 구조 (`activity_main.xml`)

- 고정 영역: 상단 라디오 그룹, 입력창, 추가 버튼, `CLEAR ALL`, 집계 `TextView`, `ListView`
- 모드별 영역: 두 개의 `LinearLayout`
  - `layoutCartControls`: 단가, 수량 입력
  - `layoutTaskControls`: 설명 입력, 우선순위 `Spinner`
- 두 영역 모두 기본 `android:visibility="gone"`으로 숨김 상태에서 시작
- 비활성화가 아니라 같은 위치에 끼워 넣거나 숨기는 방식으로 공통 UI 재사용

| 속성값 | 동작 |
| --- | --- |
| `visible` | 화면에 표시 |
| `invisible` | 보이지 않지만 공간 유지 |
| `gone` | 보이지 않고 공간도 차지하지 않음 |

### `Spinner` 우선순위 설정

```kotlin
private fun setupPrioritySpinner() {
    val priorities = TaskPriority.values().map { it.displayName }
    val priorityAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, priorities)
    priorityAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
    spinnerPriority.adapter = priorityAdapter
}
```

- **`Spinner`**: 목록에서 하나를 고르는 드롭다운 위젯
- `values()`: 열거형의 모든 값을 배열로 반환
- `map`: 각 요소를 변환해 새 리스트 생성. 여기서는 `displayName`만 추출
- `it`: 람다의 인수가 하나일 때 쓰는 암시적 이름
- `setDropDownViewResource`: 펼쳤을 때 항목의 모양 지정
- 어댑터를 만든 뒤 `spinnerPriority.adapter`에 연결해야 화면에 반영
- Kotlin 1.9 이후에는 `values()` 대신 `entries` 권장 (IDE 경고 표시, 동작에는 문제 없음)

### 항목 추가

```kotlin
when (currentMode) {
    AppMode.STUDENT_LIST -> addStudent(input)
    AppMode.SHOPPING_CART -> addCartItem(input)
    AppMode.TASK_MANAGER -> addTask(input)
}
```

- 공통 검증: 입력이 비어 있으면 `Toast`를 띄우고 종료
- 학생: `any`로 중복 이름 검사
- 장바구니
  - 단가와 수량의 형식 및 범위 검사 (가격 음수 불가, 수량 1 이상)
  - 같은 이름이 있으면 `find`로 찾아 수량 증가 (DB의 `UPDATE`에 해당)
  - 없으면 새 객체 추가 (DB의 `INSERT`에 해당)
- 일정 관리: `Spinner`의 선택 위치를 `TaskPriority` 값으로 변환해 생성

### 화면 갱신: `notifyDataSetChanged()`

- 리스트의 데이터를 변경해도 어댑터는 변경 사실을 자동으로 알지 못함
- 추가, 삭제, 수정 후 `notifyDataSetChanged()` 호출 필수
- 호출하면 어댑터가 데이터를 다시 읽어 `ListView`를 갱신
- 삭제(`removeAt`, `clear`)와 완료 상태 전환 후에도 동일하게 호출

### 클릭 이벤트

| 이벤트 | 학생 | 장바구니 | 일정 관리 |
| --- | --- | --- | --- |
| 짧게 클릭 | 이름 `Toast` | 상세 `AlertDialog` | 완료 상태 토글 |
| 길게 클릭 | 삭제 확인 `AlertDialog` | 삭제 확인 `AlertDialog` | 삭제 확인 `AlertDialog` |

```kotlin
task.isCompleted = !task.isCompleted
```

- 토글: `true`와 `false`를 번갈아 바꾸는 방식

### 상세 대화상자와 메서드 체이닝

```kotlin
AlertDialog.Builder(this)
    .setTitle("Item Details")
    .setMessage(message)
    .setPositiveButton("OK", null)
    .show()
```

- **메서드 체이닝**: 같은 객체에 점(`.`)으로 설정 메서드를 이어서 호출하는 방식
- 메시지는 `trimIndent()`를 쓴 여러 줄 문자열로 구성
- 소수점 둘째 자리 표기: `String.format("%.2f", value)`
  - Python의 `format`, `%` 연산자, f-string과 같은 계열의 기능
  - 언어마다 인수 위치와 문법 차이 존재

### 집계 함수

```kotlin
val totalItems = cartItemList.sumOf { it.quantity }
val totalValue = cartItemList.sumOf { it.getTotalPrice() }

val completed = taskList.count { it.isCompleted }
val highPriority = taskList.count {
    it.priority == TaskPriority.HIGH && !it.isCompleted
}
```

- 화면에 표시하는 값을 변경 시점마다 목록에서 다시 계산
- `updateCartInfo()`, `updateTaskInfo()`가 `textViewInfo`에 출력
- 항목 추가, 삭제, 완료 전환 때마다 호출되므로 표시값이 항상 최신 상태

## 6. 주의점

- **`dropLast(5)` 메시지**: 입력 안내문 `Please enter a ${currentMode.displayName.lowercase().dropLast(5)}`는 모드 이름의 끝 5글자를 제거하는 방식. 코드상 `Shopping Cart`는 `shopping`, `Task Manager`는 `task man`으로 표시됨 (코드 해석 기준, 실행 전 확인 필요)
- **메모리 저장**: 앱을 재실행하면 `addInitialData()`의 초기 데이터로 복귀
- **위치 기반 접근**: `studentList[position]`처럼 인덱스로 접근하므로 목록 변경과 클릭 시점의 불일치 가능성 존재
- **`Spinner` 초기화**: 항목 추가 후 `setSelection(0)`으로 우선순위를 기본값으로 복원
- **패키지명 불일치**: 복사 후 첫 빌드 에러의 주된 원인

## 7. ListView의 한계와 다음 단계

```text
ListView → RecyclerView + ViewHolder → Jetpack Compose LazyColumn
```

| 구분 | 특징 |
| --- | --- |
| `ListView` | 구조가 단순함. 항목이 많아지면 메모리와 성능 부담 증가 |
| `RecyclerView` | `ViewHolder`로 화면 항목 재사용. 반복 작성하는 보일러플레이트 코드 많음 |
| `LazyColumn` | Compose의 선언형 목록. 화면에 보이는 항목만 구성, XML 불필요 |

- **보일러플레이트 코드**: 기능과 무관하게 반복해서 작성해야 하는 정형 코드
- **선언형 UI**: 상태에 따른 화면 모양을 선언하면 프레임워크가 갱신을 처리하는 방식
- 다음 주: 현재 앱의 `ListView`를 `RecyclerView`로 교체
- 현업에서는 기존 앱 유지보수가 많아 `ListView`, `RecyclerView` 지식도 중요

## 8. 복습 체크리스트

- [ ] 새 프로젝트로 코드를 옮길 때 바꿔야 하는 항목 설명 가능
- [ ] 병합 전 분기와 병합 후 분기에서 충돌 가능성이 다른 이유 설명 가능
- [ ] `git checkout -b`와 `git push -u origin`의 역할 설명 가능
- [ ] `lateinit`이 필요한 이유 설명 가능
- [ ] `ArrayList`, `ArrayAdapter`, `ListView`의 역할 구분 가능
- [ ] `notifyDataSetChanged()`를 호출하지 않았을 때의 현상 설명 가능
- [ ] `map`, `any`, `find`, `count`, `sumOf`의 용도 구분 가능
- [ ] 모드 전환 시 `setMode()`가 바꾸는 항목 나열 가능

## 9. 기타 수업 메모

- 코드를 따라 치는 것보다 전체 구조(설계 → 연결 → 이벤트 → 화면 갱신)를 이해하는 것이 핵심
- AI 답변은 최신 문법 위주로 설명하거나 일부를 빠뜨릴 수 있음. 직접 이해한 뒤 검증하는 습관 필요
- 면접에서는 AI가 짠 코드가 아니라 본인이 이해한 내용을 질문
- 크로스 플랫폼(Flutter 등)은 소규모 팀에서 많이 쓰고, 대기업은 플랫폼별 개발팀을 따로 운영하는 경우가 많음
- 수업에서 다룬 키워드: `lateinit`, `when`, `map`, `it`, 리스너, 어댑터
