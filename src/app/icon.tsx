import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/data";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const settings = await getSiteSettings();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: settings.primary_color,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        {settings.site_name.charAt(0).toUpperCase()}
      </div>
    ),
    { ...size }
  );
}
