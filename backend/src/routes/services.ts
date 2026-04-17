import { Router, Request, Response } from 'express';
import { fetchCentralServices } from '../services/centralApi';
import { fetchLocalServices } from '../services/localApi';
import { queryPrivateServices } from '../services/privateDb';
import { ClientConditionSchema } from '../schemas/condition';

const router = Router();

router.post('/match', async (req: Request, res: Response) => {
  try {
    // 6. Input validation using Zod
    const result = ClientConditionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Invalid input parameters', 
        details: result.error.format() 
      });
    }

    const condition = result.data;

    const [central, local, privateResults] = await Promise.allSettled([
      fetchCentralServices(condition),
      fetchLocalServices(condition),
      queryPrivateServices(condition),
    ]);

    const results = {
      central: central.status === 'fulfilled' ? central.value : [],
      local: local.status === 'fulfilled' ? local.value : [],
      private: privateResults.status === 'fulfilled' ? privateResults.value : [],
    };

    res.json(results);
  } catch (error) {
    console.error('Matching error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
