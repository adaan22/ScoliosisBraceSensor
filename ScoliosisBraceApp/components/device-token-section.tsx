'use client';

import { useState } from 'react';

export function DeviceTokenSection() {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/device-token');
      if (!res.ok) throw new Error('Failed to fetch token');
      const json = await res.json();
      setToken(json.access_token);
    } catch {
      setError('Could not retrieve token. Are you logged in?');
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-gray-200 p-6 max-w-xl">
      <h2 className="text-lg font-semibold mb-1">Device Setup Token</h2>
      <p className="text-sm text-gray-500 mb-4">
        Use this token to authenticate the sensor script on your device:
        <br />
        <code className="text-xs bg-gray-100 px-1 rounded">python testJson.py --token &lt;paste here&gt;</code>
      </p>

      {!token && (
        <button
          onClick={fetchToken}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Show My Token'}
        </button>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {token && (
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={token}
              className="flex-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded px-3 py-2 truncate"
            />
            <button
              onClick={copy}
              className="px-3 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">This token expires with your session. Refresh if it stops working.</p>
        </div>
      )}
    </div>
  );
}
