# Week 10 - 이진 트리 복습과 이진 탐색 트리(BST)

## 1. 이번 주 핵심

이번 주에는 이진 트리의 기본 구조와 순회 방법을 복습한 뒤, 데이터를 빠르게 탐색할 수 있도록 정렬 규칙을 추가한 **이진 탐색 트리(Binary Search Tree, BST)**를 학습한다.

학습 목표는 다음과 같다.

1. 트리와 이진 트리의 기본 용어를 설명할 수 있다.
2. 포화 이진 트리와 완전 이진 트리를 구분할 수 있다.
3. 이진 트리를 배열과 링크 구조로 표현할 수 있다.
4. 전위·중위·후위 순회의 방문 순서를 구할 수 있다.
5. BST의 규칙에 따라 노드를 삽입하고 탐색할 수 있다.
6. BST를 중위 순회하면 키가 오름차순으로 출력되는 이유를 설명할 수 있다.

---

## 2. 트리의 기본 개념

> **쉬운 정의:** 트리는 하나의 시작점에서 여러 갈래로 뻗어나가는 계층형 자료구조이다.

트리(tree)는 데이터 사이에 **1:다 관계**를 표현하는 비선형 자료구조이다. 회사 조직도, 폴더 구조, 가계도처럼 상하 관계가 있는 데이터를 나타낼 때 적합하다.

### 2.1 주요 용어

| 용어 | 의미 |
|---|---|
| 노드(node) | 데이터를 저장하는 기본 단위 |
| 간선(edge) | 두 노드를 연결하는 선 |
| 루트(root) | 트리의 가장 위에 있는 시작 노드 |
| 부모(parent) | 바로 아래 노드를 가진 노드 |
| 자식(child) | 바로 위 부모와 연결된 노드 |
| 형제(sibling) | 같은 부모를 가진 노드들 |
| 리프(leaf), 단말 노드 | 자식이 없는 노드 |
| 서브트리(subtree) | 어떤 노드와 그 아래 노드들로 구성된 작은 트리 |
| 레벨(level) | 루트부터 몇 번째 층인지 나타내는 값 |
| 깊이(depth) | 루트에서 해당 노드까지 지나온 간선 수 |
| 높이(height) | 해당 노드에서 가장 먼 리프까지의 거리 |
| 차수(degree) | 해당 노드가 가진 자식의 수 |

> 강의 자료처럼 루트를 1레벨로 세면 레벨 수와 높이를 같은 의미로 쓰기도 한다. 다른 교재에서는 루트의 깊이를 0으로 정하므로, 문제를 풀 때 기준을 먼저 확인해야 한다.

---

## 3. 이진 트리

> **쉬운 정의:** 이진 트리는 각 노드가 왼쪽과 오른쪽, 최대 두 개의 자식만 가질 수 있는 트리이다.

이진 트리(binary tree)는 다음 중 하나이다.

- 아무 노드도 없는 공백 트리
- 루트와 왼쪽 서브트리, 오른쪽 서브트리로 구성된 트리

왼쪽과 오른쪽 서브트리도 각각 이진 트리이므로 이진 트리는 **재귀적으로 정의**된다.

### 3.1 이진 트리의 차수

이진 트리에서 한 노드의 차수는 자식 수이므로 다음 세 가지뿐이다.

| 자식 상태 | 차수 |
|---|---:|
| 자식 없음 | 0 |
| 자식 한 개 | 1 |
| 자식 두 개 | 2 |

따라서 모든 이진 트리 노드에 대해 `0 <= 차수 <= 2`이다.

### 3.2 포화 이진 트리와 완전 이진 트리

#### 포화 이진 트리

강의 자료의 포화 이진 트리는 모든 레벨이 노드로 가득 찬 형태이다.

- 높이가 `h`이고 루트가 1레벨이면 최대 노드 수는 `2^h - 1`
- 레벨 `i`의 최대 노드 수는 `2^(i-1)`

> **용어 주의:** 영어 자료에서는 모든 레벨이 가득 찬 트리를 `perfect binary tree`, 모든 노드의 차수가 0 또는 2인 트리를 `full binary tree`라고 구분하기도 한다. 강의 자료는 포화 이진 트리에 `full binary tree`라는 표현을 사용하므로 시험에서는 수업 기준을 우선하되, 두 영어 용어의 차이도 알아두자.

#### 완전 이진 트리

> **쉬운 정의:** 마지막 레벨을 제외한 모든 층이 가득 차고, 마지막 층은 왼쪽부터 빈자리 없이 채워진 이진 트리이다.

포화 이진 트리의 노드에 1번부터 차례로 번호를 붙였을 때, **1번부터 n번까지 중간 빈 번호가 없으면** 완전 이진 트리이다.

```text
        A
      /   \
     B     C
    / \   /
   D   E F
```

위 트리는 마지막 레벨이 왼쪽부터 채워졌으므로 완전 이진 트리이다.

```text
        A
      /   \
     B     C
      \
       E
```

위 트리는 `B`의 왼쪽 자리가 비었는데 오른쪽 자식 `E`가 있으므로 완전 이진 트리가 아니다.

> 완전 이진 트리는 **모양에 대한 조건**이고, BST는 **키의 대소 관계에 대한 조건**이다. 두 개념은 서로 다르다.

---

## 4. 이진 트리의 표현

### 4.1 배열 표현

루트를 배열의 1번 인덱스에 저장하면 인덱스 `i`인 노드의 관계는 다음과 같다.

| 관계 | 인덱스 |
|---|---:|
| 왼쪽 자식 | `2 * i` |
| 오른쪽 자식 | `2 * i + 1` |
| 부모 | `i / 2`의 정수 부분 |

완전 이진 트리는 중간 빈자리가 거의 없으므로 배열 표현에 적합하다. 반대로 한쪽으로 치우친 트리는 빈 배열 공간이 많이 생긴다.

### 4.2 링크 표현

> **쉬운 정의:** 각 노드가 데이터와 함께 왼쪽·오른쪽 자식의 주소를 저장하는 방식이다.

```c
typedef struct tnode *tree_pointer;

struct tnode {
    int data;
    tree_pointer left_child;
    tree_pointer right_child;
};

tree_pointer root = NULL;
```

- `data`: 노드에 저장되는 값
- `left_child`: 왼쪽 자식 노드의 주소
- `right_child`: 오른쪽 자식 노드의 주소
- `root`: 루트 노드의 주소
- `NULL`: 연결된 노드가 없음을 의미

모든 노드에 포인터 공간 두 개가 있다는 뜻이지, 모든 노드가 실제 자식 두 개를 가져야 한다는 뜻은 아니다.

---

## 5. 이진 트리 순회

> **쉬운 정의:** 순회(traversal)는 트리의 모든 노드를 정해진 순서로 한 번씩 방문하는 작업이다.

이진 트리는 재귀적으로 정의되므로 순회 함수도 왼쪽·오른쪽 서브트리를 재귀적으로 처리한다.

| 종류 | 방문 순서 | 기억법 |
|---|---|---|
| 전위 순회(preorder) | 루트 → 왼쪽 → 오른쪽 | 루트를 먼저 방문 |
| 중위 순회(inorder) | 왼쪽 → 루트 → 오른쪽 | 루트를 가운데 방문 |
| 후위 순회(postorder) | 왼쪽 → 오른쪽 → 루트 | 루트를 마지막에 방문 |

### 5.1 재귀 순회 코드

```c
void preorder(tree_pointer ptr) {
    if (ptr != NULL) {
        printf("%d ", ptr->data);
        preorder(ptr->left_child);
        preorder(ptr->right_child);
    }
}

void inorder(tree_pointer ptr) {
    if (ptr != NULL) {
        inorder(ptr->left_child);
        printf("%d ", ptr->data);
        inorder(ptr->right_child);
    }
}

void postorder(tree_pointer ptr) {
    if (ptr != NULL) {
        postorder(ptr->left_child);
        postorder(ptr->right_child);
        printf("%d ", ptr->data);
    }
}
```

`if (ptr != NULL)`은 재귀가 멈추는 **기저 조건**이다. 이 조건이 없으면 존재하지 않는 자식 노드까지 계속 접근하게 된다.

### 5.2 순회 예제

```text
          1
        /   \
       2     3
      /     / \
     4     5   6
    / \       /
   7   8     9
      /
     10
```

- 전위: `1 2 4 7 8 10 3 5 6 9`
- 중위: `7 4 10 8 2 1 5 3 9 6`
- 후위: `7 10 8 4 2 5 9 6 3 1`

---

## 6. 이진 탐색 트리(BST)

> **쉬운 정의:** BST는 현재 노드보다 작은 키는 왼쪽에, 큰 키는 오른쪽에 저장하는 이진 트리이다.

이진 탐색 트리는 다음 조건을 만족한다.

1. 모든 노드는 비교 기준이 되는 키(key)를 가진다.
2. 왼쪽 서브트리의 모든 키는 현재 노드의 키보다 작다.
3. 오른쪽 서브트리의 모든 키는 현재 노드의 키보다 크다.
4. 왼쪽과 오른쪽 서브트리도 각각 BST이다.

이 자료에서는 같은 키를 중복 삽입하지 않고 실패로 처리한다.

### 6.1 노드 구조

```c
typedef struct bstnode {
    struct bstnode *left;
    int key;
    float score;
    struct bstnode *right;
} BSTNODE;
```

`left`와 `right`가 자기와 같은 `struct bstnode`를 가리키므로 **자기 참조 구조체(self-referential structure)**이다.

> 강의 자료 일부에는 오른쪽 포인터가 `struct node *right`로 적혀 있지만, 같은 구조의 노드를 연결하려면 `struct bstnode *right`가 맞다.

---

## 7. BST 구축과 삽입

### 7.1 삽입 원리

새 키를 삽입할 때는 루트부터 비교한다.

1. 트리가 비었다면 새 노드가 루트가 된다.
2. 새 키가 현재 키보다 작으면 왼쪽으로 이동한다.
3. 새 키가 현재 키보다 크면 오른쪽으로 이동한다.
4. 같은 키를 만나면 중복이므로 삽입하지 않는다.
5. `NULL`을 만난 위치에 새 노드를 연결한다.

### 7.2 문자열 삽입 예제

`sky, blue, tiger, happy, child, yellow, aha` 순서로 삽입하면 다음 BST가 만들어진다. 문자열 비교에는 `strcmp()`를 사용한다.

```text
sky
├── L: blue
│   ├── L: aha
│   └── R: happy
│       └── L: child
└── R: tiger
    └── R: yellow
```

삽입 흐름의 예는 다음과 같다.

- `blue < sky`이므로 `sky`의 왼쪽
- `tiger > sky`이므로 `sky`의 오른쪽
- `happy < sky`, `happy > blue`이므로 `blue`의 오른쪽
- `child < sky`, `child > blue`, `child < happy`이므로 `happy`의 왼쪽

### 7.3 강의 방식의 삽입 코드

다음 함수는 이미 루트가 존재하는 BST에 새 단어를 삽입한다. 공백 트리의 첫 노드는 호출하는 쪽에서 따로 생성한다.

```c
int insert_node(NODETYPE *root, const char *word) {
    NODETYPE *tptr = root;
    NODETYPE *before = NULL;
    NODETYPE *node;
    int cmp = 0;

    while (tptr != NULL) {
        before = tptr;
        cmp = strcmp(word, tptr->word);

        if (cmp < 0)
            tptr = tptr->left;
        else if (cmp > 0)
            tptr = tptr->right;
        else
            return 0;  // 중복 키
    }

    node = malloc(sizeof(*node));
    if (node == NULL)
        return 0;

    node->word = malloc(strlen(word) + 1);
    if (node->word == NULL) {
        free(node);
        return 0;
    }

    strcpy(node->word, word);
    node->left = NULL;
    node->right = NULL;

    if (cmp < 0)
        before->left = node;
    else
        before->right = node;

    return 1;
}
```

`before`는 `NULL`을 만나기 직전의 부모 노드를 기억한다. 반복문이 끝나면 새 노드를 `before->left` 또는 `before->right`에 연결한다.

---

## 8. BST 탐색

### 8.1 탐색 원리

찾으려는 키를 `key`, 현재 노드의 키를 `root->key`라고 하면 다음과 같이 이동한다.

- `key == root->key`: 탐색 성공
- `key < root->key`: 왼쪽 서브트리 탐색
- `key > root->key`: 오른쪽 서브트리 탐색
- 이동 중 `NULL` 도착: 트리에 키가 없으므로 탐색 실패

### 8.2 반복 탐색

```c
NODETYPE *search(NODETYPE *root, const char *key) {
    NODETYPE *tptr = root;

    while (tptr != NULL) {
        int cmp = strcmp(key, tptr->word);

        if (cmp < 0)
            tptr = tptr->left;
        else if (cmp > 0)
            tptr = tptr->right;
        else
            return tptr;
    }

    return NULL;
}
```

### 8.3 재귀 탐색

```c
NODETYPE *rsearch(NODETYPE *root, const char *key) {
    if (root == NULL)
        return NULL;

    int cmp = strcmp(key, root->word);

    if (cmp < 0)
        return rsearch(root->left, key);
    if (cmp > 0)
        return rsearch(root->right, key);

    return root;
}
```

반복 함수와 재귀 함수의 탐색 경로는 같다. 차이는 반복문을 직접 사용하는지, 함수 호출이 다음 서브트리 탐색을 맡는지이다.

---

## 9. BST의 중위 순회

BST를 중위 순회하면 키가 **오름차순**으로 출력된다.

```c
void inorder(NODETYPE *ptr) {
    if (ptr != NULL) {
        inorder(ptr->left);
        printf("%s\n", ptr->word);
        inorder(ptr->right);
    }
}
```

문자열 예제의 중위 순회 결과는 다음과 같다.

```text
aha blue child happy sky tiger yellow
```

그 이유는 각 노드에서 항상 다음 순서로 방문하기 때문이다.

1. 현재 키보다 작은 왼쪽 서브트리
2. 현재 키
3. 현재 키보다 큰 오른쪽 서브트리

### 9.1 조건을 추가한 중위 순회

중위 순회 중 조건을 확인하면 특정 데이터만 출력할 수도 있다.

```c
void print_high_score(tree_pointer ptr) {
    if (ptr != NULL) {
        print_high_score(ptr->left_child);

        if (ptr->score >= 800)
            printf("%d %d\n", ptr->num, ptr->score);

        print_high_score(ptr->right_child);
    }
}
```

단, 특정 키 하나를 찾을 때는 BST 규칙을 이용한 탐색이 더 효율적이다. 입사 연도처럼 **BST의 기준 키가 아닌 필드**를 찾을 때는 전체 노드를 순회해야 한다.

---

## 10. BST 삭제의 기본 원리

강의 자료에서는 두 가지 삭제 사례를 다룬다.

### 10.1 리프 노드 삭제

자식이 없으므로 부모가 해당 노드를 가리키던 포인터를 `NULL`로 바꾸고 노드를 해제한다.

### 10.2 자식이 하나인 노드 삭제

부모가 삭제할 노드 대신 그 노드의 유일한 자식을 가리키도록 연결한 뒤 삭제한다.

### 10.3 자식이 둘인 노드 삭제 - 보충

일반적으로 다음 중 하나를 사용한다.

- 왼쪽 서브트리에서 가장 큰 키인 **중위 선행자**로 대체
- 오른쪽 서브트리에서 가장 작은 키인 **중위 후속자**로 대체

대체한 뒤 실제 선행자 또는 후속자 노드를 삭제한다.

---

## 11. 시간 복잡도

삽입과 탐색 시간은 트리의 높이에 비례한다.

| 트리 상태 | 높이 | 탐색·삽입 |
|---|---:|---:|
| 균형에 가까운 BST | 약 `log2(n)` | 평균적으로 `O(log n)` |
| 한쪽으로 치우친 BST | 최대 `n` | 최악 `O(n)` |

예를 들어 `10, 20, 30, 40`처럼 정렬된 데이터를 그대로 삽입하면 모든 노드가 오른쪽으로 이어져 연결 리스트처럼 된다.

```text
10
  \
   20
     \
      30
        \
         40
```

BST라고 해서 항상 빠른 것은 아니며, **트리의 모양이 균형에 가까운지**가 중요하다.

---

## 12. 실습 주제 정리

### 12.1 단어 BST

- 단어를 키로 사용한다.
- `insert_node()`로 단어를 삽입한다.
- `search()`로 특정 단어를 찾는다.
- `inorder()`로 알파벳 순서대로 출력한다.

### 12.2 단어 빈도수

노드에 `count`를 추가한다.

```c
typedef struct node {
    struct node *left;
    char *word;
    int count;
    struct node *right;
} NODETYPE;
```

- 새 단어이면 새 노드를 만들고 `count = 1`
- 이미 존재하는 단어이면 새 노드를 만들지 않고 `count++`
- 중위 순회하면 단어와 출현 횟수가 알파벳 순서로 출력됨

### 12.3 사원 정보 BST

```c
typedef struct enode {
    struct enode *left;
    int eid;       // 사원번호: BST의 키
    int syear;     // 입사연도
    char grade;    // 인사등급
    struct enode *right;
} ENODE;
```

- 사원번호 탐색: `eid`가 BST의 키이므로 한쪽 서브트리만 선택하며 탐색
- 입사연도 탐색: `syear`는 정렬 기준이 아니므로 전체 트리를 순회하며 검사

### 12.4 `p260bstex_file.c` 파일 입력 실습

이 프로그램은 텍스트 파일에서 `학번 key`와 `성적 score`를 읽어 학번을 기준으로 BST를 구축한다. 구축이 끝나면 `scan_bst()`로 전체 노드를 중위 순회하여 학번순으로 출력한다.

#### 입력 파일 형식

한 줄에 정수형 학번과 실수형 성적을 작성한다.

```text
1280 3.02
3140 4.21
2560 3.89
```

#### 실행 흐름

```text
명령행에서 입력 파일명 전달
        ↓
fopen()으로 파일 열기
        ↓
fscanf()로 학번과 성적 읽기
        ↓
첫 데이터는 루트 노드로 생성
        ↓
나머지 데이터는 insert_bst()로 삽입
        ↓
scan_bst()로 중위 순회 출력
```

#### 실습의 핵심 빈칸: `scan_bst()`

```c
void scan_bst(BSTNODE *ptr) {
    if (ptr != NULL) {
        scan_bst(ptr->left);
        printf("%d %.2f\n", ptr->key, ptr->score);
        scan_bst(ptr->right);
    }
}
```

BST의 중위 순회 순서인 `왼쪽 → 루트 → 오른쪽`을 사용하므로 학번이 오름차순으로 출력된다.

#### 보완한 전체 코드

원본의 학습 구조를 유지하면서 다음 사항을 보완했다.

- `void main()`을 표준 형식인 `int main()`으로 변경
- `argv[1]`을 사용하기 전에 `argc` 검사
- `malloc()` 실패 검사
- `fscanf()`가 두 값을 모두 읽었는지 검사
- 사용이 끝난 파일과 동적 메모리 정리

```c
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>

typedef struct bstnode {
    struct bstnode *left;   // 왼쪽 자식 노드
    int key;                // 학번: BST의 비교 기준
    float score;            // 성적
    struct bstnode *right;  // 오른쪽 자식 노드
} BSTNODE;

// BST 삽입, 중위 순회, 메모리 해제 함수
int insert_bst(BSTNODE *root, int id, float score);
void scan_bst(const BSTNODE *ptr);
void free_bst(BSTNODE *ptr);

int main(int argc, char *argv[]) {
    BSTNODE *tree = NULL;
    int sid;
    float grade;
    FILE *input;

    // 실행할 때 입력 파일명이 전달되었는지 확인
    if (argc != 2) {
        fprintf(stderr, "Usage: %s input_file\n", argv[0]);
        return 1;
    }

    // 읽기 모드로 데이터 파일 열기
    input = fopen(argv[1], "r");
    if (input == NULL) {
        fprintf(stderr, "Invalid Open input file...\n");
        return 1;
    }

    // 파일에서 학번과 성적을 한 쌍씩 읽기
    while (fscanf(input, "%d %f", &sid, &grade) == 2) {
        if (tree == NULL) {
            // 첫 번째 데이터로 루트 노드 생성
            tree = malloc(sizeof(*tree));
            if (tree == NULL) {
                fclose(input);
                return 1;
            }

            tree->key = sid;
            tree->score = grade;
            tree->left = NULL;
            tree->right = NULL;
        } else {
            // 두 번째 데이터부터 BST 규칙에 따라 삽입
            int result = insert_bst(tree, sid, grade);
            if (result < 0) {
                fclose(input);
                free_bst(tree);
                return 1;
            }
        }
    }

    // 파일을 닫고, 학번순으로 출력한 뒤 메모리 정리
    fclose(input);
    scan_bst(tree);
    free_bst(tree);
    return 0;
}

int insert_bst(BSTNODE *root, int id, float score) {
    BSTNODE *tptr = root;
    BSTNODE *before = NULL;
    BSTNODE *node;

    // 새 학번이 들어갈 NULL 위치까지 이동
    while (tptr != NULL) {
        before = tptr;  // 새 노드의 부모가 될 노드

        if (id < tptr->key)
            tptr = tptr->left;
        else if (id > tptr->key)
            tptr = tptr->right;
        else
            return 0;  // 중복 학번
    }

    // 삽입할 새 노드 생성
    node = malloc(sizeof(*node));
    if (node == NULL)
        return -1;

    node->key = id;
    node->score = score;
    node->left = NULL;
    node->right = NULL;

    // 부모 노드의 왼쪽 또는 오른쪽에 새 노드 연결
    if (id < before->key)
        before->left = node;
    else
        before->right = node;

    return 1;
}

void scan_bst(const BSTNODE *ptr) {
    if (ptr != NULL) {
        scan_bst(ptr->left);                         // 작은 학번
        printf("%d %.2f\n", ptr->key, ptr->score);   // 현재 학번
        scan_bst(ptr->right);                        // 큰 학번
    }
}

void free_bst(BSTNODE *ptr) {
    if (ptr != NULL) {
        // 자식 노드를 먼저 해제한 후 현재 노드 해제
        free_bst(ptr->left);
        free_bst(ptr->right);
        free(ptr);
    }
}
```

#### 실행 방법

```bash
clang -std=c11 -Wall -Wextra -Werror -pedantic \
  p260bstex_file.c -o p260bstex_file

./p260bstex_file btreedata.txt
```

제공된 `btreedata.txt`를 사용한 출력은 학번 오름차순이다.

```text
1101 4.01
1235 4.07
1280 3.02
2210 3.27
2222 3.25
2550 3.88
2560 3.89
3110 2.88
3140 4.21
3560 2.75
```

---

## 13. 확인학습 6-1

강의 자료의 트리는 다음과 같다.

```text
          A
        /   \
       B     C
      / \   /
     D   E H
          \  \
           F  I
          /  / \
         G  J   K
```

- 전위 순회: `A B D E F G C H I J K`
- 중위 순회: `D B E G F A H J I K C`
- 후위 순회: `D G F E B J K I H C A`

---

## 14. 확인학습 6-2

삽입 순서:

```text
300, 170, 250, 550, 110, 700, 630, 600
```

### 14.1 구축 결과

```text
          300
         /   \
       170   550
      /  \      \
    110  250     700
                  /
                630
                /
              600
```

### 14.2 깊이

가장 긴 경로는 `300 → 550 → 700 → 630 → 600`이다.

- 루트 깊이를 0으로 세면 최대 깊이: **4**
- 레벨 수로 세면 트리 높이: **5레벨**

### 14.3 중위 순회 결과

```text
110 170 250 300 550 600 630 700
```

### 14.4 오름차순 출력 함수

```c
void asort(tree_pointer root) {
    if (root != NULL) {
        asort(root->left_child);
        printf("%d ", root->key);
        asort(root->right_child);
    }
}
```

`asort()`는 이름만 다를 뿐 BST의 중위 순회와 같은 구조이다.

### 14.5 내림차순 출력 함수

```c
void dsort(tree_pointer ptr) {
    if (ptr != NULL) {
        dsort(ptr->right_child);
        printf("%d ", ptr->key);
        dsort(ptr->left_child);
    }
}
```

`dsort()`는 일반적인 중위 순회의 방문 순서를 반대로 바꾼 **역중위 순회**이다.

```text
오른쪽 서브트리 → 루트 → 왼쪽 서브트리
```

BST에서는 오른쪽 서브트리에 큰 키가 있고 왼쪽 서브트리에 작은 키가 있으므로, 이 순서로 방문하면 키가 내림차순으로 출력된다.

확인학습 6-2 트리에 `dsort()`를 적용한 결과는 다음과 같다.

```text
700 630 600 550 300 250 170 110
```

---

## 15. 강의 코드에서 확인할 주의점

1. 표준 C 프로그램의 시작 함수는 `void main()`이 아니라 `int main(void)` 또는 `int main(int argc, char *argv[])`를 사용한다.
2. `argv[1]`을 사용하기 전에 `argc`가 2 이상인지 확인해야 한다.
3. `malloc()` 결과가 `NULL`인지 확인한다.
4. 문자열 크기는 마지막 `\0`까지 고려하여 `strlen(word) + 1`바이트를 할당한다.
5. `gets()`는 버퍼 오버플로 위험이 있으므로 사용하지 말고 `fgets()`를 사용한다.
6. 열린 파일은 `fclose()`하고 동적 할당한 메모리는 사용 후 `free()`한다.
7. 강의 자료의 `Binay Search Tree` 표기는 `Binary Search Tree`가 맞다.

---

## 16. 시험 직전 요약

- 이진 트리 노드의 차수는 `0`, `1`, `2` 중 하나이다.
- 완전 이진 트리는 마지막 레벨을 왼쪽부터 채운다.
- 배열에서 인덱스 `i`의 왼쪽 자식은 `2i`, 오른쪽 자식은 `2i+1`이다.
- 전위: `루트-왼쪽-오른쪽`
- 중위: `왼쪽-루트-오른쪽`
- 후위: `왼쪽-오른쪽-루트`
- BST는 `왼쪽 키 < 루트 키 < 오른쪽 키` 규칙을 재귀적으로 만족한다.
- BST 탐색은 작으면 왼쪽, 크면 오른쪽으로 이동한다.
- BST를 중위 순회하면 키가 오름차순으로 출력된다.
- BST를 역중위 순회하면 키가 내림차순으로 출력된다.
- BST 탐색과 삽입은 평균 `O(log n)`, 한쪽으로 치우치면 최악 `O(n)`이다.

## 참고 자료

- `TODS트리복습.pdf`
- `TO_10주차수업BST.pdf`
- `ai_skills_collector`의 `cs-tutor` 학습 자료 구성 원칙
