/**
 * Test component to verify TimeAgo functionality
 * This can be temporarily added to any page to test timestamps
 */

import TimeAgo from './TimeAgo';

export default function TimeAgoTest() {
  const testDates = [
    new Date().toISOString(), // Now
    new Date(Date.now() - 30 * 1000).toISOString(), // 30 seconds ago
    new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    'invalid-date', // Invalid date
    null, // Null value
    undefined, // Undefined value
  ];

  return (
    <div className="p-4 border rounded-lg bg-muted/50">
      <h3 className="text-lg font-semibold mb-4">TimeAgo Test</h3>
      <div className="space-y-2">
        {testDates.map((date, index) => (
          <div key={index} className="flex items-center gap-4">
            <span className="text-sm font-mono w-32">
              {date || 'null/undefined'}
            </span>
            <span className="text-sm">→</span>
            <TimeAgo 
              iso={date} 
              titlePrefix="Test" 
              className="text-sm font-medium"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
