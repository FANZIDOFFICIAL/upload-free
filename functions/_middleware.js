const RATE = 20;
const WINDOW = 60;
const map = new Map();

export async function onRequest(ctx) {
  const ip = ctx.request.headers.get("CF-Connecting-IP") || "x";
  const now = Date.now();

  const data = map.get(ip) || { c: 0, t: now };
  if (now - data.t > WINDOW * 1000) {
    data.c = 0;
    data.t = now;
  }

  data.c++;
  map.set(ip, data);

  if (data.c > RATE) {
    return new Response("Rate limit", { status: 429 });
  }
  return ctx.next();
}