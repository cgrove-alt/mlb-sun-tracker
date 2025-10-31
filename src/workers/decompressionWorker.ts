/**
 * Web Worker for off-main-thread decompression
 * Prevents UI freezing during large file decompression (285-407KB)
 *
 * PERFORMANCE IMPROVEMENT:
 * - Moves pako.ungzip off main thread
 * - Keeps UI responsive during decompression
 * - Reduces perceived load time
 */

import pako from 'pako';

export interface DecompressionMessage {
  type: 'decompress';
  data: ArrayBuffer;
  id: string;
}

export interface DecompressionResult {
  type: 'success' | 'error';
  data?: string;
  error?: string;
  id: string;
}

// Worker message handler
self.onmessage = (event: MessageEvent<DecompressionMessage>) => {
  const { type, data, id } = event.data;

  if (type === 'decompress') {
    try {
      // Decompress the data using pako
      const decompressed = pako.ungzip(new Uint8Array(data), { to: 'string' });

      // Send success result back to main thread
      const result: DecompressionResult = {
        type: 'success',
        data: decompressed,
        id,
      };
      self.postMessage(result);
    } catch (error) {
      // Send error result back to main thread
      const result: DecompressionResult = {
        type: 'error',
        error: error instanceof Error ? error.message : 'Decompression failed',
        id,
      };
      self.postMessage(result);
    }
  }
};

// Export empty object for TypeScript module resolution
export {};
