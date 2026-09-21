## 파이썬과 한눈에 비교

| Kotlin | Python에서 가까운 표현 | 기억할 점 |
| --- | --- | --- |
| `val x = 1` | 직접 대응 없음 | `x`에 다른 값을 다시 대입할 수 없음 |
| `var x = 1` | `x = 1` | 나중에 `x = 2` 가능 |
| `listOf("a", "b")` | 튜플 `("a", "b")`에 가까움 | 읽기 전용 `List`; 튜플과 완전히 같지는 않음 |
| `mutableListOf("a", "b")` | 리스트 `["a", "b"]` | `add()` ≈ `append()` |
| `mapOf("Kim" to 100)` | 딕셔너리 `{"Kim": 100}`에 가까움 | 읽기 전용 `Map`; 항목 수정 API가 없음 |
| `mutableMapOf("Kim" to 100)` | 딕셔너리 `{"Kim": 100}` | 키의 값을 추가·변경할 수 있음 |
| `data class Person(...)` | `@dataclass` | 값 비교, 출력, 복사 기능을 자동 생성 |
| `String?`와 `?.` | `str | None`과 null 검사 | null 가능 여부를 타입으로 표현 |

### `Map`, `mapOf`, `HashMap`은 같은 말일까?

- `Map<K, V>`는 **키 → 값**을 읽는 기능을 정의한 타입입니다. 파이썬의 `dict`와 비슷한 용도로 씁니다.
- `mapOf(...)`는 읽기 전용 `Map`을 만드는 함수입니다. 항목을 바꾸고 싶다면 `mutableMapOf(...)`를 씁니다.
- `HashMap`은 맵을 구현한 **구체적인 자료구조**입니다. `mapOf(...)`가 항상 `HashMap`을 만든다고 생각하면 안 됩니다. `HashMap`의 순회 순서에도 기대지 않는 것이 좋습니다.

## 1. 변수와 null

```kotlin
val courseName = "Mobile Programming"
var week = 2
week = 3

var nickname: String? = null
nickname = "mirae"
println(nickname?.length) // 5
```

- `val`은 변수에 **다시 대입할 수 없음**, `var`는 **다시 대입 가능**을 뜻합니다.
- `String`에는 `null`을 넣을 수 없고, `String?`에는 넣을 수 있습니다.
- `nickname?.length`는 `nickname`이 `null`이면 오류 대신 `null`을 돌려줍니다. 결과 타입은 `Int?`입니다.
- `val mutableFruits = mutableListOf(...)`처럼 `val`로 선언해도, **변수가 가리키는 리스트의 항목**은 변경할 수 있습니다.

```python
nickname: str | None = None
nickname = "mirae"
print(len(nickname) if nickname is not None else None)
```

## 2. 함수와 인자

```kotlin
fun printAll(vip: Boolean, name: String) {
    println("$vip, $name")
}

fun printMany(vararg msg: String) {
    for (m in msg) println(m)
}

fun greet(name: String): String = "Hello, $name!"
fun add(a: Int, b: Int) = a + b
fun introduce(name: String, age: Int = 19) {
    println("My name is $name and I'm $age years old")
}

printAll(vip = true, name = "dy")
printMany("A", "B", "C", "D")
introduce("Park") // age의 기본값 19 사용
```

- 선언할 때 `name: String`은 **매개변수 이름: 타입**입니다.
- 호출할 때 `name = "dy"`는 **이름을 지정해 값 전달**입니다. 호출 위치에 `name: "dy"`라고 쓰면 문법 오류입니다.
- `vararg`는 **개수가 달라질 수 있는 인자**입니다. 파이썬의 `*args`와 비슷하며, `var`(재대입 가능한 변수)와는 다른 개념입니다.
- `age: Int = 19`는 기본 인자입니다. `fun add(...) = a + b`는 본문이 한 식일 때의 짧은 표현입니다.

## 3. 클래스와 데이터 클래스

```kotlin
class Student {
    var name: String = ""
    var age: Int = 0

    fun introduce() {
        println("Hi, I'm $name and I'm $age years old")
    }
}

val student1 = Student()
student1.name = "Mirae"
student1.age = 21
student1.introduce()

data class Person(val name: String, val age: Int)
val person1 = Person(name = "Kim", age = 23)
println(person1)      // Person(name=Kim, age=23)
println(person1.name) // Kim
```

- `Student()`는 객체 생성이고, `student1.introduce()`는 그 객체의 함수를 호출합니다.
- `student1`이 `val`이어도 속성 `name`과 `age`는 `var`라서 바꿀 수 있습니다.
- `data class`는 생성자에 적은 속성을 바탕으로 `toString()`, `equals()`, `hashCode()`, `copy()` 등을 자동 생성합니다. `println(person1)`은 `toString()` 결과를 출력합니다.
- 여기서 `Person`의 속성은 `val`이므로 생성 후 직접 변경할 수 없습니다. `person1.copy(age = 24)`는 값을 바꾼 **새 객체**를 만듭니다.
- 원본 코드처럼 클래스를 `week04Classes()` 함수 안에 선언하면 그 클래스는 해당 함수 안에서만 보입니다.

파이썬의 `@dataclass`가 `data class`와 비슷한 역할을 하지만, 두 언어의 생성 기능과 변경 규칙이 완전히 동일하지는 않습니다.

### 생성자: 주생성자와 부생성자

**생성자**는 `Animal(...)`처럼 클래스로 새 객체를 만들 때 실행됩니다. 코틀린에서는 Java의 `new` 없이 클래스 이름을 호출합니다. 아래 예제는 기존 `week04Classes()` 함수의 **본문에 합쳐서** 사용하세요. 같은 이름의 함수를 또 선언하면 중복 오류가 납니다.

```kotlin
// 파일 위쪽에 필요: import android.util.Log
class Animal(var species: String) { // 주생성자
    var weight: Double = 0.0

    constructor(species: String, weight: Double) : this(species) { // 부생성자
        this.weight = weight
        Log.d("KotlinWeek04", "$species 의 무게 : $weight kg")
    }

    fun makeSound() {
        Log.d("KotlinWeek04", "$species 가 소리를 냅니다.")
    }
}

val puppy = Animal("웰시코기", 10.5)
puppy.makeSound()
val puppy2 = Animal("골든리트리버")
```

| 부분 | 뜻 |
| --- | --- |
| `class Animal(var species: String)` | 클래스 이름 옆의 **주생성자**. `var`가 붙어 `species`는 변경 가능한 객체 속성이 됩니다. |
| `var weight: Double = 0.0` | 객체 속성 `weight`의 초기값은 `0.0`입니다. |
| `constructor(species: String, weight: Double)` | 인자 두 개로 만들 때 사용하는 **부생성자**입니다. |
| `: this(species)` | 부생성자에서 주생성자로 전달합니다. 주생성자가 먼저 실행됩니다. |
| `this.weight = weight` | 왼쪽은 **객체의 속성**, 오른쪽은 **부생성자의 매개변수**입니다. |
| `fun makeSound()` | 객체 생성 후 `puppy.makeSound()`로 호출하는 함수입니다. |

`Animal("웰시코기", 10.5)`는 **부생성자 → 주생성자 → 부생성자 본문**의 흐름으로 초기화됩니다. 따라서 `weight`가 `0.0`으로 초기화된 뒤 `10.5`로 바뀌고, 무게 로그가 출력됩니다. `Animal("골든리트리버")`는 주생성자만 사용하므로 `weight`는 `0.0`이고 부생성자 안의 무게 로그는 출력되지 않습니다. `puppy2.makeSound()`는 코드에서 호출하지 않았으므로 두 번째 동물의 소리 로그도 아직 없습니다.

주생성자에서 실행할 코드가 필요하면 클래스 본문의 `init { ... }`를 사용합니다. 부생성자를 호출한 경우에도 주생성자와 속성 초기화·`init` 블록이 먼저 실행됩니다. 파이썬에서는 보통 `__init__(self, species, weight=0.0)`처럼 **기본 인자**로 여러 생성 방식을 표현합니다. 코틀린에서도 이 예제의 단순한 값 설정만 필요하다면 `class Animal(var species: String, var weight: Double = 0.0)`으로 줄일 수 있습니다. 다만 이 방식은 원래 부생성자 안의 무게 로그를 자동으로 출력하지 않습니다.

`Log.d`는 Android Logcat에 디버그 로그를 남깁니다. 앱을 실행한 뒤 Logcat에서 `tag:KotlinWeek04`를 검색하세요. `println`을 찾는 `tag:System.out`과는 **다른 태그**입니다.

## 4. 리스트와 맵

```kotlin
val fruits = listOf("apple", "banana", "orange")
val mutableFruits = mutableListOf("kiwi", "watermelon")

// fruits.add("kiwi") // 읽기 전용 List에는 add()가 없음
mutableFruits.add("banana")
println(mutableFruits) // [kiwi, watermelon, banana]

val scores = mapOf("Kim" to 100, "Park" to 96, "Lee" to 97)
println(scores["Kim"]) // 100

val mutableScores = mutableMapOf("Kim" to 100)
mutableScores["Park"] = 96
```

- `listOf`는 읽기 전용 `List`를, `mutableListOf`는 항목을 추가·삭제할 수 있는 `MutableList`를 만듭니다. **읽기 전용은 내부 데이터가 절대 바뀌지 않는다는 보장과 다릅니다.**
- `mapOf`는 읽기 전용 `Map`을 만듭니다. `"Kim" to 100`의 `to`는 키와 값을 한 쌍(`Pair`)으로 묶습니다.
- `scores["Kim"]`은 키 `"Kim"`의 값을 읽습니다. 키가 없으면 `null`이 나옵니다.

```python
fruits = ("apple", "banana", "orange")  # listOf와 유사하지만 동일하지 않음
mutable_fruits = ["kiwi", "watermelon"]
mutable_fruits.append("banana")

scores = {"Kim": 100, "Park": 96, "Lee": 97}
print(scores["Kim"])
```

파이썬 `dict`는 기본적으로 수정 가능하므로 Kotlin에서는 `mutableMapOf` 쪽이 더 가깝습니다. `mapOf`는 딕셔너리처럼 조회하지만 항목 수정 기능을 노출하지 않습니다.

## 5. 반복문과 `forEach`

```kotlin
for (fruit in mutableFruits) {
    println("I like $fruit")
}

fruits.forEach { fruit -> println(fruit) }
scores.forEach { (name, score) -> println("$name scored $score") }
```

- `for (fruit in mutableFruits)`는 파이썬 `for fruit in mutable_fruits:`와 비슷합니다.
- `forEach { fruit -> ... }`에서 `{ ... }`는 **람다 함수**, `fruit`는 현재 항목, `->` 뒤는 실행할 코드입니다.
- 맵의 `(name, score)`는 각 항목을 **키와 값으로 구조 분해**한 것입니다. 파이썬의 `for name, score in scores.items():`와 비슷합니다.
- `"I like $fruit"`는 문자열 템플릿입니다. 속성이나 계산식은 `${person1.age}`처럼 중괄호로 묶습니다.

```python
for fruit in mutable_fruits:
    print(f"I like {fruit}")

for name, score in scores.items():
    print(f"{name} scored {score}")
```
