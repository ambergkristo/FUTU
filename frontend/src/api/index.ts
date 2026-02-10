const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  bookings: {
    getAll: () => fetch(`${API_BASE_URL}/bookings`),
    create: (data: any) => fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    hold: (data: any) => fetch(`${API_BASE_URL}/bookings/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    confirm: (id: number) => fetch(`${API_BASE_URL}/bookings/${id}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }),
  },
  payments: {
    start: (data: any) => fetch(`${API_BASE_URL}/payments/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    webhook: (data: any) => fetch(`${API_BASE_URL}/payments/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  },
  availability: {
    check: (roomId: number, date: string) => 
      fetch(`${API_BASE_URL}/availability?roomId=${roomId}&date=${date}`),
  },
};
