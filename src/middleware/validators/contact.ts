import { z } from 'zod';

export const sendFriendRequestSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required')
});

export const acceptFriendRequestSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required')
});
export const findUsersByContactsSchema = z.object({
  phoneNumbers: z.array(z.string()).min(1, 'At least one phone number is required')
});

export const getSuggestionsSchema = z.object({
  phoneNumbers: z.array(z.string()).optional()
});

export const createP2PRoomSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required'),
  recipientIndex: z.number().int().min(0, 'Recipient index must be a non-negative integer')
});