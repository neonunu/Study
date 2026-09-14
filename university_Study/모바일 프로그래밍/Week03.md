## 1. 변수 선언: `val`과 `var`

| 키워드 | 의미 | 다시 대입할 수 있나요? |
| --- | --- | --- |
| `val` | 읽기 전용 변수 | 아니요 |
| `var` | 변경 가능한 변수 | 네 |

```kotlin
val courseName = "Mobile Programming"
// courseName = "DataStructure" // 컴파일 오류: val은 다시 대입할 수 없음

var week = 2
week = 3 // 가능

println("Course : $courseName")
println("Week : $week")
```

`val`은 Java의 `final` 변수와 비슷하지만, 가리키는 객체의 내용까지 반드시 불변으로 만드는 것은 아닙니다. 예를 들어 `val list = mutableListOf(1)`에서 `list.add(2)`는 가능합니다.

### 타입 추론과 명시적 타입

Kotlin은 초기값을 보고 타입을 추론할 수 있습니다. 타입을 직접 적을 때는 `이름: 타입` 순서를 사용합니다.

```kotlin
val name = "Android"        // String으로 추론
var version = 8             // Int로 추론

val age: Int = 24
val height: Double = 177.7
val isStudent: Boolean = false

println("Hi $name $version")
println("Age: $age, Height: $height, Student: $isStudent")
```

`version`은 `Int`로 추론되므로 이후 다른 정수로 바꿀 수는 있지만 문자열을 넣을 수는 없습니다.

### 문자열 템플릿

문자열 안에서 `$변수명`으로 변수를 넣고, `${표현식}`으로 계산 결과를 넣습니다.

```kotlin
println("Week : $week")
println("Next week : ${week + 1}")
```

## 2. null을 허용하는 타입

Kotlin의 `String`에는 `null`을 넣을 수 없습니다. `null`이 필요하면 타입 뒤에 `?`를 붙입니다.

```kotlin
// var nickname: String = null // 컴파일 오류

var nickname: String? = null
nickname = "mirae"

println("Nickname: $nickname ${nickname?.length}")
```

`nickname?.length`는 **안전 호출**입니다. `nickname`이 문자열이면 길이를 구하고, `null`이면 오류 대신 `null`을 반환합니다. 위 예제에서는 `mirae`의 길이인 `5`가 출력됩니다.

## 3. 함수 정의

Kotlin에서는 `fun`으로 함수를 만듭니다. 매개변수는 `이름: 타입`, 반환 타입은 매개변수 목록 뒤의 `: 타입`으로 적습니다.

```kotlin
fun greet(name: String): String {
    return "Hello, $name!"
}

println(greet("Kotlin")) // Hello, Kotlin!
```

### 식 본문 함수

함수가 하나의 식을 반환한다면 `=`으로 짧게 쓸 수 있습니다. 아래 함수의 반환 타입 `Int`는 자동으로 추론됩니다.

```kotlin
fun add(a: Int, b: Int) = a + b

println("Sum: ${add(5, -71)}") // Sum: -66
```

### 기본 매개변수

매개변수에 기본값을 지정하면 호출할 때 그 인수를 생략할 수 있습니다.

```kotlin
fun introduce(name: String, age: Int = 19) {
    println("My name is $name and I'm $age years old")
}

introduce("Kim", 7)  // age = 7
introduce("Park")    // age = 19
```

`greet`, `add`, `introduce`처럼 함수를 다른 함수 **안에서** 선언할 수도 있습니다. 이 경우 그 함수 안에서만 사용할 수 있는 지역 함수가 됩니다.

## 4. 전체 예제

```kotlin
private fun week03Variables() {
    println("Week 03 : Variables")

    val courseName = "Mobile Programming"
    var week = 2
    week = 3

    println("Course : $courseName")
    println("Week : $week")
    println("========= Kotlin Variables =========")

    val name = "Android"
    var version = 8
    println("Hi $name $version")

    val age: Int = 24
    val height: Double = 177.7
    val isStudent: Boolean = false
    println("Age: $age, Height: $height, Student: $isStudent")

    var nickname: String? = null
    nickname = "mirae"
    println("Nickname: $nickname ${nickname?.length}")
}

private fun week03Functions() {
    println("========= Kotlin Functions =========")

    fun greet(name: String): String {
        return "Hello, $name!"
    }

    fun add(a: Int, b: Int) = a + b

    fun introduce(name: String, age: Int = 19) {
        println("My name is $name and I'm $age years old")
    }

    println(greet("Kotlin"))
    println("Sum: ${add(5, -71)}")
    introduce("Kim", 7)
    introduce("Park")
}
```

### 실행 결과

```text
Week 03 : Variables
Course : Mobile Programming
Week : 3
========= Kotlin Variables =========
Hi Android 8
Age: 24, Height: 177.7, Student: false
Nickname: mirae 5
========= Kotlin Functions =========
Hello, Kotlin!
Sum: -66
My name is Kim and I'm 7 years old
My name is Park and I'm 19 years old
```

Android 앱에서 실행할 때는 `MainActivity`의 `onCreate()`에서 `week03Variables()`와 `week03Functions()`를 호출합니다. `println()` 결과는 앱 화면이 아닌 Android Studio의 **Logcat**에서 확인할 수 있습니다. Logcat 검색창에 `tag:System.out`을 입력해 보세요.
