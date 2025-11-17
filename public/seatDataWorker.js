/**
 * Web Worker for parsing seat data JSON off the main thread
 * Prevents UI blocking during large JSON parsing operations
 */

// Handle messages from the main thread
self.addEventListener('message', async function(e) {
  const { type, url, data } = e.data;

  try {
    switch (type) {
      case 'FETCH_AND_PARSE':
        // Fetch and parse JSON data
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch ${url}`);
        }

        // Check if response is gzipped
        const contentEncoding = response.headers.get('content-encoding');
        const isGzipped = contentEncoding && contentEncoding.includes('gzip');

        // Parse the JSON
        const jsonData = await response.json();

        // Send parsed data back to main thread
        self.postMessage({
          type: 'PARSE_SUCCESS',
          data: jsonData,
          metadata: {
            url,
            isGzipped,
            size: response.headers.get('content-length')
          }
        });
        break;

      case 'PARSE_JSON':
        // Parse raw JSON string
        const parsed = JSON.parse(data);
        self.postMessage({
          type: 'PARSE_SUCCESS',
          data: parsed
        });
        break;

      case 'BATCH_FETCH':
        // Fetch multiple URLs in parallel
        const { urls } = data;
        const results = await Promise.all(
          urls.map(async (url) => {
            try {
              const response = await fetch(url);
              if (!response.ok) {
                return { url, error: `HTTP ${response.status}` };
              }
              const jsonData = await response.json();
              return { url, data: jsonData };
            } catch (error) {
              return { url, error: error.message };
            }
          })
        );

        self.postMessage({
          type: 'BATCH_SUCCESS',
          results
        });
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      type: 'PARSE_ERROR',
      error: error.message,
      url
    });
  }
});

// Optional: Add compression/decompression utilities if needed
function calculateDataSize(obj) {
  // Rough estimate of object size in memory
  const jsonString = JSON.stringify(obj);
  return jsonString.length;
}