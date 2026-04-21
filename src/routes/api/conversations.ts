import { Router } from 'express';
import addMemberToRoom from '../../controllers/conversations/addMemberToRoom';
import createGroupRoom from '../../controllers/conversations/createGroupRoom';
import createP2PRoom from '../../controllers/conversations/createP2PRoom';
import getAConversation from '../../controllers/conversations/getAConversation';
import getAllConversations from '../../controllers/conversations/getAllConversations';
import getGroupsByUser from '../../controllers/conversations/getGroupsByUser';
import initiateConversation from '../../controllers/conversations/initiateConversation';
import requireAuth from '../../middleware/requireAuth';

const router = Router();

router.post('/create-p2p', requireAuth, createP2PRoom);
router.post('/create-group', requireAuth, createGroupRoom);
router.get('/groups', requireAuth, getGroupsByUser);
router.post('/add-member', requireAuth, addMemberToRoom);
router.post('/initiate-conversation', requireAuth, initiateConversation);
router.get('/one/:room_id', requireAuth, getAConversation);
router.get('/all', requireAuth, getAllConversations);

export default router;