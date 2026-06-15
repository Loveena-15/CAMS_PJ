import { Router } from 'express';
import { RegistrationController } from './registration.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { registerEventSchema, getMyRegistrationsQuerySchema, getEventRegistrationsQuerySchema } from './registration.validation';

const router = Router();
const registrationController = new RegistrationController();

// All routes require authentication
router.use(authenticate);

// Student routes
router.post('/', restrictTo('STUDENT'), validate(registerEventSchema), registrationController.register);
router.get('/my', restrictTo('STUDENT'), validate(getMyRegistrationsQuerySchema), registrationController.getMyRegistrations);
router.delete('/:id', restrictTo('STUDENT'), registrationController.cancelRegistration);

// Admin routes
router.get('/event/:id', restrictTo('ADMIN'), validate(getEventRegistrationsQuerySchema), registrationController.getEventRegistrations);

export default router;
