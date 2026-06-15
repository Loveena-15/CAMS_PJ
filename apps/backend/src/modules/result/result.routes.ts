import { Router } from 'express';
import { ResultController } from './result.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { assignResultSchema, updateResultSchema, getResultsQuerySchema } from './result.validation';

const router = Router();
const resultController = new ResultController();

// Public routes
router.get('/event/:id', validate(getResultsQuerySchema), resultController.getEventResults);

// Authenticated routes
router.use(authenticate);

// Student routes
router.get('/my', restrictTo('STUDENT'), validate(getResultsQuerySchema), resultController.getMyResults);

// Admin routes
router.post('/', restrictTo('ADMIN'), validate(assignResultSchema), resultController.assignResult);
router.put('/:id', restrictTo('ADMIN'), validate(updateResultSchema), resultController.updateResult);
router.delete('/:id', restrictTo('ADMIN'), resultController.deleteResult);

export default router;
