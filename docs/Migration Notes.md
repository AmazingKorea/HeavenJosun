## Typescript-based ExpressJs

기존 프로젝트에서 바뀐 점:

1. TypeScript 도입
2. Express -> routing-controllers (Express 기반의 Validation, Marshalling/Unmarshalling 내장)
3. class와 decoratior(어노테이션) 위주의 코드
4. ORM 도입 ( Mikro-ORM )

#### 특수한 점

다른 프로젝트에서 `require`로 읽어오는 경우에는 Node의 버전이 높더라도 결과물이 `commonjs`로 빌드돼야 한다. 그렇지 않으면 `require`로 esm 모듈을 로딩한다는 오류가 발생한다.

#### 설치

VSCode `eslint-prettier` 확장을 설치했다면 추가로 설치할 외부 프로그램은 없다.

```bash
$ npm install --legacy-peer-deps
# 사용 중인 routing-controllers의 문제 때문에  `--legacy-peer-deps` 옵션을 명시해야만 설치된다.
```

이 프로젝트는 MySQL DB 인스턴스가 항상 띄워져있어야 한다.

##### 방법 1. app까지 Docker로 띄우는 방법

```bash
$ docker-compose up
```

##### 방법 2. MySQL만 Docker로 띄우는 방법

```bash
$ docker-compose -f docker-compose.mysql.yml --build
# --build는 이미지를 `heavenjosun` 이름으로 태그하기 위함으로, 최초 1회에만 실행하면 된다.
```

#### 린터 설정

TypeScript Linter를 VSCode에서 설정해본 적 없는 경우 아래의 수동 설정 과정을 거쳐야 한다.

Ctrl+Shift+P로 `>Preferences: Open Settings (JSON)` 엔터

```json
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
```

윗 내용 찾고 바로 아래에 이하의 내용을 추가

```json
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
```

#### temp 폴더 설명

MikroORM에서 `ts-morph`로 읽은 메타데이터를 캐싱한 파일들이 담겨있음. 접근x 버전 컨트롤에도x