# Streamlit 데이터 분석 수업 정리

## 실행 방법

```bash
python -m venv .venv
source .venv/bin/activate       # macOS / Linux
pip install -r requirements.txt
streamlit run app.py
```

Windows PowerShell에서는 가상 환경을 다음과 같이 활성화합니다.

```powershell
.venv\Scripts\Activate.ps1
```

## 코드별 설명

### 1. 라이브러리 불러오기

```python
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import plotly.express as px
import seaborn as sns
import streamlit as st
```

- `streamlit`: 웹 화면과 위젯을 만듭니다.
- `pandas`: CSV를 읽고 데이터를 필터링·집계합니다.
- `seaborn`, `matplotlib`: 정적인 통계 그래프를 만듭니다.
- `plotly.express`: 마우스로 확인할 수 있는 상호작용 그래프를 만듭니다.
- `Path`: 운영체제에 관계없이 파일 경로를 안전하게 다룹니다.

### 2. 페이지와 파일 경로 설정

```python
st.set_page_config(
    page_title="Streamlit 수업 정리",
    page_icon="📊",
    layout="wide",
)

DATA_PATH = Path(__file__).with_name("mpg.csv")
```

`st.set_page_config()`는 브라우저 탭 제목, 아이콘, 화면 너비를 설정합니다.
`DATA_PATH`는 실행 위치가 달라져도 항상 `app.py` 옆의 `mpg.csv`를 가리킵니다.

### 3. CSV 읽기와 캐시

```python
@st.cache_data
def load_mpg(path: Path) -> pd.DataFrame:
    return pd.read_csv(path)
```

Streamlit은 위젯을 조작할 때 코드를 위에서부터 다시 실행합니다.
`@st.cache_data`를 사용하면 파일이 바뀌지 않은 경우 이전 결과를 재사용하여 로딩을 줄일 수 있습니다.

### 4. 사이드바 메뉴

```python
selected_menu = st.sidebar.selectbox(
    "화면을 선택하세요",
    ["기본 컴포넌트", "MPG 분석", "탭 예제"],
)
```

`st.sidebar`는 왼쪽 사이드바에 내용을 배치합니다. `selectbox`의 반환값을
`if` 문으로 검사해 선택한 화면만 보여 줍니다.

### 5. Streamlit 기본 컴포넌트

```python
st.title("Streamlit 데이터 분석 실습")
st.text("hello, world")
st.image(IMAGE_URLS["image_1"])
st.video("https://youtu.be/1wHHlFE6M9U?si=BLYyFRhczzPXVoV9")
```

- `st.title()`: 큰 제목을 표시합니다.
- `st.text()`: 일반 텍스트를 표시합니다.
- `st.image()`: 파일 또는 이미지의 직접 URL을 표시합니다.
- `st.video()`: 동영상 파일이나 지원되는 동영상 URL을 표시합니다.

원본 코드의 Google 이미지 검색 결과 주소는 이미지 파일의 직접 URL이 아니어서
화면에 표시되지 않을 수 있습니다. 통합 코드에서는 실제 이미지 주소를 사용했습니다.

### 6. SUV 데이터 추출

```python
suv = mpg.query('category == "suv"')
```

`category` 값이 `suv`인 행만 선택합니다. 결과는 원본을 변경하지 않고 새로운
DataFrame인 `suv`에 저장됩니다.

### 7. 회사별 평균 연비 계산

```python
manufacturer_hwy = (
    suv.groupby("manufacturer", as_index=False)
    .agg(hwy_mean=("hwy", "mean"))
    .sort_values("hwy_mean", ascending=False)
)
```

처리 순서는 다음과 같습니다.

1. `manufacturer`를 기준으로 행을 그룹화합니다.
2. 각 그룹의 `hwy` 평균을 계산해 `hwy_mean` 열로 만듭니다.
3. 평균 연비가 높은 회사부터 볼 수 있도록 내림차순 정렬합니다.

`as_index=False`를 사용했기 때문에 `manufacturer`가 인덱스가 아닌 일반 열로
유지되어 표와 그래프에서 바로 사용할 수 있습니다.

### 8. Seaborn 시각화

```python
figure, axis = plt.subplots(figsize=(10, 5))
sns.barplot(
    data=manufacturer_hwy,
    x="manufacturer",
    y="hwy_mean",
    ax=axis,
)
st.pyplot(figure)
```

Seaborn으로 막대그래프를 만들고 `st.pyplot()`으로 Streamlit 화면에 출력합니다.
회사명이 겹치지 않도록 실제 코드에서는 x축 글자를 45도 회전했습니다.

### 9. Plotly 시각화

```python
interactive_chart = px.bar(
    manufacturer_hwy,
    x="manufacturer",
    y="hwy_mean",
)
st.plotly_chart(interactive_chart, use_container_width=True)
```

같은 집계 결과를 Plotly 막대그래프로 표현합니다. 사용자는 막대 위에 마우스를
올려 값을 확인하거나 그래프를 확대할 수 있습니다.

### 10. 탭 만들기

```python
tab1, tab2, tab3 = st.tabs(["tab1", "tab2", "tab3"])

with tab1:
    st.text("첫 번째 탭")
    st.image(IMAGE_URLS["image_1"])
```

`st.tabs()`는 한 화면을 여러 탭으로 나눕니다. `with tab1:` 아래에 작성한
컴포넌트는 첫 번째 탭에만 들어갑니다.

## 원본 코드에서 정리한 부분

- 중복된 `import` 문을 한 번만 작성했습니다.
- 기능별 코드를 함수로 분리해 흐름을 읽기 쉽게 만들었습니다.
- Google 이미지 검색 페이지 URL 대신 이미지 직접 URL을 사용했습니다.
- `mpg.csv` 또는 필수 열이 없을 때 오류 원인을 화면에 안내합니다.
- Seaborn 그래프의 x축 글자 겹침을 줄이고 Plotly 축 이름을 정리했습니다.
- 두 코드에 흩어져 있던 사이드바, 데이터 분석, 탭 예제를 하나의 앱으로 합쳤습니다.

## 핵심 실행 흐름

```text
앱 실행
  → 사이드바 메뉴 선택
      ├─ 기본 컴포넌트: 텍스트·이미지·동영상
      ├─ MPG 분석: CSV → SUV 필터 → 회사별 평균 → 표·그래프
      └─ 탭 예제: 세 개 탭에 서로 다른 콘텐츠 출력
```

