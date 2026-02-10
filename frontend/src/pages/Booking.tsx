import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import type { RoomId } from '../types/room';

interface Slot {
  startTime: string;
  endTime: string;
  status: string;
  priceCents: number;
}

interface AvailabilityResponse {
  date: string;
  roomId: number;
  slots: Slot[];
}

interface BookingResponse {
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
}

interface HoldRequest {
  roomId: number;
  date: string;
  startTime: string;
  endTime?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface StartPaymentRequest {
  bookingId: number;
  provider: string;
}

interface StartPaymentResponse {
  bookingId: number;
  status: string;
  paymentReference: string;
  paymentUrl: string;
  expiresAt: string;
}

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');

  // Read roomId from query params, validate it's 1-5, default to room 1 if not provided or invalid
  const roomIdParam = searchParams.get('roomId');
  const parsedRoomId = roomIdParam ? parseInt(roomIdParam, 10) : 1;
  const isValidRoomId = parsedRoomId >= 1 && parsedRoomId <= 5;
  const initialRoomId: RoomId = isValidRoomId ? parsedRoomId as RoomId : 1;
  const [selectedRoomId, setSelectedRoomId] = useState<RoomId>(initialRoomId);

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  // Customer info state
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

  const steps = [
    { id: 1, title: 'Kuupäev', description: 'Vali sünnipäeva kuupäev' },
    { id: 2, title: 'Aeg', description: 'Vali sobiv aeg' },
    { id: 3, title: 'Andmed', description: 'Kliendi andmed' },
  ];

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Get max date (6 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
    }
  }, [selectedDate]);

  const fetchAvailability = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/availability?date=${selectedDate}&roomId=${selectedRoomId}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Vabade aegade laadimine ebaõnnestus');
      }

      const data: AvailabilityResponse = await response.json();
      setAvailableSlots(data.slots || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Viga andmete laadimisel');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null); // Reset selected slot when date changes
    setCurrentStep(1); // Go back to step 1
  };

  const handleSlotSelect = (slot: Slot) => {
    if (slot.status === 'AVAILABLE') {
      setSelectedSlot(slot);
      setCurrentStep(3); // Jump to customer info step
    }
  };

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    setCustomerErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateCustomerInfo = () => {
    const errors = {
      name: '',
      email: '',
      phone: ''
    };

    let isValid = true;

    if (!customerInfo.name.trim()) {
      errors.name = 'Nimi on kohustuslik';
      isValid = false;
    }

    if (!customerInfo.email.trim()) {
      errors.email = 'E-post on kohustuslik';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = 'E-posti aadress on vigane';
      isValid = false;
    }

    if (!customerInfo.phone.trim()) {
      errors.phone = 'Telefoninumber on kohustuslik';
      isValid = false;
    }

    setCustomerErrors(errors);
    return isValid;
  };

  const canProceedToStep2 = () => {
    return selectedDate && availableSlots.length > 0;
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
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

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedSlot) {
      setError('Palun valige kuupäev ja aeg');
      return;
    }

    if (!validateCustomerInfo()) {
      setError('Palun täida kõik nõutud väljad korrektselt');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Step 1: Create booking hold with customer fields
      const holdRequest: HoldRequest = {
        roomId: selectedRoomId,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        ...(selectedSlot.endTime && { endTime: selectedSlot.endTime }),
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
      };

      const holdResponse = await fetch('http://localhost:8080/api/bookings/hold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(holdRequest),
      });

      if (!holdResponse.ok) {
        const errorText = await holdResponse.text();
        throw new Error(errorText || 'Broneeringu hoidmine ebaõnnestus');
      }

      const holdData: BookingResponse = await holdResponse.json();

      // Store bookingId for potential display
      setBookingId(holdData.id);

      // Step 2: Start payment
      const paymentRequest: StartPaymentRequest = {
        bookingId: holdData.id,
        provider: 'local',
      };

      const paymentResponse = await fetch('http://localhost:8080/api/payments/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        throw new Error(errorText || 'Makse alustamine ebaõnnestus');
      }

      const paymentData: StartPaymentResponse = await paymentResponse.json();

      // Step 3: Redirect to payment URL
      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
      } else {
        throw new Error('Makse link puudub');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Broneeringu tegemisel tekkis viga');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-glow-primary mb-4">
            Broneeri sünnipäev
          </h1>
          <p className="text-text-secondary text-lg">
            Lihtne 3-sammuline broneerimisprotsess
          </p>
        </motion.div>

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
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
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${isCompleted
                      ? 'bg-gradient-to-r from-primary to-secondary text-bg-primary shadow-glow-primary'
                      : isActive
                        ? 'bg-gradient-to-r from-primary to-secondary text-bg-primary shadow-glow-primary animate-pulse'
                        : 'bg-gray-700 text-gray-400'
                      }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? '✓' : step.id}
                  </motion.div>
                  <div className="mt-3 text-center">
                    <p className={`font-medium text-sm ${isActive ? 'text-primary' : isCompleted ? 'text-text-secondary' : 'text-gray-500'
                      }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-8"
        >
          {/* Step 1: Date Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Vali kuupäev
                </h2>
                <p className="text-text-muted mb-6">
                  Vali kalendrist sobiv kuupäev sünnipäeva pidamiseks
                </p>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-text-secondary font-medium">Ruum</span>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => {
                      const newRoomId = Number(e.target.value);
                      if (newRoomId >= 1 && newRoomId <= 5) {
                        setSelectedRoomId(newRoomId as RoomId);
                        setSelectedSlot(null);
                        if (selectedDate) {
                          fetchAvailability();
                        }
                      }
                    }}
                    className="mt-2 w-full px-4 py-3 bg-glass-bg border border-glass-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value={1}>VR Ruum</option>
                    <option value={2}>Köögiruum</option>
                    <option value={3}>Kunstituba</option>
                    <option value={4}>Trampoliin 1</option>
                    <option value={5}>Trampoliin 2</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-text-secondary font-medium">Sünnipäeva kuupäev</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={today}
                    max={maxDateStr}
                    className="mt-2 w-full px-4 py-3 bg-glass-bg border border-glass-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </label>

                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-4"
                  >
                    <p className="text-text-secondary">
                      Valitud kuupäev: <span className="text-primary font-medium">{formatDate(selectedDate)}</span>
                    </p>
                  </motion.div>
                )}

                {loading && (
                  <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-muted mt-4">Laadin vabu aegu...</p>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-4 border border-error"
                  >
                    <p className="text-error">{error}</p>
                  </motion.div>
                )}

                {canProceedToStep2() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setCurrentStep(2)}
                    >
                      Jätka aja valimisele
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Slot Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Vali aeg
                </h2>
                <p className="text-text-muted mb-6">
                  Vali sobiv aeg kuupäevale {formatDate(selectedDate)}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableSlots.map((slot) => (
                  <motion.button
                    key={`${slot.startTime}-${slot.endTime}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleSlotSelect(slot)}
                    disabled={slot.status !== 'AVAILABLE'}
                    className={`p-4 rounded-lg border transition-all duration-200 ${slot.status !== 'AVAILABLE'
                      ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                      : selectedSlot?.startTime === slot.startTime && selectedSlot?.endTime === slot.endTime
                        ? 'bg-gradient-to-r from-primary to-accent-blue border-primary text-bg-primary shadow-glow-primary'
                        : 'glass-card hover:border-primary hover:shadow-glow-primary cursor-pointer'
                      }`}
                    whileHover={slot.status === 'AVAILABLE' ? { scale: 1.02 } : {}}
                    whileTap={slot.status === 'AVAILABLE' ? { scale: 0.98 } : {}}
                  >
                    <div className="text-center">
                      <p className="font-semibold text-lg">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </p>
                      <p className="text-sm mt-1">
                        {slot.status === 'AVAILABLE' ? 'Vaba' : 'Hõivatud'}
                      </p>
                      {slot.priceCents && (
                        <p className="text-xs mt-1 text-primary">
                          {(slot.priceCents / 100).toFixed(2)} €
                        </p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {availableSlots.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-text-muted">
                    Sel kuupäeval pole vabu aegu saadaval.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedDate('');
                      setCurrentStep(1);
                    }}
                  >
                    Vali teine kuupäev
                  </Button>
                </div>
              )}

              {selectedDate && (
                <div className="text-center mt-6">
                  <Button
                    variant="glass"
                    onClick={() => setCurrentStep(1)}
                  >
                    Tagasi kuupäeva valimisele
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Customer Info */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Kliendi andmed
                </h2>
                <p className="text-text-muted mb-6">
                  Sisesta kontaktandmed broneeringu kinnitamiseks
                </p>
              </div>

              {selectedSlot && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 mb-6"
                >
                  <p className="text-text-secondary">
                    Valitud aeg: <span className="text-primary font-medium">
                      {formatDate(selectedDate)} {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                    </span>
                  </p>
                  {selectedSlot.priceCents && (
                    <p className="text-text-secondary mt-2">
                      Hind: <span className="text-accent-secondary font-medium">
                        {(selectedSlot.priceCents / 100).toFixed(2)} €
                      </span>
                    </p>
                  )}
                  {bookingId && (
                    <p className="text-text-secondary mt-2">
                      Broneeringu ID: <span className="text-primary font-medium">
                        #{bookingId}
                      </span>
                    </p>
                  )}
                </motion.div>
              )}

              <div className="grid md:grid-cols-1 gap-6">
                <div>
                  <label className="block">
                    <span className="text-text-secondary font-medium">Sinu nimi *</span>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleCustomerInfoChange}
                      disabled={isSubmitting}
                      className={`mt-2 w-full px-4 py-3 bg-glass-bg border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${customerErrors.name ? 'border-error' : 'border-glass-border'
                        }`}
                      placeholder="Mari Maasikas"
                    />
                    {customerErrors.name && (
                      <p className="text-error text-sm mt-1">{customerErrors.name}</p>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block">
                    <span className="text-text-secondary font-medium">E-post *</span>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleCustomerInfoChange}
                      disabled={isSubmitting}
                      className={`mt-2 w-full px-4 py-3 bg-glass-bg border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${customerErrors.email ? 'border-error' : 'border-glass-border'
                        }`}
                      placeholder="mari@example.com"
                    />
                    {customerErrors.email && (
                      <p className="text-error text-sm mt-1">{customerErrors.email}</p>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block">
                    <span className="text-text-secondary font-medium">Telefon *</span>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                      disabled={isSubmitting}
                      className={`mt-2 w-full px-4 py-3 bg-glass-bg border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${customerErrors.phone ? 'border-error' : 'border-glass-border'
                        }`}
                      placeholder="+372 5555 1234"
                    />
                    {customerErrors.phone && (
                      <p className="text-error text-sm mt-1">{customerErrors.phone}</p>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button
                  variant="glass"
                  onClick={() => setCurrentStep(2)}
                  disabled={isSubmitting}
                >
                  Tagasi
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  disabled={!selectedSlot || isSubmitting}
                  onClick={handleBookingSubmit}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Broneerin...</span>
                    </div>
                  ) : (
                    'Kinnita ja maksa'
                  )}
                </Button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 border border-error mt-4"
                >
                  <p className="text-error">{error}</p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Button
            variant="glass"
            onClick={() => navigate('/')}
          >
            Tagasi avalehele
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
