# 이벤트 보상 플랫폼 (Event Reward Platform)

NestJS + MSA + MongoDB 기반 3개의 서버 구조로 구현했습니다. API Gateway Server, Auth Server, Event Server를 각각 독립된 서비스로 구성하고, 내부 통신은 서비스끼리의 HTTP 요청으로 처리했습니다.

<br>

## 시스템 구성

![Image](https://github.com/user-attachments/assets/dadc7096-c1ba-4e10-84c5-19da1e165e58)

1. **Gateway Server**: 클라이언트 요청을 검증 및 Role 검사 후 적절한 서비스로 라우팅합니다 (PORT: 3000)
	- **JwtStrategy**  
     Passport 전략으로, `Authorization` 헤더의 Bearer 토큰을 파싱하여 사용자 검증을 수행합니다.

    - **JwtAuthGuard**  
     요청에 유효한 JWT 토큰이 포함되어 있는지 확인합니다.

    - **RolesGuard**  
     요청한 API에 필요한 사용자 역할이 있는지 검사합니다.

   - **@Roles 데코레이터**  
     각 API 별 사용 가능한 역할들을 지정합니다.

2. **Auth Server**: JWT 발급 및 갱신, 유저 등록, 역할 관리를 담당합니다 (내부 PORT: 3001)

3. **Event Server**: 이벤트 등록 및 조회, 보상 등록 및 조회, 보상 요청 및 내역 관리를 담당합니다 (내부 PORT: 3002)
4. **MongoDB**: Auth Server와 Event Server 각각 DB를 사용합니다.

    - **Auth DB Collections**: `users` 

    - **Event DB Collections**: `events`, `rewards`, `rewardrequests`

    - docker-compose 실행 시 `mongodb/init.js`를 통해 MongoDB 초기 데이터가 자동 세팅됩니다.

    - 기본 계정 id로 admin, operator1, user1, user2가 있습니다. 비밀번호 1234 로 로그인 가능합니다. 
5. **Docker**  
   - 모든 서버는 Docker 컨테이너로 구성했고, 각 서비스는 격리된 컨테이너에서 실행됩니다.
   - 내부 통신은 Docker 네트워크를 통해 서비스끼리 직접 연결됩니다.
   - **Gateway Server (3000)** 만 외부에서 접근 가능하도록 설정했고, 나머지 서버는 외부에 노출되지 않습니다.

<br>

## 프로젝트 실행 방법

프로젝트 루트 디렉터리에서 다음 명령을 실행합니다.

```bash
# 서비스 빌드 및 시작
docker-compose up --build -d

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down
```

<br>

## API 

모든 API 요청과 응답은 Gateway Server를 통해 Proxy 처리되며, Response는 다음과 같은 형식으로 일관성 있게 전달됩니다:

### 공통 응답 형식

```json
{
  "success": true,
  "statusCode": 200,
  "message": "요청이 성공적으로 처리되었습니다",
  "data": {
    // 실제 응답 데이터
  }
}
```

에러 발생 시:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "에러 메시지",
  "error": "BAD_REQUEST"
}
```

<br>

### Auth Server API

#### 사용자 관리

- **POST /auth/login** : 로그인 - 발급된 Access Token으로 인증이 필요한 API 요청에 사용합니다.
  - Role: `ALL`
  - Request:
  ```json
  {
    "id": "사용자 ID",
    "password": "비밀번호"
  }
  ```
  - Response:
  ```json
  {
    "accessToken": "JWT Access Token",
    "refreshToken": "JWT Refresh Token",
    "user": {
      "id": "사용자 ID",
      "name": "사용자 이름"
    }
  }
  ```

- **POST /auth/token/refresh** : Client에서 Access Token 만료시 Refresh Token으로 Access Token을 재발급합니다.
  - Role: `ALL`
  - Request:
  ```json
  {
    "refreshToken": "Refresh Token"
  }
  ```
  - Response:
  ```json
  {
    "accessToken": "새로운 JWT Access Token"
  }
  ```

- **POST /auth/user** : 새로운 사용자를 등록합니다.
  - Role: `ADMIN`
  - Request:
  ```json
  {
    "id": "사용자 ID",
    "name": "사용자 이름",
    "password": "비밀번호",
    "role": "ADMIN" | "OPERATOR" | "AUDITOR" | "USER"
  }
  ```
  - Response:
  ```json
  {
    "id": "사용자 ID",
    "name": "사용자 이름",
    "role": "사용자 역할"
  }
  ```

- **PATCH /auth/user/role** : 사용자 역할을 변경합니다.
  - Role: `ADMIN`
  - Request:
  ```json
  {
    "id": "사용자 ID",
    "role": "ADMIN" | "OPERATOR" | "AUDITOR" | "USER"
  }
  ```
  - Response:
  ```json
  {
    "id": "사용자 ID",
    "role": "변경된 역할"
  }
  ```

<br>

### Event Server API

#### 이벤트 관리

- **POST /event** : 이벤트를 생성합니다.
  - Role: `ADMIN`, `OPERATOR`
  - Request:
  ```json
  {
    "title": "이벤트 제목", // ex) 보스 레이드 이벤트 - 검은 마법사
    "condition": {
      "type": "조건 타입", // ex) boss_clear
      "value": "조건 값" // ex) black_mage
    },
    "status": "ACTIVE" | "INACTIVE",
    "startAt": "시작 날짜",
    "endAt": "종료 날짜"
  }
  ```
  - Response:
  ```json
  {
    "id": "이벤트 ID",
    "title": "이벤트 제목",
    "condition": {
      "type": "조건 타입",
      "value": "조건 값"
    },
    "status": "이벤트 상태",
    "startAt": "시작 날짜",
    "endAt": "종료 날짜",
    "createdAt": "생성일",
    "updatedAt": "수정일"
  }
  ```

- **GET /event** : 모든 이벤트를 조회합니다.
  - Role: `ALL`
  - Response: POST /event의 response 구조를 element로 하는 Event Array

- **GET /event/:id** : 특정 이벤트를 조회합니다.
  - Role: `ALL`
  - Response: POST /event의 response 구조의 Event Object

#### 보상 관리

- **POST /reward** : 새로운 보상을 등록합니다.
  - Role: `ADMIN`, `OPERATOR`
  - Request:
  ```json
  {
    "eventId": "이벤트 ID",
    "type": "POINT" | "COUPON" | "ITEM",
    "amount": "보상 수량 또는 양(포인트)",
    "itemId": "아이템인 경우 아이템 아이디" (optional),
    "couponCode": "쿠폰인 경우 쿠폰 코드" (optional),
    "description": "보상 설명"
  }
  ```
  - Response:
  ```json
  {
    "id": "보상 ID",
    "eventId": "이벤트 ID",
    "type": "보상 타입",
    "amount": "보상 수량 또는 양(포인트)",
    "itemId": "아이템인 경우 아이템 아이디" (optional),
    "couponCode": "쿠폰인 경우 쿠폰 코드" (optional),
    "description": "보상 설명",
    "createdAt": "생성일",
    "updatedAt": "수정일"
  }
  ```

- **GET /reward** : 모든 보상을 조회합니다.
  - Role: `ADMIN`, `OPERATOR`
  - Response: POST /reward의 response 구조를 element로 하는 Reward Array

- **GET /reward/event/:eventId** : 특정 이벤트의 보상을 조회합니다.
  - Role: `ALL`
  - Response: 해당 이벤트의 Reward Array

#### 보상 요청 관리

- **POST /reward-request** : 보상을 요청하고 조건에 따라 지급 성공/실패 처리 후 기록합니다.
  - Role: `USER`
  - Request:
  ```json
  {
    "eventId": "이벤트 ID",
    "rewardId": "보상 ID"
  }
  ```
  - Response:
  ```json
  {
    "id": "요청 ID",
    "userId": "사용자 ID",
    "eventId": "이벤트 ID",
    "rewardId": "보상 ID",
    "status": "PENDING" | "SUCCESS" | "FAILED",
    "reason": "처리 사유",
    "requestedAt": "요청 시간",
    "processedAt": "처리 시간"
  }
  ```

- **GET /reward-request/me** : 자신의 보상 요청 로그를 조회합니다.
  - Role: `USER`
  - Response: 사용자의 보상 요청 목록 배열

- **GET /reward-request** : 모든 보상 요청 로그를 조회합니다.
  - Role: `ADMIN`, `OPERATOR`, `AUDITOR`
  - Query Parameters:
    - `conditionType`: 이벤트 조건 타입으로 필터링 - ex) boss_clear
    - `status`: 보상 요청 상태로 필터링 - ex) SUCCESS
  - Response: 보상 요청 목록 배열

<br>

## 환경 변수

### Gateway Server
- `NODE_ENV`: 실행 환경 (production/development)
- `AUTH_SERVER_URL`: 인증 서버 URL
- `EVENT_SERVER_URL`: 이벤트 서버 URL
- `JWT_SECRET`: JWT 토큰 암호화 키

### Auth Server
- `NODE_ENV`: 실행 환경 (production/development)
- `PORT`: 서버 포트
- `MONGODB_URI`: MongoDB 연결 URI
- `JWT_SECRET`: JWT 토큰 암호화 키

### Event Server
- `NODE_ENV`: 실행 환경 (production/development)
- `PORT`: 서버 포트
- `MONGODB_URI`: MongoDB 연결 URI
- `AUTH_SERVER_URL`: 인증 서버 URL 