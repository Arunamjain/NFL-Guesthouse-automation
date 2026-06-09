import { QrCode } from "lucide-react";
import type { Booking } from "@/types";
import { formatDate } from "@/utils/formatters";

export function QRPassCard({ b }: { b: Booking }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-md max-w-xl mx-auto">
      <div className="bg-primary text-primary-foreground p-5 flex items-center justify-between">
        <div>
          <div className="text-xs opacity-80">NFL Guest House Pass</div>
          <div className="text-lg font-semibold">{b.guestHouseName}</div>
        </div>
        <div className="text-right text-xs">
          <div className="opacity-80">Booking ID</div>
          <div className="font-mono font-semibold">{b.id}</div>
        </div>
      </div>
      <div className="p-6 flex flex-col sm:flex-row gap-6 items-center">
        <div className="size-40 rounded-lg bg-white border-4 border-primary/20 p-2 flex items-center justify-center shadow-inner overflow-hidden">
          <img src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/qr/${b.id}/image`} alt="Booking QR Pass" className="w-full h-full object-contain" />
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm flex-1">
          <dt className="text-muted-foreground">Employee</dt><dd className="font-medium">{b.employeeName}</dd>
          <dt className="text-muted-foreground">Emp ID</dt><dd className="font-medium">{b.employeeId}</dd>
          <dt className="text-muted-foreground">Room</dt><dd className="font-medium">{b.roomNumber ?? "—"}</dd>
          <dt className="text-muted-foreground">Type</dt><dd className="font-medium">{b.roomType ?? "—"}</dd>
          <dt className="text-muted-foreground">Check-in</dt><dd className="font-medium">{formatDate(b.checkIn)}</dd>
          <dt className="text-muted-foreground">Check-out</dt><dd className="font-medium">{formatDate(b.checkOut)}</dd>
          <dt className="text-muted-foreground">Payment</dt><dd className="text-success font-medium">Verified</dd>
          <dt className="text-muted-foreground">Email</dt><dd className="text-success font-medium">Sent</dd>
        </dl>
      </div>
      <div className="bg-muted/40 p-3 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
        <QrCode className="size-3.5" /> Show this pass at the guest house reception
      </div>
    </div>
  );
}
