#!/bin/bash
# STRESS TEST - 100K Photos
echo "🧪 Starting stress test with 100,000 photos..."

# Generate test data
mkdir -p /tmp/stress_test
for i in {1..100000}; do
  echo '{"id": '$i', "name": "photo_'$i'.jpg"}' >> /tmp/stress_test/photos.json
done

echo "✅ Generated 100,000 photo entries"

# Run performance test
node -e "
const { performance } = require('perf_hooks')
const start = performance.now()

// Simulate loading 100K items
const items = []
for (let i = 0; i < 100000; i++) {
  items.push({ id: i, src: 'data:image/svg+xml;base64,PHN2Zy8+' })
}

const end = performance.now()
console.log('Load time:', (end - start).toFixed(2), 'ms')
console.log('Items/second:', Math.round(100000 / ((end - start) / 1000)))

// Memory test
const used = process.memoryUsage()
console.log('Memory usage:')
console.log('  Heap:', Math.round(used.heapUsed / 1024 / 1024), 'MB')
"

# Cleanup
rm -rf /tmp/stress_test

echo "🏁 Stress test complete"
