# Week 07 — ListView와 Git 브랜치 통합

이번 수업에서는 하나의 화면에서 여러 기능을 전환하는 앱을 만들었다. 핵심은 기능마다 화면을 새로 만드는 것이 아니라, 공통 `ListView`에 서로 다른 데이터와 어댑터를 연결하는 것이다.

현재 `week07/shopping-cart` 브랜치에는 다음 두 기능이 구현되어 있다.

- Student List: 학생 목록 관리
- Shopping Cart: 장바구니 관리

Task Manager는 별도 브랜치에서 개발한 뒤 세 기능을 통합하는 다음 단계의 수업 내용이다.

## 앱의 전체 구조

```text
RadioButton 선택
        ↓
AppMode 변경
        ↓
입력 UI와 버튼 문구 변경
        ↓
ListView에 현재 모드의 Adapter 연결
        ↓
추가·선택·삭제 동작을 현재 모드에 맞게 처리
```

각 기능은 같은 화면을 사용하지만 저장하는 데이터와 처리 방법은 다르다.

| 모드 | 저장 데이터 | 입력값 | 짧게 누르기 | 길게 누르기 |
| --- | --- | --- | --- | --- |
| Student List | `ArrayList<Student>` | 학생 이름 | 선택한 학생 표시 | 학생 삭제 |
| Shopping Cart | `ArrayList<CartItem>` | 상품명, 가격, 수량 | 상품 상세 정보 표시 | 상품 삭제 |
| Task Manager | `ArrayList<Task>` | 할 일, 우선순위 | 완료 상태 변경 | 작업 삭제 |

## 1. 데이터 클래스

`data class`는 데이터를 저장하기 위한 클래스를 간단하게 선언할 때 사용한다. 일반 클래스와 달리 `toString()`, `equals()`, `hashCode()`, `copy()` 같은 함수가 자동으로 만들어진다.

### Student

```kotlin
data class Student(
    val name: String,
    val id: String = UUID.randomUUID().toString(),
    val addedDate: Date = Date()
)
```

- `name`: 학생 이름
- `id`: 학생을 구분하는 고유값
- `addedDate`: 학생이 추가된 시간
- `UUID.randomUUID()`: 이름이 같아도 서로 다른 객체를 구분할 수 있는 ID 생성
- `Date()`: 객체가 만들어진 시점의 날짜와 시간 저장

### CartItem

```kotlin
data class CartItem(
    val name: String,
    var quantity: Int = 1,
    val price: Double,
    val id: String = UUID.randomUUID().toString(),
    val addedDate: Date = Date()
) {
    fun getTotalPrice(): Double = quantity * price
}
```

장바구니 한 항목의 총가격은 다음과 같이 계산한다.

```text
총가격 = 수량 × 단가
Apple 3개 × $2.00 = $6.00
```

`fun getTotalPrice(): Double = quantity * price`는 중괄호와 `return`을 생략한 단일 표현식 함수다.

`quantity`는 상품을 다시 추가할 때 값이 변하므로 `var`로 선언한다. 반면 상품명, 단가, ID처럼 생성 후 유지할 값은 `val`로 선언한다.

### toString() 재정의

`ArrayAdapter`는 객체를 목록에 표시할 때 객체의 `toString()` 결과를 사용한다.

```kotlin
override fun toString(): String {
    return "$name (x$quantity) - $totalPrice"
}
```

따라서 `CartItem`의 `toString()`을 재정의하면 목록에 객체 주소 대신 다음과 같이 필요한 정보를 보여줄 수 있다.

```text
Apple (x3) - $6.00
```

### Task와 nullable 타입

수업에서 다음 통합 단계의 모델도 미리 살펴봤다.

```kotlin
data class Task(
    val description: String,
    var isCompleted: Boolean = false,
    val priority: TaskPriority = TaskPriority.MEDIUM,
    val dueDate: Date? = null,
    val id: String = UUID.randomUUID().toString(),
    val createdDate: Date = Date()
)
```

- `isCompleted`: 작업의 완료 여부를 `true` 또는 `false`로 저장한다.
- `priority`: `HIGH`, `MEDIUM`, `LOW` 중 하나를 저장한다.
- `dueDate`: 마감일이 아직 없을 수 있으므로 `Date?`로 선언한다.
- 타입 뒤의 `?`는 `null`을 저장할 수 있다는 뜻이다.

## 2. enum class

`enum class`는 정해진 값 중 하나만 선택하도록 제한할 때 사용한다.

```kotlin
enum class AppMode(val displayName: String) {
    STUDENT_LIST("Student List"),
    SHOPPING_CART("Shopping Cart")
}
```

문자열로 모드를 관리하면 오타가 발생할 수 있지만, `AppMode`를 사용하면 선언된 값만 사용할 수 있다.

다음 통합 단계에서는 `TASK_MANAGER`가 추가된다.

작업 우선순위도 같은 방식으로 표현할 수 있다.

```kotlin
enum class TaskPriority {
    HIGH,
    MEDIUM,
    LOW
}
```

이렇게 만들면 우선순위에는 `HIGH`, `MEDIUM`, `LOW` 중 하나만 저장된다.

## 3. lateinit과 View 연결

Kotlin 변수는 선언할 때 초기값이 필요하다. 하지만 Android의 View는 `setContentView()`를 실행한 뒤에 `findViewById()`로 연결해야 한다.

```kotlin
private lateinit var buttonAdd: Button

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)

    buttonAdd = findViewById(R.id.buttonAdd)
}
```

`lateinit`은 “지금은 값을 넣지 않지만 사용하기 전에 초기화하겠다”는 뜻이다.

주의할 점:

- `lateinit`은 `var`에만 사용할 수 있다.
- 실제 값이 연결되기 전에 접근하면 `UninitializedPropertyAccessException`이 발생한다.
- 이 앱에서는 `setupViews()`에서 모든 View를 연결한다.

## 4. ArrayList와 ArrayAdapter

앱의 데이터는 `ArrayList`에 저장하고, `ArrayAdapter`가 데이터를 `ListView`에 표시한다.

```text
ArrayList<Student>
        ↓
ArrayAdapter<Student>
        ↓
ListView
```

```kotlin
studentList = ArrayList()

studentAdapter = ArrayAdapter(
    this,
    android.R.layout.simple_list_item_1,
    studentList
)

listView.adapter = studentAdapter
```

목록의 데이터만 바꾸면 화면이 자동으로 갱신되지 않는다. 데이터 변경 후 어댑터에 변경 사실을 알려야 한다.

```kotlin
studentList.add(Student("KIM"))
studentAdapter.notifyDataSetChanged()
```

삭제할 때도 같은 순서다.

```kotlin
studentList.removeAt(position)
studentAdapter.notifyDataSetChanged()
```

## 5. 하나의 ListView를 여러 기능이 공유하는 방법

Student List와 Shopping Cart는 같은 `ListView`를 사용한다. 모드가 바뀔 때 연결되는 어댑터만 교체한다.

```kotlin
when (mode) {
    AppMode.STUDENT_LIST -> {
        listView.adapter = studentAdapter
    }

    AppMode.SHOPPING_CART -> {
        listView.adapter = cartAdapter
    }
}
```

데이터 형태가 다르므로 어댑터도 각각 필요하다.

- `studentAdapter`는 `Student` 목록과 연결된다.
- `cartAdapter`는 `CartItem` 목록과 연결된다.
- 화면의 `ListView`는 하나지만 선택한 모드에 따라 다른 목록이 표시된다.

## 6. when을 이용한 모드별 처리

추가, 전체 삭제, 항목 선택 같은 동작은 버튼과 `ListView`를 함께 사용한다. 각 이벤트에서 `currentMode`를 확인해 실행할 기능을 결정한다.

```kotlin
when (currentMode) {
    AppMode.STUDENT_LIST -> addStudent(input)
    AppMode.SHOPPING_CART -> addCartItem(input)
}
```

이 구조를 사용하면 같은 버튼을 여러 기능에서 재사용할 수 있다.

모드를 바꿀 때 함께 변경되는 항목:

- 입력창의 안내 문구
- 추가 버튼의 문구
- 가격·수량 입력창의 표시 여부
- `ListView`에 연결되는 어댑터
- 학생 수 또는 장바구니 합계 정보

## 7. 클릭과 길게 누르기

### 짧게 누르기

```kotlin
listView.setOnItemClickListener { _, _, position, _ ->
    handleItemClick(position)
}
```

- 학생 모드: 선택한 학생 이름 표시
- 장바구니 모드: 상품명, 수량, 단가, 총가격, 추가 날짜 표시
- Task Manager 통합 후: 작업의 완료·미완료 상태 변경

### 길게 누르기

```kotlin
listView.setOnItemLongClickListener { _, _, position, _ ->
    handleItemLongClick(position)
    true
}
```

길게 누르면 삭제 확인 대화상자를 표시한다. 마지막에 `true`를 반환하면 길게 누르기 이벤트를 처리했다는 뜻이다.

## 8. 입력값 검증

잘못된 값이 목록에 추가되지 않도록 실제 추가 작업 전에 검사한다.

학생 목록에서 확인할 내용:

- 이름이 비어 있는가?
- 같은 이름의 학생이 이미 있는가?

장바구니에서 확인할 내용:

- 상품명이 비어 있는가?
- 가격을 `Double`로 변환할 수 있는가?
- 수량을 `Int`로 변환할 수 있는가?
- 가격과 수량이 0보다 큰가?

```kotlin
val price = priceText.toDoubleOrNull() ?: run {
    showToast("Invalid price format")
    return
}
```

`toDoubleOrNull()`은 변환에 실패해도 앱을 종료시키지 않고 `null`을 반환한다. 잘못된 입력을 처리하기에 적합하다.

## 9. 장바구니 합계 계산

장바구니는 상품 종류 수가 아니라 각 상품의 수량 합계를 표시한다.

```kotlin
val totalItems = cartItemList.sumOf { it.quantity }
val totalValue = cartItemList.sumOf { it.getTotalPrice() }
```

예시:

| 상품 | 수량 | 단가 | 항목 합계 |
| --- | ---: | ---: | ---: |
| Apple | 3 | $2.00 | $6.00 |
| Banana | 2 | $1.00 | $2.00 |
| Milk | 1 | $3.00 | $3.00 |
| 합계 | 6개 |  | $11.00 |

같은 상품을 다시 추가하면 새로운 항목을 만드는 대신 기존 수량을 증가시킨다.

```kotlin
val existingItem = cartItemList.find { it.name == name }

if (existingItem != null) {
    existingItem.quantity += quantity
} else {
    cartItemList.add(CartItem(name, quantity, price))
}
```

## 10. 앱 실행 흐름

`onCreate()`에서 실행되는 순서는 다음과 같다.

```text
onCreate()
 ├─ initializeData()   : 비어 있는 ArrayList 생성
 ├─ setupViews()       : XML View와 Kotlin 변수 연결
 ├─ setupAdapters()    : ArrayList와 Adapter 연결
 ├─ setupListeners()   : 버튼과 ListView 이벤트 등록
 ├─ addInitialData()   : KIM, LEE, PARK와 기본 상품 추가
 └─ setMode()          : 시작 모드를 Student List로 설정
```

초기 데이터를 먼저 넣고 시작 모드를 설정해야 첫 화면의 학생 수가 실제 목록과 일치한다.

## 11. Git 기능 브랜치 실습

이번 수업에서는 한 사람이 모든 기능을 한 번에 만드는 대신 기능별 개발자가 따로 작업하는 상황을 연습했다.

```text
main
 ├─ week07/shopping-cart
 └─ week07/task-manager
          ↓
     integration
          ↓
        main
```

새 브랜치를 만들면서 바로 이동하는 명령:

```bash
git checkout -b week07/shopping-cart
```

브랜치를 원격 저장소에 처음 올릴 때:

```bash
git push --set-upstream origin week07/shopping-cart
```

기능 브랜치에서는 다른 브랜치의 코드가 자동으로 보이지 않는다. 기능을 합치려면 `merge` 과정이 필요하다.

### 통합할 때 예상되는 충돌

- `DataModels.kt`: 서로 다른 데이터 클래스가 같은 파일에 추가됨
- `MainActivity.kt`: 같은 함수 안에 기능별 코드가 추가됨
- `activity_main.xml`: 여러 개발자가 같은 화면 요소를 수정함
- `strings.xml`, `colors.xml`: 같은 리소스 파일을 수정함
- `import`: 서로 다른 클래스가 추가됨

충돌 해결의 핵심은 한쪽 코드를 무조건 선택하는 것이 아니라, 두 기능에 필요한 코드를 모두 남겨 세 기능이 함께 동작하도록 만드는 것이다.

## 핵심 정리

- `data class`는 앱에서 사용할 데이터의 구조를 정의한다.
- `enum class`는 사용할 수 있는 상태를 정해진 값으로 제한한다.
- `lateinit`은 Android View처럼 나중에 연결되는 변수를 선언할 때 사용한다.
- `ArrayList`가 데이터를 저장하고 `ArrayAdapter`가 데이터를 화면에 연결한다.
- 데이터 변경 후 `notifyDataSetChanged()`를 호출해야 목록이 갱신된다.
- 하나의 `ListView`도 어댑터를 교체하면 여러 기능에서 공유할 수 있다.
- `when`으로 현재 모드에 맞는 추가·선택·삭제 동작을 실행한다.
- 짧은 클릭과 긴 클릭에 서로 다른 기능을 연결할 수 있다.
- 입력값은 `toIntOrNull()`, `toDoubleOrNull()` 등으로 안전하게 검사한다.
- 기능별 브랜치를 합칠 때 코드와 리소스 충돌을 함께 해결해야 한다.

## 복습 질문

1. `Student`와 `CartItem`을 일반 클래스가 아닌 `data class`로 만든 이유는 무엇인가?
2. `CartItem.getTotalPrice()`는 어떤 값을 반환하는가?
3. `ListView`와 `ArrayList` 사이에서 `ArrayAdapter`가 하는 역할은 무엇인가?
4. 목록을 수정한 뒤 `notifyDataSetChanged()`가 필요한 이유는 무엇인가?
5. 하나의 `ListView`가 학생과 장바구니 데이터를 번갈아 표시할 수 있는 이유는 무엇인가?
6. `lateinit` 변수에 값이 들어가기 전에 접근하면 어떻게 되는가?
7. 짧은 클릭과 긴 클릭은 각각 어떤 리스너로 처리하는가?
8. 기능 브랜치를 통합할 때 `DataModels.kt`에서 충돌이 발생하는 이유는 무엇인가?
