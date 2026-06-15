import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

router.use('/auth', authRoutes);

export default router;
