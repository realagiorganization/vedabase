import { ApiClientError, type ApiContract, type ApiErrorShape } from './contracts';

type AppImportMeta = ImportMeta & {
  env?: {
    VITE_API_BASE_URL?: string;
  };
};

export const API_BASE_URL = (import.meta as AppImportMeta).env?.VITE_API_BASE_URL;

export function createApiError(shape: ApiErrorShape): ApiClientError {
  return new ApiClientError(shape);
}

export function resolveContractPath<Request, Response>(
  contract: ApiContract<Request, Response>,
  request: Request,
): string {
  return typeof contract.path === 'function'
    ? contract.path(request)
    : contract.path;
}

export async function requestContractJson<Request, Response>(
  contract: ApiContract<Request, Response>,
  request: Request,
  init?: RequestInit,
): Promise<Response> {
  if (!API_BASE_URL) {
    throw createApiError({
      status: 500,
      code: `${contract.key}.missing_base_url`,
      message: 'VITE_API_BASE_URL is not configured',
    });
  }

  const path = resolveContractPath(contract, request);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');

    throw createApiError({
      status: response.status,
      code: `${contract.key}.request_failed`,
      message: body || response.statusText,
      details: {
        method: contract.method,
        path,
      },
    });
  }

  return (await response.json()) as Response;
}
