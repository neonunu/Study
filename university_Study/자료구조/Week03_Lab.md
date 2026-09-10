# 컴퓨팅 알고리즘 3주차 - 문제와 코드

## 1. 학생 성적 함수 구현

### C

```c
/*
문제
----
n명 학생의 학번과 0-100점 사이의 성적을 2차원 배열에 입력받는다.

1. 성적 평균을 구하는 find_avg 함수를 작성한다.
2. 최고점을 구하는 find_max 함수를 작성한다.
3. 학번으로 학생을 찾아 등수를 구하는 find_rank 함수를 작성한다.
4. main 함수에서는 자료를 입력하고 각 함수를 호출해 결과를 출력한다.

등수 규칙
---------
대상 학생보다 점수가 높은 학생 수 + 1을 등수로 사용한다.
따라서 같은 점수의 학생은 같은 등수를 갖는다.

입력 예
-------
10
717 88
625 92
810 80
707 75
530 98
424 70
877 65
701 85
628 70
505 78
530

출력 예
-------
평균: 80.10
최고점: 98
학번 530의 등수: 1등
*/

#include <stdio.h>

#define MAX_STUDENTS 100

double find_avg(const int scores[][2], int n) {
    int sum = 0;

    for (int i = 0; i < n; i++) {
        sum += scores[i][1];
    }

    return (double)sum / n;
}

int find_max(const int scores[][2], int n) {
    int max_score = scores[0][1];

    for (int i = 1; i < n; i++) {
        if (scores[i][1] > max_score) {
            max_score = scores[i][1];
        }
    }

    return max_score;
}

int find_rank(const int scores[][2], int n, int student_id) {
    int target_score = -1;

    for (int i = 0; i < n; i++) {
        if (scores[i][0] == student_id) {
            target_score = scores[i][1];
            break;
        }
    }

    if (target_score < 0) {
        return -1;
    }

    int rank = 1;
    for (int i = 0; i < n; i++) {
        if (scores[i][1] > target_score) {
            rank++;
        }
    }

    return rank;
}

int main(void) {
    int scores[MAX_STUDENTS][2];
    int n;

    printf("학생 수: ");
    if (scanf("%d", &n) != 1 || n <= 0 || n > MAX_STUDENTS) {
        fprintf(stderr, "학생 수는 1-%d 사이여야 합니다.\n", MAX_STUDENTS);
        return 1;
    }

    printf("학번과 성적을 입력하세요.\n");
    for (int i = 0; i < n; i++) {
        if (scanf("%d %d", &scores[i][0], &scores[i][1]) != 2 ||
            scores[i][1] < 0 || scores[i][1] > 100) {
            fprintf(stderr, "학번과 0-100 사이의 성적을 입력하세요.\n");
            return 1;
        }
    }

    printf("평균: %.2f\n", find_avg(scores, n));
    printf("최고점: %d\n", find_max(scores, n));

    int student_id;
    printf("조회할 학번: ");
    if (scanf("%d", &student_id) != 1) {
        fprintf(stderr, "올바른 학번을 입력하세요.\n");
        return 1;
    }

    int rank = find_rank(scores, n, student_id);
    if (rank < 0) {
        printf("학번 %d을(를) 찾을 수 없습니다.\n", student_id);
    } else {
        printf("학번 %d의 등수: %d등\n", student_id, rank);
    }

    return 0;
}
```

### Python

```python
"""
문제
----
n명 학생의 학번과 0-100점 사이의 성적을 입력받는다.

1. 성적 평균을 구하는 find_avg 함수를 작성한다.
2. 최고점을 구하는 find_max 함수를 작성한다.
3. 학번으로 학생을 찾아 등수를 구하는 find_rank 함수를 작성한다.
4. 각 함수를 호출해 결과를 출력한다.

등수 규칙
---------
대상 학생보다 점수가 높은 학생 수 + 1을 등수로 사용한다.
따라서 같은 점수의 학생은 같은 등수를 갖는다.
"""


def find_avg(scores):
    return sum(score for _, score in scores) / len(scores)


def find_max(scores):
    return max(score for _, score in scores)


def find_rank(scores, student_id):
    target_score = None

    for current_id, score in scores:
        if current_id == student_id:
            target_score = score
            break

    if target_score is None:
        return None

    return 1 + sum(score > target_score for _, score in scores)


def main():
    try:
        student_count = int(input("학생 수: "))
    except ValueError:
        print("학생 수는 정수로 입력하세요.")
        return

    if not 1 <= student_count <= 100:
        print("학생 수는 1-100 사이여야 합니다.")
        return

    scores = []
    print("학번과 성적을 입력하세요.")

    for _ in range(student_count):
        try:
            student_id, score = map(int, input().split())
        except ValueError:
            print("학번과 성적을 정수로 입력하세요.")
            return

        if not 0 <= score <= 100:
            print("성적은 0-100 사이여야 합니다.")
            return

        scores.append((student_id, score))

    print(f"평균: {find_avg(scores):.2f}")
    print(f"최고점: {find_max(scores)}")

    try:
        student_id = int(input("조회할 학번: "))
    except ValueError:
        print("학번은 정수로 입력하세요.")
        return

    rank = find_rank(scores, student_id)
    if rank is None:
        print(f"학번 {student_id}을(를) 찾을 수 없습니다.")
    else:
        print(f"학번 {student_id}의 등수: {rank}등")


if __name__ == "__main__":
    main()
```

---

## 2. Kruskal 최소 비용 신장 트리

### C

```c
/*
문제
----
정점 1-6과 다음 가중치 간선으로 이루어진 무방향 그래프가 있다.

(1,2,16), (1,6,21), (1,5,19), (2,6,11), (2,3,5),
(2,4,6), (3,4,10), (4,6,14), (4,5,18), (5,6,33)

Kruskal 알고리즘을 이용해 최소 비용 신장 트리를 구한다.

조건
----
1. 간선을 가중치 오름차순으로 정렬한다.
2. 사이클을 만들지 않는 간선만 선택한다.
3. 정점 수가 n일 때 간선 n-1개를 선택하면 종료한다.
4. 사이클 판별에는 Union-Find를 사용한다.

기대 결과
---------
선택 가중치: 5, 6, 11, 16, 18
총비용: 56
*/

#include <stdio.h>
#include <stdlib.h>

#define VERTEX_COUNT 6

typedef struct {
    int from;
    int to;
    int weight;
} Edge;

static int parent[VERTEX_COUNT + 1];
static int tree_rank[VERTEX_COUNT + 1];

int find_root(int vertex) {
    if (parent[vertex] != vertex) {
        parent[vertex] = find_root(parent[vertex]);
    }
    return parent[vertex];
}

void union_sets(int a, int b) {
    a = find_root(a);
    b = find_root(b);

    if (a == b) {
        return;
    }

    if (tree_rank[a] < tree_rank[b]) {
        parent[a] = b;
    } else if (tree_rank[a] > tree_rank[b]) {
        parent[b] = a;
    } else {
        parent[b] = a;
        tree_rank[a]++;
    }
}

int compare_edges(const void *left, const void *right) {
    const Edge *a = left;
    const Edge *b = right;
    return (a->weight > b->weight) - (a->weight < b->weight);
}

int main(void) {
    Edge edges[] = {
        {1, 2, 16}, {1, 6, 21}, {1, 5, 19}, {2, 6, 11}, {2, 3, 5},
        {2, 4, 6},  {3, 4, 10}, {4, 6, 14}, {4, 5, 18}, {5, 6, 33}
    };
    const int edge_count = (int)(sizeof(edges) / sizeof(edges[0]));

    for (int vertex = 1; vertex <= VERTEX_COUNT; vertex++) {
        parent[vertex] = vertex;
        tree_rank[vertex] = 0;
    }

    qsort(edges, edge_count, sizeof(Edge), compare_edges);

    int selected_count = 0;
    int total_cost = 0;

    puts("선택된 간선:");

    for (int i = 0;
         i < edge_count && selected_count < VERTEX_COUNT - 1;
         i++) {
        Edge edge = edges[i];

        if (find_root(edge.from) == find_root(edge.to)) {
            printf("제외: %d - %d (가중치 %d, 사이클 발생)\n",
                   edge.from, edge.to, edge.weight);
            continue;
        }

        union_sets(edge.from, edge.to);
        selected_count++;
        total_cost += edge.weight;
        printf("선택: %d - %d (가중치 %d)\n",
               edge.from, edge.to, edge.weight);
    }

    if (selected_count != VERTEX_COUNT - 1) {
        fprintf(stderr, "모든 정점을 연결할 수 없습니다.\n");
        return 1;
    }

    printf("총비용: %d\n", total_cost);
    return 0;
}
```

### Python

```python
"""
문제
----
정점 1-6과 다음 가중치 간선으로 이루어진 무방향 그래프가 있다.

(1,2,16), (1,6,21), (1,5,19), (2,6,11), (2,3,5),
(2,4,6), (3,4,10), (4,6,14), (4,5,18), (5,6,33)

Kruskal 알고리즘으로 최소 비용 신장 트리를 구한다.
간선을 가중치 오름차순으로 확인하고 사이클이 생기지 않는 간선만 선택한다.
사이클 판별에는 Union-Find를 사용한다.

기대 결과
---------
선택 가중치: 5, 6, 11, 16, 18
총비용: 56
"""

VERTEX_COUNT = 6
EDGES = [
    (1, 2, 16),
    (1, 6, 21),
    (1, 5, 19),
    (2, 6, 11),
    (2, 3, 5),
    (2, 4, 6),
    (3, 4, 10),
    (4, 6, 14),
    (4, 5, 18),
    (5, 6, 33),
]


def find_root(parent, vertex):
    if parent[vertex] != vertex:
        parent[vertex] = find_root(parent, parent[vertex])
    return parent[vertex]


def union_sets(parent, tree_rank, a, b):
    root_a = find_root(parent, a)
    root_b = find_root(parent, b)

    if root_a == root_b:
        return

    if tree_rank[root_a] < tree_rank[root_b]:
        parent[root_a] = root_b
    elif tree_rank[root_a] > tree_rank[root_b]:
        parent[root_b] = root_a
    else:
        parent[root_b] = root_a
        tree_rank[root_a] += 1


def kruskal(vertex_count, edges):
    parent = list(range(vertex_count + 1))
    tree_rank = [0] * (vertex_count + 1)
    selected_edges = []
    total_cost = 0

    for start, end, weight in sorted(edges, key=lambda edge: edge[2]):
        if find_root(parent, start) == find_root(parent, end):
            print(f"제외: {start} - {end} (가중치 {weight}, 사이클 발생)")
            continue

        union_sets(parent, tree_rank, start, end)
        selected_edges.append((start, end, weight))
        total_cost += weight
        print(f"선택: {start} - {end} (가중치 {weight})")

        if len(selected_edges) == vertex_count - 1:
            break

    return selected_edges, total_cost


if __name__ == "__main__":
    mst, cost = kruskal(VERTEX_COUNT, EDGES)

    if len(mst) != VERTEX_COUNT - 1:
        print("모든 정점을 연결할 수 없습니다.")
    else:
        print(f"총비용: {cost}")
```

---

## 3. 그리디 거스름돈

### C

```c
/*
문제
----
500원, 100원, 50원, 10원 동전이 있다.
거스름돈을 입력받아 필요한 동전의 최소 개수를 출력한다.

해결 방법
---------
남은 금액을 넘지 않는 가장 큰 동전을 먼저 선택한다.

입력 예
-------
860

출력 예
-------
500원 동전: 1개
100원 동전: 3개
50원 동전: 1개
10원 동전: 1개
전체 동전 수: 6개
*/

#include <stdio.h>

int how_many(int change) {
    const int coins[] = {500, 100, 50, 10};
    const int coin_type_count = (int)(sizeof(coins) / sizeof(coins[0]));
    int total_count = 0;

    for (int i = 0; i < coin_type_count; i++) {
        int quantity = change / coins[i];
        change %= coins[i];
        total_count += quantity;
        printf("%d원 동전: %d개\n", coins[i], quantity);
    }

    if (change != 0) {
        printf("주어진 동전으로 거슬러 줄 수 없는 금액: %d원\n", change);
    }

    return total_count;
}

int main(void) {
    int change;

    printf("거스름돈: ");
    if (scanf("%d", &change) != 1 || change < 0) {
        fprintf(stderr, "0 이상의 금액을 입력하세요.\n");
        return 1;
    }

    printf("전체 동전 수: %d개\n", how_many(change));
    return 0;
}
```

### Python

```python
"""
문제
----
500원, 100원, 50원, 10원 동전이 있다.
거스름돈을 입력받아 필요한 동전의 최소 개수를 출력한다.

해결 방법
---------
남은 금액을 넘지 않는 가장 큰 동전을 먼저 선택한다.

입력 예: 860
결과: 500원 1개, 100원 3개, 50원 1개, 10원 1개
전체 동전 수: 6개
"""

COINS = (500, 100, 50, 10)


def count_coins(change):
    result = {}

    for coin in COINS:
        quantity, change = divmod(change, coin)
        result[coin] = quantity

    return result, change


def main():
    try:
        change = int(input("거스름돈: "))
    except ValueError:
        print("금액은 정수로 입력하세요.")
        return

    if change < 0:
        print("0 이상의 금액을 입력하세요.")
        return

    result, remainder = count_coins(change)
    for coin, quantity in result.items():
        print(f"{coin}원 동전: {quantity}개")

    if remainder:
        print(f"주어진 동전으로 거슬러 줄 수 없는 금액: {remainder}원")

    print(f"전체 동전 수: {sum(result.values())}개")


if __name__ == "__main__":
    main()
```

---

## 4. 스택을 이용한 미로 찾기

### Python

```python
"""
문제
----
다음 4×4 미로에서 시작점 (0, 0)부터 도착점 (3, 3)까지의 경로를 찾는다.

0 0 1 0
0 1 0 0
0 1 0 1
0 0 0 0

0은 이동 가능한 길이고 1은 벽이다.
이동 방향은 오른쪽, 아래, 왼쪽, 위 순서로 확인한다.

조건
----
1. 이동할 때 현재 경로를 스택에 push한다.
2. 막다른 길을 만나면 스택에서 pop하여 이전 위치로 돌아간다.
3. 이미 방문한 칸은 다시 방문하지 않는다.
4. push와 pop 과정을 단계별로 출력한다.

기대 경로
---------
(0,0) -> (1,0) -> (2,0) -> (3,0) -> (3,1) -> (3,2) -> (3,3)
"""

MAZE = [
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 1],
    [0, 0, 0, 0],
]

DIRECTIONS = [
    (0, 1, "오른쪽"),
    (1, 0, "아래"),
    (0, -1, "왼쪽"),
    (-1, 0, "위"),
]


def find_path(maze):
    size = len(maze)
    start = (0, 0)
    goal = (size - 1, size - 1)
    visited = [[False] * size for _ in range(size)]

    # 스택 원소: (행, 열, 다음에 확인할 방향 번호)
    stack = [(start[0], start[1], 0)]
    visited[start[0]][start[1]] = True
    print(f"push {start}: 탐색 시작")

    while stack:
        row, col, next_direction = stack[-1]

        if (row, col) == goal:
            return [(r, c) for r, c, _ in stack]

        if next_direction >= len(DIRECTIONS):
            popped = stack.pop()
            print(f"pop  {(popped[0], popped[1])}: 막다른 길")
            continue

        # 이 위치를 다시 확인할 때는 다음 방향부터 검사한다.
        stack[-1] = (row, col, next_direction + 1)

        dr, dc, direction_name = DIRECTIONS[next_direction]
        next_row = row + dr
        next_col = col + dc
        is_inside = 0 <= next_row < size and 0 <= next_col < size

        if (
            is_inside
            and maze[next_row][next_col] == 0
            and not visited[next_row][next_col]
        ):
            visited[next_row][next_col] = True
            stack.append((next_row, next_col, 0))
            print(
                f"push {(next_row, next_col)}: "
                f"{direction_name} 방향으로 이동"
            )

    return None


if __name__ == "__main__":
    path = find_path(MAZE)

    if path:
        formatted_path = " -> ".join(map(str, path))
        print(f"\n[성공] 최종 이동 경로: {formatted_path}")
    else:
        print("\n[실패] 도착점으로 가는 경로가 없습니다.")
```

---

## 5. 가장 가까운 배수 찾기

### C

```c
/*
문제
----
양의 정수 m을 입력받는다.
그다음 숫자 5개를 입력받아 각 숫자에서 가장 가까운 m의 배수를 출력한다.

사용 변수
---------
call_number: 입력받은 숫자
m: 나눗수
r: call_number를 m으로 나눈 나머지
k: 반복 횟수
ans: 가장 가까운 m의 배수

계산 방법
---------
아래쪽 배수 = call_number - r
위쪽 배수 = call_number + (m - r)

두 배수까지의 거리가 같으면 위쪽 배수를 선택한다.
call_number가 이미 m의 배수이면 입력값을 그대로 출력한다.
*/

#include <stdio.h>

int nearest_multiple(int call_number, int m) {
    int r = call_number % m;

    if (r == 0) {
        return call_number;
    }

    if (r < m - r) {
        return call_number - r;
    }

    return call_number + (m - r);
}

int main(void) {
    int call_number;
    int m;
    int k;
    int ans;

    printf("몇으로 나누어떨어지는 놀이를 할까요? ");
    if (scanf("%d", &m) != 1 || m <= 0) {
        fprintf(stderr, "0보다 큰 기준값을 입력하세요.\n");
        return 1;
    }

    printf("%d로 나누어떨어지는 가장 가까운 수로 답합니다.\n", m);

    for (k = 0; k < 5; k++) {
        printf("숫자 입력: ");
        if (scanf("%d", &call_number) != 1 || call_number < 0) {
            fprintf(stderr, "0 이상의 정수를 입력하세요.\n");
            return 1;
        }

        ans = nearest_multiple(call_number, m);
        printf("가장 가까운 수: %d\n", ans);
    }

    return 0;
}
```

### Python

```python
"""
문제
----
양의 정수 m을 입력받는다.
그다음 숫자 5개를 입력받아 각 숫자에서 가장 가까운 m의 배수를 출력한다.

계산 방법
---------
아래쪽 배수 = call_number - r
위쪽 배수 = call_number + (m - r)

두 배수까지의 거리가 같으면 위쪽 배수를 선택한다.
입력값이 이미 m의 배수이면 입력값을 그대로 출력한다.
"""


def nearest_multiple(call_number, m):
    remainder = call_number % m

    if remainder == 0:
        return call_number

    if remainder < m - remainder:
        return call_number - remainder

    return call_number + (m - remainder)


def main():
    try:
        m = int(input("몇으로 나누어떨어지는 놀이를 할까요? "))
    except ValueError:
        print("기준값은 정수로 입력하세요.")
        return

    if m <= 0:
        print("0보다 큰 기준값을 입력하세요.")
        return

    print(f"{m}로 나누어떨어지는 가장 가까운 수로 답합니다.")

    for _ in range(5):
        try:
            call_number = int(input("숫자 입력: "))
        except ValueError:
            print("숫자는 정수로 입력하세요.")
            return

        if call_number < 0:
            print("0 이상의 정수를 입력하세요.")
            return

        answer = nearest_multiple(call_number, m)
        print(f"가장 가까운 수: {answer}")


if __name__ == "__main__":
    main()
```

---

## 실행 방법

C 코드는 원하는 코드 블록을 `.c` 파일로 저장한 뒤 다음과 같이 실행합니다.

```bash
cc -std=c11 -Wall -Wextra 파일이름.c -o 실행파일
./실행파일
```

Python 코드는 `.py` 파일로 저장한 뒤 실행합니다.

```bash
python3 파일이름.py
```
