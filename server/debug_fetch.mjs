import { overpassPassportProvider } from './src/app/modules/government-offices/office-location-provider.ts';

// Save original fetch
const originalFetch = globalThis.fetch;

// Create mock fetch
let fetchCount = 0;
globalThis.fetch = async (url, options) => {
  fetchCount++;
  console.log('Mock fetch called:', fetchCount, 'for', url);
  return new Response(JSON.stringify({
    elements: [
      { type: 'node', id: 1, lat: 22.34, lon: 91.81, tags: { name: 'Passport Office' } }
    ]
  }), { status: 200 });
};

async function runTest() {
  try {
    console.log('Calling findNearbyPassportCandidates...');
    const result = await overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10);
    console.log('Result:', result.length, 'items');
    console.log('Total fetch calls:', fetchCount);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

runTest();
