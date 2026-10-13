# 빅데이터실습 7주차 — 그래프 만들기

> 첨부된 `08 그래프 만들기.html`의 개념과 코드 셀을 정리한 문서입니다. 실행 결과표와 실제 데이터 출력, 그래프 이미지는 제외하고 개념 설명과 재현 가능한 코드만 수록했습니다.

## 학습 목표

- 분석 목적에 맞는 그래프 선택
- 산점도로 두 변수의 관계 표현
- 막대 그래프로 집단별 평균과 빈도 비교
- 선 그래프로 시간에 따른 변화 표현
- 상자 그림으로 집단별 분포 비교

## 08-1 파이썬으로 만들 수 있는 그래프

### 그래프 선택 기준

| 분석 목적 | 그래프 | 대표 함수 |
|---|---|---|
| 두 연속형 변수의 관계 | 산점도 | `sns.scatterplot()` |
| 집단별 평균·합계 비교 | 막대 그래프 | `sns.barplot()` |
| 범주별 개수 비교 | 빈도 막대 그래프 | `sns.countplot()` |
| 시간에 따른 변화 | 선 그래프 | `sns.lineplot()` |
| 집단별 분포 비교 | 상자 그림 | `sns.boxplot()` |

### 기본 패키지와 그래프 환경 설정

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
```

seaborn 테마 설정:

```python
sns.set_theme(style="dark")
# style 예시: whitegrid, darkgrid, ticks, white, dark
```

경고 메시지 설정:

```python
import warnings

# 그래프 관련 경고 숨기기
warnings.filterwarnings(action="ignore")

# 경고 표시를 기본값으로 되돌리기
# warnings.filterwarnings(action="default")
```

경고를 숨기면 중요한 오류 원인을 놓칠 수 있으므로 학습 중에는 경고 내용을 먼저 확인하는 편이 좋습니다.

한글과 음수 기호 설정:

```python
# 음수 기호 깨짐 방지
plt.rcParams["axes.unicode_minus"] = False

# Windows
plt.rcParams["font.family"] = "Malgun Gothic"

# macOS
# plt.rcParams["font.family"] = "AppleGothic"

# NanumGothic 설치 환경
# plt.rcParams["font.family"] = "NanumGothic"
```

Matplotlib 설정 디렉터리 확인:

```python
import matplotlib as mpl

mpl.get_configdir()
```

새 글꼴을 설치했는데 인식되지 않는 경우 Matplotlib 설정 디렉터리의 글꼴 캐시를 확인하고 Jupyter 서버를 다시 실행합니다.

### seaborn 예제 1 — FMRI 선 그래프

`hue`는 색상, `style`은 선 모양으로 범주를 구분합니다.

```python
import seaborn as sns

sns.set_theme(style="dark")

fmri = sns.load_dataset("fmri")

sns.lineplot(
    data=fmri,
    x="timepoint",
    y="signal",
    hue="region",
    style="event",
)
```

### seaborn 예제 2 — 상관관계 행렬 시각화

상관계수를 색상과 점 크기로 함께 표현하는 예제입니다.

```python
import seaborn as sns

sns.set_theme(style="whitegrid")

df = sns.load_dataset(
    "brain_networks",
    header=[0, 1, 2],
    index_col=0,
)

used_networks = [1, 5, 6, 7, 8, 12, 13, 17]

used_columns = (
    df.columns
      .get_level_values("network")
      .astype(int)
      .isin(used_networks)
)

df = df.loc[:, used_columns]
df.columns = df.columns.map("-".join)

corr_mat = (
    df.corr()
      .stack()
      .reset_index(name="correlation")
)

g = sns.relplot(
    data=corr_mat,
    x="level_0",
    y="level_1",
    hue="correlation",
    size="correlation",
    palette="vlag",
    hue_norm=(-1, 1),
    edgecolor=".7",
    height=10,
    sizes=(50, 250),
    size_norm=(-0.2, 0.8),
)

g.set(xlabel="", ylabel="", aspect="equal")
g.despine(left=True, bottom=True)
g.ax.margins(0.02)

for label in g.ax.get_xticklabels():
    label.set_rotation(90)

# seaborn 버전에 따라 범례 요소의 테두리를 직접 변경할 때 사용
# for artist in g.legend.legendHandles:
#     artist.set_edgecolor(".7")
```

## 08-2 산점도 — 변수 간 관계 표현

산점도는 두 연속형 변수의 값을 x축과 y축의 점으로 표현합니다. 관계의 방향, 군집, 비선형 패턴, 이상치를 확인할 때 사용합니다.

### 데이터 불러오기

```python
mpg = pd.read_csv("mpg.csv")
```

### 기본 산점도

배기량 `displ`과 고속도로 연비 `hwy`의 관계:

```python
sns.scatterplot(
    data=mpg,
    x="displ",
    y="hwy",
)
```

### 축 범위 설정

x축만 제한:

```python
sns.scatterplot(data=mpg, x="displ", y="hwy").set(
    xlim=(3, 6)
)
```

y축만 제한:

```python
sns.scatterplot(data=mpg, x="displ", y="hwy").set(
    ylim=(15, 30)
)
```

x축과 y축을 함께 제한:

```python
sns.scatterplot(data=mpg, x="displ", y="hwy").set(
    xlim=(3, 6),
    ylim=(10, 30),
)
```

축 범위를 제한하면 범위 밖의 데이터가 보이지 않으므로 그래프 해석 시 제한 범위를 함께 표시합니다.

### 범주별 색상 구분

`hue`에 범주형 변수를 지정하면 범주별로 점의 색상이 달라집니다.

```python
sns.scatterplot(
    data=mpg,
    x="displ",
    y="hwy",
    hue="drv",
)
```

차종 `category`로 색상을 구분하는 방법:

```python
sns.scatterplot(
    data=mpg,
    x="displ",
    y="hwy",
    hue="category",
)
```

### 실습 1 — 도시 연비와 고속도로 연비

```python
sns.scatterplot(
    data=mpg,
    x="cty",
    y="hwy",
)
```

차종별 색상 구분:

```python
sns.scatterplot(
    data=mpg,
    x="cty",
    y="hwy",
    hue="category",
)
```

산점도에서 함께 증가하거나 감소하는 패턴은 관계를 의미하지만 인과관계를 직접 증명하지는 않습니다.

### 실습 2 — 전체 인구와 아시아계 인구

```python
midwest = pd.read_csv("midwest.csv")

sns.scatterplot(
    data=midwest,
    x="poptotal",
    y="popasian",
).set(
    xlim=(0, 500_000),
    ylim=(0, 10_000),
)
```

## 08-3 막대 그래프 — 집단 간 차이 표현

막대 그래프는 집단별 평균이나 합계 같은 요약값을 비교할 때 사용합니다. 범주별 데이터 개수는 `countplot()`으로 바로 표현할 수 있습니다.

### 평균 막대 그래프

#### 1단계 — 집단별 평균표 생성

```python
df_mpg = (
    mpg.groupby("drv", as_index=False)
       .agg(mean_hwy=("hwy", "mean"))
)

df_mpg
```

`as_index=False`를 사용하면 그룹 기준인 `drv`가 인덱스가 아니라 일반 열로 유지됩니다.

#### 2단계 — 평균 막대 그래프 생성

```python
sns.barplot(
    data=df_mpg,
    x="drv",
    y="mean_hwy",
)
```

#### 3단계 — 평균 내림차순 정렬

```python
df_mpg = df_mpg.sort_values(
    "mean_hwy",
    ascending=False,
)

sns.barplot(
    data=df_mpg,
    x="drv",
    y="mean_hwy",
)
```

### `as_index=False`를 사용하지 않는 경우

```python
df_mpg_index = (
    mpg.groupby("drv")
       .agg(mean_hwy=("hwy", "mean"))
)

df_mpg_index
```

`drv`가 인덱스가 됩니다. 예전 seaborn에서는 열만 축에 지정할 수 있어 오류가 발생할 수 있었지만 최신 버전에서는 인덱스를 축으로 처리할 수 있습니다. 버전에 상관없이 명확한 표 구조를 유지하려면 `as_index=False` 사용을 권장합니다.

```python
sns.barplot(
    data=df_mpg_index,
    x="drv",
    y="mean_hwy",
)
```

### 빈도 막대 그래프

#### 방법 1 — 집계표를 만든 뒤 `barplot()` 사용

```python
df_mpg = (
    mpg.groupby("drv", as_index=False)
       .agg(count_drv=("drv", "count"))
)

sns.barplot(
    data=df_mpg,
    x="drv",
    y="count_drv",
)
```

#### 방법 2 — `countplot()`으로 바로 집계

```python
sns.countplot(
    data=mpg,
    x="drv",
)
```

### 범주 순서 변경

```python
sns.countplot(
    data=mpg,
    x="drv",
    order=["4", "f", "r"],
)
```

### 자동차 모델 빈도 정렬

모델 열 확인:

```python
mpg[["model"]].head(20)
```

원본 데이터에서 처음 등장한 순서:

```python
original_order = mpg["model"].unique()

sns.countplot(
    data=mpg,
    x="model",
    order=original_order,
)
```

모델명 오름차순:

```python
model_count_mpg = (
    mpg.groupby("model", as_index=False)
       .agg(model_count=("model", "count"))
)

alphabetical_order = model_count_mpg["model"].unique()

sns.countplot(
    data=mpg,
    x="model",
    order=alphabetical_order,
)
```

빈도 내림차순:

```python
frequency_order = mpg["model"].value_counts().index

sns.countplot(
    data=mpg,
    x="model",
    order=frequency_order,
)
```

빈도 상위 5개 모델만 표시:

```python
top5_order = mpg["model"].value_counts().head(5).index

sns.countplot(
    data=mpg,
    x="model",
    order=top5_order,
)
```

### 실습 1 — SUV 도시 연비 상위 5개 회사

작업 순서: SUV 추출 → 회사별 평균 → 내림차순 정렬 → 상위 5개 추출 → 그래프 생성

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
```

HTML 원본에 있는 한글 결과 열 이름과 `sort_index()`를 사용한 작성 방식:

```python
mpg_suv_top5 = (
    mpg.query('category == "suv"')
       .groupby("manufacturer", as_index=False)
       .agg(시티연비평균=("cty", "mean"))
       .sort_values("시티연비평균", ascending=False)
       .head(5)
       .sort_index()
)

sns.barplot(
    data=mpg_suv_top5,
    x="manufacturer",
    y="시티연비평균",
)
```

`sort_index()`는 평균값 순서가 아니라 기존 행 인덱스 순서로 다시 정렬합니다. 상위 5개의 순위를 그래프에서도 유지하려면 `sort_index()`를 생략하고 첫 번째 방식을 사용합니다.

단계별로 확인하는 코드:

```python
mpg.head(3)

mpg.query('category == "suv"').head(3)

mpg.query('category == "suv"') \
   .groupby("manufacturer", as_index=False) \
   .agg(mean_cty=("cty", "mean"))

mpg.query('category == "suv"') \
   .groupby("manufacturer", as_index=False) \
   .agg(mean_cty=("cty", "mean")) \
   .sort_values("mean_cty", ascending=False)
```

### 실습 2 — 자동차 종류별 빈도

집계표를 이용하는 방법:

```python
mpg_category = (
    mpg.groupby("category", as_index=False)
       .agg(category_totalcount=("category", "count"))
       .sort_values("category_totalcount", ascending=False)
)

sns.barplot(
    data=mpg_category,
    x="category",
    y="category_totalcount",
    order=mpg_category["category"],
)
```

`countplot()`을 이용하는 방법:

```python
category_order = mpg["category"].value_counts().index

sns.countplot(
    data=mpg,
    x="category",
    order=category_order,
)
```

## 08-4 선 그래프 — 시간에 따라 달라지는 데이터 표현

시계열 데이터는 일정한 시간 간격으로 관측된 데이터입니다. 선 그래프는 시간 순서에 따른 변화와 추세를 표현할 때 사용합니다.

### economics 데이터 확인

```python
economics = pd.read_csv("economics.csv")

economics.head()
economics.shape
economics.info()
economics.describe()
```

위 코드는 실제 데이터를 문서에 복사하지 않고 데이터의 구조, 자료형, 결측치, 요약 통계를 실행 환경에서 확인합니다.

### 문자열 날짜로 선 그래프 생성

```python
sns.set_style("whitegrid")

sns.lineplot(
    data=economics,
    x="date",
    y="unemploy",
)
```

문자열 날짜를 그대로 사용하면 x축 날짜가 겹치거나 시간 계산이 어려울 수 있습니다.

### 날짜 자료형 변환

원본 열을 유지하고 `date2` 열을 추가하는 방법:

```python
economics["date2"] = pd.to_datetime(economics["date"])

economics.info()
economics[["date", "date2"]].head()
```

원본 `date` 열을 직접 변환하는 방법:

```python
economics["date"] = pd.to_datetime(economics["date"])
```

### 연·월·일 추출

개별 확인:

```python
economics["date2"].dt.year
economics["date2"].dt.month
economics["date2"].dt.day
```

새로운 열로 추가:

```python
economics["year"] = economics["date2"].dt.year
economics["month"] = economics["date2"].dt.month
economics["day"] = economics["date2"].dt.day

economics.head(10)
```

`date` 열을 직접 변환한 경우에는 다음과 같이 작성합니다.

```python
economics["year"] = economics["date"].dt.year
economics["month"] = economics["date"].dt.month
economics["day"] = economics["date"].dt.day
```

### 연도별 실업자 수

seaborn의 기본 추정선과 신뢰구간을 표시하는 방법:

```python
sns.lineplot(
    data=economics,
    x="year",
    y="unemploy",
)
```

특정 연도의 분포 확인:

```python
economics.query("year == 1982")[["unemploy"]].describe()
```

Series를 DataFrame으로 변환해 확인하는 원본 방식:

```python
economics.query("year == 1982")["unemploy"].to_frame().describe()
```

신뢰구간을 표시하지 않는 방법:

```python
sns.lineplot(
    data=economics,
    x="year",
    y="unemploy",
    errorbar=None,
)
```

연도별 평균을 직접 계산한 뒤 그리는 방법:

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

직접 집계하면 그래프가 어떤 통계량을 나타내는지 명확해집니다.

### 실습 1 — 연도별 개인 저축률

```python
economics = pd.read_csv("economics.csv")
economics["date2"] = pd.to_datetime(economics["date"])
economics["year"] = economics["date2"].dt.year

sns.lineplot(
    data=economics,
    x="year",
    y="psavert",
    errorbar=None,
)
```

연도별 평균을 직접 계산하는 방법:

```python
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
```

### 실습 2 — 2014년 월별 개인 저축률

```python
economics["month"] = economics["date2"].dt.month

df_2014 = economics.query("year == 2014")
df_2014.head()

sns.lineplot(
    data=df_2014,
    x="month",
    y="psavert",
    marker="o",
    errorbar=None,
)
```

한 달에 관측값이 여러 개라면 월별 평균처럼 사용할 대표값을 먼저 집계해야 합니다.

## 08-5 상자 그림 — 집단 간 분포 차이 표현

상자 그림은 중앙값, 사분위수, IQR, 수염, 극단치 후보를 한 번에 확인할 수 있는 그래프입니다.

### 구동 방식별 고속도로 연비

```python
mpg = pd.read_csv("mpg.csv")

sns.boxplot(
    data=mpg,
    x="drv",
    y="hwy",
)
```

상자 그림 해석 순서:

1. 중앙값 비교
2. 상자의 높이인 IQR 비교
3. 수염 길이 비교
4. 수염 밖의 극단치 후보 확인
5. 집단별 표본 수 확인

상자 안의 굵은 선은 평균이 아니라 중앙값입니다.

### 자동차 종류별 도시 연비

```python
mpg = pd.read_csv("mpg.csv")

df = mpg.query(
    'category in ["compact", "subcompact", "suv"]'
)

df.value_counts()

sns.boxplot(
    data=df,
    x="category",
    y="cty",
    order=["compact", "subcompact", "suv"],
)
```

상자 그림은 평균 하나가 아니라 집단별 분포 전체를 비교하는 데 사용합니다. 정확한 평균, 전체 밀도, 집단별 표본 수는 상자 그림만으로 확인하기 어렵습니다.

필요한 경우 개별 관측점 추가:

```python
sns.boxplot(data=mpg, x="drv", y="hwy")
sns.stripplot(
    data=mpg,
    x="drv",
    y="hwy",
    color="black",
    alpha=0.3,
)
```

## 핵심 정리

- 산점도: 두 연속형 변수의 관계 확인
- 막대 그래프: 집단별 요약값 비교
- 빈도 막대 그래프: 범주별 개수 비교
- 선 그래프: 시간에 따른 변화 확인
- 상자 그림: 집단별 분포 비교
- `hue`: 범주별 색상 구분
- `order`: 범주 표시 순서 지정
- `pd.to_datetime()`: 문자열 날짜를 날짜 자료형으로 변환
- `dt.year`, `dt.month`, `dt.day`: 날짜 요소 추출
- 그래프를 그리기 전에 결측치, 이상치, 단위, 축 범위 확인
- 상관관계만으로 인과관계를 확정하지 않기
