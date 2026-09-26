export default function Marquee({ motto, slogan }: { motto: string; slogan: string }) {
  const text = (
    <span>
      {slogan.toUpperCase()} <span className="dot">&middot;</span> {motto.toUpperCase()}{" "}
      <span className="dot">&middot;</span>
    </span>
  );
  return (
    <div className="marquee">
      <div className="marquee-track">
        {text}
        {text}
      </div>
    </div>
  );
}
