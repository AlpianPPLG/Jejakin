// Email notification helper
// In production, integrate with email service like SendGrid, Mailgun, etc.

interface BookingEmailData {
  userName: string;
  userEmail: string;
  bookingCode: string;
  destinationName: string;
  destinationLocation: string;
  visitDate: string;
  numberOfPeople: number;
  totalPrice: number;
  notes?: string;
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  // In production, send actual email
  // For now, just log to console
  console.log('📧 Sending booking confirmation email...');
  console.log('To:', data.userEmail);
  console.log('Subject: Booking Confirmation - ' + data.bookingCode);
  console.log('---');
  console.log('Booking Details:');
  console.log('- Name:', data.userName);
  console.log('- Email:', data.userEmail);
  console.log('- Booking Code:', data.bookingCode);
  console.log('- Destination:', data.destinationName);
  console.log('- Location:', data.destinationLocation);
  console.log('- Visit Date:', data.visitDate);
  console.log('- Number of People:', data.numberOfPeople);
  console.log('- Total Price:', `Rp ${data.totalPrice.toLocaleString('id-ID')}`);
  if (data.notes) {
    console.log('- Notes:', data.notes);
  }
  console.log('---');

  // TODO: Integrate with email service
  // Example with SendGrid:
  // await sendgrid.send({
  //   to: data.userEmail,
  //   from: 'noreply@jejakin.com',
  //   subject: `Booking Confirmation - ${data.bookingCode}`,
  //   html: generateBookingEmailHTML(data),
  // });

  return true;
}

export async function sendNewBookingNotificationToAdmin(data: BookingEmailData, adminEmail: string) {
  console.log('📧 Sending new booking notification to admin...');
  console.log('To:', adminEmail);
  console.log('Subject: New Booking - ' + data.bookingCode);
  console.log('---');
  console.log('New Booking Alert:');
  console.log('- Customer:', data.userName);
  console.log('- Email:', data.userEmail);
  console.log('- Booking Code:', data.bookingCode);
  console.log('- Destination:', data.destinationName);
  console.log('- Visit Date:', data.visitDate);
  console.log('- Number of People:', data.numberOfPeople);
  console.log('- Total Price:', `Rp ${data.totalPrice.toLocaleString('id-ID')}`);
  console.log('---');

  return true;
}

function generateBookingEmailHTML(data: BookingEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #333; }
        .total { font-size: 24px; color: #667eea; font-weight: bold; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Terima kasih telah melakukan booking di Jejakin</p>
        </div>
        <div class="content">
          <p>Halo <strong>${data.userName}</strong>,</p>
          <p>Booking Anda telah berhasil dibuat. Berikut adalah detail booking Anda:</p>
          
          <div class="booking-info">
            <div class="info-row">
              <span class="info-label">Kode Booking</span>
              <span class="info-value">${data.bookingCode}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Destinasi</span>
              <span class="info-value">${data.destinationName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Lokasi</span>
              <span class="info-value">${data.destinationLocation}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tanggal Kunjungan</span>
              <span class="info-value">${data.visitDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Jumlah Orang</span>
              <span class="info-value">${data.numberOfPeople} orang</span>
            </div>
            ${data.notes ? `
            <div class="info-row">
              <span class="info-label">Catatan</span>
              <span class="info-value">${data.notes}</span>
            </div>
            ` : ''}
            <div class="info-row" style="border-bottom: none; margin-top: 20px;">
              <span class="info-label">Total Harga</span>
              <span class="total">Rp ${data.totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <p><strong>Langkah Selanjutnya:</strong></p>
          <ol>
            <li>Lakukan pembayaran sesuai total harga di atas</li>
            <li>Upload bukti pembayaran di dashboard</li>
            <li>Tunggu konfirmasi dari admin</li>
            <li>Siap untuk berwisata! 🎉</li>
          </ol>

          <center>
            <a href="https://jejakin.com/dashboard/bookings/${data.bookingCode}" class="button">
              Lihat Detail Booking
            </a>
          </center>

          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Jika Anda memiliki pertanyaan, silakan hubungi kami di support@jejakin.com
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2026 Jejakin. All rights reserved.</p>
          <p>Platform Pariwisata Indonesia</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateAdminBookingEmailHTML(data: BookingEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .booking-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #333; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Booking Alert</h1>
          <p>Ada booking baru yang perlu diproses</p>
        </div>
        <div class="content">
          <div class="alert">
            <strong>⚠️ Action Required:</strong> Booking baru menunggu konfirmasi Anda
          </div>
          
          <h3>Customer Information:</h3>
          <div class="booking-info">
            <div class="info-row">
              <span class="info-label">Nama</span>
              <span class="info-value">${data.userName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">${data.userEmail}</span>
            </div>
          </div>

          <h3>Booking Details:</h3>
          <div class="booking-info">
            <div class="info-row">
              <span class="info-label">Kode Booking</span>
              <span class="info-value">${data.bookingCode}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Destinasi</span>
              <span class="info-value">${data.destinationName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tanggal Kunjungan</span>
              <span class="info-value">${data.visitDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Jumlah Orang</span>
              <span class="info-value">${data.numberOfPeople} orang</span>
            </div>
            <div class="info-row" style="border-bottom: none;">
              <span class="info-label">Total Harga</span>
              <span class="info-value" style="font-size: 20px; color: #1e40af; font-weight: bold;">
                Rp ${data.totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <center>
            <a href="https://jejakin.com/dashboard/admin/bookings" class="button">
              Kelola Booking
            </a>
          </center>
        </div>
      </div>
    </body>
    </html>
  `;
}
