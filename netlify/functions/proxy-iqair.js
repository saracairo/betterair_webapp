exports.handler = async function(event, context) {
  const city = event.queryStringParameters.city;
  const state = event.queryStringParameters.state;
  const apiKey = process.env.IQAIR_API_KEY; // variabile ambiente su Netlify

  const url = `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=Italy&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};