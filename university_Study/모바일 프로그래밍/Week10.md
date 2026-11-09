# AppWeek10 — RecyclerView 학생 목록 앱 학습 정리

> 강의 녹취와 [`neonunu/kotlin-2026c`의 `AppWeek10`](https://github.com/neonunu/kotlin-2026c/tree/main/AppWeek10) 실제 소스를 함께 대조한 복습 자료입니다.  
> 소스 확인 기준: `main` 브랜치, 2026-11-09

## 1. 이번 주 핵심 한 문장

`RecyclerView`는 **데이터 목록을 화면의 항목 뷰와 연결하고, 화면 밖으로 나간 항목 뷰를 재사용하는 XML Views 기반 목록 UI**이다.

이번 앱에서는 학생 데이터 6개를 `RecyclerView`에 표시하고, 학생 추가·조회·삭제·전체 삭제와 `Linear`/`Grid` 레이아웃 전환을 구현한다.

## 2. 학습 목표

- `RecyclerView`, `ViewHolder`, `Adapter`, `LayoutManager`의 역할을 구분한다.
- 데이터가 XML 항목 레이아웃에 바인딩되는 흐름을 설명한다.
- `onCreateViewHolder()`, `onBindViewHolder()`, `getItemCount()`의 역할을 구분한다.
- ViewBinding으로 XML 뷰를 안전하게 참조한다.
- `notifyItemInserted()`, `notifyItemRemoved()`, `notifyDataSetChanged()`의 차이를 이해한다.
- `LinearLayoutManager`와 `GridLayoutManager`를 실행 중에 교체한다.
- 현재 앱의 데이터가 영구 저장되지 않는 이유를 설명한다.

---

## 3. 2026년 기준: RecyclerView와 Compose

Android 공식 문서는 새 UI 개발에 Jetpack Compose를 권장한다. `RecyclerView` 라이브러리는 현재 **maintenance mode**이며 중요한 수정은 받지만 새로운 기능은 계획되어 있지 않다. 그러나 기존 XML Views 프로젝트를 이해하고 유지보수하려면 여전히 `RecyclerView`를 알아야 한다.

| UI 방식 | 목록 구성요소 | 이번 프로젝트와의 관계 |
| --- | --- | --- |
| XML Views | `RecyclerView` | 이번 `AppWeek10`이 사용 |
| Jetpack Compose | `LazyColumn`, `LazyRow`, `LazyVerticalGrid` | 새 Compose 화면에서 사용하는 대응 구성요소 |

공식 문서에서 확인되는 내용은 다음과 같다.

- Compose는 현재 Android가 권장하는 UI 도구이다.
- RecyclerView의 안정 버전은 프로젝트와 같은 `1.4.0`이다.
- RecyclerView는 유지보수 모드지만 XML Views 앱에서 계속 사용할 수 있다.
- `LazyColumn`과 `LazyRow`도 화면에 필요한 항목을 중심으로 구성한다.

> **주의:** 강의 중 AI 검색 결과로 언급된 “상위 앱 68%”, “레거시 60~70%”, “LazyColumn 30~40%” 같은 비율은 출처가 제시되지 않았다. 시험 개념이나 시장 통계로 외우면 안 된다. 공식적으로 확인할 수 있는 결론은 **새 UI는 Compose 우선, 기존 Views 코드에는 RecyclerView가 많이 남아 있어 둘 다 이해할 가치가 있다**는 정도이다.

---

## 4. 완성 앱에서 할 수 있는 일

| 기능 | 사용 방법 | 코드의 실제 동작 |
| --- | --- | --- |
| 초기 목록 | 앱 실행 | `KIM`부터 `WOO`까지 학생 6명 추가 |
| 학생 추가 | 이름 입력 후 `ADD` | 빈 입력과 같은 이름을 검사한 뒤 새 학생 추가 |
| 상세 조회 | 항목 짧게 누르기 | 이름, ID 일부, 학과, 학년, 이메일, 위치를 Dialog로 표시 |
| 학생 삭제 | 항목 길게 누르기 | 확인 Dialog 후 해당 학생 삭제 |
| 전체 삭제 | `CLEAR` | 모든 학생 삭제 |
| 목록형 보기 | Spinner에서 `Linear` | 세로 1열 목록 |
| 그리드 보기 | `Grid (2 columns)` | 2열 그리드 |
| 넓은 그리드 보기 | `Grid (3 columns)` | 3열 그리드 |

### 현재 앱의 중요한 한계

학생 목록은 `ArrayList`라는 **메모리 안의 데이터**이다. Room, 파일, 서버 등에 저장하지 않으므로 Activity가 다시 만들어지거나 앱 프로세스가 종료되면 처음의 학생 6명으로 돌아온다.

---

## 5. 전체 구조를 먼저 보기

```text
Student 데이터
    │
    ▼
StudentAdapter
    ├─ 필요한 항목 틀을 생성 ──> StudentViewHolder
    └─ Student 값을 항목 뷰에 연결
                              │
                              ▼
                         item_student.xml
                              │
                              ▼
RecyclerView ── LayoutManager가 위치 결정 ──> 화면에 목록/그리드 표시
```

각 파일의 관계는 다음과 같다.

```text
AppWeek10/
└── app/
    ├── build.gradle.kts
    └── src/main/
        ├── AndroidManifest.xml
        ├── java/com/appweek10/
        │   ├── MainActivity.kt
        │   ├── StudentAdapter.kt
        │   └── data/
        │       └── Student.kt
        └── res/layout/
            ├── activity_main.xml
            └── item_student.xml
```

---

## 6. 핵심 개념 1 — RecyclerView

> **쉬운 정의:** 많은 목록 항목을 모두 새로 만들지 않고, 화면에서 벗어난 항목의 뷰를 다시 써서 목록을 효율적으로 보여주는 ViewGroup이다.

`RecyclerView`는 목록 전체를 그리는 컨테이너이다. 데이터 자체를 저장하거나 항목의 모양을 혼자 결정하지 않는다. 다음 세 요소와 함께 동작한다.

- `Adapter`: 데이터와 항목 뷰를 연결한다.
- `ViewHolder`: 항목 하나의 뷰를 잡고 있다.
- `LayoutManager`: 항목을 세로, 가로, 그리드 등으로 배치한다.

**아주 간단한 핵심 예시**

```kotlin
binding.recyclerView.layoutManager = LinearLayoutManager(this)
binding.recyclerView.adapter = adapter
```

**예상 결과 (실행 전)**

`adapter`가 제공한 학생 항목들이 세로 목록으로 표시된다.

**그 결과가 나온 이유**

1. `adapter`가 항목 뷰를 만들고 학생 데이터를 넣는다.
2. `LinearLayoutManager`가 항목을 한 줄씩 세로로 배치한다.
3. `RecyclerView`가 필요한 항목 뷰를 화면에 붙이고 재사용한다.

### 꼭 바로잡을 점: RecyclerView는 데이터 페이징 도구가 아니다

RecyclerView가 화면 밖의 **뷰**를 재사용하는 것과, 서버나 DB에서 데이터를 조금씩 불러오는 것은 다른 문제이다.

```text
RecyclerView의 재활용: 화면에 필요한 View 객체 수를 줄임
Paging의 분할 로딩: 메모리에 가져오는 데이터 양을 줄임
```

따라서 `ArrayList`에 학생 100만 명을 먼저 넣으면 데이터 100만 개는 이미 메모리에 있다. 대용량 데이터를 실제로 나누어 불러오려면 Paging 같은 별도 기술이 필요하다.

---

## 7. 핵심 개념 2 — ViewHolder

> **쉬운 정의:** 목록 항목 하나에 들어 있는 여러 View를 보관하고, 새 데이터로 다시 채울 수 있게 하는 홀더이다.

`ViewHolder`는 항목 하나의 `itemView`를 감싸는 래퍼이다. 이 프로젝트에서는 ViewBinding 객체인 `ItemStudentBinding`을 가지고 있어 이름·학과·학년·이메일 View에 바로 접근한다.

**아주 간단한 핵심 예시**

```kotlin
inner class StudentViewHolder(
    private val binding: ItemStudentBinding
) : RecyclerView.ViewHolder(binding.root) {

    // 학생 한 명의 값을 항목 View에 표시
    fun bind(student: Student) {
        binding.textViewName.text = student.name
    }
}
```

- `StudentViewHolder`: ViewHolder 클래스
- `binding.root`: `item_student.xml`의 최상위 View
- `bind(student)`: 기존 항목 뷰에 현재 학생 값을 채우는 함수

> `RecyclerView.ViewHolder`를 점으로 접근한다고 해서 `RecyclerView`의 모든 것이 static이라는 뜻은 아니다. Java/Kotlin의 중첩 타입을 바깥 클래스 이름으로 한정해 표현한 것이다.

---

## 8. 핵심 개념 3 — Adapter

> **쉬운 정의:** 서로 다른 모양의 데이터와 화면 View 사이를 연결해 주는 변환기이다.

이 프로젝트의 `StudentAdapter`는 다음 정보를 받는다.

```kotlin
class StudentAdapter(
    private val studentList: List<Student>,
    private val onItemClick: (Student, Int) -> Unit,
    private val onItemLongClick: (Int) -> Unit
) : RecyclerView.Adapter<StudentAdapter.StudentViewHolder>()
```

| 매개변수 | 역할 |
| --- | --- |
| `studentList` | 화면에 표시할 학생 목록 |
| `onItemClick` | 짧게 눌렀을 때 Activity에 알릴 함수 |
| `onItemLongClick` | 길게 눌렀을 때 Activity에 알릴 함수 |

Adapter가 화면을 직접 소유하지 않고 클릭 결과를 람다로 Activity에 전달하므로, 역할을 비교적 깔끔하게 나눌 수 있다.

---

## 9. Adapter에서 반드시 구현하는 세 메서드

| 메서드 | 쉬운 역할 | 이 앱에서 하는 일 |
| --- | --- | --- |
| `onCreateViewHolder()` | 빈 항목 틀 만들기 | `item_student.xml`을 inflate하여 ViewHolder 생성 |
| `onBindViewHolder()` | 틀에 데이터 넣기 | `position`의 `Student`를 `holder.bind()`에 전달 |
| `getItemCount()` | 항목 개수 알려주기 | `studentList.size` 반환 |

### 9.1 `onCreateViewHolder()`

```kotlin
// item_student.xml로 새 ViewHolder를 생성
override fun onCreateViewHolder(
    parent: ViewGroup,
    viewType: Int
): StudentViewHolder {
    val binding = ItemStudentBinding.inflate(
        LayoutInflater.from(parent.context),
        parent,
        false
    )
    return StudentViewHolder(binding)
}
```

`inflate`는 XML 레이아웃 설명을 실제 `View` 객체 계층으로 만드는 과정이다.

- `LayoutInflater.from(parent.context)`: View를 만들 도구를 얻는다.
- `parent`: 새 항목이 들어갈 부모 정보를 전달한다.
- `false`: 지금 즉시 `parent`에 붙이지 않는다. 붙이는 시점은 RecyclerView가 관리한다.

이 함수는 매 데이터마다 항상 호출되는 것이 아니다. 재사용할 ViewHolder가 부족할 때 새로 만든다.

### 9.2 `onBindViewHolder()`

```kotlin
// 현재 위치의 Student를 기존 ViewHolder에 연결
override fun onBindViewHolder(
    holder: StudentViewHolder,
    position: Int
) {
    holder.bind(studentList[position])
}
```

예를 들어 `position == 1`이면 `studentList[1]`인 `LEE` 객체를 꺼내 이름, 학과, 학년, 이메일 View에 채운다.

### 9.3 `getItemCount()`

```kotlin
// RecyclerView에 전체 학생 수를 전달
override fun getItemCount(): Int = studentList.size
```

학생이 6명이면 `6`, 한 명을 삭제하면 `5`가 된다. `= studentList.size`는 다음 함수를 줄인 표현식이다.

```kotlin
// 전체 학생 수를 RecyclerView에 전달
override fun getItemCount(): Int {
    return studentList.size
}
```

---

## 10. 핵심 개념 4 — LayoutManager

> **쉬운 정의:** RecyclerView 안의 항목들을 어느 방향과 모양으로 놓을지 결정하는 배치 관리자이다.

`LayoutManager`는 데이터를 이름순으로 정렬하는 도구가 아니다. 항목의 **화면 위치와 재활용 시점**을 관리한다. 데이터 정렬이 필요하면 `studentList` 자체를 정렬해야 한다.

### 주요 종류

| 클래스 | 결과 |
| --- | --- |
| `LinearLayoutManager` | 한 방향의 1차원 목록 |
| `GridLayoutManager` | 같은 열 수를 가진 2차원 그리드 |
| `StaggeredGridLayoutManager` | 항목 크기가 서로 다를 수 있는 엇갈린 그리드 |

### 이 앱의 레이아웃 전환

```kotlin
// Spinner 위치에 따라 RecyclerView 배치를 변경
private fun changeLayoutManager(layoutType: Int) {
    binding.recyclerView.layoutManager = when (layoutType) {
        0 -> LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false)
        1 -> GridLayoutManager(this, 2)
        2 -> GridLayoutManager(this, 3)
        else -> LinearLayoutManager(this)
    }
}
```

같은 학생 데이터와 같은 Adapter를 유지한 채 배치 방식만 바뀐다.

---

## 11. 핵심 개념 5 — ViewBinding

> **쉬운 정의:** XML에 선언한 View를 ID 문자열 검색 대신, 생성된 타입 안전 객체로 접근하게 해 주는 기능이다.

### 활성화

`app/build.gradle.kts`의 `android` 블록에 다음 설정이 있다.

```kotlin
buildFeatures {
    viewBinding = true
}
```

### Activity에서 사용

```kotlin
private lateinit var binding: ActivityMainBinding

// ViewBinding으로 Activity 화면을 생성하고 표시
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding = ActivityMainBinding.inflate(layoutInflater)
    setContentView(binding.root)
}
```

`activity_main.xml`에서 `ActivityMainBinding`이 생성되고, `item_student.xml`에서 `ItemStudentBinding`이 생성된다.

```kotlin
binding.buttonAdd
binding.spinnerLayout
binding.recyclerView
```

이처럼 XML ID에 대응하는 속성으로 접근하므로 잘못된 타입 캐스팅과 반복적인 `findViewById()`를 줄일 수 있다.

> ViewBinding을 켠다고 모든 실행 성능이 자동으로 크게 향상된다고 단정하면 안 된다. 핵심 장점은 생성된 참조를 통한 타입 안전성과 간결한 View 접근이다.

---

## 12. Gradle 설정

프로젝트 소스의 실제 설정은 다음과 같다.

```kotlin
android {
    namespace = "com.appweek10"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.appweek10"
        minSdk = 26
        targetSdk = 36
    }

    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.recyclerview:recyclerview:1.4.0")
}
```

Gradle 파일을 바꾼 뒤에는 Android Studio에서 Gradle Sync가 필요하다.

---

## 13. XML 레이아웃 두 개의 역할

### 13.1 `activity_main.xml` — 전체 화면

전체 화면에는 다음 View가 들어 있다.

```text
LinearLayout
├── 제목 TextView
├── 이름 입력 EditText + ADD Button
├── Layout Spinner + CLEAR Button
├── 전체 학생 수 TextView
├── 사용 안내 TextView
├── RecyclerView
└── 주차 안내 TextView
```

RecyclerView 부분은 다음과 같다.

```xml
<androidx.recyclerview.widget.RecyclerView
    android:id="@+id/recyclerView"
    android:layout_width="match_parent"
    android:layout_height="0dp"
    android:layout_weight="1"
    android:background="#ffffff"
    android:padding="8dp"
    android:elevation="2dp" />
```

`layout_height="0dp"`와 `layout_weight="1"`을 함께 사용해 남은 세로 공간을 RecyclerView가 차지한다.

### 13.2 `item_student.xml` — 학생 한 명의 항목

```text
LinearLayout
├── textViewName
├── D: + textViewDept
├── G: + textViewGrade
└── E: + textViewEmail
```

- `D:`, `G:`, `E:`는 고정 표시이다.
- `textViewDept`, `textViewGrade`, `textViewEmail`은 학생마다 바뀐다.
- 이 레이아웃 하나가 학생 명함 한 장과 비슷한 역할을 한다.

---

## 14. `Student.kt` — 데이터 모델

> **쉬운 정의:** 학생 한 명이 어떤 정보를 갖는지 정한 설계도이다.

실제 소스는 다음 구조이다.

```kotlin
class Student(
    val name: String,
    val id: String = UUID.randomUUID().toString(),
    val department: String = "Computer Science",
    val grade: String = "2nd Year",
    val email: String = "",
    val addedDate: Date = Date()
) {
    // Student 객체를 문자열로 표현할 때 이름을 반환
    override fun toString(): String = name
}
```

| 속성 | 의미 | 기본값 |
| --- | --- | --- |
| `name` | 학생 이름 | 반드시 전달 |
| `id` | 고유 식별 문자열 | 임의 UUID |
| `department` | 학과 | `Computer Science` |
| `grade` | 학년 | `2nd Year` |
| `email` | 이메일 | 빈 문자열 |
| `addedDate` | 객체 생성 시각 | 현재 시각 |

### `toString()` 실행 예

```kotlin
val student = Student("KIM")
println(student)
```

**예상 결과 (실행 전)**

```text
KIM
```

`println()`이 객체의 `toString()`을 호출하고, 재정의된 함수가 `name`을 반환하기 때문이다.

> **소스 대조:** 현재 `Student`는 README 예시와 달리 `data class`가 아니라 일반 `class`이다.

---

## 15. `StudentAdapter.kt` 실행 흐름

### 15.1 바인딩

```kotlin
// 학생 데이터를 항목 View에 표시하고 클릭 이벤트를 연결
fun bind(student: Student) {
    binding.apply {
        textViewName.text = student.name
        textViewDept.text = student.department
        textViewGrade.text = student.grade
        textViewEmail.text = student.email

        root.setOnClickListener {
            onItemClick(student, adapterPosition)
        }

        root.setOnLongClickListener {
            onItemLongClick(adapterPosition)
            true
        }
    }
}
```

`binding.apply { ... }` 안에서는 `binding.`을 반복하지 않아도 된다.

긴 클릭에서 `true`를 반환하는 것은 이벤트를 처리했다는 뜻이다. `false`이면 같은 입력이 다른 클릭 처리로 이어질 수 있다.

### 15.2 위치 사용 시 주의점

현재 코드는 `adapterPosition`을 바로 전달한다. 항목이 제거되는 순간처럼 위치가 유효하지 않을 때는 `RecyclerView.NO_POSITION`이 될 수 있다. 더 안전한 형태는 다음과 같다.

```kotlin
root.setOnClickListener {
    val position = bindingAdapterPosition

    // 유효한 위치일 때만 현재 데이터를 전달
    if (position != RecyclerView.NO_POSITION) {
        onItemClick(studentList[position], position)
    }
}
```

이 코드는 이해를 위한 개선 예시이며, 현재 GitHub 소스에 적용된 코드는 아니다.

---

## 16. `MainActivity.kt` 실행 순서

`onCreate()`는 다음 네 작업을 순서대로 부른다.

```kotlin
// Activity 화면과 RecyclerView 기능을 순서대로 초기화
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding = ActivityMainBinding.inflate(layoutInflater)
    setContentView(binding.root)

    setupViews()
    setupRecyclerView()
    setupListeners()
    addInitialData()
}
```

```text
1. setupViews()
   ├─ 빈 studentList 생성
   └─ Spinner에 세 레이아웃 이름 연결

2. setupRecyclerView()
   ├─ StudentAdapter 생성
   ├─ LinearLayoutManager 설정
   ├─ Adapter 연결
   └─ 세로 구분선 추가

3. setupListeners()
   ├─ ADD 클릭 → addStudent()
   ├─ CLEAR 클릭 → clearAllStudents()
   └─ Spinner 선택 → changeLayoutManager()

4. addInitialData()
   ├─ 학생 6명 생성
   ├─ studentList에 추가
   └─ 화면과 학생 수 갱신
```

호출 순서가 중요하다. `addInitialData()`가 Adapter 생성보다 먼저 실행되면 아직 `adapter`가 초기화되지 않아 갱신 함수를 부를 수 없다.

---

## 17. 학생 추가 흐름 추적

입력창에 `HAN`을 넣고 `ADD`를 누른다고 가정한다.

```text
buttonAdd 클릭
  → addStudent()
  → 입력값 trim(): "HAN"
  → 빈 문자열 검사 통과
  → 중복 이름 검사 통과
  → Student("HAN", ...) 생성
  → studentList.add(student)
  → notifyItemInserted(마지막 위치)
  → 입력창 비우기
  → 학생 수 TextView 갱신
```

핵심 코드는 다음과 같다.

```kotlin
// 입력값을 검사하고 새 학생을 목록 끝에 추가
private fun addStudent() {
    val studentName = binding.editTextStudent.text.toString().trim()

    // 이름이 비어 있으면 추가를 중단
    if (studentName.isEmpty()) {
        showToast("Please enter a student name")
        return
    }

    // 같은 이름이 이미 있으면 추가를 중단
    if (studentList.any { it.name == studentName }) {
        showToast("Student '$studentName' already exists")
        return
    }

    val student = Student(
        name = studentName,
        department = "Computer Science",
        grade = "Year ${(Math.random() * 4 + 1).toInt()}",
        email = "${studentName.replace(" ", ".")}@university.edu"
    )

    studentList.add(student)
    adapter.notifyItemInserted(studentList.size - 1)
    binding.editTextStudent.text.clear()
    updateStudentCount()
}
```

### 이 중복 검사의 범위

검사는 대소문자를 구분한다.

```text
KIM == KIM  → 중복
KIM == kim  → 중복 아님
```

---

## 18. 클릭과 삭제 흐름 추적

### 짧게 클릭

```text
항목 root 클릭
  → Adapter의 onItemClick(student, position)
  → MainActivity의 handleItemClick(student, position)
  → AlertDialog에 상세 정보 표시
```

### 길게 클릭

```text
항목 root 길게 클릭
  → Adapter의 onItemLongClick(position)
  → MainActivity의 handleItemLongClick(position)
  → 삭제 확인 Dialog
  → Delete 선택
  → removeStudent(position)
  → 목록에서 객체 제거
  → notifyItemRemoved(position)
  → 학생 수 갱신
```

`removeStudent()`는 위치가 목록 범위 안에 있는지도 확인한다.

```kotlin
// 유효한 위치의 학생을 제거하고 해당 변경만 알림
private fun removeStudent(position: Int) {
    if (position >= 0 && position < studentList.size) {
        studentList.removeAt(position)
        adapter.notifyItemRemoved(position)
        updateStudentCount()
    }
}
```

---

## 19. Adapter 알림 메서드

데이터 목록만 바꾸면 RecyclerView가 변경 사실을 자동으로 모두 추론하지 못한다. 어떤 변화가 생겼는지 Adapter에 알려야 한다.

| 메서드 | 사용할 때 | 이 앱의 사용 위치 |
| --- | --- | --- |
| `notifyItemInserted(position)` | 한 항목 추가 | 학생 추가 |
| `notifyItemRemoved(position)` | 한 항목 삭제 | 학생 삭제 |
| `notifyItemChanged(position)` | 한 항목 내용 변경 | 현재 미사용 |
| `notifyDataSetChanged()` | 전체가 크게 바뀜 | 초기 데이터 추가, 전체 삭제 |

가능하면 특정 위치를 알려주는 메서드가 RecyclerView에 더 정확한 변경 정보를 준다. 복잡한 실제 앱에서는 `ListAdapter`와 `DiffUtil`을 사용해 이전 목록과 새 목록의 차이를 계산하는 방식도 자주 쓴다.

---

## 20. `ArrayList`와 `List<Student>`가 함께 동작하는 이유

`MainActivity`의 실제 객체는 수정 가능한 `ArrayList<Student>`이다.

```kotlin
private lateinit var studentList: ArrayList<Student>
```

Adapter 생성자는 읽기 중심 인터페이스인 `List<Student>`로 받는다.

```kotlin
private val studentList: List<Student>
```

Adapter에 전달할 때 목록을 복사한 것이 아니라 같은 `ArrayList` 객체를 가리키는 참조를 전달한다. 그래서 Activity가 원본 `ArrayList`에 학생을 추가하거나 삭제하면 Adapter에서도 바뀐 내용과 크기를 볼 수 있다.

```text
MainActivity.studentList ─┐
                         ├─> 같은 ArrayList 객체
Adapter.studentList ─────┘
```

다만 Adapter 쪽 타입이 `List`이므로 Adapter 내부에서는 `add()`나 `remove()`를 직접 호출할 수 없다.

---

## 21. 실습 재현 순서

1. Android Studio에서 **Empty Views Activity** 프로젝트를 만든다.
2. 모듈 `app/build.gradle.kts`에 ViewBinding과 RecyclerView 의존성을 추가한다.
3. Gradle Sync를 실행한다.
4. `activity_main.xml`에 전체 화면과 `RecyclerView`를 만든다.
5. `item_student.xml`에 학생 한 명의 항목 모양을 만든다.
6. `data/Student.kt`에 학생 모델을 만든다.
7. `StudentAdapter.kt`에 ViewHolder와 세 필수 메서드를 구현한다.
8. `MainActivity.kt`에서 목록, Adapter, LayoutManager, Listener를 연결한다.
9. 빌드 후 에뮬레이터에서 추가·클릭·길게 클릭·전체 삭제·레이아웃 변경을 확인한다.

---

## 22. 강의 설명에서 정확히 구분할 내용

### 22.1 “ListView는 데이터 100만 개의 View를 전부 만든다”

지나치게 단순화한 설명이다. `ListView`도 `convertView`를 통해 View 재사용이 가능하다. RecyclerView의 차이는 ViewHolder 사용을 구조적으로 강제하고, LayoutManager·애니메이션·변경 알림 등 확장 가능한 구조를 제공한다는 데 있다.

### 22.2 “RecyclerView는 보이는 데이터만 로딩한다”

정확히는 보이는 범위 중심으로 **View를 생성·연결·재사용**한다. 데이터 자체를 DB나 네트워크에서 일부만 로딩하려면 Paging 등이 필요하다.

### 22.3 “자료가 적으면 RecyclerView는 부적합하다”

항목이 적다는 이유만으로 부적합한 것은 아니다. 간단한 정적 UI라면 `LinearLayout` 등이 더 단순할 수 있지만, 항목 추가·삭제·스크롤·그리드 전환이 필요하면 적은 데이터에도 RecyclerView를 사용할 수 있다.

### 22.4 “LayoutManager가 소팅한다”

LayoutManager는 화면 배치를 맡는다. 이름순·학년순 정렬은 데이터 목록을 정렬하는 별도 코드의 책임이다.

### 22.5 “ViewHolder는 View를 기반으로 만든 View의 자식이다”

ViewHolder는 `View`를 상속하는 것이 아니라 `RecyclerView.ViewHolder`를 상속하며, 내부의 `itemView`로 항목 View를 보관하는 래퍼이다.

### 22.6 “RecyclerView.ViewHolder는 static이라 점으로 접근한다”

`RecyclerView.ViewHolder`는 바깥 타입 이름으로 중첩 타입을 지정한 표현이다. 점 표기만 보고 RecyclerView 전체가 static이라고 해석하면 안 된다.

### 22.7 Pandas·NumPy·Seaborn의 ‘래핑’ 비유

Pandas가 NumPy를 활용하고 Seaborn이 Matplotlib 위에 고수준 API를 제공하는 것은 맞지만, 한 라이브러리의 모든 API를 다른 라이브러리에서 그대로 쓸 수 있다는 뜻은 아니다. 여기서는 “ViewHolder가 항목 View를 감싸 보관한다”는 직접적인 관계만 기억하면 된다.

---

## 23. 현재 GitHub README와 실제 소스의 차이

| README 또는 표시 내용 | 실제 소스 확인 결과 |
| --- | --- |
| 제목이 `Fall 2025 Semester`, 내용은 `Week 09` | 프로젝트 폴더는 `AppWeek10`; 강의에서는 10주 차 실습으로 진행 |
| 예시 모델이 `data class Student` | 실제 `Student.kt`는 일반 `class Student` |
| 실행 환경 `API 24+ recommended` | 실제 `minSdk = 26` |
| 트리 경로 `com/example/appweek10` | 실제 패키지는 `com/appweek10` |
| Adapter 예시에서 `Grade: ...`를 붙임 | 실제 Adapter는 `student.grade`만 넣고 XML의 `G:`가 앞에 표시됨 |
| Log 태그 `KotlinWeek09App` | 실제 코드에도 이 과거 이름이 남아 있음 |
| 화면 하단 `Week 09: RecyclerView Introduction` | 실제 `activity_main.xml`에도 이 표기가 남아 있음 |

따라서 README를 개념 참고용으로 볼 수는 있지만, 과제나 코드 설명에서는 실제 소스를 기준으로 해야 한다.

---

## 24. 자주 생기는 오류와 점검 순서

### `ItemStudentBinding` 또는 `ActivityMainBinding`을 찾지 못함

1. `buildFeatures { viewBinding = true }`를 확인한다.
2. Gradle Sync를 실행한다.
3. XML 파일 이름과 XML 문법 오류를 확인한다.
4. Build/Rebuild를 실행한다.

### RecyclerView가 보이지만 항목이 없음

```kotlin
binding.recyclerView.layoutManager = LinearLayoutManager(this)
binding.recyclerView.adapter = adapter
```

두 설정을 모두 했는지 확인하고 `getItemCount()`가 0이 아닌지 확인한다.

### Adapter에 빨간 줄이 생김

다음 세 메서드를 모두 재정의했는지 확인한다.

```text
onCreateViewHolder()
onBindViewHolder()
getItemCount()
```

### XML ID가 Binding 속성으로 나타나지 않음

예를 들어 `@+id/textViewName`은 `binding.textViewName`이 된다. 철자와 XML 파일을 확인한 뒤 다시 빌드한다.

### Grid에서 구분선이 어색함

현재 앱은 처음에 세로 `DividerItemDecoration`을 한 번 추가하고, 이후 Grid로 바꾸어도 그대로 둔다. Grid 전용 간격이 필요하면 레이아웃에 맞는 `ItemDecoration`을 별도로 설계해야 한다.

### 앱을 다시 열면 삭제한 학생이 돌아옴

버그라기보다 현재 구조의 한계이다. 목록이 메모리에만 있고 Room 같은 영구 저장소에 저장되지 않기 때문이다.

---

## 25. 시험 직전 요약

```text
RecyclerView
  └─ 목록을 표시하고 View를 재사용하는 ViewGroup

ViewHolder
  └─ 항목 하나의 View 참조를 보관

Adapter
  └─ 데이터와 ViewHolder를 연결

LayoutManager
  └─ 항목의 배치와 재활용을 관리

onCreateViewHolder()
  └─ 빈 항목 ViewHolder 생성

onBindViewHolder()
  └─ position의 데이터를 기존 ViewHolder에 연결

getItemCount()
  └─ 데이터 개수 반환

ViewBinding
  └─ XML View를 생성된 타입 안전 객체로 참조

notifyItemInserted/Removed
  └─ 특정 위치의 변경을 Adapter에 알림

Room 또는 다른 저장소
  └─ 앱을 껐다 켜도 데이터를 유지하려면 필요
```

### 가장 중요한 데이터 흐름

```text
Student
  → StudentAdapter가 선택
  → StudentViewHolder.bind()가 XML View에 값 설정
  → LayoutManager가 위치 결정
  → RecyclerView가 화면에 표시
```

---

## 26. 참고 자료

- [AppWeek10 GitHub 소스](https://github.com/neonunu/kotlin-2026c/tree/main/AppWeek10)
- [Android Developers — RecyclerView로 동적 목록 만들기](https://developer.android.com/develop/ui/views/layout/recyclerview?hl=ko)
- [Android Developers — RecyclerView 맞춤설정](https://developer.android.com/develop/ui/views/layout/recyclerview-custom?hl=ko)
- [Android Developers — RecyclerView 릴리스 및 유지보수 상태](https://developer.android.com/jetpack/androidx/releases/recyclerview)
- [Android Developers — Android is Compose-first](https://developer.android.com/develop/ui/compose/first)
- [Android Developers — Lazy 목록과 그리드](https://developer.android.com/develop/ui/compose/lists?hl=ko)

> 이 문서는 소스 구조와 실행 흐름을 정리한 학습자료이다. 예시 개선 코드는 별도로 표시했으며, GitHub 원본 파일은 수정하지 않았다.
