# 빅데이터실습 6주차 — 데이터 정제

## 07 데이터 정제 개념

### 1. 데이터 정제

**데이터 정제(Data Cleaning)**: 분석 전에 결측치, 이상치, 잘못된 형식 등을 찾아 수정하는 작업

- 현장 데이터에 포함될 수 있는 입력 오류와 누락값 처리
- 분석 결과의 신뢰도 향상을 위한 필수 단계
- 원본 보존 후 정제본을 별도 변수에 저장하는 방식 권장

#### 데이터 정제 흐름

```mermaid
flowchart LR
    A[원본 보존] --> B[데이터 품질 탐색]
    B --> C{문제 유형}
    C -->|결측치| D[제거 또는 대체]
    C -->|이상치| E[도메인 또는 IQR 기준 적용]
    D --> F[처리 결과 검증]
    E --> F
    F --> G[정제 데이터 분석]
```

``` python
import numpy as np
import pandas as pd
```

### 2. 결측치

**결측치(Missing Value)**: 값이 비어 있거나 관측되지 않은 데이터

**`NaN`(Not a Number)**: `pandas`와 `NumPy`에서 자주 사용하는 결측치 표현

``` python
df = pd.DataFrame({
    "gender": ["M", "F", np.nan, "M", "F"],
    "score": [5, 4, 3, 4, np.nan],
})
```

결측치가 포함된 산술 연산의 주요 특징:

``` python
df["score"] + 1
```

- 일반 값: 정상 연산
- `NaN`: 결과도 `NaN`
- 통계 함수: 기본적으로 결측치 제외 후 계산

### 3. 결측치 확인

#### 3.1 전체 위치 확인

``` python
df.isna()
# pd.isna(df)와 동일한 목적
```

- 결측 위치: `True`
- 정상 위치: `False`

#### 3.2 열별 개수 확인

``` python
df.isna().sum()
```

#### 3.3 특정 열의 개수 확인

``` python
df["score"].isna().sum()
```

#### 3.4 여러 열만 확인

``` python
df[["gender", "score"]].isna().sum()
```

### 4. 결측치 제거

**`dropna()`**: 결측치가 있는 행 또는 열 제거

#### 4.1 특정 열 기준 제거

``` python
df_nomiss = df.dropna(subset=["score"])
```

- `score`가 결측치인 행만 제거
- 다른 열의 결측치 유지 가능

#### 4.2 여러 열 기준 제거

``` python
df_nomiss = df.dropna(subset=["gender", "score"])
```

- 두 열 가운데 하나라도 결측치인 행 제거

#### 4.3 모든 열 기준 제거

``` python
df_nomiss = df.dropna()
```

- 어느 열에든 결측치가 있는 행 제거
- 분석에 필요한 행까지 잃을 가능성
- 분석 대상 열만 `subset`으로 지정하는 방식 권장

#### 4.4 원본과 반환값

``` python
df.dropna(subset=["score"])
```

- 새 `DataFrame` 반환
- 원본 `df` 유지
- 결과 보관 시 새 변수 또는 명시적 할당 필요

``` python
df = df.dropna(subset=["score"])
```

### 5. 결측치 대체

**결측치 대체(Imputation)**: 결측치를 대표값이나 규칙 기반 값으로 교체하는 작업

**`fillna()`**: 결측치에 지정한 값 삽입

``` python
mean_math = exam["math"].mean()
exam["math"] = exam["math"].fillna(mean_math)
```

대표적인 대체 기준:

| 데이터 유형 | 대체 후보          | 주의점                            |
|-------------|--------------------|-----------------------------------|
| 수치형      | 평균, 중앙값       | 극단치가 많을 때 중앙값 우선 검토 |
| 범주형      | 최빈값, 별도 범주  | 실제 의미와 구분되는 값 사용      |
| 시계열      | 앞값, 뒷값, 보간값 | 시간 순서와 추세 확인 필요        |

평균 대체의 주요 특성:

- 전체 행 수 유지
- 평균 주변으로 값이 모이는 현상
- 분산과 변수 간 관계 왜곡 가능성
- 결측 발생 원인 검토 후 사용

### 6. 이상치

**이상치(Outlier)**: 정상 범위나 예상 규칙에서 크게 벗어난 값

두 가지 대표 유형:

- **논리적 이상치**: 허용 범위 또는 범주 밖의 값
  - 1~3반만 존재하는 데이터의 `4반`
  - 1~5점 척도의 `6점`
- **통계적 극단치**: 분포상 다른 관측값과 크게 떨어진 값
  - 몸무게 `930kg`
  - 연비 분포의 수염 범위 밖 값

이상치 처리 전 확인 항목:

- 실제 관측값인지 입력 오류인지 구분
- 도메인 기준과 통계 기준의 적합성
- 제거가 표본 크기와 분석 결과에 미치는 영향

### 7. 존재할 수 없는 값 처리

#### 7.1 빈도 확인

``` python
df["class"].value_counts().sort_index()
df["score"].value_counts().sort_index()
```

#### 7.2 조건에 따른 결측 처리

**`np.where(조건, 참일 때 값, 거짓일 때 값)`**: 조건에 따른 값 선택

``` python
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

#### 7.3 허용 목록 기준 처리

**`isin()`**: 값이 허용 목록에 포함되는지 검사

``` python
allowed_drv = ["4", "f", "r"]

mpg["drv"] = np.where(
    mpg["drv"].isin(allowed_drv),
    mpg["drv"],
    np.nan,
)
```

### 8. IQR 기반 극단치 처리

#### 8.1 상자 그림 구성

**상자 그림(Box Plot)**: 사분위수와 극단치를 함께 표현하는 그래프

| 요소      | 의미                     |
|-----------|--------------------------|
| Q1        | 1사분위수, 하위 25% 지점 |
| Q2        | 중앙값, 하위 50% 지점    |
| Q3        | 3사분위수, 하위 75% 지점 |
| IQR       | `Q3 - Q1`                |
| 아래 경계 | `Q1 - 1.5 × IQR`         |
| 위 경계   | `Q3 + 1.5 × IQR`         |

경계 밖 관측값을 극단치 후보로 분류

#### 상자 그림 구조

```text
극단치       아래 수염              IQR               위 수염       극단치
  ●             │          ┌─────────┬─────────┐          │             ●
────────────────┼──────────┤   Q1    │ Q2 │ Q3 ├──────────┼────────────────
                │          └─────────┴─────────┘          │
                           25%      50%      75%
```

- `Q2`: 중앙값
- 상자 길이: `Q3 - Q1`
- 수염 밖 점: 극단치 후보

#### 8.2 경계 계산

``` python
q1 = mpg["hwy"].quantile(0.25)
q3 = mpg["hwy"].quantile(0.75)
iqr = q3 - q1

lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
```

#### 8.3 극단치 확인

``` python
extreme_mask = (mpg["hwy"] < lower) | (mpg["hwy"] > upper)
mpg.loc[extreme_mask, ["hwy"]]
```

#### 8.4 극단치의 결측 처리

``` python
mpg["hwy"] = np.where(
    extreme_mask,
    np.nan,
    mpg["hwy"],
)
```

조건별 괄호 사용 필수:

``` python
(mpg["hwy"] < lower) | (mpg["hwy"] > upper)
```

#### 8.5 시각적 확인

``` python
import seaborn as sns

sns.boxplot(data=mpg, y="hwy")
```

### 9. 정제 절차

``` text
원본 보존
  → 결측치와 이상치 탐색
  → 처리 기준 결정
  → 제거 또는 대체
  → 처리 결과 검증
  → 정제 데이터 분석
```

검증 예시:

``` python
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

### 10. 핵심 함수

| 목적              | 코드                                              |
|-------------------|---------------------------------------------------|
| 결측 위치 확인    | `df.isna()`                                       |
| 열별 결측 개수    | `df.isna().sum()`                                 |
| 특정 열 기준 제거 | `df.dropna(subset=["col"])`                       |
| 결측치 대체       | `df["col"].fillna(value)`                         |
| 빈도 확인         | `df["col"].value_counts()`                        |
| 조건별 값 선택    | `np.where(condition, a, b)`                       |
| 허용 목록 검사    | `df["col"].isin(values)`                          |
| 사분위수 계산     | `df["col"].quantile(0.25)`                        |
| 요약 통계         | `df["col"].describe()`                            |
| 그룹별 평균       | `df.groupby("group").agg(mean=("value", "mean"))` |

## 07 데이터 정제 문제풀이

### 준비

``` python
import numpy as np
import pandas as pd
import seaborn as sns
```

### 문제 1. 결측치 탐색

#### 문제

다음 데이터에서 열별 결측치 개수와 `score`의 결측치 개수 확인

``` python
df = pd.DataFrame({
    "gender": ["M", "F", np.nan, "M", "F"],
    "score": [5, 4, 3, 4, np.nan],
})
```

#### 풀이

``` python
# 결측 위치
df.isna()

# 열별 결측치 개수
df.isna().sum()

# score의 결측치 개수
df["score"].isna().sum()
```

#### 결과

| 열       | 결측치 수 |
|----------|----------:|
| `gender` |         1 |
| `score`  |         1 |

**핵심**: `isna()`의 불리언 결과에 `sum()`을 적용하는 방식

### 문제 2. 결측치 제거

#### 문제

문제 1의 `df`에서 다음 세 데이터 생성

1.  `score`가 결측치인 행만 제거한 데이터
2.  `gender` 또는 `score`가 결측치인 행을 제거한 데이터
3.  결측치가 하나라도 있는 행을 제거한 데이터

#### 풀이

``` python
# 1. score 기준
score_clean = df.dropna(subset=["score"])

# 2. gender와 score 기준
two_columns_clean = df.dropna(subset=["gender", "score"])

# 3. 전체 열 기준
all_columns_clean = df.dropna()
```

#### 결과 비교

| 데이터              | 남은 행 인덱스 | 행 수 |
|---------------------|----------------|------:|
| `score_clean`       | 0, 1, 2, 3     |     4 |
| `two_columns_clean` | 0, 1, 3        |     3 |
| `all_columns_clean` | 0, 1, 3        |     3 |

**핵심**: 분석에 필요한 열만 `subset`으로 지정해 불필요한 행 손실 방지

### 문제 3. 평균값으로 결측치 대체

#### 문제

`exam.csv`의 `math` 열에서 인덱스 2, 7, 14를 결측치로 변경한 뒤 평균값으로 대체

#### 풀이

``` python
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

#### 결과

- 결측치 제외 평균: 약 `55.2353`
- 대체 후 결측치 수: `0`
- 원본 예제의 정수 대체값 `55` 대신 실제 평균 `mean_math` 사용

**핵심**: 계산값을 변수에 저장해 반올림에 따른 정보 손실 방지

### 문제 4. 구동 방식별 고속도로 연비

#### 문제

`mpg.csv`의 `hwy` 일부를 결측치로 바꾼 뒤 다음 항목 확인

1.  `drv`, `hwy`의 결측치 수
2.  `hwy` 결측치 제거 후 구동 방식별 평균 고속도로 연비
3.  평균 연비가 가장 높은 구동 방식

``` python
mpg = pd.read_csv("mpg.csv")
mpg.loc[[64, 123, 130, 152, 211], "hwy"] = np.nan
```

#### 풀이

``` python
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

#### 결과

| 구동 방식 | 평균 `hwy` |
|-----------|-----------:|
| `f`       |  28.200000 |
| `r`       |  21.000000 |
| `4`       |  19.242424 |

**해석**: 전륜 구동 `f`의 평균 고속도로 연비가 가장 높은 결과

### 문제 5. 허용 범위 밖 값 처리

#### 문제

- 허용 반: 1반, 2반, 3반
- 허용 점수: 1점부터 5점
- 이상치를 결측 처리한 뒤 반별 평균 점수 계산

``` python
df = pd.DataFrame({
    "class": [1, 2, 4, 3, 4, 1],
    "score": [5, 4, 3, 4, 2, 6],
})
```

#### 풀이

``` python
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

#### 결과

| 반  | 평균 점수 |
|-----|----------:|
| 1   |       5.0 |
| 2   |       4.0 |
| 3   |       4.0 |

**핵심**: 범주형 값은 `isin()`, 연속 범위는 `between()` 활용

### 문제 6. IQR 기반 고속도로 연비 극단치 처리

#### 문제

`mpg.csv`의 `hwy`에서 IQR 기준 극단치를 결측 처리한 뒤 구동 방식별 평균 계산

#### 풀이

``` python
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

#### 계산 결과

| 항목      |   값 |
|-----------|-----:|
| Q1        | 18.0 |
| Q3        | 27.0 |
| IQR       |  9.0 |
| 아래 경계 |  4.5 |
| 위 경계   | 40.5 |
| 극단치 수 |    3 |

#### 구동 방식별 평균

| 구동 방식 | 평균 `hwy` |
|-----------|-----------:|
| `4`       |  19.174757 |
| `f`       |  27.728155 |
| `r`       |  21.000000 |

**핵심**: IQR 경계 밖 값을 자동 삭제하기 전 실제 오류 여부 확인

### 문제 7. 구동 방식과 도시 연비 정제

#### 문제

`mpg.csv`에 다음 이상치 추가 후 정제

- `drv` 이상치: 인덱스 9, 13, 57, 92의 값 `k`
- `cty` 극단치: 인덱스 28, 42, 128, 202의 값 `3`, `4`, `39`, `42`
- 정제 후 구동 방식별 평균 도시 연비 계산

#### 풀이

``` python
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

#### 계산 결과

| 항목      |   값 |
|-----------|-----:|
| Q1        | 14.0 |
| Q3        | 19.0 |
| IQR       |  5.0 |
| 아래 경계 |  6.5 |
| 위 경계   | 26.5 |

#### 구동 방식별 평균

| 구동 방식 | 평균 `cty` |
|-----------|-----------:|
| `f`       |  19.470000 |
| `4`       |  14.247423 |
| `r`       |  13.958333 |

**해석**: 이상치 제거 후 전륜 구동 `f`의 평균 도시 연비가 가장 높은 결과

### 마무리 점검

- 원본 데이터 보존 여부
- 분석 대상 열 중심의 결측치 처리 여부
- 이상치 기준의 근거 기록 여부
- 처리 전후 행 수와 요약 통계 비교 여부
- 정제 후 결측치 재확인 여부
