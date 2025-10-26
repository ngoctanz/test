import Image from "next/image";

interface BankQRCodeProps {
  bankName: string;
  qrImage?: string; // Optional QR image
}

/**
 * Component to display bank QR code uploaded by admin
 * If no QR image, show a message instead
 */
function BankQRCode({ bankName, qrImage }: BankQRCodeProps) {
  // If no QR image provided, show info message
  if (!qrImage) {
    return (
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-dashed border-blue-500/30 p-6 rounded-lg">
        <div className="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-3">💳</div>
          <p className="text-white font-semibold text-sm mb-2">{bankName}</p>
          <p className="text-gray-400 text-xs">
            Sử dụng thông tin tài khoản bên dưới để chuyển khoản
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="w-48 h-48 sm:w-56 sm:h-56 relative rounded-lg overflow-hidden">
        <Image
          src={qrImage}
          alt={`${bankName} QR Code`}
          fill
          className="object-contain"
          priority
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3EQR Code%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>
      <p className="text-gray-600 text-xs font-medium text-center mt-2">
        {bankName}
      </p>
    </div>
  );
}

export default BankQRCode;
