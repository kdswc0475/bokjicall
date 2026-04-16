import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import iconv from 'iconv-lite';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importCsv() {
  const rootDir = path.resolve(__dirname, '../../');
  const files = fs.readdirSync(rootDir);
  const csvFile = files.find(f => f.endsWith('20251105.csv') && !f.startsWith('._'));

  if (!csvFile) {
    console.error('CSV file not found');
    process.exit(1);
  }

  const filePath = path.join(rootDir, csvFile);
  console.log(`Importing file: ${csvFile}`);

  const parser = fs.createReadStream(filePath)
    .pipe(iconv.decodeStream('euc-kr'))
    .pipe(parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }));

  console.log('Clearing existing private services...');
  await prisma.privateService.deleteMany({});

  let count = 0;
  for await (const record of parser) {
    // Mapping from CSV headers to Prisma fields
    // 기관명,사업명,사업시작일,사업종료일,사업목적,지원대상,지원내용,신청방법,제출서류,기타,생애주기,가구상황,관심주제
    
    const startDate = record['사업시작일'] ? new Date(record['사업시작일']) : null;
    const endDate = record['사업종료일'] ? new Date(record['사업종료일']) : null;

    await prisma.privateService.create({
      data: {
        orgName: record['기관명'] || '',
        serviceName: record['사업명'] || '',
        startDate: isNaN(startDate?.getTime() || NaN) ? null : startDate,
        endDate: isNaN(endDate?.getTime() || NaN) ? null : endDate,
        purpose: record['사업목적'] || '',
        target: record['지원대상'] || '',
        content: record['지원내용'] || '',
        applyMethod: record['신청방법'] || '',
        documents: record['제출서류'] || '',
        note: record['기타'] || '',
        lifecycle: record['생애주기'] || '',
        household: record['가구상황'] || '',
        topic: record['관심주제'] || '',
        regionScope: '전국', // Default for this CSV
        urgencyLevel: 2, // Default
      }
    });
    count++;
    if (count % 100 === 0) console.log(`${count} records imported...`);
  }

  console.log(`Successfully imported ${count} records.`);
}

importCsv()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
