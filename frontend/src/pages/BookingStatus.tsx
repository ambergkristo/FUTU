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

interface StatusMeta {
  label: string;
  title: string;
  description: string;
  badgeClasses: string;
  lineClasses: string;
}

const BookingStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingIdFromQuery = searchParams.get('bookingId');
  const bookingIdFromSession = sessionStorage.getItem('bookingId');
  const bookingId = bookingIdFromQuery || bookingIdFromSession;

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingIdFromQuery) {
      sessionStorage.setItem('bookingId', bookingIdFromQuery);
    }

    if (!bookingId) {
      setError('Broneeringu ID puudub. Ava see leht uuesti maksevoost või alusta uut broneeringut avalehelt.');
      setLoading(false);
      return;
    }

    fetchBookingDetails(bookingId, true);
  }, [bookingId, bookingIdFromQuery]);

  useEffect(() => {
    if (!bookingId || booking?.status?.toUpperCase() !== 'PENDING_PAYMENT') {
      return;
    }

    const pollingIntervalMs = 2000;
    const maxPollingDurationMs = 30000;
    const startedAt = Date.now();

    const pollingTimer = window.setInterval(() => {
      if (Date.now() - startedAt >= maxPollingDurationMs) {
        window.clearInterval(pollingTimer);
        return;
      }

      fetchBookingDetails(bookingId, false);
    }, pollingIntervalMs);

    return () => window.clearInterval(pollingTimer);
  }, [bookingId, booking?.status]);

  const fetchBookingDetails = async (currentBookingId: string, showLoader: boolean) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setIsPolling(true);
    }

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${currentBookingId}`);

      if (response.ok) {
        const bookingData: BookingDetails = await response.json();
        setBooking(bookingData);
        setError('');
      } else if (response.status === 404) {
        setError('Broneeringut ei leitud');
      } else {
        setError('Broneeringu andmete laadimine ebaõnnestus');
      }
    } catch (err) {
      setError('Viga andmete laadimisel');
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setIsPolling(false);
      }
    }
  };

  const navigateToBooking = () => {
    window.location.href = '/#booking';
  };

  const getStatusMeta = (status: string): StatusMeta => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return {
          label: 'Kinnitatud',
          title: 'Broneering on kinnitatud',
          description: 'Kõik on korras. Ootame teid valitud ajal.',
          badgeClasses: 'text-green-300 bg-green-500/15 border border-green-500/40',
          lineClasses: 'from-green-400/80 to-green-600/80'
        };
      case 'CANCELLED':
        return {
          label: 'Tühistatud',
          title: 'Broneering on tühistatud',
          description: 'Seda aega ei ole enam võimalik kasutada.',
          badgeClasses: 'text-red-300 bg-red-500/15 border border-red-500/40',
          lineClasses: 'from-red-400/80 to-red-600/80'
        };
      case 'PENDING_PAYMENT':
        return {
          label: 'Makset ootel',
          title: 'Makse kinnitust oodatakse',
          description: 'Kontrollime makse laekumist automaatselt iga 5 sekundi järel.',
          badgeClasses: 'text-text-secondary bg-white/5 border border-white/20',
          lineClasses: 'from-slate-300/70 to-slate-500/70'
        };
      case 'EXPIRED':
        return {
          label: 'Aegunud',
          title: 'Broneeringu makseaeg on lõppenud',
          description: 'Palun alustage uus broneering sobiva aja leidmiseks.',
          badgeClasses: 'text-amber-300 bg-amber-500/15 border border-amber-500/40',
          lineClasses: 'from-amber-300/80 to-amber-500/80'
        };
      case 'DRAFT':
        return {
          label: 'Mustand',
          title: 'Broneering on pooleli',
          description: 'Jätkamiseks kinnitage makse.',
          badgeClasses: 'text-amber-300 bg-amber-500/15 border border-amber-500/40',
          lineClasses: 'from-amber-300/80 to-amber-500/80'
        };
      default:
        return {
          label: status || 'Teadmata',
          title: 'Broneeringu staatus',
          description: 'Kuvame hetkel teadaoleva staatuse.',
          badgeClasses: 'text-text-secondary bg-white/5 border border-white/20',
          lineClasses: 'from-primary/70 to-secondary/70'
        };
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
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Laen broneeringu andmeid...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 sm:p-8 text-center"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Broneeringu staatust ei saa kuvada
            </h1>
            <p className="text-text-muted mb-8">
              {error || 'Broneeringut ei leitud'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/')}>
                Tagasi avalehele
              </Button>
              <Button variant="glass" onClick={navigateToBooking}>
                Proovi uuesti broneerida
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const statusMeta = getStatusMeta(booking.status);
  const isPendingPayment = booking.status?.toUpperCase() === 'PENDING_PAYMENT';

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
          className="glass-card p-6 sm:p-8"
        >
          <div className="text-center mb-8 space-y-4">
            <div className="flex justify-center">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusMeta.badgeClasses}`}>
                {isPendingPayment && <span className="w-3 h-3 rounded-full border-2 border-text-secondary border-t-transparent animate-spin" aria-hidden="true" />}
                {statusMeta.label}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">{statusMeta.title}</h2>
            <p className="text-text-secondary max-w-xl mx-auto">{statusMeta.description}</p>
            {isPendingPayment && (
              <p className="text-sm text-text-muted" aria-live="polite">
                {isPolling ? 'Värskendan staatust...' : 'Staatus värskendatakse automaatselt.'}
              </p>
            )}
            <div className={`w-16 h-1 bg-gradient-to-r ${statusMeta.lineClasses} mx-auto rounded-full`} />
          </div>

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

            {booking.expiresAt && (
              <div>
                <h3 className="text-text-secondary font-medium mb-2">Kehtib kuni</h3>
                <p className="text-text-primary">
                  {formatDateTime(booking.expiresAt)}
                </p>
              </div>
            )}

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

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t border-glass-border">
            <Button onClick={() => navigate('/')}>
              Tagasi avalehele
            </Button>
            <Button variant="glass" onClick={navigateToBooking}>
              Proovi uuesti broneerida
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

