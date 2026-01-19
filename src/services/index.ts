import { HttpDataClient } from './HttpDataClient';
import type { IDataClient, DataClientConfig } from './IDataClient';

export type { IDataClient, DataClientConfig, QueryParams, DatasetSummary } from './IDataClient';
export { HttpDataClient } from './HttpDataClient';

let dataClientInstance: IDataClient | null = null;

/**
 * Creates a data client instance.
 * In development with MSW enabled, the HTTP client's fetch calls are intercepted.
 * In production, pass a getAccessToken function for MSAL authentication.
 */
export function createDataClient(config?: DataClientConfig): IDataClient {
  return new HttpDataClient(config);
}

/**
 * Gets the singleton data client instance.
 * Creates one if it doesn't exist.
 */
export function getDataClient(): IDataClient {
  if (!dataClientInstance) {
    dataClientInstance = createDataClient();
  }
  return dataClientInstance;
}

/**
 * Sets the data client instance (useful for testing or custom configurations).
 */
export function setDataClient(client: IDataClient): void {
  dataClientInstance = client;
}

/**
 * Resets the data client instance (useful for testing).
 */
export function resetDataClient(): void {
  dataClientInstance = null;
}
