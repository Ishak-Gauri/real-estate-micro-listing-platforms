export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
  
    if (!q || q.trim() === "") {
      return Response.json([]);
    }
  
    const res = await fetch(
      `https://api.locationiq.com/v1/autocomplete.php?key=${process.env.LOCATIONIQ_KEY}&q=${q}&format=json`
    );
  
    const data = await res.json();
  
    if (!Array.isArray(data)) {
      return Response.json([]);
    }
  
    // Deduplicate by place_id and add coordinates
    const seen = new Set();
    const formatted = data
      .filter((place) => {
        if (seen.has(place.place_id)) return false;
        seen.add(place.place_id);
        return true;
      })
      .map((place, index) => {
        const parts = place.display_name.split(",");
        return {
          label: place.display_name,
          value: place.display_name,
          place_id: place.place_id || `place-${index}`,  // fallback key
          structured_formatting: {
            main_text: parts[0].trim(),
            secondary_text: parts.slice(1).join(",").trim(),
          },
          terms: parts.map((p) => ({ value: p.trim() })),
          types: place.type ? [place.type] : [],
          // ✅ coordinates for Supabase
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lon),
        };
      });
  
    return Response.json(formatted);
  }