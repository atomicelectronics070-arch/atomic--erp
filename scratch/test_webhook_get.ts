async function testWebhook() {
  const url = 'https://atomiccotizador.shop/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=atomic_whatsapp_verify_token_2026&hub.challenge=test_challenge_999';
  console.log('Probando GET webhook URL:', url);
  const res = await fetch(url);
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response body:', JSON.stringify(text));
  console.log('Content-Type:', res.headers.get('content-type'));
}
testWebhook().catch(console.error);
