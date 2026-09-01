
`id(x)`의 출력값은 고정된 데이터값이 아니라 해당 실행에서 객체를 식별하는 값이므로 실행할 때 달라질 수 있다.

### `range()`

```python
print(range(5))          # range(0, 5)
print(list(range(5)))    # [0, 1, 2, 3, 4]
list(range(5, 10))       # [5, 6, 7, 8, 9]
```

- `range(5)`는 0부터 5 직전인 4까지의 연속 정수를 나타낸다.
- `range(5, 10)`은 5부터 10 직전인 9까지를 나타낸다.
- 실제 리스트 형태로 확인하려면 `list()`로 변환한다.

## 2. 모듈과 패키지

- **모듈(module)**: 이미 작성된 프로그램이나 함수가 들어 있는 `.py` 파일이다.
- **패키지(package)**: 여러 모듈을 묶은 디렉터리(폴더)이다.

패키지를 사용하는 기본 순서는 다음과 같다.

1. 설치: `pip install seaborn`
2. 로드: `import seaborn`
3. 함수 사용: `countplot()`

Anaconda에는 주요 패키지가 기본 설치되어 있어 별도 설치가 필요 없는 경우가 많다. 현재 설치된 패키지는 노트북에서 다음 명령으로 확인할 수 있다.

```python
!pip list
```

문서의 실제 셀에서는 위 명령이 주석 처리되어 있다.

```python
#현재 설치되어 있는 패키지들 확인
#!pip list
```

## 3. seaborn 패키지 활용

### seaborn의 의미와 로드 방법

- seaborn은 Matplotlib을 기반으로 색상 테마와 통계용 차트 기능을 더한 시각화 패키지이다.
- 전체 이름으로 사용: `import seaborn`
- 약어를 붙여 사용: `import seaborn as sns`
- 범주별 데이터 수를 막대그래프로 표시하는 함수: `seaborn.countplot()` 또는 `sns.countplot()`

Anaconda에는 seaborn이 기본 설치되어 있다는 전제로 설치 명령은 주석 처리하고 로드만 수행했다.

```python
# !pip install seaborn
import seaborn
```

### 간단한 빈도 그래프

```python
var = ['a', 'a', 'b', 'c']
seaborn.countplot(x=var)
```

- `a`는 2개, `b`는 1개, `c`는 1개이므로 각 범주의 빈도를 막대로 표현한다.
- 출력 객체는 `<Axes: ylabel='count'>`이다.

약어를 사용한 동일한 표현은 다음과 같다.

```python
import seaborn as sns
sns.countplot(x=var)
```

## 4. seaborn의 Titanic 데이터로 그래프 만들기

### 데이터셋 목록 확인

```python
import seaborn as sns
sns.get_dataset_names()
```

문서에 출력된 데이터셋은 총 23개이다.

`anagrams`, `anscombe`, `attention`, `brain_networks`, `car_crashes`, `diamonds`, `dots`, `dowjones`, `exercise`, `flights`, `fmri`, `geyser`, `glue`, `healthexp`, `iris`, `mpg`, `penguins`, `planets`, `seaice`, `taxis`, `tips`, `titanic`

### Titanic 데이터 불러오기

```python
df = sns.load_dataset('titanic')
df
```

- 데이터 크기: **891행 × 15열**
- 컬럼: `survived`, `pclass`, `sex`, `age`, `sibsp`, `parch`, `fare`, `embarked`, `class`, `who`, `adult_male`, `deck`, `embark_town`, `alive`, `alone`
- 출력은 앞의 0~4번 행과 뒤의 886~890번 행을 보여 주고, 중간 행은 생략한다.
- `NaN`은 결측값을 뜻한다.

### Titanic 빈도 그래프 세 가지

```python
# 성별 데이터 수
sns.countplot(data=df, x='sex')

# 객실 등급별 데이터 수
sns.countplot(data=df, x='class')

# 객실 등급별로 생존 여부까지 구분
sns.countplot(data=df, x='class', hue='alive')
```

- `data`에는 사용할 DataFrame을 넣는다.
- `x`에는 가로축에서 빈도를 셀 컬럼을 넣는다.
- `hue`를 지정하면 같은 범주 안을 다른 범주로 다시 나누어 색으로 구분한다.
- 각 셀의 출력 객체는 각각 `xlabel='sex'` 또는 `xlabel='class'`, `ylabel='count'`인 `Axes`이다.

## 5. pydataset 패키지

### 설치

```python
!pip install pydataset
```

문서 제목에는 `pydata`라고 적혀 있지만 실제 설치·로드하는 패키지 이름은 **`pydataset`**이다.

### 패키지의 데이터셋 목록 확인

```python
import pydataset
pydataset.data()
```

- 출력 규모: **757행 × 2열**
- 컬럼: `dataset_id`, `title`
- 출력 예: 앞부분의 `AirPassengers`, `BJsales`, `BOD`, `Formaldehyde`, `HairEyeColor`와 뒷부분의 `VerbAgg`, `cake`, `cbpp`, `grouseticks`, `sleepstudy`

### `mtcars` 불러오기

```python
df = pydataset.data('mtcars')  # mtcars 데이터를 df에 할당
df                             # df 출력
```

- 자동차 모델명이 인덱스이다.
- 총 **32개 자동차 × 11개 변수**로 구성된다.
- 컬럼: `mpg`, `cyl`, `disp`, `hp`, `drat`, `wt`, `qsec`, `vs`, `am`, `gear`, `carb`
- 문서 출력의 자동차는 Mazda RX4부터 Volvo 142E까지 32종이며, 각 행에 위 11개 수치가 들어 있다.

---

# 4장 데이터 프레임 — 공통 개념

- Pandas는 라벨이 붙은 **2차원 배열인 DataFrame**과 **1차원 배열인 Series**를 다루는 도구이다.
- DataFrame의 행 라벨은 **index(인덱스)**이다.
- DataFrame의 열 라벨은 **column(컬럼)** 또는 **변수**이다.
- Series는 1차원 구조이므로 행에만 라벨이 붙으며, 이를 index라고 한다.
- 문서의 구조 그림은 DataFrame이 여러 컬럼과 여러 인덱스로 이루어진 값의 표이고, Series는 하나의 값 열과 인덱스로 이루어진 구조임을 보여 준다.

---

# 4장 Lab1 — 시험 성적 데이터로 DataFrame 만들기

## 1. Pandas 로드와 DataFrame 생성

```python
import pandas as pd

df1 = pd.DataFrame({
    'name'    : ['김기훈', '이유진', '박동현', '김민지'],
    'english' : [90, 80, 60, 70],
    'math'    : [50, 60, 100, 20]
})
df1
```

생성 결과:

| index | name | english | math |
|---:|---|---:|---:|
| 0 | 김기훈 | 90 | 50 |
| 1 | 이유진 | 80 | 60 |
| 2 | 박동현 | 60 | 100 |
| 3 | 김민지 | 70 | 20 |

- 컬럼은 `name`, `english`, `math`이다.
- 문서 설명에는 생성한 프레임 이름을 `df`로 사용한다고 되어 있지만 실제 코드는 **`df1`**을 사용한다.
- 인덱스를 따로 지정하지 않으면 0부터 자동으로 부여된다.

## 2. DataFrame의 구성 확인

```python
df1.index
```
[Week02.ipynb](https://github.com/user-attachments/files/31672798/Week02.ipynb) 실습파일 링크
