import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6 animate-float">🌸</div>
      <h1 className="font-display text-4xl font-bold text-pink-700 mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <Link href="/" className="btn-primary">Go Home</Link>
    </div>
  );
}
