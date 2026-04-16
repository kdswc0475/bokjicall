import { PrismaClient } from '@prisma/client';
import { ClientCondition, ServiceResult } from '../types/service';

const prisma = new PrismaClient();

export async function queryPrivateServices(condition: ClientCondition): Promise<ServiceResult[]> {
  try {
    // Basic filtering logic based on spec
    const services = await prisma.privateService.findMany({
      where: {
        isActive: true,
        OR: [
          { regionScope: '전국' },
          { regionName: { contains: condition.sido } },
          { regionName: { contains: condition.sigungu } }
        ],
        // Lifecycle matching
        AND: condition.lifecycle.length > 0 ? {
          OR: condition.lifecycle.map(l => ({
            lifecycle: { contains: l }
          }))
        } : {},
        // Household matching
        // Note: For complex multi-criteria searching, raw query or refined logic might be better
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
      topics: s.topic.split(','),
      region: s.regionName || s.regionScope,
      isActive: s.isActive,
    }));
  } catch (error) {
    console.error('Error querying private services:', error);
    return [];
  }
}
