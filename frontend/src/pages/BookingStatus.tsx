import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useLang } from '../i18n/I18nContext';
import { getUi } from '../copy/ui';
import { ApiError, requestJson } from '../api/client';

type BookingDetails = {
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
};

type StatusMeta = {
  label: string;
  title: string;
  description: string;
  badgeClasses: string;
  lineClasses: string;
};

const API_BASE_URL = 'http://localhost:8080/api';

const BookingStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const ui = getUi(lang);
  const statusUi = ui.bookingStatus;

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
      setError(statusUi.errors.missingBookingId);
      setLoading(false);
      return;
    }

    void fetchBookingDetails(bookingId, true);
  }, [bookingId, bookingIdFromQuery, statusUi.errors.missingBookingId]);

  useEffect(() => {
    if (!bookingId || booking?.status?.toUpperCase() !== 'PENDING_PAYMENT') {
      return;
    }

    const pollingIntervalMs = 5000;
    const maxPollingDurationMs = 30000;
    const startedAt = Date.now();

    const pollingTimer = window.setInterval(() => {
      if (Date.now() - startedAt >= maxPollingDurationMs) {
        window.clearInterval(pollingTimer);
        return;
      }

      void fetchBookingDetails(bookingId, false);
    }, pollingIntervalMs);

    return () => window.clearInterval(pollingTimer);
  }, [booking?.status, bookingId]);

  const mapStatusError = (requestError: unknown): string => {
    if (!(requestError instanceof ApiError)) {
      return statusUi.errors.network;
    }

    if (requestError.code === 'BOOKING_NOT_FOUND' || requestError.status === 404) {
      return statusUi.errors.notFound;
    }

    if (requestError.code === 'VALIDATION_FAILED' || requestError.status === 400) {
      return statusUi.errors.loadFailed;
    }

    if (requestError.status >= 500) {
      return statusUi.errors.unknown;
    }

    return statusUi.errors.loadFailed;
  };

  const fetchBookingDetails = async (currentBookingId: string, showLoader: boolean) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setIsPolling(true);
    }

    try {
      const bookingData = await requestJson<BookingDetails>(`${API_BASE_URL}/bookings/${currentBookingId}`);
      setBooking(bookingData);
      setError('');
    } catch (requestError) {
      setError(mapStatusError(requestError));
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setIsPolling(false);
      }
    }
  };

  const navigateToBooking = () => {
    window.location.assign('/#booking');
  };

  const statusMetaByKey: Record<string, StatusMeta> = useMemo(
    () => ({
      CONFIRMED: {
        label: statusUi.statuses.confirmed.label,
        title: statusUi.statuses.confirmed.title,
        description: statusUi.statuses.confirmed.description,
        badgeClasses: 'text-green-300 bg-green-500/15 border border-green-500/40',
        lineClasses: 'from-green-400/80 to-green-600/80'
      },
      CANCELLED: {
        label: statusUi.statuses.cancelled.label,
        title: statusUi.statuses.cancelled.title,
        description: statusUi.statuses.cancelled.description,
        badgeClasses: 'text-red-300 bg-red-500/15 border border-red-500/40',
        lineClasses: 'from-red-400/80 to-red-600/80'
      },
      PENDING_PAYMENT: {
        label: statusUi.statuses.pendingPayment.label,
        title: statusUi.statuses.pendingPayment.title,
        description: statusUi.statuses.pendingPayment.description,
        badgeClasses: 'text-text-secondary bg-white/5 border border-white/20',
        lineClasses: 'from-slate-300/70 to-slate-500/70'
      },
      EXPIRED: {
        label: statusUi.statuses.expired.label,
        title: statusUi.statuses.expired.title,
        description: statusUi.statuses.expired.description,
        badgeClasses: 'text-amber-300 bg-amber-500/15 border border-amber-500/40',
        lineClasses: 'from-amber-300/80 to-amber-500/80'
      },
      DRAFT: {
        label: statusUi.statuses.draft.label,
        title: statusUi.statuses.draft.title,
        description: statusUi.statuses.draft.description,
        badgeClasses: 'text-amber-300 bg-amber-500/15 border border-amber-500/40',
        lineClasses: 'from-amber-300/80 to-amber-500/80'
      },
      UNKNOWN: {
        label: statusUi.statuses.unknown.label,
        title: statusUi.statuses.unknown.title,
        description: statusUi.statuses.unknown.description,
        badgeClasses: 'text-text-secondary bg-white/5 border border-white/20',
        lineClasses: 'from-primary/70 to-secondary/70'
      }
    }),
    [statusUi.statuses]
  );

  const getStatusMeta = (status: string): StatusMeta => {
    const normalized = (status || 'UNKNOWN').toUpperCase();
    return statusMetaByKey[normalized] || statusMetaByKey.UNKNOWN;
  };

  const formatDate = (dateStr: string) => {
    const locale = lang === 'en' ? 'en-US' : 'et-EE';
    return new Date(dateStr).toLocaleDateString(locale, {
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
    const locale = lang === 'en' ? 'en-US' : 'et-EE';
    return new Date(dateTimeStr).toLocaleString(locale);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">{statusUi.loading}</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">{statusUi.errorTitle}</h1>
            <p className="text-text-muted mb-8">{error || statusUi.errors.notFound}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/')}>{statusUi.backHome}</Button>
              <Button variant="glass" onClick={navigateToBooking}>{statusUi.retryBooking}</Button>
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
          <h1 className="text-4xl md:text-5xl font-bold text-glow-primary mb-4">{statusUi.title}</h1>
          <p className="text-text-secondary text-lg">{statusUi.bookingNumberPrefix}{booking.id}</p>
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
                {isPolling ? statusUi.pollingRefreshing : statusUi.pollingAuto}
              </p>
            )}
            <div className={`w-16 h-1 bg-gradient-to-r ${statusMeta.lineClasses} mx-auto rounded-full`} />
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-text-secondary font-medium mb-2">{statusUi.labels.dateTime}</h3>
                <p className="text-text-primary text-lg">{formatDate(booking.date)}</p>
                <p className="text-text-primary">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
              </div>

              <div>
                <h3 className="text-text-secondary font-medium mb-2">{statusUi.labels.price}</h3>
                <p className="text-text-primary text-2xl font-bold text-accent-secondary">{(booking.priceCents / 100).toFixed(2)} EUR</p>
              </div>
            </div>

            {booking.expiresAt && (
              <div>
                <h3 className="text-text-secondary font-medium mb-2">{statusUi.labels.validUntil}</h3>
                <p className="text-text-primary">{formatDateTime(booking.expiresAt)}</p>
              </div>
            )}

            {(booking.customerName || booking.customerEmail || booking.customerPhone) && (
              <div className="border-t border-glass-border pt-6">
                <h3 className="text-text-secondary font-medium mb-4">{statusUi.labels.customerInfo}</h3>
                <div className="space-y-2">
                  {booking.customerName && (
                    <p className="text-text-primary">
                      <span className="text-text-secondary">{statusUi.labels.name}:</span> {booking.customerName}
                    </p>
                  )}
                  {booking.customerEmail && (
                    <p className="text-text-primary">
                      <span className="text-text-secondary">{statusUi.labels.email}:</span> {booking.customerEmail}
                    </p>
                  )}
                  {booking.customerPhone && (
                    <p className="text-text-primary">
                      <span className="text-text-secondary">{statusUi.labels.phone}:</span> {booking.customerPhone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t border-glass-border">
            <Button onClick={() => navigate('/')}>{statusUi.backHome}</Button>
            <Button variant="glass" onClick={navigateToBooking}>{statusUi.retryBooking}</Button>
            {booking.status?.toUpperCase() === 'DRAFT' && (
              <Button variant="primary" onClick={() => navigate(`/booking?bookingId=${booking.id}`)}>
                {statusUi.continueBooking}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingStatus;
