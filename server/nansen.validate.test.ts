import { describe, expect, it } from "vitest";
import axios from 'axios';

describe("Nansen API Key Validation", () => {
  it("validates that NANSEN_API_KEY is set and works", async () => {
    const apiKey = process.env.NANSEN_API_KEY;
    
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe('');
    
    // Make a lightweight API call to validate the key
    try {
      const response = await axios.post(
        'https://api.nansen.ai/api/v1/token-screener',
        {
          chains: ['ethereum'],
          timeframe: '24h',
          pagination: {
            page: 1,
            per_page: 1
          },
          filters: {
            only_smart_money: false
          },
          order_by: [
            {
              field: 'volume_24h',
              direction: 'DESC'
            }
          ]
        },
        {
        headers: {
          'apiKey': apiKey,
          'Content-Type': 'application/json'
        },
          timeout: 10000
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Nansen API key is invalid or unauthorized. Please check your API key.');
      } else if (error.response?.status === 429) {
        // Rate limit is acceptable - means the key works
        console.log('API key is valid (rate limit reached)');
      } else if (error.response?.data?.error === 'Insufficient credits') {
        // Insufficient credits means authentication worked
        console.log('API key is valid (insufficient credits - need to top up)');
      } else {
        throw new Error(`Nansen API validation failed: ${error.message}`);
      }
    }
  }, 15000); // 15 second timeout for API call
});
