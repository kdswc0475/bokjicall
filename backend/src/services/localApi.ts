import axios from 'axios';
import { parseXml, extractArray } from '../utils/xmlParser';
import { ClientCondition, ServiceResult } from '../types/service';

const BASE_URL = 'http://apis.data.go.kr/B554287/LocalWelfareInformations';
const SERVICE_KEY = process.env.PUBLIC_DATA_API_KEY || '';

export async function fetchLocalServices(condition: ClientCondition): Promise<ServiceResult[]> {
  try {
    // If no region is selected, we can't fetch local services efficiently without major pagination
    if (!condition.sido) return [];

    const params = {
      serviceKey: SERVICE_KEY,
      pageNo: 1,
      numOfRows: 50,
      ctpvNm: condition.sido,
      sggNm: condition.sigungu || undefined,
    };

    const response = await axios.get(`${BASE_URL}/getLcWelfareServiceList`, {
      params,
      responseType: 'text',
      timeout: 8000,
    });

    const parsedData = parseXml(response.data);
    const items = extractArray<any>(parsedData?.response?.body?.servList?.servList || []);

    return items.map((item: any) => ({
      id: item.servId,
      name: item.servNm,
      provider: item.jurMnofNm || item.jurOrgNm || '지자체',
      tier: 'LOCAL',
      summary: item.servDgst || '',
      content: item.servDgst || '',
      target: item.trgterIndvdlArray || '',
      applyMethod: '지자체 문의',
      link: item.servDtlLink,
      urgencyLevel: 2,
      topics: item.intrsThemaArray ? item.intrsThemaArray.split(',') : [],
      region: `${item.ctpvNm || ''} ${item.sggNm || ''}`.trim(),
      isActive: true,
    }));
  } catch (error) {
    console.error('Error fetching local services:', error);
    return [];
  }
}
