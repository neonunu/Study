## 2주차 — Python 패키지, 시각화, DataFrame 기초

#### `id()`

```python
x = [1, 2, 3]
id(x)
```

#### `range()`

```python
print(range(5))          # range(0, 5)
print(list(range(5)))    # [0, 1, 2, 3, 4]
print(list(range(5, 10)))
# [5, 6, 7, 8, 9]
```

### 2. 모듈과 패키지

```python
!pip install seaborn
import seaborn
```

```python
!pip list
```

```python
# !pip install seaborn
# !pip list
```

#### 3.1 패키지 불러오기

```python
import seaborn as sns
import matplotlib.pyplot as plt
```

#### 3.2 리스트의 빈도 그래프

```python
var = ['a', 'a', 'b', 'b', 'c']

print(var)
sns.countplot(x=var)

plt.savefig('countplot.png')
plt.show()
```

#### 3.3 seaborn 데이터셋 확인

```python
dataset_names = sns.get_dataset_names()
dataset_names
```

#### 3.4 Titanic 데이터 불러오기

```python
df = sns.load_dataset('titanic')
df
```

#### 3.5 Titanic 빈도 그래프

```python
sns.countplot(
    data=df,
    x='sex',
    hue='sex'
)

plt.show()
```

```python
sns.countplot(
    data=df,
    x='sex',
    hue='class'
)

plt.show()
```

```python
sns.countplot(
    data=df,
    x='class',
    hue='alive'
)

plt.show()
```

#### 4.1 설치와 불러오기

```python
!pip install pydataset

import pydataset
```

#### 4.2 데이터셋 목록 확인

```python
pydataset.data()
```

#### 4.3 `mtcars` 불러오기

```python
cars = pydataset.data('mtcars')
cars
```

### 5. Python 리스트와 기본 집계

```python
test_score = [80, 60, 70, 50, 90]
ts = test_score

print(ts)
print(sum(ts))

ts_sum = sum(ts)
print(ts_sum)
```

#### 6.2 딕셔너리로 DataFrame 만들기

```python
import pandas as pd

df1 = pd.DataFrame({
    'name': ['김지훈', '이유진', '박동현', '김민지'],
    'english': [90, 80, 60, 70],
    'math': [50, 60, 100, 20]
})

df1
```

#### 6.3 한 열과 여러 열 선택

```python
english_series = df1['english']
english_series
```

```python
scores = df1[['english', 'math']]
scores
```

```python
df1['english']              # Series
df1[['english']]            # 열이 하나인 DataFrame
df1[['english', 'math']]    # 열이 두 개인 DataFrame
```

#### 6.4 합계와 평균 계산

```python
english_sum = sum(df1['english'])

english_mean = (
    sum(df1['english']) /
    len(df1['english'])
)

print(english_sum)
print(english_mean)
```

```python
df1['english'].sum()
df1['english'].mean()
```

#### 6.5 조건 비교

```python
result = df1['english'] >= 80
print(result)
```

```python
result = df1[['english', 'math']] >= 80
print(result)
```

### 7. 결측값이 있는 DataFrame

```python
df2 = pd.DataFrame({
    '제품': ['사과', '딸기', '수박'],
    '가격': [1800, 1500, 3000],
    '판매량': [24, 38, None]
})

df2
```

#### 7.1 열 이름과 인덱스 확인

```python
print(df2.columns)
print(df2.index)
```

#### 7.2 평균 계산과 결측값

```python
average_price = df2['가격'].mean()
print(average_price)
```

```python
average_sales = df2['판매량'].mean()
print(average_sales)
```

```python
sum(df2['판매량']) / len(df2['제품'])
```

#### 8.1 CSV 파일

```python
exam = pd.read_csv('data/exam.csv')
exam
```

```python
exam = pd.read_csv('exam.csv')
```

#### 8.2 Excel 파일

```python
excel_exam = pd.read_excel('data/excel_exam.xlsx')
excel_exam
```

```python
exam = pd.read_csv(
    '/Users/ma/Downloads/Doit_Python-main/Data/exam.csv'
)

excel_exam = pd.read_excel(
    '/Users/ma/Downloads/Doit_Python-main/Data/excel_exam.xlsx'
)
```

### 9. 핵심 정리

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


## 3주차 — 데이터 파악, 파생 변수, 분류

#### pandas 불러오기

```python
import pandas as pd
```

#### `exam.csv` 불러오기

```python
exam = pd.read_csv("data/exam.csv")
exam
```

```python
exam = pd.read_csv("exam.csv")
```

#### 처음과 마지막 데이터 확인

```python
exam.head()
```

```python
exam.head(10)
```

```python
exam.tail()
```

#### 행과 열 개수 확인

```python
exam.shape
```

```python
exam.shape    # 올바른 코드
exam.shape()  # 오류 발생
```

#### 변수명 확인

```python
exam.columns
```

```python
exam.columns.tolist()
```

#### 변수 속성 확인

```python
exam.info()
```

### 3. 요약 통계량 이해하기

```python
exam.describe()
```

```python
exam.describe(include="all")
```

#### 과목별 평균 계산

```python
exam[["math", "english", "science"]].mean()
```

#### 특정 변수의 통계만 확인

```python
exam["math"].describe()
```

#### 여러 변수의 통계 확인

```python
exam[["math", "english", "science"]].describe()
```

#### `loc` 사용하기

```python
exam.loc[5]
```

```python
exam.loc[[5]]
```

```python
exam.loc[[5, 7, 9]]
```

```python
exam.loc[5:10]
```

#### 특정 열을 인덱스로 설정하기

```python
exam_by_id = exam.set_index("id")
exam_by_id.head()
```

```python
exam_by_id.loc[3:6]
```

#### `iloc` 사용하기

```python
exam_by_id.iloc[[0, 3, 5]]
```

```python
exam_by_id.iloc[2:5]
```

#### 조건에 맞는 행 선택

```python
exam.loc[exam["math"] > 50]
```

```python
exam.loc[exam["math"] >= 50]
```

```python
exam.loc[
    (exam["math"] >= 50) &
    (exam["english"] >= 80)
]
```

### 5. `mpg.csv` 데이터 파악하기

```python
mpg = pd.read_csv("data/mpg.csv")
```

#### 데이터 파악

```python
mpg.head()
mpg.tail()
mpg.shape
mpg.info()
mpg.describe()
```

```python
mpg.describe(include="all")
```

### 6. 변수명 바꾸기

```python
mpg_new = mpg.copy()
```

```python
mpg_new = mpg_new.rename(
    columns={
        "hwy": "highway"
    }
)
```

```python
mpg_new = mpg_new.rename(
    columns={
        "cty": "city",
        "hwy": "highway"
    }
)
```

```python
mpg_new.columns
```

```python
mpg.columns
```

```python
df = df.rename(columns={"old": "new"})
```

#### 통합 연비 만들기

```python
mpg["total"] = (
    mpg["cty"] + mpg["hwy"]
) / 2
```

```python
mpg[["cty", "hwy", "total"]].head()
```

#### 통합 연비 통계 확인

```python
mpg["total"].describe()
```

```python
mpg["total"].plot.hist()
```

#### `np.where()` 기본 구조

```python
import numpy as np

np.where(조건, 참일 때 값, 거짓일 때 값)
```

#### 합격 여부 만들기

```python
mpg["test"] = np.where(
    mpg["total"] >= 20,
    "pass",
    "fail"
)
```

```python
mpg[["total", "test"]].head()
```

#### 코드

```python
mpg["grade"] = np.where(
    mpg["total"] >= 30,
    "A",
    np.where(
        mpg["total"] >= 20,
        "B",
        "C"
    )
)
```

#### 반복 조건 사용

```python
mpg["size"] = np.where(
    (mpg["category"] == "compact") |
    (mpg["category"] == "subcompact") |
    (mpg["category"] == "2seater"),
    "small",
    "large"
)
```

#### `isin()` 사용

```python
small_categories = [
    "compact",
    "subcompact",
    "2seater"
]

mpg["size"] = np.where(
    mpg["category"].isin(small_categories),
    "small",
    "large"
)
```

```python
mpg["land"] = np.where(
    mpg["manufacturer"].isin(
        ["hyundai", "honda"]
    ),
    "asia",
    "non-asia"
)
```

#### 합격 여부 빈도

```python
mpg["test"].value_counts()
```

#### 등급별 빈도

```python
mpg["grade"].value_counts()
```

```python
count_grade = (
    mpg["grade"]
    .value_counts()
    .sort_index()
)
```

#### 자동차 크기별 빈도

```python
mpg["size"].value_counts()
```

#### 제조사 지역별 빈도

```python
mpg["land"].value_counts()
```

#### pandas 막대그래프

```python
count_grade.plot.bar(rot=0)
```

```python
count_grade.plot.barh()
```

#### seaborn 막대그래프

```python
import seaborn as sns

sns.countplot(
    data=mpg,
    x="grade",
    order=["A", "B", "C"]
)
```

#### 그래프 제목 추가

```python
import matplotlib.pyplot as plt

sns.countplot(
    data=mpg,
    x="grade",
    order=["A", "B", "C"]
)

plt.title("자동차 연비 등급")
plt.xlabel("연비 등급")
plt.ylabel("자동차 수")
plt.show()
```

#### 단계별 작성

```python
grade_count = mpg["grade"]
grade_count = grade_count.value_counts()
grade_count = grade_count.sort_index()
```

#### 메서드 체이닝

```python
grade_count = (
    mpg["grade"]
    .value_counts()
    .sort_index()
)
```

#### 1. 대입: `b = a`

```python
a = [[1], [2]]
b = a

b[0].append(99)

print(a)
# [[1, 99], [2]]

print(b)
# [[1, 99], [2]]
```

##### 메모리 구조

```python
print(a is b)
# True
```

#### 2. 얕은 복사: `a.copy()`

```python
a = [[1], [2]]
b = a.copy()
```

##### 메모리 구조

```python
print(a is b)
# False
```

```python
print(a[0] is b[0])
# True
```

##### 바깥 리스트를 수정하는 경우

```python
a = [[1], [2]]
b = a.copy()

b.append([3])

print(a)
# [[1], [2]]

print(b)
# [[1], [2], [3]]
```

##### 내부 리스트를 수정하는 경우

```python
a = [[1], [2]]
b = a.copy()

b[0].append(99)

print(a)
# [[1, 99], [2]]

print(b)
# [[1, 99], [2]]
```

#### 3. 깊은 복사: `deepcopy()`

```python
from copy import deepcopy

a = [[1], [2]]
b = deepcopy(a)
```

##### 메모리 구조

```python
print(a is b)
# False

print(a[0] is b[0])
# False
```

##### 내부 리스트 수정

```python
b[0].append(99)

print(a)
# [[1], [2]]

print(b)
# [[1, 99], [2]]
```

#### pandas의 `copy()`

```python
mpg_new = mpg.copy()
```

```python
mpg_new = mpg_new.rename(
    columns={
        "cty": "city",
        "hwy": "highway"
    }
)

print(mpg.columns)
print(mpg_new.columns)
```

```python
복사본 = 원본.copy()
```

#### 데이터 불러오기

```python
midwest = pd.read_csv("data/midwest.csv")
```

```python
midwest.head()
midwest.shape
midwest.info()
```

#### 변수명 변경

```python
midwest = midwest.rename(
    columns={
        "poptotal": "total",
        "popasian": "asian"
    }
)
```

#### 아시아계 인구 비율 계산

```python
midwest["rate"] = (
    midwest["asian"] /
    midwest["total"] *
    100
)
```

```python
midwest[
    ["county", "state", "total", "asian", "rate"]
].head()
```

#### 분포 확인

```python
midwest["rate"].describe()
midwest["rate"].plot.hist()
```

#### 평균을 기준으로 분류

```python
mean_rate = midwest["rate"].mean()
```

```python
midwest["asiangroup"] = np.where(
    midwest["rate"] > mean_rate,
    "large",
    "small"
)
```

```python
# 권장하지 않는 방식
midwest["asiangroup"] = np.where(
    midwest["rate"] > 0.4872,
    "large",
    "small"
)
```

#### 빈도 확인

```python
midwest["asiangroup"].value_counts()
```

#### 그래프 작성

```python
sns.countplot(
    data=midwest,
    x="asiangroup",
    order=["large", "small"]
)

plt.title("아시아계 인구 비율 그룹")
plt.xlabel("그룹")
plt.ylabel("지역 수")
plt.show()
```

#### 데이터 파악

```python
df.head()
df.tail()
df.shape
df.columns
df.info()
df.describe()
```

#### 변수명 변경

```python
df = df.rename(
    columns={
        "old": "new"
    }
)
```

#### 파생 변수 생성

```python
df["total"] = (
    df["column1"] +
    df["column2"]
)
```

#### 두 그룹으로 분류

```python
df["group"] = np.where(
    df["total"] >= 10,
    "high",
    "low"
)
```

#### 여러 값 중 하나인지 확인

```python
df["group"] = np.where(
    df["category"].isin(["A", "B"]),
    "target",
    "other"
)
```

#### 조건에 맞는 행 선택

```python
df.loc[df["total"] >= 10]
```

#### 빈도표

```python
df["group"].value_counts()
```

### 19. 종합 실습 정답 코드

```python
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns


DATA_DIR = Path("data")


# -------------------------
# 1. exam.csv
# -------------------------

exam = pd.read_csv(DATA_DIR / "exam.csv")

print("처음 5행")
print(exam.head())

print("\n마지막 5행")
print(exam.tail())

print("\n데이터 크기")
print(exam.shape)

print("\n변수명")
print(exam.columns.tolist())

print("\n과목별 평균")
print(
    exam[
        ["math", "english", "science"]
    ].mean()
)

exam_by_id = exam.set_index("id")

print("\nid가 3~6인 학생")
print(exam_by_id.loc[3:6])

print("\n수학 점수가 50점보다 높은 학생")
print(
    exam.loc[
        exam["math"] > 50
    ]
)


# -------------------------
# 2. mpg.csv
# -------------------------

mpg = pd.read_csv(DATA_DIR / "mpg.csv")

print("\nmpg 데이터 크기")
print(mpg.shape)

mpg_new = mpg.copy()

mpg_new = mpg_new.rename(
    columns={
        "cty": "city",
        "hwy": "highway"
    }
)

mpg["total"] = (
    mpg["cty"] + mpg["hwy"]
) / 2

mpg["test"] = np.where(
    mpg["total"] >= 20,
    "pass",
    "fail"
)

mpg["grade"] = np.where(
    mpg["total"] >= 30,
    "A",
    np.where(
        mpg["total"] >= 20,
        "B",
        "C"
    )
)

mpg["size"] = np.where(
    mpg["category"].isin(
        ["compact", "subcompact", "2seater"]
    ),
    "small",
    "large"
)

mpg["land"] = np.where(
    mpg["manufacturer"].isin(
        ["hyundai", "honda"]
    ),
    "asia",
    "non-asia"
)

print("\n합격 여부")
print(mpg["test"].value_counts())

print("\n연비 등급")
print(
    mpg["grade"]
    .value_counts()
    .sort_index()
)

print("\n자동차 크기")
print(mpg["size"].value_counts())

print("\n제조사 지역")
print(mpg["land"].value_counts())

sns.countplot(
    data=mpg,
    x="grade",
    order=["A", "B", "C"]
)

plt.title("자동차 연비 등급")
plt.xlabel("등급")
plt.ylabel("자동차 수")
plt.show()


# -------------------------
# 3. midwest.csv
# -------------------------

midwest = pd.read_csv(
    DATA_DIR / "midwest.csv"
)

print("\nmidwest 데이터 크기")
print(midwest.shape)

midwest = midwest.rename(
    columns={
        "poptotal": "total",
        "popasian": "asian"
    }
)

midwest["rate"] = (
    midwest["asian"] /
    midwest["total"] *
    100
)

mean_rate = midwest["rate"].mean()

midwest["asiangroup"] = np.where(
    midwest["rate"] > mean_rate,
    "large",
    "small"
)

print("\n아시아계 인구 비율 평균")
print(mean_rate)

print("\n아시아계 인구 비율 그룹")
print(
    midwest["asiangroup"]
    .value_counts()
)

sns.countplot(
    data=midwest,
    x="asiangroup",
    order=["large", "small"]
)

plt.title("아시아계 인구 비율 그룹")
plt.xlabel("그룹")
plt.ylabel("지역 수")
plt.show()
```


## 4주차 — 데이터 전처리와 가공

```bash
python -m pip install pandas numpy
```

```python
import pandas as pd
import numpy as np
```

##### Lab1. 반별(nclass) 데이터를 추출하여 작업해보자

```python
import pandas as pd
exam = pd.read_csv("exam.csv")
exam.head()
```

```python
# 1반 (nclass == 1) 데이터 추출
exam.query('nclass == 1')
```

```python
# 2반 (nclass == 2) 데이터 추출
exam.query('nclass == 2')
```

```python
# 1반이 아닌(nclass != 1) 다른 반의 데이터 추출
exam.query('nclass != 1')
```

```python
exam.query('nclass == 1 & math >= 50')
```

```python
exam.query('english < 90 | science < 50')
```

```python
exam.query('nclass == 1 | nclass == 3 | nclass == 5')
```

```python
exam.query('nclass in [1, 3, 5]')
```

```python
nclass1 = exam.query('nclass == 1')
nclass1
```

```python
nclass2 = exam.query('nclass == 2')
nclass2
```

```python
nclass1['math'].mean()  # 1반 수학 평균
```

```python
nclass2['math'].mean()  # 2반 수학 평균
```

```python
df = pd.DataFrame({'sex' : ['F', 'M', 'F', 'M'],
                   'country' : ['Korea', 'China', 'Japan', 'USA']})
df
```

```python
df.query(' sex == "F" & country == "Korea" ' )
```

```python
df.query(" sex == 'F' & country == 'Korea' " )
```

```python
n = 'F'
df.query('sex == @n')   #  외부 변수 사용
```

##### Lab2. mpg 데이터 분석 (혼자서 해보기, 배포자료 참고)

```python
mpg = pd.read_csv("mpg.csv")
mpg.head()
```

```python
mpg_lt4 = mpg.query('displ <= 4')
mpg_lt4.head()
```

```python
mpg_gt4 = mpg.query('displ > 4')
mpg_gt4.head()
```

```python
mpg_lt4['hwy'].mean()
```

```python
mpg_gt4['hwy'].mean()
```

```python
if mpg_lt4['hwy'].mean() > mpg_gt4['hwy'].mean() :
    print('배기량 4 이하 자동차의 고속도로 연비가 높다')
elif mpg_lt4['hwy'].mean() < mpg_gt4['hwy'].mean() :
    print('배기량 4 초과 자동차의 고속도로 연비가 높다')
```

```python
mpg_audi = mpg.query('manufacturer == "audi"')
mpg_audi.head()
```

```python
mpg_toyota = mpg.query('manufacturer == "toyota" ')
mpg_toyota.head()
```

```python
mpg_audi['cty'].mean()
```

```python
mpg_toyota['cty'].mean()
```

```python
mpg_new = mpg.query("manufacturer in ['chevrolet', 'ford', 'honda']")
mpg_new['manufacturer'].value_counts()
```

```python
mpg_new['hwy'].mean()
```

##### Lab1. 변수(컬럼) 추출

```python
#수학성적 추출
exam['math']  # 시리즈 추출
```

```python
exam[['math']] # 데이터 프레임으로 추출
```

```python
exam[['nclass', 'math', 'english']]
```

```python
# math 제거
exam.drop(columns = 'math')
#exam.drop(columns = 'math', inplace=True)
```

```python
exam.drop(columns = ['english', 'science'])
```

##### Lab2. Pandas 함수 조합하기

```python
exam.query('nclass == 1')
```

```python
# nclass == 1 인 결과에서 english column만 가져와라
# 전체 데이터 중에, 1반의 영어 성적만 보고 싶다
exam.query('nclass == 1')['english']
```

```python
exam.query('nclass == 1')[['english']]  # 위와 동일 결과를 데이터 프레임으로 출력
```

```python
# 수학 점수 50점 이상인 학생의 학번과 수학점수 출력
exam.query('math >= 50')[['id', 'math']].head(3)
```

###### Q1 : mpg 데이터에서 category(자동차 종류)와 cty(도시 연비) 변수(컬럼)을 추출하여 새로운 데이터를 만드시오

```python
mpg = pd.read_csv("mpg.csv")
```

```python
mpg_new = mpg[['category', 'cty']]
mpg_new.head(3)
```

```python
mpg_new['category'].value_counts()
```

###### Q2 : 추출한 데이터를 이용하여 category가 'suv'인 자동차와 'compact' 자동차의 도시연비(cty)를 비교해 보시오

```python
mpg_new.query('category == "suv"')
```

```python
mpg_new.query('category == "suv"')['cty'].mean()
```

```python
mpg_new.query('category == "compact"')['cty'].mean()
```

```python
# mean() 이외에 다른 method를 적용해 보세요. head(), min(), max(), sum()등
```

#### 06-4 순서대로 정렬하기

```python
exam = pd.read_csv("exam.csv")
```

```python
exam.head(10)
```

```python
# 수학 점수로 정렬, 오름차순
exam.sort_values('math')
```

```python
# 수학 점수로 정렬, 내림차순
exam.sort_values('math', ascending=False)
```

```python
# nclass, math 오름 차순 정렬
exam.sort_values(['nclass', 'math'])
```

```python
# nclass 오름 차순, math 내림 차순 정렬
exam.sort_values(['nclass', 'math'], ascending=[True, False])
```

##### Lab1. mpg 데이터 분석

```python
mpg = pd.read_csv("mpg.csv")
mpg.head(3)
```

```python
mpg.query('manufacturer == "audi"').sort_values('hwy', ascending=False).head(5)
```

##### Lab1. assign() 활용하여 파생변수 추가

```python
exam = pd.read_csv("exam.csv")
exam.head(3)
```

```python
exam.assign(total = exam['math'] + exam['english'] + exam['science'])
```

```python
exam.assign(
        total = exam['math'] + exam['english'] + exam['science'],
        mean  = (exam['math'] + exam['english'] + exam['science']) / 3
)
```

```python
import numpy as np
```

```python
exam.assign(test = np.where(exam['science'] > 60, 'pass', 'fail'))
```

```python
exam.assign(total = exam['math'] + exam['english'] + exam['science'])
```

```python
# 추가한 변수에 pandas 함수를 바로 적용하기
exam.assign(total = exam['math'] + exam['english'] + exam['science']).sort_values('total')
```

##### Lab2. lambda를 이용하여 데이터 프레임명 줄이기

```python
exam = pd.read_csv("exam.csv")
```

```python
exam.assign(total = lambda x : x['math'] + x['english'] + x['science']).head(3)
```

```python
# 파생 변수 total을 생성하고, 생성한 total을 이용하여 mean을 계산하면 오류 발생

# exam.assign(total = exam['math'] + exam['english'] + exam['science'],
#             mean = exam['total']/3 )
```

```python
exam.assign(total = exam['math'] + exam['english'] + exam['science'],
            mean = lambda x: x['total']/3 )
```

```python
exam.assign(total = lambda x: x['math'] + x['english'] + x['science'],
            mean = lambda x: x['total']/3 )
```

##### Lab3. mpg 데이터를 이용하여 문제 분석 (혼자 해보기, 배포자료 참고)

```python
mpg = pd.read_csv("mpg.csv")
```

```python
mpg_new = mpg.copy()
```

```python
mpg_new = mpg_new.assign(total = mpg_new['cty'] + mpg_new['hwy'])
mpg_new.head(3)
```

```python
mpg_new = mpg_new.assign(mean = mpg_new['total']/2)
mpg_new.head(3)
```

```python
# 평균 연비(mean)를 기준으로 내림차순 정렬, 상위 3개 출력
mpg_new.sort_values('mean', ascending=False).head(3)
```

```python
mpg.assign(total = lambda x: x['cty'] + x['hwy'],
           mean  = lambda x: x['total'] / 2 
          ).sort_values('mean', ascending=False).head(3)
```


## 5주차 — 집단별 요약과 데이터 결합

#### 06-6 집단별로 요약하기

```python
df.groupby(key).agg(mean = ('data', 'mean'))
```

```python
df.groupby(key).agg(sum_data = ('data', 'sum'))
```

```python
df.groupby("key").agg(sum_data=("data", "sum"))
```

##### agg()란?

```python
# Pandas 패키지를 로드
# exam.csv를 데이터 프레임 exam으로 읽어옴
import pandas as pd
exam = pd.read_csv("exam.csv")
exam.head()
```

```python
# 수학선생님이 수학 점수를 알고 싶다. 통계를 활용하자
exam.mean()
```

```python
exam['math'].mean()
```

```python
#exam.agg(추가하는 변수명 = ('원래 변수명', '함수명'))
#exam.agg(수학평균 = ('math', 'mean'))
exam.agg(new_mean = ('math', 'mean'))
```

```python
exam.agg(new_mean = ('math', 'mean'),
         eng_mean = ('english', 'mean'),
         sci_max = ('science', 'max')
        )
```

```python
exam['math'].mean()
```

##### 집단별 요약 통계량 구하기 (`groupby()`)

```python
# 반(nclass)별로 그룹화하고, 그룹별로 변수(컬럼) math에 대한 평균(mean)을 구하고, 
# 변수 이름을 mean_math로 함.
# 기본적으로 nclass가 인덱스가 됨
exam.groupby('nclass').agg(mean_math = ('math', 'mean'))
```

```python
# 반(nclass)별로 그룹화하고, 
# 그룹별로 변수(컬럼) math에 대한 평균(mean)을 구하고, 
# 변수 이름을 mean_math로 함.
# nclass를 인덱스로 만들지 않음
exam.groupby('nclass', as_index = False).agg(mean_math = ('math', 'mean'))
```

```python
# 반(nclass)별로 그룹화하고, 그룹별로 
# mean_math 변수에 math에 대한 평균(mean) 값을
# sum_math 변수에 math에 대한 합(sum) 값을 생성함
exam.groupby('nclass') \
    .agg(mean_math = ('math', 'mean'),
         sum_math  = ('math', 'sum'))
```

```python
# 반(nclass)별로 그룹화하고, 그룹별로 
# mean_math 변수에 math에 대한 평균(mean) 값을
# sum_math 변수에 math에 대한 합(sum) 값을 생성함
# median_math 변수에 math에 대한 중앙값(median) 값을 생성함
# n 변수에 math에 대한 그룹 내 개수(count) 값을 생성함

exam.groupby('nclass') \
    .agg(mean_math = ('math', 'mean'),
         sum_math  = ('math', 'sum'),
         median_math = ('math', 'median'),
         n = ('math', 'count')
    )
```

```python
# 반(nclass)별로 그룹화하고, 그룹별로 
# 각 변수에 대한 평균(mean) 값 구하기
exam.groupby('nclass').mean()
```

##### 혼자 연습

```python
# mpg 데이터로 제조사별로 도심연비의 평균을 구하라
#1) 원하는 결과를 행렬 생성
#2) 결과를 위해서 groupby랑 agg를 사용해서 코드 작성
```

##### Lab2. 집단별로 다시 나누기

```python
# mpg.csv 데이터를 데이터 프레임 mpg로 읽어 들임
mpg = pd.read_csv("mpg.csv")
```

```python
# 데이터 프레임 mpg 데이터 확인
mpg.head(3)
```

```python
# 제조사(manufacturer)와 구동방식(drv)별로 그룹화하고, 그룹별로 
# mean_cty 변수에 도시연비 cty에 대한 평균(mean) 값을 구하여 출력
mpg.groupby(['manufacturer', 'drv']).agg(mean_cty = ('cty', 'mean'))
```

```python
# 제조사(manufacturer)가 audi인 자동차를 대상으로
# 구동방식(drv)에 따라 그룹화하고, 그룹별로 
# n 변수에 구동방식 drv에 대한 그룹 내 개수(count) 값을 구하여 출력
mpg.query('manufacturer == "audi"') \
    .groupby(['drv']) \
    .agg(n = ('drv', 'count'))
```

##### Lab3. value_counts()로 간단히 집단별 빈도수 구하기

```python
# 구동방식(drv)에 따라 그룹화하고, 그룹별로
# n 변수에 구동방식 drv에 대한 그룹 내 개수(count) 값을 구하여 출력
mpg.groupby('drv').agg(n = ('drv', 'count'))
```

```python
# 구동방식 drv에 대한 그룹 내 개수 값을 구하여 출력
mpg.value_counts('drv')   #  시리즈로 출력
```

```python
# 구동방식 drv에 대한 그룹 내 개수 값을 구하여 출력
mpg.value_counts('drv').to_frame('count') # 데이터 프레임으로 출력 (변수 이름 count)
```

```python
# 시리즈 데이터 타입에는 query() 함수를 사용할 수 없음

# mpg.value_counts('drv').query('count > 100')
```

```python
# 구동방식 drv에 대한 그룹 내 개수가 100개 초과인 구동방식(drv)을 구하여 출력
mpg.value_counts('drv').to_frame('count').query('count > 100')
```

##### Lab4. mpg 데이터에서 suv 제조사의 합산 평균 연비 상위 1 ~ 5위 제조사 출력하기

```python
# (1) mpg.csv 파일을 데이터 프레임 mpg로 읽어 들임
mpg = pd.read_csv("mpg.csv")
```

```python
mpg.head(3)
```

```python
# (2) 데이터 프레임 mpg에서 차종(category)가 suv인 자동차만 골라 mpg_new로 생성
mpg_new = mpg.query('category == "suv"')
mpg_new.head(3)
```

```python
# (3) SUV 데이터의 도시·고속도로 연비 평균을 total로 추가
mpg_new = mpg_new.assign(total=lambda x: (x["hwy"] + x["cty"]) / 2)
mpg_new.head(3)
```

```python
# (4) 제조사(manufacturer)에 따라 그룹화하고, 그룹별로
# mean_tot 변수에 통합연비 total에 대한 평균(mean) 값을 구하여 mpg_new에 저장
mpg_new = mpg_new.groupby('manufacturer')\
                .agg(mean_tot = ('total', 'mean'))
mpg_new.head(3)
```

```python
# (5) mpg_new를 평균 연비 변수 mean_tot 값을 기준으로 내림차순으로 정렬
mpg_new = mpg_new.sort_values('mean_tot', ascending = False)
mpg_new.head(3)
```

```python
# (6) mpg_new 데이터 프레임을 상위 5개 값을 출력
mpg_new.head(5)
```

```python
# 앞의 작업을 하나의 pandas 구문으로 처리
(
    mpg.query('category == "suv"')
    .assign(total=lambda x: (x["hwy"] + x["cty"]) / 2)
    .groupby("manufacturer")
    .agg(mean_tot=("total", "mean"))
    .sort_values("mean_tot", ascending=False)
    .head(5)
)
```

##### Lab5. 혼자서 해보기(mpg 데이터 분석)

```python
# 데이터 mpg.csv를 데이터 프레임 mpg로 읽어 들임
mpg = pd.read_csv("mpg.csv")
```

```python
mpg.head(3)
```

```python
# 차종(category)에 따라 그룹화하고, 그룹별로
# mean_cty 변수에 도시연비 cty에 대한 평균(mean) 값을 구하여 출력

## mpg.groupby('      ').agg(mean_cty = ('     ', '       '))
```

```python
# 차종(category)에 따라 그룹화하고, 그룹별로
# mean_cty 변수에 도시연비 cty에 대한 평균(mean) 값을 구한 다음
# 차종별 도시 평균 연비 mean_cty의 값에 따라 내림 차순으로 정렬
mpg.groupby('category').agg(mean_cty = ('cty', 'mean')).sort_values('mean_cty', ascending=False)
```

```python
# 제조사(manufacturer)에 따라 그룹화하고, 그룹별로
# mean_hwy 변수에 고속도로연비 hwy에 대한 평균(mean) 값을 구함

## mpg.groupby('       ').agg(mean_hwy = ('      ', '       '))
```

```python
# 제조사(manufacturer)에 따라 그룹화하고, 그룹별로
# mean_hwy 변수에 고속도로연비 hwy에 대한 평균(mean) 값을 구한 다음
# 제조사별 고속도로 평균 연비 mean_hwy의 값에 따라 내림 차순으로 정렬하고
# 상위 3개 회사 정보 출력

## mpg.groupby('          ') \
##   .agg(mean_hwy = ('     ', '      ')) \
##   .sort_values('mean_hwy', ascending=        ) \
##   .head(3)
```

```python
# compact 차종 데이터만 추출
mpg.query('category == "compact"').head()
```

```python
# compact 차종 데이터만 추출하여 데이터 프레임 mpg_new에 저장
mpg_new = mpg.query('category == "compact"')
```

```python
# 제조사(manufacturer)에 따라 그룹화하고, 그룹별로
# count_compact 변수에 차종(category)별 개수(count) 값을 저장하여 출력

mpg_new.groupby('manufacturer') \
       .agg(count_compact = ('category', 'count'))
```

```python
# 제조사(manufacturer)에 따라 그룹화하고, 그룹별로
# count_compact 변수에 차종(category)별 개수(count) 값을 저장하고
# 차종별 개수 count_compact 값에 따라 내림 차순으로 정렬 

## mpg_new.groupby('        ') \
##       .agg(count_compact = ('        ', '        ')) \
##       .sort_values('count_compact', ascending=      )
```

```python
# 제조사(manufacturer)에 따라 그룹화하고
# 제조사에 따른 그룹별 개수를 출력
mpg_new.value_counts('manufacturer')
```

##### Lab1. 가로로 합치기

```python
# 중간고사
test1 = pd.DataFrame( {'id' : [1, 2, 3, 4, 5],
                       'midterm' : [60, 80, 70, 90, 85]
                      })
```

```python
test1
```

```python
# 기말고사
test2 = pd.DataFrame( {'id' : [1, 2, 3, 4, 5],
                       'finalterm' : [70, 83, 65, 95, 80]
                      })
```

```python
test2
```

```python
total = pd.merge(test1, test2, how = 'left', on = 'id')
```

```python
total
```

```python
# 반별 담임 선생님
name = pd.DataFrame({'nclass' : [1, 2, 3, 4, 5],
                     'teacher' : ['kim', 'lee', 'park', 'choi', 'jung']
                    })
name
```

```python
exam.head(3)
```

```python
exam_new  = pd.merge(exam, name, how = 'left', on='nclass')
exam_new
```

##### 속성

```python
import pandas as pd
fruit = pd.DataFrame({'Num':[123, 456, 789, 1011, 1112], 'Fruit':['Apple', 'Banana', 'Cherry', 'Lemon', 'Peach']})
grade = pd.DataFrame({'Num':[123, 789, 1314], 'Grade':['A', 'B', 'C']})
fruit
```

```python
grade
```

```python
#Left Join
#: 왼쪽 데이터프레임을 기준으로 조인한다. 오른쪽 데이터프레임에 없는 값은 NaN으로 나타난다.
pd.merge(fruit, grade, on = 'Num', how = 'left')
```

```python
#Right Join
#: 오른쪽 데이터프레임을 기준으로 조인한다. 왼쪽 데이터프레임에 없는 값은 NaN으로 나타난다.

pd.merge(fruit, grade, on = 'Num', how = 'right')
```

```python
#Inner Join
#: 교집합을 의미한다. 양쪽에 공통으로 있는 값만 나타난다. 
pd.merge(fruit, grade, on = 'Num', how = 'inner')
```

```python
#Outer Join
#: 모든 값이 나타나도록 한다. 왼쪽 데이터프레임과 오른쪽 데이터프레임에 없는 값들은 NaN으로 나타난다.
pd.merge(fruit, grade, on = 'Num', how = 'outer')
```

##### Lab2. 세로로 합치기 (concat())

```python
group_a = pd.DataFrame({'id' : [1, 2, 3, 4, 5],
                        'test' : [60, 80, 70, 90, 85]
                       })
```

```python
group_b = pd.DataFrame({'id' : [6, 7, 8, 9, 10],
                        'test' : [70, 83, 65, 95, 80]
                       })
```

```python
group_a
```

```python
group_b
```

```python
group_all = pd.concat([group_a, group_b])
group_all
```

```python
group_all = pd.concat([group_a, group_b], ignore_index=True)
group_all
```

##### concat()은 반드시 column이 동일해야 하나요?

```python
group_c = pd.DataFrame({'id' : [16, 17, 18, 19, 20],
                        'test' : [70, 83, 65, 95, 80],
                        'grade' : ['a', 'b','b','a','c']
                       })
group_c
```

```python
group_all2 = pd.concat([group_all, group_c])
group_all2
```

##### Lab3. 혼자서 해보기

```python
fuel = pd.DataFrame({'fl' : ['c', 'd', 'e', 'p', 'r'],
                     'price_fl' : [2.35, 2.38, 2.11, 2.76, 2.22]
                    })
fuel
```

```python
mpg = pd.read_csv("mpg.csv")
mpg.head(3)
```

```python
mpg = pd.merge(mpg, fuel, how='left', on='fl')
mpg.head(20)
```

```python
mpg[['model', 'fl', 'price_fl']].head(5)
```

##### Lab4. 분석 도전

```python
# 미국 동북중부 437개 지역의 인구 통계 데이터 midwest.csv 읽어 오기
midwest = pd.read_csv("midwest.csv")
midwest.head(3)
```

```python
# '전체 인구 대비 미성년 인구 백분율'인 파생 변수 ratio를 추가

## midwest['ratio'] = (midwest['       '] - midwest['       ']) / midwest['       '] * 100
## midwest.head(3)
```

```python
# 미국 동북중부 437개 지역의 인구 통계 데이터 midwest에서 변수 county, state, ratio 값만 출력
# midwest[['county', 'state', 'ratio']].head(3)
```

```python
# '전체 인구 대비 미성년 인구 백분율'인 파생 변수 ratio 값에 따라 내림차순 정렬
# 상위 5개 지역 출력

## midwest.sort_values('         ', ascending=       ).head()[['state', 'county', 'ratio']]
```

```python
# np.where() 연산 등을 수행하기 위해 numpy 패키지 로딩
#import numpy as np
```

```python
# ratio(전체 인구 대비 미성년 인구 백분율)이 40 이상이면 large
#                                           30 이상이면 middle
#                                           30 미만이면 small
# 값을 갖는 파생변수 grade 추가
#midwest['grade'] = np.where(midwest['ratio'] >= 40, 'large',
#                   np.where(midwest['ratio'] >= 30, 'middle', 'small' ))
#midwest.head()[['county', 'ratio', 'grade']]
```

```python
# grade 등급에 따라 그룹을 나누고, 그룹별로 
# count_grade 변수에 등급(grade)별 개수(count)를 구함
#midwest.groupby('grade').agg(count_grade = ('grade', 'count'))
```

```python
# 지역별 전체 인구 대비 아시아인 인구 백분율구하고,
# 파생변수 ratio_asian에 저장

## midwest.assign(ratio_asian = midwest['     ']/midwest['        '] * 100)
```

```python
# 지역별 전체 인구 대비 아시아인 인구 백분율구하고,
# 파생변수 ratio_asian에 저장
# ratio_asian(지역별 전체 인구 대비 아시아인 인구 백분율) 값을 기준으로 정렬(오름 차순)하고
# 하위 10개 지역 출력

## midwest.assign(ratio_asian = midwest['popasian']/midwest['poptotal'] * 100)\
##       .sort_values('        ')\
##       .head(10)[['state', 'county','ratio_asian']]
```

#### 종합 예제: SUV 제조사별 평균 연비 TOP 5

```python
(
    mpg.query('category == "suv"')
    .assign(total=lambda x: (x["hwy"] + x["cty"]) / 2)
    .groupby("manufacturer")
    .agg(mean_tot=("total", "mean"))
    .sort_values("mean_tot", ascending=False)
    .head(5)
)
```


## 6주차 — 데이터 정제와 시각화

###### 데이터 정제 흐름

```python
import numpy as np
import pandas as pd
```

##### 2. 결측치

```python
df = pd.DataFrame({
    "gender": ["M", "F", np.nan, "M", "F"],
    "score": [5, 4, 3, 4, np.nan],
})
```

```python
df["score"] + 1
```

###### 3.1 전체 위치 확인

```python
df.isna()
# pd.isna(df)와 동일한 목적
```

###### 3.2 열별 개수 확인

```python
df.isna().sum()
```

###### 3.3 특정 열의 개수 확인

```python
df["score"].isna().sum()
```

###### 3.4 여러 열만 확인

```python
df[["gender", "score"]].isna().sum()
```

###### 4.1 특정 열 기준 제거

```python
df_nomiss = df.dropna(subset=["score"])
```

###### 4.2 여러 열 기준 제거

```python
df_nomiss = df.dropna(subset=["gender", "score"])
```

###### 4.3 모든 열 기준 제거

```python
df_nomiss = df.dropna()
```

###### 4.4 원본과 반환값

```python
df.dropna(subset=["score"])
```

```python
df = df.dropna(subset=["score"])
```

##### 5. 결측치 대체

```python
mean_math = exam["math"].mean()
exam["math"] = exam["math"].fillna(mean_math)
```

###### 7.1 빈도 확인

```python
df["class"].value_counts().sort_index()
df["score"].value_counts().sort_index()
```

###### 7.2 조건에 따른 결측 처리

```python
df["class"] = np.where(
    df["class"] == 4,
    np.nan,
    df["class"],
)

df["score"] = np.where(
    df["score"] > 5,
    np.nan,
    df["score"],
)
```

###### 7.3 허용 목록 기준 처리

```python
allowed_drv = ["4", "f", "r"]

mpg["drv"] = np.where(
    mpg["drv"].isin(allowed_drv),
    mpg["drv"],
    np.nan,
)
```

###### 8.2 경계 계산

```python
q1 = mpg["hwy"].quantile(0.25)
q3 = mpg["hwy"].quantile(0.75)
iqr = q3 - q1

lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
```

###### 8.3 극단치 확인

```python
extreme_mask = (mpg["hwy"] < lower) | (mpg["hwy"] > upper)
mpg.loc[extreme_mask, ["hwy"]]
```

###### 8.4 극단치의 결측 처리

```python
mpg["hwy"] = np.where(
    extreme_mask,
    np.nan,
    mpg["hwy"],
)
```

```python
(mpg["hwy"] < lower) | (mpg["hwy"] > upper)
```

###### 8.5 시각적 확인

```python
import seaborn as sns

sns.boxplot(data=mpg, y="hwy")
```

##### 9. 정제 절차

```python
# 처리 후 결측치 수
mpg[["drv", "hwy"]].isna().sum()

# 처리 전후 행 수
before = mpg.shape[0]
clean = mpg.dropna(subset=["drv", "hwy"])
after = clean.shape[0]

# 정제 데이터 분석
result = (
    clean.groupby("drv", as_index=False)
         .agg(mean_hwy=("hwy", "mean"))
)
```

##### 준비

```python
import numpy as np
import pandas as pd
import seaborn as sns
```

###### 문제

```python
df = pd.DataFrame({
    "gender": ["M", "F", np.nan, "M", "F"],
    "score": [5, 4, 3, 4, np.nan],
})
```

###### 풀이

```python
# 결측 위치
df.isna()

# 열별 결측치 개수
df.isna().sum()

# score의 결측치 개수
df["score"].isna().sum()
```

```python
# 1. score 기준
score_clean = df.dropna(subset=["score"])

# 2. gender와 score 기준
two_columns_clean = df.dropna(subset=["gender", "score"])

# 3. 전체 열 기준
all_columns_clean = df.dropna()
```

```python
exam = pd.read_csv("exam.csv")

# 결측치 생성
exam.loc[[2, 7, 14], "math"] = np.nan

# 결측치를 제외한 평균
mean_math = exam["math"].mean()

# 평균값 대체
exam["math"] = exam["math"].fillna(mean_math)

# 검증
exam["math"].isna().sum()
```

###### 문제

```python
mpg = pd.read_csv("mpg.csv")
mpg.loc[[64, 123, 130, 152, 211], "hwy"] = np.nan
```

###### 풀이

```python
# 1. 결측치 수
missing_count = mpg[["drv", "hwy"]].isna().sum()

# 2. 정제 후 집계
mean_hwy_by_drv = (
    mpg.dropna(subset=["drv", "hwy"])
       .groupby("drv", as_index=False)
       .agg(mean_hwy=("hwy", "mean"))
       .sort_values("mean_hwy", ascending=False)
)

missing_count
mean_hwy_by_drv
```

###### 문제

```python
df = pd.DataFrame({
    "class": [1, 2, 4, 3, 4, 1],
    "score": [5, 4, 3, 4, 2, 6],
})
```

###### 풀이

```python
# 이상치 탐색
df["class"].value_counts().sort_index()
df["score"].value_counts().sort_index()

# 이상치의 결측 처리
df["class"] = np.where(df["class"].isin([1, 2, 3]), df["class"], np.nan)
df["score"] = np.where(df["score"].between(1, 5), df["score"], np.nan)

# 정제 후 집계
mean_score_by_class = (
    df.dropna(subset=["class", "score"])
      .groupby("class", as_index=False)
      .agg(mean_score=("score", "mean"))
)
```

```python
mpg = pd.read_csv("mpg.csv")

# 1. 분포 확인
sns.boxplot(data=mpg, y="hwy")

# 2. IQR 경계 계산
q1 = mpg["hwy"].quantile(0.25)
q3 = mpg["hwy"].quantile(0.75)
iqr = q3 - q1

lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr

# 3. 극단치의 결측 처리
extreme = (mpg["hwy"] < lower) | (mpg["hwy"] > upper)
mpg.loc[extreme, "hwy"] = np.nan

# 4. 처리 결과 검증
extreme_count = mpg["hwy"].isna().sum()

# 5. 정제 후 집계
mean_hwy_by_drv = (
    mpg.dropna(subset=["hwy"])
       .groupby("drv", as_index=False)
       .agg(mean_hwy=("hwy", "mean"))
)
```

```python
mpg = pd.read_csv("mpg.csv")

# 이상치 추가
mpg.loc[[9, 13, 57, 92], "drv"] = "k"
mpg.loc[[28, 42, 128, 202], "cty"] = [3, 4, 39, 42]

# drv 정제
allowed_drv = ["4", "f", "r"]
mpg["drv"] = np.where(mpg["drv"].isin(allowed_drv), mpg["drv"], np.nan)

# cty의 IQR 경계
q1 = mpg["cty"].quantile(0.25)
q3 = mpg["cty"].quantile(0.75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr

# cty 정제
extreme_cty = (mpg["cty"] < lower) | (mpg["cty"] > upper)
mpg.loc[extreme_cty, "cty"] = np.nan

# 최종 분석
result = (
    mpg.dropna(subset=["drv", "cty"])
       .groupby("drv", as_index=False)
       .agg(mean_cty=("cty", "mean"))
       .sort_values("mean_cty", ascending=False)
)
```

##### 1. 시각화 기본 설정

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="whitegrid")
plt.rcParams["axes.unicode_minus"] = False
```

```python
# Windows
plt.rcParams["font.family"] = "Malgun Gothic"

# macOS
plt.rcParams["font.family"] = "AppleGothic"

# NanumGothic 설치 환경
plt.rcParams["font.family"] = "NanumGothic"
```

###### 3.1 기본 산점도

```python
mpg = pd.read_csv("mpg.csv")

sns.scatterplot(data=mpg, x="displ", y="hwy")
```

###### 3.2 축 범위 제한

```python
sns.scatterplot(data=mpg, x="displ", y="hwy").set(
    xlim=(3, 6),
    ylim=(10, 30),
)
```

###### 3.3 범주별 색상

```python
sns.scatterplot(
    data=mpg,
    x="displ",
    y="hwy",
    hue="drv",
)
```

###### 4.1 평균 막대 그래프

```python
mean_hwy = (
    mpg.groupby("drv", as_index=False)
       .agg(mean_hwy=("hwy", "mean"))
       .sort_values("mean_hwy", ascending=False)
)

sns.barplot(data=mean_hwy, x="drv", y="mean_hwy")
```

###### 4.2 빈도 막대 그래프

```python
sns.countplot(data=mpg, x="drv")
```

```python
drv_count = (
    mpg.groupby("drv", as_index=False)
       .agg(count=("drv", "count"))
)

sns.barplot(data=drv_count, x="drv", y="count")
```

###### 4.3 범주 순서

```python
order = mpg["model"].unique()
```

```python
order = sorted(mpg["model"].dropna().unique())
```

```python
order = mpg["model"].value_counts().index
```

```python
top5_order = mpg["model"].value_counts().head(5).index
sns.countplot(data=mpg, x="model", order=top5_order)
```

###### 5.1 날짜 변환

```python
economics = pd.read_csv("economics.csv")
economics["date"] = pd.to_datetime(economics["date"])
```

###### 5.2 날짜 요소 추출

```python
economics["year"] = economics["date"].dt.year
economics["month"] = economics["date"].dt.month
economics["day"] = economics["date"].dt.day
```

###### 5.3 원시 시계열

```python
sns.lineplot(
    data=economics,
    x="date",
    y="unemploy",
)
```

###### 5.4 연도별 대표값

```python
yearly_unemploy = (
    economics.groupby("year", as_index=False)
             .agg(mean_unemploy=("unemploy", "mean"))
)

sns.lineplot(
    data=yearly_unemploy,
    x="year",
    y="mean_unemploy",
    errorbar=None,
)
```

##### 6. 상자 그림

```python
sns.boxplot(data=mpg, x="drv", y="hwy")
```

```python
sns.boxplot(data=mpg, x="drv", y="hwy")
sns.stripplot(data=mpg, x="drv", y="hwy", color="black", alpha=0.3)
```

##### 8. 핵심 코드

```python
# 산점도
sns.scatterplot(data=mpg, x="displ", y="hwy", hue="drv")

# 평균 막대 그래프
summary = (
    mpg.groupby("drv", as_index=False)
       .agg(mean_hwy=("hwy", "mean"))
)
sns.barplot(data=summary, x="drv", y="mean_hwy")

# 빈도 막대 그래프
sns.countplot(data=mpg, x="drv")

# 선 그래프
sns.lineplot(data=economics, x="date", y="unemploy")

# 상자 그림
sns.boxplot(data=mpg, x="drv", y="hwy")
```

##### 준비

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="whitegrid")
plt.rcParams["axes.unicode_minus"] = False
```

###### 풀이

```python
mpg = pd.read_csv("mpg.csv")

sns.scatterplot(data=mpg, x="cty", y="hwy")
plt.title("도시 연비와 고속도로 연비")
plt.show()
```

```python
midwest = pd.read_csv("midwest.csv")

ax = sns.scatterplot(
    data=midwest,
    x="poptotal",
    y="popasian",
)
ax.set(xlim=(0, 500_000), ylim=(0, 10_000))
plt.show()
```

```python
mpg = pd.read_csv("mpg.csv")

mean_hwy = (
    mpg.groupby("drv", as_index=False)
       .agg(mean_hwy=("hwy", "mean"))
       .sort_values("mean_hwy", ascending=False)
)

sns.barplot(data=mean_hwy, x="drv", y="mean_hwy")
plt.show()
```

###### 풀이 A. `countplot()`

```python
order = ["4", "f", "r"]
sns.countplot(data=mpg, x="drv", order=order)
plt.show()
```

###### 풀이 B. 집계 후 `barplot()`

```python
drv_count = (
    mpg.groupby("drv", as_index=False)
       .agg(count=("drv", "count"))
)

sns.barplot(data=drv_count, x="drv", y="count")
plt.show()
```

###### 풀이

```python
# 1. 원본 등장 순서
original_order = mpg["model"].unique()
sns.countplot(data=mpg, x="model", order=original_order)
plt.xticks(rotation=90)
plt.show()

# 2. 모델명 오름차순
alphabetical_order = sorted(mpg["model"].dropna().unique())
sns.countplot(data=mpg, x="model", order=alphabetical_order)
plt.xticks(rotation=90)
plt.show()

# 3. 빈도 내림차순 상위 5개
top5_order = mpg["model"].value_counts().head(5).index
sns.countplot(data=mpg, x="model", order=top5_order)
plt.xticks(rotation=30)
plt.show()
```

```python
suv_top5 = (
    mpg.query('category == "suv"')
       .groupby("manufacturer", as_index=False)
       .agg(mean_cty=("cty", "mean"))
       .sort_values("mean_cty", ascending=False)
       .head(5)
)

sns.barplot(
    data=suv_top5,
    x="manufacturer",
    y="mean_cty",
    order=suv_top5["manufacturer"],
)
plt.show()
```

###### 풀이 A. `countplot()`

```python
category_order = mpg["category"].value_counts().index

sns.countplot(
    data=mpg,
    x="category",
    order=category_order,
)
plt.xticks(rotation=30)
plt.show()
```

###### 풀이 B. 집계 후 `barplot()`

```python
category_count = (
    mpg.groupby("category", as_index=False)
       .agg(count=("category", "count"))
       .sort_values("count", ascending=False)
)

sns.barplot(
    data=category_count,
    x="category",
    y="count",
    order=category_count["category"],
)
plt.xticks(rotation=30)
plt.show()
```

###### 풀이

```python
economics = pd.read_csv("economics.csv")
economics["date"] = pd.to_datetime(economics["date"])
economics["year"] = economics["date"].dt.year

yearly_unemploy = (
    economics.groupby("year", as_index=False)
             .agg(mean_unemploy=("unemploy", "mean"))
)

sns.lineplot(
    data=yearly_unemploy,
    x="year",
    y="mean_unemploy",
    errorbar=None,
)
plt.show()
```

```python
economics = pd.read_csv("economics.csv")
economics["date"] = pd.to_datetime(economics["date"])
economics["year"] = economics["date"].dt.year

yearly_psavert = (
    economics.groupby("year", as_index=False)
             .agg(mean_psavert=("psavert", "mean"))
)

sns.lineplot(
    data=yearly_psavert,
    x="year",
    y="mean_psavert",
    errorbar=None,
)
plt.show()
```

```python
economics["month"] = economics["date"].dt.month

economics_2014 = economics.query("year == 2014")

sns.lineplot(
    data=economics_2014,
    x="month",
    y="psavert",
    marker="o",
    errorbar=None,
)
plt.xticks(range(1, 13))
plt.show()
```

```python
sns.boxplot(data=mpg, x="drv", y="hwy")
plt.show()
```

```python
selected = mpg.query(
    'category in ["compact", "subcompact", "suv"]'
)

sns.boxplot(
    data=selected,
    x="category",
    y="cty",
    order=["compact", "subcompact", "suv"],
)
plt.show()
```

