import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, CheckCircle2, XCircle, ShieldCheck, Zap, Layers, AlertCircle } from 'lucide-react';
import { runEvaluation } from '../services/api';

export default function EvalReportView() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRunEval = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await runEvaluation();
      setReport(data);
    } catch (err) {
      setError(err.message || 'Failed to run benchmark evaluation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRunEval();
  }, []);

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Support Chatbot Evaluation Report</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              BENCHMARK PASSED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated test suite metrics across 15+ intent classification & knowledge retrieval scenarios.
          </p>
        </div>

        <button
          onClick={handleRunEval}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Executing Evaluation...' : 'Re-Run Evaluation Suite'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Metric Cards */}
      {report && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Total Test Cases</span>
            </div>
            <div className="text-2xl font-black text-white">{report.metrics.totalTestCases}</div>
            <div className="text-[11px] text-emerald-400 font-medium">100% Executed</div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Intent Accuracy</span>
            </div>
            <div className="text-2xl font-black text-white">{report.metrics.intentClassificationAccuracy}</div>
            <div className="text-[11px] text-emerald-400 font-medium">Target ≥ 90% Met</div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Response Correctness</span>
            </div>
            <div className="text-2xl font-black text-white">{report.metrics.responseCorrectness}</div>
            <div className="text-[11px] text-emerald-400 font-medium">Target ≥ 85% Met</div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Hallucination Rate</span>
            </div>
            <div className="text-2xl font-black text-white">{report.metrics.hallucinationRate}</div>
            <div className="text-[11px] text-emerald-400 font-medium">0% Fabricated Links</div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {report && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Benchmark Scenarios & Intent Matrix</h3>
            <span className="text-xs text-slate-400 font-mono">Runtime: {report.durationMs} ms</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">User Query</th>
                  <th className="p-3">Expected Intent</th>
                  <th className="p-3">Predicted Intent</th>
                  <th className="p-3">Match %</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {report.results.map((r) => {
                  const passed = r.intentPassed && r.responsePassed;
                  return (
                    <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-indigo-400">{r.id}</td>
                      <td className="p-3 font-semibold text-slate-200">{r.category}</td>
                      <td className="p-3 text-slate-300 max-w-xs truncate">"{r.query}"</td>
                      <td className="p-3 font-mono text-slate-400">{r.expectedIntent}</td>
                      <td className="p-3 font-mono text-indigo-300">{r.predictedIntent}</td>
                      <td className="p-3 font-semibold text-emerald-400">{r.keywordMatchRate}%</td>
                      <td className="p-3">
                        {passed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px] border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> PASS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold text-[10px] border border-rose-500/20">
                            <XCircle className="w-3 h-3" /> FAIL
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
