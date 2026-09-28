# Week 05 Android 앱

구구단 출력과 이름 기반 인사 기능을 다루는 Android 실습 모음

## 1. 구구단 앱

숫자 입력 후 1부터 9까지의 곱셈 결과를 출력하는 Android 애플리케이션

### 주요 기능

- 구구단 단 입력
- 빈 값과 잘못된 숫자 입력 검증
- 버튼 클릭 기반 결과 계산
- `TextView`를 통한 1~9단 출력
- `Toast`를 통한 입력 오류 안내

### 기술 구성

- **언어**: Kotlin
- **UI**: XML Layout
- **화면 구성**: `LinearLayout`
- **입력 컴포넌트**: `EditText`
- **동작 컴포넌트**: `Button`
- **출력 컴포넌트**: `TextView`

### 프로젝트 구조

```text
AppWeek05/
└── app/
    └── src/
        └── main/
            ├── java/
            │   └── com/
            │       └── appweek05/
            │           └── MainActivity.kt
            └── res/
                └── layout/
                    └── activity_main.xml
```

### 파일 연계

| Kotlin 코드 | XML 선언 | 역할 |
|---|---|---|
| `R.layout.activity_main` | `activity_main.xml` | Activity와 화면 레이아웃 연결 |
| `R.id.etDan` | `android:id="@+id/etDan"` | 구구단 숫자 입력 |
| `R.id.btnCalculate` | `android:id="@+id/btnCalculate"` | 계산 동작 실행 |
| `R.id.tvResult` | `android:id="@+id/tvResult"` | 계산 결과 출력 |

### 연결 핵심 개념

**`@+id/이름`**: XML에서 새로운 View ID 생성

**`R.id.이름`**: Kotlin에서 XML의 View ID 참조

**`R.layout.activity_main`**: `res/layout/activity_main.xml` 레이아웃 참조

**`findViewById<T>()`**: XML View를 Kotlin 객체로 연결

```text
XML: android:id="@+id/etDan"
                    ↓
Android 빌드 과정에서 R.id.etDan 생성
                    ↓
Kotlin: findViewById<EditText>(R.id.etDan)
```

### 동작 흐름

```text
activity_main.xml 화면 표시
        ↓
etDan에 숫자 입력
        ↓
btnCalculate 클릭
        ↓
MainActivity에서 입력값 검증
        ↓
1~9 곱셈 결과 생성
        ↓
tvResult에 결과 출력
```

### Kotlin 코드

**파일 경로**: `app/src/main/java/com/appweek05/MainActivity.kt`

```kotlin
package com.appweek05

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // [연결 0]
        // 대상 XML: res/layout/activity_main.xml
        // 역할: XML 레이아웃을 MainActivity의 화면으로 지정
        setContentView(R.layout.activity_main)

        // [연결 1]
        // 대상 XML ID: @+id/etDan
        // 역할: 사용자가 단을 입력하는 EditText 참조
        val editTextDan = findViewById<EditText>(R.id.etDan)

        // [연결 2]
        // 대상 XML ID: @+id/btnCalculate
        // 역할: 구구단 계산을 시작하는 Button 참조
        val buttonCalculate = findViewById<Button>(R.id.btnCalculate)

        // [연결 3]
        // 대상 XML ID: @+id/tvResult
        // 역할: 계산 결과를 표시하는 TextView 참조
        val textViewResult = findViewById<TextView>(R.id.tvResult)

        // [연결 2 사용]
        // btnCalculate 클릭 시 중괄호 내부 코드 실행
        buttonCalculate.setOnClickListener {

            // [연결 1 사용]
            // etDan에 입력된 텍스트를 정수로 변환
            val dan = editTextDan.text
                .toString()
                .trim()
                .toIntOrNull()

            // 숫자 변환 실패 시 안내 메시지 출력
            if (dan == null) {
                Toast.makeText(
                    this,
                    "숫자 입력 필요",
                    Toast.LENGTH_SHORT
                ).show()

                return@setOnClickListener
            }

            // 입력받은 단의 1~9 곱셈 결과 생성
            val result = buildString {
                for (number in 1..9) {
                    appendLine("$dan × $number = ${dan * number}")
                }
            }

            // [연결 3 사용]
            // 계산 결과를 tvResult에 출력
            textViewResult.text = result.trimEnd()
        }
    }
}
```

### Kotlin 코드 설명

| 코드 | 역할 | XML 연계 |
|---|---|---|
| `setContentView(R.layout.activity_main)` | Activity 화면 지정 | `activity_main.xml` 전체 |
| `findViewById<EditText>(R.id.etDan)` | 입력 필드 참조 획득 | `@+id/etDan` |
| `findViewById<Button>(R.id.btnCalculate)` | 버튼 참조 획득 | `@+id/btnCalculate` |
| `findViewById<TextView>(R.id.tvResult)` | 결과 영역 참조 획득 | `@+id/tvResult` |
| `setOnClickListener` | 버튼 클릭 이벤트 등록 | `btnCalculate` |
| `editTextDan.text` | 입력 필드의 현재 문자열 획득 | `etDan` |
| `trim()` | 문자열 앞뒤 공백 제거 | 입력값 전처리 |
| `toIntOrNull()` | 문자열의 안전한 정수 변환 | 잘못된 입력 시 `null` 반환 |
| `return@setOnClickListener` | 현재 클릭 이벤트만 종료 | 잘못된 입력 처리 |
| `buildString` | 출력용 문자열 묶음 생성 | 구구단 결과 준비 |
| `for (number in 1..9)` | 1부터 9까지 반복 | 구구단 계산 |
| `appendLine(...)` | 계산 결과 한 줄 추가 | 결과 문자열 생성 |
| `textViewResult.text = ...` | 완성된 문자열 표시 | `tvResult` |

### XML 코드

**파일 경로**: `app/src/main/res/layout/activity_main.xml`

**XML 주석 형식**: `//` 대신 `<!-- 설명 -->` 사용

```xml
<?xml version="1.0" encoding="utf-8"?>

<!--
    [연결 0]
    파일: activity_main.xml
    역할: MainActivity에 표시할 전체 화면 구성
    MainActivity.kt 연결 코드:
    setContentView(R.layout.activity_main)
-->
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center_horizontal"
    android:padding="20dp">

    <!--
        [연결 1]
        ID: etDan
        역할: 사용자에게 구구단의 단을 입력받는 영역
        MainActivity.kt 연결 코드:
        val editTextDan = findViewById<EditText>(R.id.etDan)
    -->
    <EditText
        android:id="@+id/etDan"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="단 입력 (예: 5)"
        android:inputType="number"
        android:minHeight="48dp" />

    <!--
        [연결 2]
        ID: btnCalculate
        역할: 입력값 계산을 시작하는 버튼
        MainActivity.kt 연결 코드:
        val buttonCalculate = findViewById<Button>(R.id.btnCalculate)
        MainActivity.kt 사용 코드:
        buttonCalculate.setOnClickListener { ... }
    -->
    <Button
        android:id="@+id/btnCalculate"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="15dp"
        android:text="구구단 출력" />

    <!--
        [연결 3]
        ID: tvResult
        역할: MainActivity에서 만든 구구단 결과 출력
        MainActivity.kt 연결 코드:
        val textViewResult = findViewById<TextView>(R.id.tvResult)
        MainActivity.kt 사용 코드:
        textViewResult.text = result.trimEnd()
    -->
    <TextView
        android:id="@+id/tvResult"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="20dp"
        android:gravity="center"
        android:lineSpacingMultiplier="1.2"
        android:text="단 입력 후 버튼 클릭!"
        android:textSize="20sp" />

</LinearLayout>
```

### XML 속성 설명

#### `LinearLayout`

| 속성 | 값 | 역할 |
|---|---|---|
| `android:id` | `@+id/main` | 최상위 레이아웃 ID |
| `android:layout_width` | `match_parent` | 부모 영역의 전체 너비 사용 |
| `android:layout_height` | `match_parent` | 부모 영역의 전체 높이 사용 |
| `android:orientation` | `vertical` | 하위 View의 세로 배치 |
| `android:gravity` | `center_horizontal` | 하위 View의 가로 중앙 정렬 |
| `android:padding` | `20dp` | 화면 내부 여백 설정 |

#### `EditText`

| 속성 | 값 | 역할 | Kotlin 연결 |
|---|---|---|---|
| `android:id` | `@+id/etDan` | 단 입력 필드 ID | `R.id.etDan` |
| `android:layout_width` | `match_parent` | 사용 가능한 전체 너비 사용 | 없음 |
| `android:layout_height` | `wrap_content` | 입력 영역 크기에 맞춘 높이 | 없음 |
| `android:hint` | `단 입력 (예: 5)` | 입력 전 안내 문구 | 없음 |
| `android:inputType` | `number` | 숫자 키보드 표시 | `toIntOrNull()` 변환 대상 |
| `android:minHeight` | `48dp` | 최소 터치 높이 확보 | 없음 |

#### `Button`

| 속성 | 값 | 역할 | Kotlin 연결 |
|---|---|---|---|
| `android:id` | `@+id/btnCalculate` | 계산 버튼 ID | `R.id.btnCalculate` |
| `android:layout_width` | `wrap_content` | 버튼 내용에 맞춘 너비 | 없음 |
| `android:layout_height` | `wrap_content` | 버튼 내용에 맞춘 높이 | 없음 |
| `android:layout_marginTop` | `15dp` | 위쪽 View와의 간격 | 없음 |
| `android:text` | `구구단 출력` | 버튼 표시 문구 | 없음 |

#### `TextView`

| 속성 | 값 | 역할 | Kotlin 연결 |
|---|---|---|---|
| `android:id` | `@+id/tvResult` | 결과 영역 ID | `R.id.tvResult` |
| `android:layout_width` | `match_parent` | 사용 가능한 전체 너비 사용 | 없음 |
| `android:layout_height` | `wrap_content` | 결과 길이에 맞춘 높이 | 없음 |
| `android:layout_marginTop` | `20dp` | 버튼과 결과 영역 사이 간격 | 없음 |
| `android:gravity` | `center` | 결과 문자열 중앙 정렬 | 없음 |
| `android:lineSpacingMultiplier` | `1.2` | 결과 행간 확대 | 없음 |
| `android:text` | `단 입력 후 버튼 클릭!` | 실행 전 기본 안내 문구 | `textViewResult.text`로 교체 |
| `android:textSize` | `20sp` | 결과 글자 크기 | 없음 |

### 핵심 연결 코드

#### 레이아웃 연결

```kotlin
setContentView(R.layout.activity_main)
```

- `res/layout/activity_main.xml`을 `MainActivity`의 화면으로 지정
- `findViewById()`보다 먼저 실행할 필수 코드

#### 입력 필드 연결

```kotlin
val editTextDan = findViewById<EditText>(R.id.etDan)
```

- XML의 `@+id/etDan`과 연결
- 사용자가 입력한 문자열 획득

#### 버튼 연결

```kotlin
val buttonCalculate = findViewById<Button>(R.id.btnCalculate)
```

- XML의 `@+id/btnCalculate`와 연결
- `setOnClickListener`를 통한 클릭 이벤트 등록

#### 결과 영역 연결

```kotlin
val textViewResult = findViewById<TextView>(R.id.tvResult)
```

- XML의 `@+id/tvResult`와 연결
- `textViewResult.text`를 통한 계산 결과 표시

### 실행 방법

1. Android Studio에서 `AppWeek05` 프로젝트 열기
2. Gradle Sync 완료 확인
3. 에뮬레이터 또는 Android 기기 선택
4. Run 버튼 실행
5. 숫자 입력 후 `구구단 출력` 버튼 선택

### 입력 예시

```text
입력: 5

출력:
5 × 1 = 5
5 × 2 = 10
5 × 3 = 15
5 × 4 = 20
5 × 5 = 25
5 × 6 = 30
5 × 7 = 35
5 × 8 = 40
5 × 9 = 45
```

### GitHub 업로드

저장소 최상위 폴더 기준 명령어

```bash
git add AppWeek05/app/src/main/java/com/appweek05/MainActivity.kt
git add AppWeek05/app/src/main/res/layout/activity_main.xml
git add AppWeek05/README.md
git commit -m "Week 05: document multiplication table app"
git push neonunu main
```

### 커밋 제외 항목

- `.gradle/`
- `build/`
- `local.properties`
- 기기별 또는 IDE별 임시 설정 파일

## 2. Greeting 앱

이름 입력 후 맞춤 인사말을 화면과 Logcat에 출력하는 Android 애플리케이션

### 주요 기능

- 사용자 이름 입력
- 입력값의 앞뒤 공백 제거
- 이름 존재 여부에 따른 인사말 분기
- 숨겨진 결과 영역 표시
- Logcat 기반 결과 확인

### 파일 연계

| Kotlin 코드 | XML 선언 | 역할 |
|---|---|---|
| `R.layout.activity_main` | `activity_main.xml` | Activity와 화면 레이아웃 연결 |
| `R.id.editTextName` | `android:id="@+id/editTextName"` | 이름 입력 |
| `R.id.buttonGreet` | `android:id="@+id/buttonGreet"` | 인사말 생성 |
| `R.id.textViewGreeting` | `android:id="@+id/textViewGreeting"` | 인사말 출력 |

### 동작 흐름

```text
activity_main.xml 화면 표시
        ↓
editTextName에 이름 입력
        ↓
buttonGreet 클릭
        ↓
MainActivity에서 공백 제거 및 입력값 확인
        ↓
이름 유무에 따른 greeting 문자열 생성
        ↓
textViewGreeting 표시 및 Logcat 출력
```

### Kotlin 코드

**파일 경로**: `app/src/main/java/com/appweek05/MainActivity.kt`

```kotlin
package com.appweek05

import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // [연결 0]
        // 대상 XML: res/layout/activity_main.xml
        // 역할: Greeting 앱의 화면을 MainActivity에 연결
        setContentView(R.layout.activity_main)

        // [연결 1]
        // 대상 XML ID: @+id/editTextName
        // 역할: 사용자가 이름을 입력하는 EditText 참조
        val editTextName = findViewById<EditText>(R.id.editTextName)

        // [연결 2]
        // 대상 XML ID: @+id/buttonGreet
        // 역할: 인사말 생성을 시작하는 Button 참조
        val buttonGreet = findViewById<Button>(R.id.buttonGreet)

        // [연결 3]
        // 대상 XML ID: @+id/textViewGreeting
        // 역할: 완성된 인사말을 표시하는 TextView 참조
        val textViewGreeting = findViewById<TextView>(R.id.textViewGreeting)

        // [연결 2 사용]
        // buttonGreet 클릭 시 인사말 생성 코드 실행
        buttonGreet.setOnClickListener {

            // [연결 1 사용]
            // editTextName의 입력값 획득 및 앞뒤 공백 제거
            val name = editTextName.text.toString().trim()

            // 입력값 존재 여부에 따른 인사말 선택
            val greeting = if (name.isNotEmpty()) {
                "안녕, ${name}님~"
            } else {
                "너의 이름은?"
            }

            // [연결 3 사용]
            // 생성한 인사말을 textViewGreeting에 적용
            textViewGreeting.text = greeting

            // XML의 visibility="gone" 상태를 visible 상태로 변경
            textViewGreeting.visibility = View.VISIBLE

            // Logcat의 KotlinWeek05App 태그에 인사말 출력
            Log.d("KotlinWeek05App", greeting)
        }
    }
}
```

### Kotlin 코드 설명

| 코드 | 역할 | XML 연계 |
|---|---|---|
| `setContentView(R.layout.activity_main)` | Activity 화면 지정 | `activity_main.xml` 전체 |
| `findViewById<EditText>(R.id.editTextName)` | 이름 입력 필드 참조 획득 | `@+id/editTextName` |
| `findViewById<Button>(R.id.buttonGreet)` | 인사 버튼 참조 획득 | `@+id/buttonGreet` |
| `findViewById<TextView>(R.id.textViewGreeting)` | 결과 영역 참조 획득 | `@+id/textViewGreeting` |
| `trim()` | 이름 앞뒤 공백 제거 | 입력값 전처리 |
| `isNotEmpty()` | 이름 입력 여부 확인 | 조건 분기 |
| `textViewGreeting.text` | 인사말 적용 | `textViewGreeting` |
| `View.VISIBLE` | 숨겨진 결과 영역 표시 | `visibility="gone"` 상태 변경 |
| `Log.d(...)` | 디버그 로그 출력 | Logcat 확인 |

### XML 코드

**파일 경로**: `app/src/main/res/layout/activity_main.xml`

**XML 주석 형식**: `//` 대신 `<!-- 설명 -->` 사용

```xml
<?xml version="1.0" encoding="utf-8"?>

<!--
    [연결 0]
    파일: activity_main.xml
    역할: Greeting 앱의 전체 화면 구성
    MainActivity.kt 연결 코드:
    setContentView(R.layout.activity_main)
-->
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp"
    android:gravity="center">

    <!--
        역할: 앱 제목 표시
        Kotlin 연결: 없음
    -->
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="32dp"
        android:text="인사 앱"
        android:textSize="24sp"
        android:textStyle="bold" />

    <!--
        [연결 1]
        ID: editTextName
        역할: 사용자 이름 입력
        MainActivity.kt 연결 코드:
        val editTextName = findViewById<EditText>(R.id.editTextName)
        MainActivity.kt 사용 코드:
        val name = editTextName.text.toString().trim()
    -->
    <EditText
        android:id="@+id/editTextName"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="16dp"
        android:hint="이름을 입력하세요"
        android:inputType="textPersonName"
        android:minHeight="48dp"
        android:padding="12dp" />

    <!--
        [연결 2]
        ID: buttonGreet
        역할: 인사말 생성 시작
        MainActivity.kt 연결 코드:
        val buttonGreet = findViewById<Button>(R.id.buttonGreet)
        MainActivity.kt 사용 코드:
        buttonGreet.setOnClickListener { ... }
    -->
    <Button
        android:id="@+id/buttonGreet"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="16dp"
        android:text="인사하기 버튼" />

    <!--
        [연결 3]
        ID: textViewGreeting
        역할: 생성한 인사말 출력
        초기 상태: gone
        MainActivity.kt 연결 코드:
        val textViewGreeting = findViewById<TextView>(R.id.textViewGreeting)
        MainActivity.kt 사용 코드:
        textViewGreeting.text = greeting
        textViewGreeting.visibility = View.VISIBLE
    -->
    <TextView
        android:id="@+id/textViewGreeting"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="18sp"
        android:textStyle="bold"
        android:visibility="gone" />

</LinearLayout>
```

### XML 속성 설명

| View | 속성 | 역할 | Kotlin 연결 |
|---|---|---|---|
| `LinearLayout` | `orientation="vertical"` | 하위 View의 세로 배치 | 없음 |
| `LinearLayout` | `gravity="center"` | 하위 View의 화면 중앙 정렬 | 없음 |
| 이름 `EditText` | `id="@+id/editTextName"` | 입력 필드 식별 | `R.id.editTextName` |
| 이름 `EditText` | `inputType="textPersonName"` | 이름 입력용 키보드 설정 | `editTextName.text` |
| 인사 `Button` | `id="@+id/buttonGreet"` | 클릭 대상 식별 | `R.id.buttonGreet` |
| 결과 `TextView` | `id="@+id/textViewGreeting"` | 출력 영역 식별 | `R.id.textViewGreeting` |
| 결과 `TextView` | `visibility="gone"` | 실행 전 결과 영역 숨김 | `View.VISIBLE`로 변경 |

### 실행 예시

```text
입력: 홍길동
출력: 안녕, 홍길동님~

입력: 빈 문자열
출력: 너의 이름은?
```

### Logcat 확인

- 검색 태그: `KotlinWeek05App`
- 출력 코드: `Log.d("KotlinWeek05App", greeting)`
- 버튼 클릭 시 화면 출력과 동일한 인사말 확인
