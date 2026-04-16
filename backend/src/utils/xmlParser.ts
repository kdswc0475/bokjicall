import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

export const parseXml = (xml: string) => {
  return parser.parse(xml);
};

export const extractArray = <T>(data: any): T[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};
