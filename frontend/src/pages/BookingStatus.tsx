import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

interface BookingDetails {
  id: number;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  priceCents: number;
  expiresAt?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

const BookingStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) {
      setError('Broneeringu ID puudub');
      setLoading(false);
      return;
    }

    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`);

      if (response.ok) {
        const bookingData = await response.json();
        setBooking(bookingData);
      } else if (response.status === 404) {
        setError('Broneeringut ei leitud');
      } else {
        setError('Broneeringu andmete laadimine ebaõnnestus');
      }
    } catch (err) {
      setError('Viga andmete laadimisel');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'text-green-400';
      case 'CANCELLED':
        return 'text-red-400';
      case 'DRAFT':
      case 'PENDING_PAYMENT':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'Kinnitatud';
      case 'CANCELLED':
        return 'Tühistatud';
      case 'DRAFT':
        return 'Mustand';
      case 'PENDING_PAYMENT':
        return 'Ootel makse';
      default:
        return status || 'Teadmata';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('et-EE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('et-EE');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Laen broneeringu andmeid...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center"
          >
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Viga
            </h1>
            <p className="text-text-muted mb-6">
              {error || 'Broneeringut ei leitud'}
            </p>
            <Button onClick={() => navigate('/')}>
              Tagasi avalehele
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-glow-primary mb-4">
            Broneeringu staatus
          </h1>
          <p className="text-text-secondary text-lg">
            Broneering #{booking.id}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          {/* Status */}
          <div className="text-center mb-8">
            <div className={`text-3xl font-bold mb-2 ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>

          {/* Booking Details */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-text-secondary font-medium mb-2">Kuupäev ja kellaaeg</h3>
                <p className="text-text-primary text-lg">
                  {formatDate(booking.date)}
                </p>
                <p className="text-text-primary">
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </p>
              </div>

              <div>
                <h3 className="text-text-secondary font-medium mb-2">Hind</h3>
                <p className="text-text-primary text-2xl font-bold text-accent-secondary">
                  {(booking.priceCents / 100).toFixed(2)} €
                </p>
              </div>
            </div>

            {/* Expiry */}
            {booking.expiresAt && (
              <div>
                <h3 className="text-text-secondary font-medium mb-2">Kehtib kuni</h3>
                <p className="text-text-primary">
                  {formatDateTime(booking.expiresAt)}
                </p>
              </div>
            )}

            {/* Customer Information */}
            {(booking.customerName || booking.customerEmail || booking.customerPhone) && (
              <div className="border-t border-glass-border pt-6">
                <h3 className="text-text-secondary font-medium mb-4">Kliendi andmed</h3>
                <div className="space-y-2">
                  {booking.customerName && (
                    <p className="text-text-primary">
                      <span className="text-text-secondary">Nimi:</span> {booking.customerName}
                    </p>
                  )}
                  {booking.customerEmail && (
                    <p className="text-text-primary">
                      <span className="text-text-secondary">E-post:</span> {booking.customerEmail}
                    </p>
                  )}
                  {booking.customerPhone && (
                    <p className="text-text-primary">
                      <span className="text-text-secondary">Telefon:</span> {booking.customerPhone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t border-glass-border">
            <Button
              variant="glass"
              onClick={() => navigate('/')}
            >
              Tee uus broneering
            </Button>
            {booking.status === 'DRAFT' && (
              <Button
                variant="primary"
                onClick={() => navigate(`/booking?bookingId=${booking.id}`)}
              >
                Jätka broneeringut
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingStatus;
