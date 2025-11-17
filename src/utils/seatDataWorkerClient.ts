/**
 * Client-side wrapper for the seat data Web Worker
 * Handles communication with the worker and provides a Promise-based API
 */

import type { SectionSeatingData } from '@/types/seat';

class SeatDataWorkerClient {
  private worker: Worker | null = null;
  private pendingRequests = new Map<string, { resolve: Function; reject: Function }>();
  private requestId = 0;

  constructor() {
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      this.initWorker();
    }
  }

  private initWorker() {
    try {
      this.worker = new Worker('/seatDataWorker.js');

      this.worker.addEventListener('message', (e) => {
        const { type, data, error, url, results } = e.data;

        // Handle batch responses
        if (type === 'BATCH_SUCCESS' && results) {
          results.forEach((result: any) => {
            const key = `fetch-${result.url}`;
            const pending = this.pendingRequests.get(key);
            if (pending) {
              if (result.error) {
                pending.reject(new Error(result.error));
              } else {
                pending.resolve(result.data);
              }
              this.pendingRequests.delete(key);
            }
          });
          return;
        }

        // Handle single responses
        const key = url ? `fetch-${url}` : `parse-${this.requestId}`;
        const pending = this.pendingRequests.get(key);

        if (pending) {
          if (type === 'PARSE_SUCCESS') {
            pending.resolve(data);
          } else if (type === 'PARSE_ERROR') {
            pending.reject(new Error(error));
          }
          this.pendingRequests.delete(key);
        }
      });

      this.worker.addEventListener('error', (error) => {
        console.error('Worker error:', error);
        // Reject all pending requests
        this.pendingRequests.forEach((pending) => {
          pending.reject(error);
        });
        this.pendingRequests.clear();
      });
    } catch (error) {
      console.warn('Failed to initialize Web Worker:', error);
      this.worker = null;
    }
  }

  /**
   * Fetch and parse JSON using the Web Worker
   */
  async fetchAndParse(url: string): Promise<SectionSeatingData> {
    // Fallback to main thread if worker is not available
    if (!this.worker) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch ${url}`);
      }
      return response.json();
    }

    return new Promise((resolve, reject) => {
      const key = `fetch-${url}`;
      this.pendingRequests.set(key, { resolve, reject });

      this.worker!.postMessage({
        type: 'FETCH_AND_PARSE',
        url
      });

      // Add timeout
      setTimeout(() => {
        if (this.pendingRequests.has(key)) {
          this.pendingRequests.delete(key);
          reject(new Error(`Timeout fetching ${url}`));
        }
      }, 30000); // 30 second timeout
    });
  }

  /**
   * Parse JSON string using the Web Worker
   */
  async parseJSON(jsonString: string): Promise<any> {
    // Fallback to main thread for small strings or if worker is not available
    if (!this.worker || jsonString.length < 10000) {
      return JSON.parse(jsonString);
    }

    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      const key = `parse-${id}`;
      this.pendingRequests.set(key, { resolve, reject });

      this.worker!.postMessage({
        type: 'PARSE_JSON',
        data: jsonString
      });

      // Add timeout
      setTimeout(() => {
        if (this.pendingRequests.has(key)) {
          this.pendingRequests.delete(key);
          reject(new Error('Parse timeout'));
        }
      }, 10000); // 10 second timeout
    });
  }

  /**
   * Fetch multiple URLs in parallel using the Web Worker
   */
  async batchFetch(urls: string[]): Promise<Map<string, SectionSeatingData>> {
    const results = new Map<string, SectionSeatingData>();

    // Fallback to main thread if worker is not available
    if (!this.worker) {
      const promises = urls.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            results.set(url, data);
          }
        } catch (error) {
          console.warn(`Failed to fetch ${url}:`, error);
        }
      });
      await Promise.all(promises);
      return results;
    }

    return new Promise((resolve, reject) => {
      this.worker!.postMessage({
        type: 'BATCH_FETCH',
        data: { urls }
      });

      this.worker!.addEventListener(
        'message',
        (e) => {
          if (e.data.type === 'BATCH_SUCCESS') {
            e.data.results.forEach((result: any) => {
              if (!result.error && result.data) {
                results.set(result.url, result.data);
              }
            });
            resolve(results);
          }
        },
        { once: true }
      );

      // Add timeout
      setTimeout(() => {
        reject(new Error('Batch fetch timeout'));
      }, 60000); // 60 second timeout for batch
    });
  }

  /**
   * Terminate the worker
   */
  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.pendingRequests.clear();
  }
}

// Create singleton instance
let workerClient: SeatDataWorkerClient | null = null;

export function getSeatDataWorker(): SeatDataWorkerClient {
  if (!workerClient) {
    workerClient = new SeatDataWorkerClient();
  }
  return workerClient;
}

export function terminateSeatDataWorker() {
  if (workerClient) {
    workerClient.terminate();
    workerClient = null;
  }
}