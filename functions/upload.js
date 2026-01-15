export async function onRequestPost(ctx) {
  const fd = await ctx.request.formData();
  const file = fd.get("file");

  if (!file) return new Response("NO FILE", { status: 400 });
  if (file.size > 10 * 1024 * 1024)
    return new Response("MAX 10MB", { status: 400 });

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", ctx.env.UPLOAD_PRESET);

  const r = await fetch(
    `https://api.cloudinary.com/v1_1/${ctx.env.CLOUD_NAME}/auto/upload`,
    { method: "POST", body: data }
  );

  const j = await r.json();
  return Response.json({
    success: true,
    brand: "FANZID",
    url: j.secure_url
  });
}