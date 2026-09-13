import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/data";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const settings = await getSiteSettings();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: settings.primary_color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 96,
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
