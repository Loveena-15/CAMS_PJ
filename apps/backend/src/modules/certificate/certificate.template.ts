export const getCertificateTemplate = (data: {
  studentName: string;
  eventName: string;
  eventDate: string;
  position: string;
  qrCodeUrl: string;
  certificateId: string;
}) => {
  const positionText = data.position === 'PARTICIPANT' 
    ? 'for actively participating in'
    : `for securing the ${data.position} position in`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f5; }
        .certificate {
          width: 297mm; height: 210mm; padding: 20mm; box-sizing: border-box;
          background: #fff; border: 15px solid #004282; position: relative; text-align: center;
        }
        .header { margin-top: 10px; }
        .college-name { font-size: 36px; color: #004282; font-weight: bold; text-transform: uppercase; }
        .title { font-size: 50px; color: #d4af37; margin: 30px 0; font-family: 'Times New Roman', serif; font-style: italic; }
        .content { font-size: 24px; line-height: 1.6; color: #333; margin-top: 20px; }
        .name { font-size: 40px; font-weight: bold; color: #004282; text-decoration: underline; display: inline-block; padding-bottom: 5px; }
        .event { font-weight: bold; color: #000; }
        .footer { position: absolute; bottom: 40px; left: 40px; right: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
        .signature { text-align: center; }
        .signature-line { width: 250px; border-bottom: 2px solid #000; margin-bottom: 10px; }
        .qr-code { text-align: right; }
        .qr-code img { width: 100px; height: 100px; }
        .cert-id { font-size: 12px; color: #777; margin-top: 5px; }
        .date-badge { margin-top: 30px; font-size: 20px; font-weight: bold; color: #555; }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <div class="college-name">Campus Activity Management System</div>
        </div>
        <div class="title">Certificate of Achievement</div>
        <div class="content">
          This is to proudly certify that<br><br>
          <span class="name">${data.studentName}</span><br><br>
          has demonstrated exceptional effort ${positionText}<br><br>
          <span class="event">"${data.eventName}"</span>
        </div>
        <div class="date-badge">
          Conducted on: ${data.eventDate}
        </div>
        <div class="footer">
          <div class="signature">
            <div class="signature-line"></div>
            <div>Authorized Signature</div>
          </div>
          <div class="qr-code">
            <img src="${data.qrCodeUrl}" alt="QR Code">
            <div class="cert-id">ID: ${data.certificateId}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
