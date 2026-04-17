import { PrismaClient } from '@prisma/client';
import { ClientCondition, ServiceResult } from '../types/service';

const prisma = new PrismaClient();

// Mapping UI condition labels to DB topic labels
const CONDITION_TO_DB_TOPIC: Record<string, string> = {
  '정신건강': '의료·건강',
  '알코올중독': '의료·건강',
  '신체질환': '의료·건강',
  '주거불안': '주거',
  '법률문제': '법률',
  '취업': '고용',
  '교육': '교육',
  '생활안정': '생계·긴급',
  '문화여가': '문화·여가',
  '가족돌봄': '돌봄',
};

export async function queryPrivateServices(condition: ClientCondition): Promise<ServiceResult[]> {
  try {
    const mappedTopics = condition.conditions
      .map(c => CONDITION_TO_DB_TOPIC[c])
      .filter(Boolean);

    const services = await prisma.privateService.findMany({
      where: {
        isActive: true,
        OR: [
          { regionScope: '전국' },
          // 3. Prevent empty string matching everything
          ...(condition.sido ? [{ regionName: { contains: condition.sido } }] : []),
          ...(condition.sigungu ? [{ regionName: { contains: condition.sigungu } }] : [])
        ],
        // 8. Improved array matching using hasSome
        AND: [
          condition.lifecycle.length > 0 ? {
            lifecycle: { hasSome: condition.lifecycle }
          } : {},
          // 4. Household matching implemented
          condition.household.length > 0 ? {
            household: { hasSome: condition.household }
          } : {},
          // 12. Income level logic + condition mapping
          mappedTopics.length > 0 ? {
            topic: { hasSome: mappedTopics }
          } : {},
        ],
      },
      orderBy: {
        urgencyLevel: 'desc'
      }
    });

    return services.map(s => ({
      id: s.id.toString(),
      name: s.serviceName,
      provider: s.orgName,
      tier: 'PRIVATE',
      summary: s.purpose || '',
      content: s.content || '',
      target: s.target || '',
      applyMethod: s.applyMethod || '',
      documents: s.documents || '',
      urgencyLevel: s.urgencyLevel,
      // 8. Simplified as s.topic is already an array
      topics: s.topic,
      region: s.regionName || s.regionScope,
      isActive: s.isActive,
    }));
  } catch (error) {
    console.error('Error querying private services:', error);
    return [];
  }
}
