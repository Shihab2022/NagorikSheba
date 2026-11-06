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

// Access module internals
const providerModule = await import('./src/app/modules/government-offices/office-location-provider.ts');
const cache = providerModule.cache;
const inFlight = providerModule.inFlight;
const lastFailureAt = providerModule.lastFailureAt;

async function runTest() {
  try {
    cache.clear();
    inFlight.clear();
    lastFailureAt.clear();
    
    console.log('=== Test: Fresh call ===');
    console.log('Cache before:', cache.size);
    
    console.log('Calling findNearbyPassportCandidates...');
    const result = await overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10);
    console.log('Result:', result.length, 'items');
    console.log('Cache after:', cache.size);
    console.log('Total fetch calls:', fetchCount);
    
    cache.clear();
    inFlight.clear();
    lastFailureAt.clear();
    
    console.log('');
    console.log('=== Test: Same coordinates, should use cache ===');
    console.log('Cache before:', cache.size);
    
    const result2 = await overpassPassportProvider.findNearbyPassportCandidates(22.34, 91.81, 10);
    console.log('Result:', result2.length, 'items');
    console.log('Total fetch calls:', fetchCount);
  } catch (error) {
    console.error('Error:', error.message, error.stack);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

runTest();
