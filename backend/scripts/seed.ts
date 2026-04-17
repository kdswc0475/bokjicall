import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleServices = [
  {
    orgName: '삼성꿈장학재단',
    serviceName: '꿈장학금 지원사업',
    purpose: '경제적 여건에 상관없이 꿈이 있는 중고생에게 기회 제공',
    target: '저소득층 중학생 및 고등학생',
    content: '매월 학업장려금 지원 및 멘토링 프로그램 운영',
    applyMethod: '재단 홈페이지 온라인 신청',
    lifecycle: ['아동', '청소년'],
    household: ['저소득'],
    topic: ['교육'],
    regionScope: '전국',
    urgencyLevel: 2,
  },
  {
    orgName: '밀알복지재단',
    serviceName: '장애아동 결연후원',
    purpose: '저소득 장애아동의 의료비 및 생계비 지원',
    target: '지원과 보호가 필요한 장애아동 및 청소년',
    content: '검사비, 수술비, 재활치료비 등 의료비 긴급 지원',
    applyMethod: '기관 추천 방식',
    lifecycle: ['영유아', '아동', '청소년'],
    household: ['장애인', '저소득'],
    topic: ['의료·건강', '생계·긴급'],
    regionScope: '전국',
    urgencyLevel: 4,
  },
  {
    orgName: '대한법률구조공단',
    serviceName: '무료법률구조사업',
    purpose: '경제적 약자에게 법률적 권리보호 기회 제공',
    target: '기초생활수급자, 차상위계층, 장애인 등',
    content: '무료 민사·가사 소송 대리 및 법률 상담',
    applyMethod: '전화(132) 또는 방문 상담',
    lifecycle: ['청년', '중장년', '노년'],
    household: ['저소득', '장애인', '한부모'],
    topic: ['법률'],
    regionScope: '전국',
    urgencyLevel: 3,
  },
  {
    orgName: '굿네이버스',
    serviceName: '위기가정 지원사업',
    purpose: '갑작스러운 위기 상황에 처한 가정의 기능 회복 지원',
    target: '위기 상황(질병, 소득 중단 등)에 놓인 취약계층 가정',
    content: '생계비, 주거비, 의료비 등 긴급 생활지원금 지급',
    applyMethod: '굿네이버스 지부 방문 신청',
    lifecycle: ['아동', '중장년', '노년'],
    household: ['저소득', '한부모'],
    topic: ['생계·긴급', '주거'],
    regionScope: '전국',
    urgencyLevel: 5,
  },
];

async function main() {
  console.log('Start seeding...');
  for (const s of sampleServices) {
    await prisma.privateService.create({
      data: s,
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
