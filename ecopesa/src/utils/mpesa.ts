import axios from 'axios';

export async function getMpesaToken() {
  const auth = Buffer.from(
    process.env.SP9m1gNmvtwP5uajujmrkE7mduHTg0uzoR1yg8qHe5dkZ0Km
 + ':' + process.env.vY9hM1HAdQ4QlXv8SWQ54gJClvlCPEW4vbC8P7GGqVR9RamxP3ES0P7o712G8s4t
  ).toString('base64');

  const res = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return res.data.access_token;
}
