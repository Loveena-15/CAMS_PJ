import { Router } from 'express';
import { EventController } from './event.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { createEventSchema, updateEventSchema, getEventsQuerySchema } from './event.validation';

const router = Router();
const eventController = new EventController();

// Publicly accessible routes
router.get('/', validate(getEventsQuerySchema), eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Admin-only routes
router.use(authenticate);
router.use(restrictTo('ADMIN'));

router.post('/', validate(createEventSchema), eventController.createEvent);
router.put('/:id', validate(updateEventSchema), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

export default router;
