# Week11 — 지도 시각화

## 학습 목표

- Folium으로 지도를 만들고 위도·경도로 대학 위치 표시하기
- GeoJSON의 경계와 CSV의 인구를 행정구역 코드로 연결하기
- 등간격 구간과 분위수 구간을 비교하고 단계 구분도 만들기
- 서울시 동별 지도 위에 구 경계선을 추가하고 HTML로 저장하기

| 알고 싶은 것 | 필요한 데이터 | Folium 기능 |
| --- | --- | --- |
| 대학이 어디에 있나? | 대학별 위도·경도 | `Marker`, `CircleMarker` |
| 시군구마다 인구가 얼마나 다른가? | 시군구 경계와 인구 | `Choropleth` |
| 서울의 어느 동에 외국인이 많이 거주하나? | 동 경계와 외국인 인구 | `Choropleth` |
| 여러 동을 묶는 구의 경계는 어디인가? | 구 경계 | `GeoJson` |

## 1. 실습 준비

Jupyter Notebook에서 패키지를 설치한다.

```ipython
%pip install folium pandas openpyxl
```

터미널에서는 `python -m pip install folium pandas openpyxl`을 실행한다. `openpyxl`은 `.xlsx`를 읽을 때 사용한다.

아래 코드는 Jupyter에서 실습하는 흐름이다. 파일 이름만 쓰므로 `Path.cwd()`로 확인한 현재 작업 폴더에 해당 데이터 파일이 있어야 한다. 이 환경의 `Downloads/Doit_Python-main/Data`에는 아래 여섯 파일이 모두 있다.

| 파일 | 역할 |
| --- | --- |
| `seoul_univ.xlsx` | 대학 이름, 위도, 경도 |
| `SIG.geojson` | 전국 시군구 경계 |
| `Population_SIG.csv` | 2021년 인구와 지역 코드 |
| `EMD_Seoul.geojson` | 서울시 동 경계 |
| `Foreigner_EMD_Seoul.csv` | 동별 외국인 인구와 지역 코드 |
| `SIG_Seoul.geojson` | 서울시 25개 구 경계 |

## 2. 배경 지도와 마커

> **Folium**은 Python에서 확대·축소와 클릭이 가능한 웹 지도를 만드는 라이브러리다. 배경 지도 위에 마커나 행정구역 경계를 겹쳐 올릴 수 있다.

### 한 곳 표시하기

```python
import folium

seoul_map = folium.Map(location=[37.55, 126.98], zoom_start=12)  # 서울 중심 좌표와 처음 확대 단계
folium.Marker(
    location=[37.500501, 126.867840],  # 대학 위치 [위도, 경도]
    popup="A",            # 마커를 클릭하면 나오는 이름
).add_to(seoul_map)  # 서울 지도에 마커 추가

seoul_map
```

예상 화면은 서울을 중심으로 열린 지도다. 마커를 클릭하면 동양미래대학교라는 이름이 나온다.

- `Map(location=...)`의 좌표는 지도를 열었을 때의 **중심점**이다. 마커 좌표는 표시할 **장소의 위치**다.
- `zoom_start`가 클수록 처음부터 좁은 범위를 확대해서 본다.
- `Marker(...).add_to(seoul_map)`은 만든 마커를 `seoul_map`에 올린다. Jupyter에서 셀의 마지막 줄에 지도 객체를 쓰면 화면에 표시된다.
- Folium의 `location`은 `[위도, 경도]` 순서다. 예를 들어 도쿄타워를 중심으로 보려면 지도 중심과 마커 위치에 `[35.658633, 139.745165]`를 넣는다. [Folium API 문서](https://python-visualization.github.io/folium/latest/reference.html)

### 서울 지역 대학 여러 곳 표시하기

`pd.read_excel(..., index_col=0)`은 엑셀의 첫 번째 열을 행 이름인 **인덱스**로 읽는다. 이 파일에서는 인덱스가 대학 이름이다.

```python
import folium
import pandas as pd

df_univ = pd.read_excel("seoul_univ.xlsx", index_col=0)           # 첫 번째 열을 대학 이름으로 읽기
univ_map = folium.Map(location=[37.55, 126.98], zoom_start=12)    # 핀을 표시할 지도
circle_map = folium.Map(location=[37.55, 126.98], zoom_start=12)  # 원을 표시할 지도

# 같은 행의 대학 이름과 좌표를 묶어서 두 지도에 추가한다.
for name, lat, lng in zip(df_univ.index, df_univ["위도"], df_univ["경도"]):
    folium.Marker([lat, lng], popup=name).add_to(univ_map)
    folium.CircleMarker(
        [lat, lng],          # 대학 위치 [위도, 경도]
        radius=10,           # 화면에 표시되는 원의 반지름 10픽셀
        color="brown",       # 원의 테두리 색
        fill=True,           # 원 내부 채우기
        fill_color="coral",  # 원 내부의 색
        fill_opacity=0.7,    # 원 내부의 불투명도
        popup=name,          # 클릭하면 대학 이름 표시
    ).add_to(circle_map)  # 원을 표시할 지도에 추가

circle_map
```

첫 번째 반복에서는 `KAIST 서울캠퍼스`의 이름과 좌표를 가져온다. `univ_map`에는 핀이, `circle_map`에는 원이 각각 하나씩 추가된다. 파일에는 한국폴리텍대학 성남캠퍼스를 포함한 대학 위치 49개가 들어 있으며, 같은 방식으로 나머지 행도 처리된다. 핀 지도를 보려면 마지막 줄을 `univ_map`으로 바꾼다. `CircleMarker`의 `radius=10`은 화면에서의 반지름 10픽셀이다. [Folium CircleMarker 문서](https://python-visualization.github.io/folium/latest/reference.html#folium.vector_layers.CircleMarker)

### 선택 실습 — CARTO 배경 타일

> **타일**은 지도의 배경을 채우는 작은 이미지 조각이다. `tiles`를 바꾸면 도로와 지명 등이 그려진 배경의 스타일이 달라진다.

밝은 배경을 쓰려면 발급받은 CARTO Basemaps 키를 실행 환경의 `CARTO_BASEMAPS_KEY`에 설정하고 다음과 같이 지도 객체를 만든다. URL에서 `{z}`는 확대 단계, `{x}`와 `{y}`는 해당 단계의 타일 위치다. 사용자 지정 타일 URL에는 `attr`로 출처를 표시한다. [CARTO Basemaps 키 안내](https://carto.com/basemaps/apikey/)

```python
import os
import folium

carto_key = os.environ["CARTO_BASEMAPS_KEY"]  # 환경 변수에서 CARTO 키 읽기
light_map = folium.Map(
    location=[37.55, 126.98],  # 서울 중심 좌표
    zoom_start=12,             # 처음 확대 단계
    # 밝은 배경 타일을 불러올 주소와 인증 키
    tiles="https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"
          f"?key={carto_key}",
    attr="© OpenStreetMap contributors © CARTO",  # 지도에 표시할 타일 출처
)
light_map
```

강의의 다른 방식은 `import xyzservices.providers as xyz`로 공급자 목록을 가져온 뒤 `xyz.CartoDB.Positron(apikey=carto_key)`를 `tiles`에 전달하는 것이다. 타일 URL에 넣은 키는 저장된 지도 HTML에도 포함된다. 아래 Lab은 Folium 기본 배경을 사용하므로 키 설정 없이 따라갈 수 있다.

## 3. GeoJSON과 단계 구분도

> **GeoJSON**은 점의 위치나 지역의 경계 같은 지리 정보를 JSON으로 담는 형식이다. **단계 구분도(Choropleth)**는 인구처럼 지역마다 다른 값을 여러 구간으로 나누고, 해당 구간의 색으로 지역 면을 채운 지도다.

`json.load()`로 읽은 경계 파일에서 `geo["features"]`는 지역 목록이다. 목록의 각 항목은 `properties`에 지역 코드와 이름을, `geometry`에 지도 위에 그릴 경계 모양을 담는다. GeoJSON의 좌표 쌍은 `[경도, 위도]` 순서다. 경계 파일은 Folium에 통째로 넘기고, 마커 좌표를 직접 쓸 때는 `[위도, 경도]` 순서를 사용한다. [GeoJSON 표준 RFC 7946](https://www.rfc-editor.org/rfc/rfc7946#section-3.1.1)

### 행정구역 코드로 연결하기

실습 파일에서 서울 종로구의 코드 `11110`을 찾으면 연결 과정을 따라갈 수 있다.

```text
SIG.geojson         properties.SIG_CD = "11110"   → 종로구의 경계
Population_SIG.csv  code = "11110", pop = 144683  → 종로구의 인구
                                          ↓
                         144,683명이 속한 구간의 색으로 종로구를 채움
```

| `Choropleth` 인자 | 전달하는 값 |
| --- | --- |
| `geo_data` | 지역 경계를 담은 GeoJSON |
| `data` | 지역 코드와 인구를 담은 DataFrame |
| `columns=("code", "pop")` | CSV에서 연결에 쓸 열과 색으로 표현할 열 |
| `key_on="feature.properties.SIG_CD"` | GeoJSON에서 연결에 쓸 코드의 위치 |
| `bins` | 구간 수 또는 구간 경계값 목록 |

### 등간격과 분위수

- **등간격 구간**은 최솟값부터 최댓값까지를 같은 너비로 나눈다. `bins=6`이면 6구간이다. 큰 값이 일부 지역에 집중되면 많은 지역이 첫 구간의 색으로 보일 수 있다.
- **분위수**는 값을 작은 순서대로 놓았을 때 특정 비율 지점에 해당하는 값이다. `quantile([0, 0.2, 0.4, 0.6, 0.8, 1])`의 경계값 6개를 `bins`에 넘기면 5구간을 만들 수 있다. 같은 값이 많이 반복되면 경계값이 겹치거나 구간별 지역 수가 달라질 수 있다.

예를 들어 인구가 `[10, 20, 30, 1000]`인 지역 네 곳을 두 구간으로 나눈다고 하자. 등간격 기준 `505`에서는 작은 세 값이 한쪽에 몰린다. 중앙값 `25`를 기준으로 나누면 각 구간에 두 곳씩 들어간다. [Folium Choropleth 문서](https://python-visualization.github.io/folium/latest/reference.html#folium.features.Choropleth)

## 4. Lab 1 — 시군구별 인구 단계 구분도

`Population_SIG.csv`에는 시·도 합계처럼 지도에 그릴 시군구 경계와 연결되지 않는 행도 들어 있다. 경계와 일치하는 코드만 남기면 실제로 칠할 지역의 인구 분포로 구간을 계산할 수 있다.

```python
import json
import folium
import pandas as pd

with open("SIG.geojson", encoding="utf-8") as file:  # 전국 시군구 경계 파일
    geo_sig = json.load(file)

# 행정구역 코드를 문자열로 읽어 GeoJSON의 코드와 맞춘다.
df_pop = pd.read_csv("Population_SIG.csv", dtype={"code": "string"})

# 지도에 있는 시군구 코드만 모은 뒤, CSV에서 일치하는 행을 남긴다.
sig_codes = {feature["properties"]["SIG_CD"] for feature in geo_sig["features"]}
sig_pop = df_pop.loc[df_pop["code"].isin(sig_codes)]

# 최솟값과 최댓값을 포함한 경계값 6개로 5개 구간을 나눈다.
sig_bins = sig_pop["pop"].quantile([0, 0.2, 0.4, 0.6, 0.8, 1]).tolist()

map_sig = folium.Map(location=[35.95, 127.7], zoom_start=7)  # 전국을 볼 배경 지도

# 시군구 경계와 인구를 코드로 연결하고, 인구 구간에 따라 색을 칠한다.
folium.Choropleth(
    geo_data=geo_sig,                    # 시군구 경계 좌표
    data=sig_pop,                        # 시군구별 인구 통계
    columns=("code", "pop"),             # 통계에서 연결할 코드 열과 색으로 표현할 인구 열
    key_on="feature.properties.SIG_CD",  # 경계 데이터에서 코드가 저장된 위치
    bins=sig_bins,                       # 인구 구간을 나눌 경계값
    fill_color="YlGnBu",                 # 노랑·초록·파랑 계열 색상표
    fill_opacity=0.75,                   # 지역 내부 색의 불투명도
    line_opacity=0.5,                    # 지역 경계선의 불투명도
    legend_name="시군구 인구 (명)",      # 색상 범례 제목
).add_to(map_sig)  # 배경 지도 위에 단계 구분도 추가

map_sig
```

확인한 데이터에서 CSV 278행 중 250행이 시군구 경계에 연결된다. 연결된 행만 사용하면 등간격 6구간의 첫 구간에 118곳이 들어간다. 분위수 5구간에는 각각 50곳이 들어간다. 두 방식을 직접 비교하려면 위 코드의 `bins=sig_bins`를 `bins=6`으로 바꾸고 지도 생성부터 다시 실행한다.

## 5. Lab 2 — 서울시 동별 외국인 인구 단계 구분도

전국 시군구 실습과 순서는 같다. 이번에는 동 코드인 `ADM_DR_CD`로 연결하고, 서울 경계에 포함되는 동의 외국인 인구로 구간을 계산한다. 강의와 같이 상위 40%는 10% 간격으로 나누어 높은 값의 차이를 더 세분화한다.

```python
import json
import folium
import pandas as pd

with open("EMD_Seoul.geojson", encoding="utf-8") as file:  # 인구 색을 칠할 동 경계
    geo_emd = json.load(file)
with open("SIG_Seoul.geojson", encoding="utf-8") as file:  # 나중에 선으로 겹쳐 그릴 구 경계
    geo_seoul_gu = json.load(file)

# 동별 외국인 인구 CSV를 읽고 행정구역 코드를 문자열로 유지한다.
foreigner = pd.read_csv("Foreigner_EMD_Seoul.csv", dtype={"code": "string"})

# 동 경계에서 코드를 모아 서울 지도에 표시될 행만 남긴다.
emd_codes = {feature["properties"]["ADM_DR_CD"] for feature in geo_emd["features"]}
seoul_pop = foreigner.loc[foreigner["code"].isin(emd_codes)]

# 분위수 경계값 9개로 인구를 8개 구간으로 나눈다.
emd_bins = seoul_pop["pop"].quantile(
    [0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
).tolist()

map_seoul = folium.Map(location=[37.56, 127.0], zoom_start=11)  # 서울을 볼 배경 지도

# 동 경계와 외국인 인구를 코드로 연결해 동별로 색을 칠한다.
folium.Choropleth(
    geo_data=geo_emd,                            # 서울시 동 경계 좌표
    data=seoul_pop,                              # 서울시 동별 외국인 인구 통계
    columns=("code", "pop"),                     # 통계에서 연결할 동 코드 열과 인구 열
    key_on="feature.properties.ADM_DR_CD",       # 경계 데이터에서 동 코드가 저장된 위치
    bins=emd_bins,                               # 외국인 인구 구간을 나눌 경계값
    fill_color="Blues",                          # 파랑 계열 색상표
    fill_opacity=0.75,                           # 동 내부 색의 불투명도
    line_opacity=0.5,                            # 동 경계선의 불투명도
    nan_fill_color="white",                      # 연결된 인구 값이 없는 동의 색
    nan_fill_opacity=0.85,                       # 값이 없는 동에 적용할 불투명도
    legend_name="서울시 동별 외국인 인구 (명)",  # 색상 범례 제목
).add_to(map_seoul)  # 서울 지도 위에 단계 구분도 추가

# 동의 색이 보이도록 구는 내부를 채우지 않고 경계선만 올린다.
folium.GeoJson(
    geo_seoul_gu,  # 서울시 구 경계 좌표
    style_function=lambda _: {
        "color": "#333333",  # 구 경계선 색
        "weight": 3,         # 구 경계선 두께
        "fillOpacity": 0,    # 구 내부를 투명하게 표시
    },
).add_to(map_seoul)

map_seoul.save("map_seoul.html")  # 현재 작업 폴더에 지도 HTML 저장
map_seoul
```

확인한 파일에서 서울의 동 경계 425개 중 424개가 CSV 코드와 연결되고, 그중 423개에 인구 값이 있다. 항동은 CSV에 해당 코드가 없고, 둔촌1동은 코드가 있지만 인구 값이 비어 있다. 두 동은 `nan_fill_color`에 따라 흰색으로 표시된다.

저장된 `map_seoul.html`은 브라우저에서 열 수 있다. Python에서 열려면 `webbrowser.open_new()`에 HTML 파일의 URI를 넘긴다. 외부 배경 타일과 웹 라이브러리를 불러오려면 브라우저에서 인터넷에 연결되어야 한다.

```python
from pathlib import Path
import webbrowser

# 저장한 HTML의 절대 경로를 브라우저에서 열 수 있는 주소로 바꾼다.
webbrowser.open_new(Path("map_seoul.html").resolve().as_uri())
```

## 6. 결과가 다를 때 확인할 것

| 증상 | 확인할 부분 |
| --- | --- |
| `FileNotFoundError`가 난다 | `Path.cwd()`와 데이터 파일 경로를 확인한다. |
| 마커가 엉뚱한 곳에 나온다 | `location`에 `[위도, 경도]` 순서로 넣었는지 확인한다. |
| 일부 지역이 결측 색으로 나온다 | `key_on`의 속성명과 CSV의 `code`를 대조하고 `pop`이 비어 있는지 확인한다. 코드에 앞자리 0이 있다면 CSV에서 문자열로 읽어 보존한다. |
| 대부분 지역의 색이 비슷하다 | 범위 밖 행이 구간 계산에 포함됐는지, 등간격 구간에서 첫 색에 값이 몰리는지 확인한다. |
| 지도의 세로 크기가 적용되지 않는다 | `folium.Map()`의 인자 이름을 `height`로 쓴다. |
| 구 경계선 안쪽이 동 색을 가린다 | 구 경계 레이어의 `fillOpacity`가 `0`인지 확인한다. |

## 자료와 검증 범위

- 강의 자료 두 편을 통합했다. `11장- 지도 시각화.html`의 시군구·서울 동 실습과 `11장 - 지도 시각화-대학교.html`의 대학 마커·배경 타일 실습을 다뤘다.
- 본 실습은 기본 배경으로 진행하고 CARTO는 선택 예제로 분리했다. 강의의 구 경계 레이어는 `GeoJson`으로 표현했다.
- Folium 0.20.0 환경에서 실습 데이터로 지도 HTML 5개의 생성을 확인했다. 마커 수, 시군구 구간별 지역 수, 서울 동의 결측 표시도 코드로 대조했다. CARTO 예제는 테스트 문자열로 HTML 생성까지 확인했다. 브라우저의 실제 지도 표시와 외부 타일 응답은 확인하지 않았다.
