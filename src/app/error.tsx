"use client";

import { useEffect } from "react";
import { Metadata } from "next";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Something went wrong
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
          We encountered an error while loading this page. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors inline-block"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
