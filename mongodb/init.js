// auth-db 초기 유저 삽입
let now = new Date();

db = db.getSiblingDB('auth-db');
db.createCollection('users');

db.users.insertMany([
  {
    id: 'admin',
    name: '관리자1',
    password: '$2b$10$87gC33Kyfno8ugwCyr6ghOpvz/8KTBh/gxbgpzEjZIZy0IqoPYcbC', // "1234"
    role: 'ADMIN',
    refreshToken: '',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'operator1',
    name: '운영자1',
    password: '$2b$10$87gC33Kyfno8ugwCyr6ghOpvz/8KTBh/gxbgpzEjZIZy0IqoPYcbC', // "1234"
    role: 'OPERATOR',
    refreshToken: '',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'user1',
    name: '유저1',
    password: '$2b$10$87gC33Kyfno8ugwCyr6ghOpvz/8KTBh/gxbgpzEjZIZy0IqoPYcbC', // "1234"
    role: 'USER',
    refreshToken: '',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'user2',
    name: '유저2',
    password: '$2b$10$87gC33Kyfno8ugwCyr6ghOpvz/8KTBh/gxbgpzEjZIZy0IqoPYcbC', // "1234"
    role: 'USER',
    refreshToken: '',
    createdAt: now,
    updatedAt: now,
  }
]);

// event-db 초기 이벤트, 보상, 요청 기록 삽입
db = db.getSiblingDB('event-db');

db.createCollection('events');
db.createCollection('rewards');
db.createCollection('rewardrequests');

let event1Id = ObjectId();
let event2Id = ObjectId();
let reward1Id = ObjectId();
let reward2Id = ObjectId();

db.events.insertMany([
  {
    _id: event1Id,
    title: '3일 연속 로그인 이벤트',
    condition: {
      type: 'login_days',
      value: '3'
    },
    status: 'ACTIVE',
    startAt: new Date('2025-05-01T00:00:00'),
    endAt: new Date('2025-05-31T23:59:59'),
    createdAt: now,
    updatedAt: now
  },
  {
    _id: event2Id,
    title: '보스 레이드 이벤트 - 검은 마법사',
    condition: {
      type: 'boss_clear',
      value: 'black_mage'
    },
    status: 'ACTIVE',
    startAt: new Date('2025-05-15T00:00:00'),
    endAt: new Date('2025-06-01T23:59:59'),
    createdAt: now,
    updatedAt: now
  }
]);

db.rewards.insertMany([
  {
    _id: reward1Id,
    eventId: event2Id,
    type: 'POINT',
    description: '보스 레이드 이벤트 - 마일리지 500P',
    createdAt: now,
    updatedAt: now
  },
  {
    _id: reward2Id,
    eventId: event1Id,
    type: 'COUPON',
    description: '출석 이벤트 특별 쿠폰',
    createdAt: now,
    updatedAt: now
  }
]);

db.rewardrequests.insertMany([
  {
    userId: 'user1',
    eventId: event2Id,
    rewardId: reward1Id,
    status: 'SUCCESS',
    requestedAt: now,
    processedAt: now
  },
  {
    userId: 'user2',
    eventId: event2Id,
    rewardId: reward1Id,
    status: 'FAIL',
    requestedAt: now,
    processedAt: now
  },
  {
    userId: 'user2',
    eventId: event1Id,
    rewardId: reward2Id,
    status: 'SUCCESS',
    requestedAt: now,
    processedAt: now
  }
]);