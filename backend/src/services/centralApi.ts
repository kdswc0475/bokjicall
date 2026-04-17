import axios from 'axios';
import { parseXml, extractArray } from '../utils/xmlParser';
import { ClientCondition, ServiceResult } from '../types/service';

const BASE_URL = 'http://apis.data.go.kr/B554287/NationalWelfareInformationsV001';
const SERVICE_KEY = process.env.PUBLIC_DATA_API_KEY || '';

// Mappings from Spec
const LIFECYCLE_TO_CODE: Record<string, string> = {
  '영유아': '001',
  '아동': '002',
  '청소년': '003',
  '청년': '004',
  '중장년': '005',
  '노년': '007',
  '임신·출산': '008',
};

const HOUSEHOLD_TO_CODE: Record<string, string> = {
  '저소득': '008',
  '수급자': '012',
  '장애인': '003',
  '한부모': '002',
  '다문화': '005',
  '탈북민': '007',
  '노숙인': '011',
};

const CONDITION_TO_TOPIC: Record<string, string> = {
  '정신건강': '005',
  '알코올중독': '005',
  '신체질환': '004',
  '주거불안': '002',
  '법률문제': '010',
  '취업': '003',
  '교육': '006',
  '생활안정': '001',
  '문화여가': '007',
  '환경': '008',
  '가족돌봄': '009',
  '서민금융': '011',
};

export async function fetchCentralServices(condition: ClientCondition): Promise<ServiceResult[]> {
  try {
    const lifeArray = condition.lifecycle
      .map(l => LIFECYCLE_TO_CODE[l])
      .filter(Boolean)
      .join(',');

    const trgterIndvdlArray = condition.household
      .map(h => HOUSEHOLD_TO_CODE[h])
      .filter(Boolean)
      .join(',');

    const intrsThemaArray = condition.conditions
      .map(c => CONDITION_TO_TOPIC[c])
      .filter(Boolean)
      .join(',');

    const params = {
      serviceKey: SERVICE_KEY,
      callTp: 'L',
      pageNo: 1,
      numOfRows: 50,
      lifeArray: lifeArray || undefined,
      trgterIndvdlArray: trgterIndvdlArray || undefined,
      intrsThemaArray: intrsThemaArray || undefined,
      age: condition.ageValue || undefined,
    };

    const response = await axios.get(`${BASE_URL}/NationalWelfarelistV001`, {
      params,
      responseType: 'text',
      timeout: 8000,
    });

    const parsedData = parseXml(response.data);
    const items = extractArray<any>(parsedData?.response?.body?.servList?.servList || []);

    return items.map(item => ({
      id: item.servId,
      name: item.servNm,
      provider: item.jurMnofNm,
      tier: 'CENTRAL',
      summary: item.servDgst,
      content: item.servDgst, // Detailed view might need another API call, for list we use dgst
      target: item.trgterIndvdlArray,
      applyMethod: item.onapPsbltYn === 'Y' ? '온라인 신청 가능' : '방문/전화 문의',
      link: item.servDtlLink,
      urgencyLevel: 2, // Default
      topics: item.intrsThemaArray ? item.intrsThemaArray.split(',') : [],
      region: '전국',
      isActive: true,
    }));
  } catch (error) {
    console.error('Error fetching central services:', error);
    return [];
  }
}
