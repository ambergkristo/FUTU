import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import type { RoomId } from '../types/room';
import { useLang } from '../i18n/I18nContext';
import { getUi } from '../copy/ui';
import { ApiError, requestJson } from '../api/client';

type Slot = {
  startTime: string;
  endTime: string;
  status: string;
  priceCents: number;
};

type AvailabilityResponse = {
  date: string;
  roomId: number;
  slots: Slot[];
};

type BookingResponse = {
  id: number;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  priceCents: number;
  expiresAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

type HoldRequest = {
  roomId: number;
  date: string;
  startTime: string;
  endTime?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

type StartPaymentRequest = {
  bookingId: number;
  provider: string;
};

type StartPaymentResponse = {
  bookingId: number;
  status: string;
  paymentReference: string;
  paymentUrl: string;
  expiresAt: string;
};

type CustomerField = 'name' | 'email' | 'phone';

type BookingErrors = ReturnType<typeof getUi>['booking']['errors'];

const API_BASE_URL = 'http://localhost:8080/api';

const mapApiErrorToBookingMessage = (error: unknown, errors: BookingErrors, fallback: string): string => {
  if (!(error instanceof ApiError)) {
    return errors.network;
  }

  switch (error.code) {
    case 'BOOKING_OVERLAP':
      return errors.conflict;
    case 'BOOKING_NOT_FOUND':
    case 'ROOM_NOT_FOUND':
      return errors.notFound;
    case 'VALIDATION_FAILED':
    case 'INVALID_DATE_FORMAT':
    case 'INVALID_REQUEST_BODY':
    case 'INVALID_PARAMETER':
    case 'MISSING_PARAMETER':
      return errors.validation;
    default:
      break;
  }

  if (error.status === 404) {
    return errors.notFound;
  }
  if (error.status === 409) {
    return errors.conflict;
  }
  if (error.status === 400) {
    return errors.validation;
  }
  if (error.status >= 500) {
    return errors.unknown;
  }
  return fallback;
};

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang } = useLang();
  const ui = getUi(lang);
  const bookingUi = ui.booking;

  const roomIdParam = searchParams.get('roomId');
  const parsedRoomId = roomIdParam ? parseInt(roomIdParam, 10) : 1;
  const isValidRoomId = parsedRoomId >= 1 && parsedRoomId <= 5;
  const initialRoomId: RoomId = isValidRoomId ? (parsedRoomId as RoomId) : 1;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<RoomId>(initialRoomId);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const availabilityRequestIdRef = useRef(0);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [customerErrors, setCustomerErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  const locale = lang === 'en' ? 'en-US' : 'et-EE';

  const steps = useMemo(
    () => bookingUi.steps.map((step, index) => ({ id: index + 1, title: step.title, description: step.description })),
    [bookingUi.steps]
  );

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      setLoading(false);
      return;
    }

    const requestId = ++availabilityRequestIdRef.current;

    const fetchAvailability = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await requestJson<AvailabilityResponse>(
          `${API_BASE_URL}/availability?date=${selectedDate}&roomId=${selectedRoomId}`
        );
        if (requestId === availabilityRequestIdRef.current) {
          setAvailableSlots(data.slots || []);
        }
      } catch (requestError) {
        if (requestId !== availabilityRequestIdRef.current) {
          return;
        }
        setAvailableSlots([]);
        setError(mapApiErrorToBookingMessage(requestError, bookingUi.errors, bookingUi.errors.availabilityLoadFailed));
      } finally {
        if (requestId === availabilityRequestIdRef.current) {
          setLoading(false);
        }
      }
    };

    void fetchAvailability();
  }, [bookingUi.errors, selectedDate, selectedRoomId]);

  const validateCustomerField = (field: CustomerField, value: string): string => {
    const trimmed = value.trim();

    if (field === 'name') {
      return trimmed.length > 1 ? '' : bookingUi.errors.nameRequired;
    }
    if (field === 'email') {
      if (!trimmed) {
        return bookingUi.errors.emailRequired;
      }
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? '' : bookingUi.errors.emailInvalid;
    }
    if (!trimmed) {
      return bookingUi.errors.phoneRequired;
    }
    return '';
  };

  const validateCustomerInfo = (): boolean => {
    const nextErrors = {
      name: validateCustomerField('name', customerInfo.name),
      email: validateCustomerField('email', customerInfo.email),
      phone: validateCustomerField('phone', customerInfo.phone)
    };
    setCustomerErrors(nextErrors);
    return !nextErrors.name && !nextErrors.email && !nextErrors.phone;
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setSelectedSlot(null);
    setCurrentStep(1);
    setError('');
  };

  const handleRoomChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const roomValue = Number(event.target.value);
    if (roomValue < 1 || roomValue > 5) {
      return;
    }
    setSelectedRoomId(roomValue as RoomId);
    setSelectedSlot(null);
    setCurrentStep(1);
    setError('');
  };

  const handleSlotSelect = (slot: Slot) => {
    if (slot.status !== 'AVAILABLE' || isSubmitting) {
      return;
    }
    setSelectedSlot(slot);
    setCurrentStep(3);
    setError('');
  };

  const handleCustomerInfoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const field = name as CustomerField;
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    setCustomerErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const canProceedToStep2 = selectedDate.length > 0 && availableSlots.some((slot) => slot.status === 'AVAILABLE');

  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const roomLabelById: Record<number, string> = bookingUi.rooms;

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedSlot) {
      setError(bookingUi.errors.selectDateAndTime);
      return;
    }

    if (!validateCustomerInfo()) {
      setError(bookingUi.errors.fillRequiredFields);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const holdRequest: HoldRequest = {
        roomId: selectedRoomId,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        ...(selectedSlot.endTime && { endTime: selectedSlot.endTime }),
        customerName: customerInfo.name.trim(),
        customerEmail: customerInfo.email.trim(),
        customerPhone: customerInfo.phone.trim()
      };

      const holdData = await requestJson<BookingResponse>(`${API_BASE_URL}/bookings/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(holdRequest)
      });
      setBookingId(holdData.id);
      sessionStorage.setItem('bookingId', String(holdData.id));

      const paymentRequest: StartPaymentRequest = {
        bookingId: holdData.id,
        provider: 'local'
      };

      const paymentData = await requestJson<StartPaymentResponse>(`${API_BASE_URL}/payments/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRequest)
      });

      if (!paymentData.paymentUrl) {
        setError(bookingUi.errors.paymentLinkMissing);
        return;
      }

      window.location.assign(paymentData.paymentUrl);
    } catch (requestError) {
      setError(mapApiErrorToBookingMessage(requestError, bookingUi.errors, bookingUi.errors.genericBookingFailed));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-glow-primary mb-4">{bookingUi.title}</h1>
          <p className="text-text-secondary text-lg">{bookingUi.subtitle}</p>
        </motion.div>

        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-700 -translate-y-1/2 -z-10" />
            <div
              className="absolute left-0 top-1/2 h-0.5 bg-gradient-to-r from-primary to-secondary -translate-y-1/2 -z-10 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-r from-primary to-secondary text-bg-primary shadow-glow-primary'
                        : isActive
                          ? 'bg-gradient-to-r from-primary to-secondary text-bg-primary shadow-glow-primary animate-pulse'
                          : 'bg-gray-700 text-gray-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? 'OK' : step.id}
                  </motion.div>
                  <div className="mt-3 text-center">
                    <p
                      className={`font-medium text-sm ${
                        isActive ? 'text-primary' : isCompleted ? 'text-text-secondary' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-8"
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">{bookingUi.chooseDateTitle}</h2>
                <p className="text-text-muted mb-6">{bookingUi.chooseDateSubtitle}</p>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-text-secondary font-medium">{bookingUi.roomLabel}</span>
                  <select
                    value={selectedRoomId}
                    onChange={handleRoomChange}
                    disabled={loading || isSubmitting}
                    className="mt-2 w-full px-4 py-3 bg-glass-bg border border-glass-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {Object.entries(roomLabelById).map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-text-secondary font-medium">{bookingUi.dateLabel}</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={today}
                    max={maxDateStr}
                    disabled={isSubmitting}
                    className="mt-2 w-full px-4 py-3 bg-glass-bg border border-glass-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </label>

                {selectedDate && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                    <p className="text-text-secondary">
                      {bookingUi.selectedDateLabel}:{' '}
                      <span className="text-primary font-medium">{formatDate(selectedDate)}</span>
                    </p>
                  </motion.div>
                )}

                {loading && (
                  <div className="text-center py-8" aria-live="polite">
                    <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-text-muted mt-4">{bookingUi.loadingAvailability}</p>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-4 border border-error"
                    role="alert"
                  >
                    <p className="text-error">{error}</p>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  <Button variant="primary" size="lg" disabled={!canProceedToStep2 || loading || isSubmitting} onClick={() => setCurrentStep(2)}>
                    {bookingUi.continueToTime}
                  </Button>
                </motion.div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">{bookingUi.chooseTimeTitle}</h2>
                <p className="text-text-muted mb-6">
                  {bookingUi.chooseTimeSubtitlePrefix} {formatDate(selectedDate)}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableSlots.map((slot) => {
                  const isAvailable = slot.status === 'AVAILABLE';
                  const isSelected = selectedSlot?.startTime === slot.startTime && selectedSlot?.endTime === slot.endTime;
                  return (
                    <motion.button
                      type="button"
                      key={`${slot.startTime}-${slot.endTime}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleSlotSelect(slot)}
                      disabled={!isAvailable || isSubmitting}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        !isAvailable
                          ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                          : isSelected
                            ? 'bg-gradient-to-r from-primary to-accent-blue border-primary text-bg-primary shadow-glow-primary'
                            : 'glass-card hover:border-primary hover:shadow-glow-primary cursor-pointer'
                      } disabled:opacity-60`}
                      whileHover={isAvailable && !isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={isAvailable && !isSubmitting ? { scale: 0.98 } : {}}
                    >
                      <div className="text-center">
                        <p className="font-semibold text-lg">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </p>
                        <p className="text-sm mt-1">{isAvailable ? bookingUi.statusAvailable : bookingUi.statusBooked}</p>
                        <p className="text-xs mt-1 text-primary">{(slot.priceCents / 100).toFixed(2)} EUR</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {!loading && availableSlots.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-text-muted mb-4">{bookingUi.noSlots}</p>
                  <Button
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={() => {
                      setSelectedDate('');
                      setCurrentStep(1);
                    }}
                  >
                    {bookingUi.chooseAnotherDate}
                  </Button>
                </div>
              )}

              <div className="text-center mt-6">
                <Button variant="glass" disabled={isSubmitting} onClick={() => setCurrentStep(1)}>
                  {bookingUi.backToDate}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">{bookingUi.customerTitle}</h2>
                <p className="text-text-muted mb-6">{bookingUi.customerSubtitle}</p>
              </div>

              {selectedSlot && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 mb-6">
                  <p className="text-text-secondary">
                    {bookingUi.selectedTimeLabel}:{' '}
                    <span className="text-primary font-medium">
                      {formatDate(selectedDate)} {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                    </span>
                  </p>
                  <p className="text-text-secondary mt-2">
                    {bookingUi.priceLabel}:{' '}
                    <span className="text-accent-secondary font-medium">{(selectedSlot.priceCents / 100).toFixed(2)} EUR</span>
                  </p>
                  {bookingId && (
                    <p className="text-text-secondary mt-2">
                      {bookingUi.bookingIdLabel}:{' '}
                      <span className="text-primary font-medium">#{bookingId}</span>
                    </p>
                  )}
                </motion.div>
              )}

              <div className="grid md:grid-cols-1 gap-6">
                <div>
                  <label className="block">
                    <span className="text-text-secondary font-medium">{bookingUi.nameLabel}</span>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleCustomerInfoChange}
                      disabled={isSubmitting}
                      className={`mt-2 w-full px-4 py-3 bg-glass-bg border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        customerErrors.name ? 'border-error' : 'border-glass-border'
                      }`}
                      placeholder={bookingUi.namePlaceholder}
                    />
                    {customerErrors.name && <p className="text-error text-sm mt-1">{customerErrors.name}</p>}
                  </label>
                </div>

                <div>
                  <label className="block">
                    <span className="text-text-secondary font-medium">{bookingUi.emailLabel}</span>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleCustomerInfoChange}
                      disabled={isSubmitting}
                      className={`mt-2 w-full px-4 py-3 bg-glass-bg border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        customerErrors.email ? 'border-error' : 'border-glass-border'
                      }`}
                      placeholder={bookingUi.emailPlaceholder}
                    />
                    {customerErrors.email && <p className="text-error text-sm mt-1">{customerErrors.email}</p>}
                  </label>
                </div>

                <div>
                  <label className="block">
                    <span className="text-text-secondary font-medium">{bookingUi.phoneLabel}</span>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                      disabled={isSubmitting}
                      className={`mt-2 w-full px-4 py-3 bg-glass-bg border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        customerErrors.phone ? 'border-error' : 'border-glass-border'
                      }`}
                      placeholder={bookingUi.phonePlaceholder}
                    />
                    {customerErrors.phone && <p className="text-error text-sm mt-1">{customerErrors.phone}</p>}
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button variant="glass" onClick={() => setCurrentStep(2)} disabled={isSubmitting}>
                  {bookingUi.back}
                </Button>
                <Button variant="primary" size="lg" disabled={!selectedSlot || isSubmitting} onClick={handleBookingSubmit}>
                  {isSubmitting ? bookingUi.bookingInProgress : bookingUi.confirmAndPay}
                </Button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 border border-error mt-4"
                  role="alert"
                >
                  <p className="text-error">{error}</p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        <div className="text-center mt-8">
          <Button variant="glass" disabled={isSubmitting} onClick={() => navigate('/')}>
            {bookingUi.backHome}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Booking;

