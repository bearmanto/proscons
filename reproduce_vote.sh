#!/bin/bash

# Fetch a reason ID first (assuming there is at least one reason)
# We'll use the seed API to get a reason ID if needed, or just list reasons
# For now, let's try to hit the vote endpoint with a dummy ID to see if we get a 400 or 500
# But to reproduce the specific "user_key" error, we need a valid reason_id and a valid flow.

# Let's try to get a reason ID from the API
REASON_ID=$(curl -s http://localhost:3000/api/reasons?slug=jqFs4nGGAL | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$REASON_ID" ]; then
  echo "Could not find a reason ID. Please ensure the app is running and seeded."
  exit 1
fi

echo "Found Reason ID: $REASON_ID"

# Send a vote request
echo "Sending vote request..."
curl -v -X POST http://localhost:3000/api/reason-votes \
  -H "Content-Type: application/json" \
  -d "{\"reason_id\": \"$REASON_ID\", \"value\": 1}"
