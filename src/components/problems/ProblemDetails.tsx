import { useParams, Link } from "react-router-dom";

function ProblemDetail() {
  // The dynamic segment from the route path, e.g. /explore-solutions/:problemId
  const { problemId } = useParams<{ problemId: string }>();

  return (
    <div className="px-6 py-5">
      <Link
        to="/problemlist"
        className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
      >
        ← Back to Explore Problems
      </Link>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-bold text-slate-900">
          Problem Detail Page (test)
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Problem ID from URL:{" "}
          <span className="font-mono font-semibold text-emerald-700">
            {problemId ?? "none"}
          </span>
        </p>

        <p className="mt-4 text-xs text-slate-400">
          Next step: use this ID to call{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5">
            GET /api/problems/{"{problemId}"}
          </code>{" "}
          and render the full detail view here.
        </p>
      </div>
    </div>
  );
}

export default ProblemDetail;
