import { z } from 'zod';

export const ClientConditionSchema = z.object({
  sido: z.string().optional().default(''),
  sigungu: z.string().optional().default(''),
  dong: z.string().optional(),
  lifecycle: z.array(z.string()).default([]),
  ageValue: z.number().optional(),
  household: z.array(z.string()).default([]),
  conditions: z.array(z.string()).default([]),
  incomeLevel: z.string().optional(),
  topicFilter: z.string().optional(),
});

export type ValidatedClientCondition = z.infer<typeof ClientConditionSchema>;
