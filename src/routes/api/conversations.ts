import { Router } from 'express';
import { getConversations } from '../../controllers/conversations/getConversations';
import requireAuth from '../../middleware/requireAuth';

const router = Router();

router.get('/all', requireAuth, getConversations);

export default router;
