"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="text-muted">
        {error.digest ? `Reference: ${error.digest}` : "Please try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="border-border hover:bg-surface rounded-md border px-4 py-2"
      >
        Try again
      </button>
    </main>
  );
}
