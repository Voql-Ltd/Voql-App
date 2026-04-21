import { Router } from 'express';
import getMessages from '../../controllers/messages/getMessages';
import requireAuth from '../../middleware/requireAuth';

const router = Router();

router.get('/:room_id', requireAuth, getMessages);

export default router;
