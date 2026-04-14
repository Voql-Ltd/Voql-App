import { Router } from 'express';
import { getUserConversations } from '../../controllers/userConversations/getUserConversations';
import requireAuth from '../../middleware/requireAuth';

const router = Router();
// dd
router.get('/all', requireAuth, getUserConversations);

export default router;
