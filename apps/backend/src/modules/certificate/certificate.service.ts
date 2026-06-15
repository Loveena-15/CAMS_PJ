import { CertificateRepository } from './certificate.repository';
import { getCertificateTemplate } from './certificate.template';
import { generateQRCode, generatePDFBuffer, uploadToCloudinary } from './certificate.utils';
import { AppError } from '../../utils/AppError';

export class CertificateService {
  private repository: CertificateRepository;

  constructor() {
    this.repository = new CertificateRepository();
  }

  async generateCertificate(resultId: string) {
    // 1. Fetch Result with Student and Event details
    const result = await this.repository.findResultById(resultId);
    if (!result) {
      throw new AppError('Result not found', 404);
    }

    // 2. Idempotency Check - Ensure we don't generate duplicate PDFs
    if (result.certificateUrl) {
      return { certificateUrl: result.certificateUrl };
    }

    const certificateId = `CERT-${result.id.substring(0, 8).toUpperCase()}`;
    // Hardcoded frontend URL structure for demo, would normally come from ENV
    const verificationUrl = `https://cams.edu/verify/${certificateId}`;
    
    // 3. Generate QR Code
    const qrCodeUrl = await generateQRCode(verificationUrl);

    // 4. Create HTML Template
    const htmlContent = getCertificateTemplate({
      studentName: result.student.fullName,
      eventName: result.event.title,
      eventDate: result.event.date.toISOString().split('T')[0],
      position: result.position,
      qrCodeUrl,
      certificateId,
    });

    // 5. Convert to PDF
    const pdfBuffer = await generatePDFBuffer(htmlContent);

    // 6. Upload to Cloudinary
    const filename = `certificate_${result.student.id}_${result.event.id}`;
    let cloudinaryUrl = '';
    try {
      cloudinaryUrl = await uploadToCloudinary(pdfBuffer, filename);
    } catch (err) {
      console.error('Cloudinary Upload Error', err);
      throw new AppError('Failed to upload certificate to cloud storage', 500);
    }

    // 7. Store URL in DB (updates the Result table)
    await this.repository.updateResultWithCertificate(result.id, cloudinaryUrl);

    return { certificateUrl: cloudinaryUrl };
  }

  async getMyCertificates(studentId: string) {
    const results = await this.repository.findMyCertificates(studentId);
    return results.map(r => ({
      id: r.id, // Result ID acts as Certificate ID
      position: r.position,
      certificateUrl: r.certificateUrl,
      event: r.event,
      createdAt: r.createdAt,
    }));
  }

  async getCertificateById(resultId: string, studentId: string) {
    const result = await this.repository.findResultById(resultId);
    if (!result || !result.certificateUrl) {
      throw new AppError('Certificate not found', 404);
    }

    // Validate ownership
    if (result.studentId !== studentId) {
      throw new AppError('You do not have permission to access this certificate', 403);
    }

    return {
      id: result.id,
      position: result.position,
      certificateUrl: result.certificateUrl,
      event: result.event,
    };
  }

  async getDownloadUrl(resultId: string, studentId: string) {
    const cert = await this.getCertificateById(resultId, studentId);
    return cert.certificateUrl;
  }
}
