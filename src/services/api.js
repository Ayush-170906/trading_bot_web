export async function placeOrder(formData) {
  const res = await fetch("/api/place_order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return res.json();
}
