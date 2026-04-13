import { Router } from 'express';
import { acceptFriendRequest } from '../../controllers/friends/acceptRequest';
import { findUsersByContacts } from '../../controllers/friends/findUsersByContacts';
import { getMyFriends } from '../../controllers/friends/getMyFriends';
import { getPeopleYouMayKnow } from '../../controllers/friends/getSuggestions';
import { sendFriendRequest } from '../../controllers/friends/sendRequest';
import requireAuth from '../../middleware/requireAuth';
import {
    acceptFriendRequestSchema,
    findUsersByContactsSchema,
    getSuggestionsSchema,
    sendFriendRequestSchema
} from '../../middleware/validators/friend';
import { validate } from '../../middleware/validators/auth';

const router = Router();

router.post('/request', requireAuth, validate(sendFriendRequestSchema), sendFriendRequest);

router.post('/accept', requireAuth, validate(acceptFriendRequestSchema), acceptFriendRequest);

router.get('/', requireAuth, getMyFriends);

router.post('/find-by-contacts', requireAuth, validate(findUsersByContactsSchema), findUsersByContacts);

router.get('/suggestions', requireAuth, validate(getSuggestionsSchema), getPeopleYouMayKnow);

export default router;
