export type ApiErrorEnvelope = {
  status?: number;
  code?: string;
  message?: string;
  path?: string;
  timestamp?: string;
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, code?: string, message?: string) {
    super(message || code || `HTTP_${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toApiErrorEnvelope = (payload: unknown): ApiErrorEnvelope | undefined => {
  if (!isObject(payload)) {
    return undefined;
  }
  return {
    status: typeof payload.status === 'number' ? payload.status : undefined,
    code: typeof payload.code === 'string' ? payload.code : undefined,
    message: typeof payload.message === 'string' ? payload.message : undefined,
    path: typeof payload.path === 'string' ? payload.path : undefined,
    timestamp: typeof payload.timestamp === 'string' ? payload.timestamp : undefined
  };
};

const parseJsonSafely = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return undefined;
};

export const requestJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);
  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    const envelope = toApiErrorEnvelope(payload);
    throw new ApiError(response.status, envelope?.code, envelope?.message);
  }

  return payload as T;
};

