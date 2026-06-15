import { Router } from 'express';
import { CertificateController } from './certificate.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { generateCertificateSchema } from './certificate.validation';

const router = Router();
const certificateController = new CertificateController();

router.use(authenticate);

// Student routes
router.get('/my', restrictTo('STUDENT'), certificateController.getMyCertificates);
router.get('/:id', restrictTo('STUDENT'), certificateController.getCertificateById);
router.get('/download/:id', restrictTo('STUDENT'), certificateController.downloadCertificate);

// Admin routes
router.post('/generate', restrictTo('ADMIN'), validate(generateCertificateSchema), certificateController.generateCertificate);

export default router;
