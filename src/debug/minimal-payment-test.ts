// Minimal Tinkoff API test to isolate the issue
export async function testMinimalPayment() {
  const TERMINAL_KEY = '1754995728217';
  const PASSWORD = 'Ut8FxLDYq2t3563u';
  const API_URL = 'https://securepay.tinkoff.ru/v2/';
  
  // Generate minimal parameters for Init
  const orderId = `test_${Date.now()}`;
  const amount = 500; // 5 рублей в копейках
  
  // Step 1: Test with ABSOLUTE MINIMUM parameters only
  const minimalParams = {
    TerminalKey: TERMINAL_KEY,
    Amount: amount,
    OrderId: orderId,
    Description: 'Test payment'
  };
  
  // Generate token for minimal params
  const tokenParams = Object.keys(minimalParams).sort().reduce((result: any, key) => {
    result[key] = minimalParams[key as keyof typeof minimalParams];
    return result;
  }, {});
  
  // Add password for token generation
  tokenParams.Password = PASSWORD;
  
  // Generate concatenated string
  const concatenated = Object.keys(tokenParams).sort()
    .map(key => String(tokenParams[key]))
    .join('');
    
  console.log('🔍 Token generation string:', concatenated);
  
  // Generate SHA-256 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(concatenated);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  console.log('🔐 Generated token:', token);
  
  const finalRequest = {
    ...minimalParams,
    Token: token
  };
  
  console.log('📤 Minimal request:', finalRequest);
  
  try {
    const response = await fetch(`${API_URL}Init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(finalRequest)
    });
    
    const responseText = await response.text();
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('📥 Response body:', responseText);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ SUCCESS! Payment URL:', data.PaymentURL);
      return { success: true, data };
    } else {
      console.error('❌ FAILED! Status:', response.status);
      try {
        const errorData = JSON.parse(responseText);
        console.error('❌ Error details:', errorData);
        return { success: false, error: errorData };
      } catch {
        console.error('❌ Raw error:', responseText);
        return { success: false, error: responseText };
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, networkError: error };
  }
}

// Test function for browser console
(window as any).testMinimalPayment = testMinimalPayment;