import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import eventRoutes from '../modules/event/event.routes';
import registrationRoutes from '../modules/registration/registration.routes';
import resultRoutes from '../modules/result/result.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/registrations', registrationRoutes);
router.use('/results', resultRoutes);

export default router;
