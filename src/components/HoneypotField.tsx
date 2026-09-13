// Classic honeypot: visually hidden from real visitors (but present in the
// DOM, unlike display:none which some bots skip), so only bots that
// blindly fill every field end up tripping it. Paired with a server-side
// check in each form action.
export default function HoneypotField() {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        opacity: 0,
      }}
    />
  );
}
