# Week 02 — Python 패키지, 데이터 시각화, DataFrame 기초

이번 주에는 Python 객체와 `range()`의 기본 개념을 확인하고, 외부 패키지를 불러오는 방법을 익힌다. 이어서 seaborn으로 빈도 그래프를 만들고, pandas의 `DataFrame`과 `Series`를 생성·선택·비교하는 방법을 실습한다.

## 1. Python 객체와 `range()`

### `id()`

```python
x = [1, 2, 3]
id(x)
```

- `id(x)`는 현재 실행 중인 Python 환경에서 객체를 식별하는 값을 반환한다.
- 출력값은 데이터 자체가 아니며, 프로그램을 다시 실행하면 달라질 수 있다.

### `range()`

```python
print(range(5))          # range(0, 5)
print(list(range(5)))    # [0, 1, 2, 3, 4]
print(list(range(5, 10)))
# [5, 6, 7, 8, 9]
```

- `range(5)`는 0부터 5 직전인 4까지의 연속 정수를 나타낸다.
- `range(5, 10)`은 5부터 10 직전인 9까지를 나타낸다.
- 실제 리스트 형태로 확인하려면 `list()`로 변환한다.

## 2. 모듈과 패키지

- **모듈(module)**: 이미 작성된 프로그램이나 함수가 들어 있는 `.py` 파일
- **패키지(package)**: 여러 모듈을 묶은 디렉터리

패키지를 사용하는 기본 순서는 다음과 같다.

1. 설치: `pip install 패키지명`
2. 로드: `import 패키지명`
3. 함수 사용: `패키지명.함수명()`

예를 들어 seaborn을 설치하고 불러오는 코드는 다음과 같다.

```python
!pip install seaborn
import seaborn
```

Anaconda에는 주요 패키지가 이미 설치되어 있는 경우가 많다. 현재 환경에 설치된 패키지는 다음 명령으로 확인할 수 있다.

```python
!pip list
```

설치 명령을 실행하지 않을 때는 앞에 `#`을 붙여 주석으로 만들 수 있다.

```python
# !pip install seaborn
# !pip list
```

## 3. seaborn과 Matplotlib으로 그래프 만들기

### 3.1 패키지 불러오기

seaborn은 Matplotlib을 기반으로 통계 그래프를 쉽게 만드는 패키지다.

```python
import seaborn as sns
import matplotlib.pyplot as plt
```

- `seaborn as sns`: seaborn을 `sns`라는 별칭으로 사용
- `matplotlib.pyplot as plt`: pyplot을 `plt`라는 별칭으로 사용

### 3.2 리스트의 빈도 그래프

```python
var = ['a', 'a', 'b', 'b', 'c']

print(var)
sns.countplot(x=var)

plt.savefig('countplot.png')
plt.show()
```

- `sns.countplot()`은 범주별 데이터 개수를 세어 막대그래프로 표현한다.
- `x=var`는 `var`의 값을 x축 범주로 사용한다는 뜻이다.
- `plt.savefig()`는 현재 그래프를 이미지 파일로 저장한다.
- `plt.show()`는 그래프를 화면에 표시한다.

위 데이터에서는 `a`와 `b`가 각각 2개, `c`가 1개다.

### 3.3 seaborn 데이터셋 확인

```python
dataset_names = sns.get_dataset_names()
dataset_names
```

`get_dataset_names()`는 seaborn에서 불러올 수 있는 예제 데이터셋 이름을 반환한다.

### 3.4 Titanic 데이터 불러오기

```python
df = sns.load_dataset('titanic')
df
```

- `load_dataset('titanic')`은 Titanic 예제 데이터를 DataFrame으로 불러온다.
- `NaN`은 결측값을 뜻한다.
- 주요 열에는 `survived`, `pclass`, `sex`, `age`, `fare`, `class`, `alive` 등이 있다.

### 3.5 Titanic 빈도 그래프

성별 빈도:

```python
sns.countplot(
    data=df,
    x='sex',
    hue='sex'
)

plt.show()
```

성별을 x축에 놓고 객실 등급에 따라 색상 구분:

```python
sns.countplot(
    data=df,
    x='sex',
    hue='class'
)

plt.show()
```

객실 등급을 x축에 놓고 생존 여부에 따라 색상 구분:

```python
sns.countplot(
    data=df,
    x='class',
    hue='alive'
)

plt.show()
```

`countplot()`의 주요 키워드 인자는 다음과 같다.

| 인자 | 의미 |
|---|---|
| `data` | 사용할 DataFrame |
| `x` | x축에서 빈도를 셀 열 |
| `hue` | 같은 범주를 색상으로 다시 구분할 열 |

## 4. pydataset 패키지

### 4.1 설치와 불러오기

```python
!pip install pydataset

import pydataset
```

패키지 이름은 `pydata`가 아니라 **`pydataset`**이다.

### 4.2 데이터셋 목록 확인

```python
pydataset.data()
```

이 명령은 `dataset_id`와 `title`이 들어 있는 데이터셋 목록을 보여 준다.

### 4.3 `mtcars` 불러오기

```python
cars = pydataset.data('mtcars')
cars
```

- 자동차 모델명이 인덱스로 사용된다.
- 주요 열에는 `mpg`, `cyl`, `disp`, `hp`, `wt`, `gear`, `carb` 등이 있다.

## 5. Python 리스트와 기본 집계

```python
test_score = [80, 60, 70, 50, 90]
ts = test_score

print(ts)
print(sum(ts))

ts_sum = sum(ts)
print(ts_sum)
```

- `test_score`는 숫자를 저장한 리스트다.
- `ts = test_score`는 리스트를 복사하는 것이 아니라 같은 리스트 객체를 가리키게 한다.
- `sum(ts)`는 리스트 안의 숫자를 모두 더한다.

## 6. pandas DataFrame과 Series

### 6.1 공통 개념

- **DataFrame**: 행과 열로 구성된 2차원 데이터 구조
- **Series**: 하나의 값 열과 인덱스로 구성된 1차원 데이터 구조
- **index**: 행의 라벨
- **columns**: 열의 라벨

### 6.2 딕셔너리로 DataFrame 만들기

```python
import pandas as pd

df1 = pd.DataFrame({
    'name': ['김지훈', '이유진', '박동현', '김민지'],
    'english': [90, 80, 60, 70],
    'math': [50, 60, 100, 20]
})

df1
```

딕셔너리를 DataFrame 생성자에 전달하면 다음과 같이 변환된다.

- 딕셔너리의 키 → DataFrame의 열 이름
- 키에 연결된 리스트 → 해당 열의 데이터
- 리스트에서 같은 위치의 값 → 같은 행

| index | name | english | math |
|---:|---|---:|---:|
| 0 | 김지훈 | 90 | 50 |
| 1 | 이유진 | 80 | 60 |
| 2 | 박동현 | 60 | 100 |
| 3 | 김민지 | 70 | 20 |

인덱스를 직접 지정하지 않으면 `0`부터 자동으로 만들어진다.

### 6.3 한 열과 여러 열 선택

한 열을 선택하면 Series가 반환된다.

```python
english_series = df1['english']
english_series
```

여러 열 이름을 리스트로 전달하면 DataFrame이 반환된다.

```python
scores = df1[['english', 'math']]
scores
```

다음 두 표현의 차이를 기억한다.

```python
df1['english']              # Series
df1[['english']]            # 열이 하나인 DataFrame
df1[['english', 'math']]    # 열이 두 개인 DataFrame
```

### 6.4 합계와 평균 계산

```python
english_sum = sum(df1['english'])

english_mean = (
    sum(df1['english']) /
    len(df1['english'])
)

print(english_sum)
print(english_mean)
```

pandas의 메서드로도 계산할 수 있다.

```python
df1['english'].sum()
df1['english'].mean()
```

### 6.5 조건 비교

Series의 각 값이 80 이상인지 확인한다.

```python
result = df1['english'] >= 80
print(result)
```

두 열을 한꺼번에 비교하면 Boolean DataFrame이 만들어진다.

```python
result = df1[['english', 'math']] >= 80
print(result)
```

비교 결과에는 조건을 만족하면 `True`, 만족하지 않으면 `False`가 저장된다. 원래 점수는 변경되지 않는다.

## 7. 결측값이 있는 DataFrame

```python
df2 = pd.DataFrame({
    '제품': ['사과', '딸기', '수박'],
    '가격': [1800, 1500, 3000],
    '판매량': [24, 38, None]
})

df2
```

- Python에서는 값이 없음을 `None`으로 표현한다.
- `null`은 Python에 미리 정의된 값이 아니므로 그대로 사용하면 오류가 발생한다.
- pandas는 숫자 열의 `None`을 일반적으로 `NaN`이라는 결측값으로 표시한다.

### 7.1 열 이름과 인덱스 확인

```python
print(df2.columns)
print(df2.index)
```

행이 3개이고 인덱스를 직접 지정하지 않았으므로 다음과 같은 범위 인덱스가 만들어진다.

```text
RangeIndex(start=0, stop=3, step=1)
```

실제 인덱스는 `0`, `1`, `2`이며 `stop=3`의 3은 포함되지 않는다.

### 7.2 평균 계산과 결측값

가격 평균:

```python
average_price = df2['가격'].mean()
print(average_price)
```

판매량에는 결측값이 있으므로 pandas의 `mean()`을 사용하는 편이 안전하다. `Series.mean()`은 기본적으로 결측값을 제외하고 계산한다.

```python
average_sales = df2['판매량'].mean()
print(average_sales)
```

다음 코드는 결측값까지 더하려고 하므로 결과가 `NaN`이 된다.

```python
sum(df2['판매량']) / len(df2['제품'])
```

## 8. 외부 파일 불러오기

### 8.1 CSV 파일

```python
exam = pd.read_csv('data/exam.csv')
exam
```

파일과 노트북이 같은 폴더에 있다면 파일 이름만 사용할 수 있다.

```python
exam = pd.read_csv('exam.csv')
```

### 8.2 Excel 파일

```python
excel_exam = pd.read_excel('data/excel_exam.xlsx')
excel_exam
```

로컬 환경에서는 전체 경로를 사용할 수도 있다.

```python
exam = pd.read_csv(
    '/Users/ma/Downloads/Doit_Python-main/Data/exam.csv'
)

excel_exam = pd.read_excel(
    '/Users/ma/Downloads/Doit_Python-main/Data/excel_exam.xlsx'
)
```

## 9. 핵심 정리

```python
# 패키지 불러오기
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# seaborn 예제 데이터
df = sns.load_dataset('titanic')

# 빈도 그래프
sns.countplot(data=df, x='class', hue='alive')
plt.show()

# 딕셔너리로 DataFrame 생성
df1 = pd.DataFrame({
    'name': ['김지훈', '이유진'],
    'english': [90, 80]
})

# Series 선택
english = df1['english']

# DataFrame 선택
selected = df1[['name', 'english']]

# 조건 비교
result = df1['english'] >= 80

# 외부 파일 불러오기
exam = pd.read_csv('data/exam.csv')
excel_exam = pd.read_excel('data/excel_exam.xlsx')
```

## 10. 실습 체크리스트

- `range()`를 리스트로 변환할 수 있는가?
- 모듈과 패키지의 차이를 설명할 수 있는가?
- seaborn 데이터셋을 불러와 `countplot()`을 만들 수 있는가?
- 딕셔너리를 이용해 DataFrame을 만들 수 있는가?
- 한 열을 Series로, 여러 열을 DataFrame으로 선택할 수 있는가?
- 비교식을 사용해 `True`와 `False` 결과를 만들 수 있는가?
- `None`과 pandas 결측값의 관계를 설명할 수 있는가?
- CSV와 Excel 파일을 DataFrame으로 불러올 수 있는가?

[Week02.ipynb](https://github.com/user-attachments/files/31672798/Week02.ipynb) 실습 파일
