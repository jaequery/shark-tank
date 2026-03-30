import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <div className="empty-state">
        <h2>Page not found</h2>
        <Link href="/">Back to home</Link>
      </div>
    </div>
  );
}
