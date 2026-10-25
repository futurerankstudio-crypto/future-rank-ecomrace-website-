import React, { useState, useEffect } from 'react';
import { AutomationWorkflow, AutomationExecution } from '../../types/index.ts';
import { Zap, Play, CheckCircle2, AlertTriangle, XCircle, Clock, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export const AdminAutomation: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingWfId, setTestingWfId] = useState<string | null>(null);
  const [expandedWfId, setExpandedWfId] = useState<string | null>('wf-1');
  const [selectedExecution, setSelectedExecution] = useState<AutomationExecution | null>(null);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/workflows');
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data.workflows);
        setExecutions(data.executions);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleToggleWorkflow = async (id: string) => {
    try {
      const res = await fetch(`/api/workflows/${id}/toggle`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setWorkflows((prev) => prev.map((w) => (w.id === id ? data.workflow : w)));
      }
    } catch {
      // ignore
    }
  };

  const handleTestRun = async (id: string) => {
    setTestingWfId(id);
    try {
      const res = await fetch(`/api/workflows/${id}/test`, { method: 'POST' });
      if (res.ok) {
        await fetchWorkflows();
      }
    } catch {
      // ignore
    } finally {
      setTestingWfId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7E2DA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8A7D6B] font-semibold">
            <Zap className="w-4 h-4 text-[#B89758]" />
            <span>Store Automation Engine</span>
          </div>
          <h2 className="font-serif text-2xl font-medium text-[#1C1C1F] mt-0.5">
            Automation Centre
          </h2>
          <p className="text-xs text-[#7A7875]">
            Event-driven business rules for inventory protection, instant order verification, AI triage, and post-purchase follow-up.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tabular-nums text-[#4A4845] bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#DDD7CE]">
            {workflows.filter((w) => w.isEnabled).length} of {workflows.length} Workflows Operational
          </span>
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((wf) => {
          const isExpanded = expandedWfId === wf.id;

          return (
            <div
              key={wf.id}
              className={`bg-white rounded-2xl border transition-all ${
                wf.isEnabled ? 'border-[#E7E2DA]' : 'border-[#EAE5DC] opacity-75'
              }`}
            >
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 cursor-pointer" onClick={() => setExpandedWfId(isExpanded ? null : wf.id)}>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg font-semibold text-[#1C1C1F]">
                      {wf.name}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                        wf.isEnabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {wf.isEnabled ? 'Enabled & Active' : 'Guarded (Requires Integration)'}
                    </span>
                  </div>

                  <p className="text-xs text-[#555350] mt-1 leading-relaxed">
                    {wf.description}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-[#7A7875] font-mono">
                    <span>{wf.trigger}</span>
                    <span>·</span>
                    <span>Total Runs: {wf.totalRuns}</span>
                    <span>·</span>
                    <span>Last Run: {wf.lastRun ? new Date(wf.lastRun).toLocaleString() : 'Never'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleTestRun(wf.id)}
                    disabled={testingWfId === wf.id || !wf.isEnabled}
                    className="px-3.5 py-1.5 rounded-lg border border-[#DDD7CE] text-xs font-medium text-[#1C1C1F] hover:bg-[#FAF8F5] flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Play className="w-3.5 h-3.5 text-[#B89758]" />
                    <span>{testingWfId === wf.id ? 'Executing...' : 'Test Run'}</span>
                  </button>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggleWorkflow(wf.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                      wf.isEnabled ? 'bg-[#1C1C1F]' : 'bg-[#DDD7CE]'
                    }`}
                    title={wf.isEnabled ? 'Disable workflow' : 'Enable workflow'}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        wf.isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => setExpandedWfId(isExpanded ? null : wf.id)}
                    className="p-1 text-[#7A7875] hover:text-[#1C1C1F]"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Step Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-[#F2EEE9] bg-[#FAF8F5]/60 text-xs text-[#555350] space-y-2 rounded-b-2xl animate-fadeIn">
                  <span className="font-semibold text-[#1C1C1F] block text-[11px] uppercase tracking-wider">
                    Pipeline Execution Steps:
                  </span>
                  <div className="space-y-1.5 pl-2">
                    {wf.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B89758] shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Execution Logs Table */}
      <div className="bg-white rounded-2xl border border-[#E7E2DA] shadow-sm overflow-hidden space-y-4 p-5">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#1C1C1F]">
            Recent Execution History & Telemetry
          </h3>
          <p className="text-xs text-[#7A7875]">
            Audit logs recorded automatically when orders, inventory changes, or support inquiries occur.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E7E2DA] text-[#7A7875]">
                <th className="py-2.5 px-3 font-semibold">Execution ID</th>
                <th className="py-2.5 px-3 font-semibold">Workflow</th>
                <th className="py-2.5 px-3 font-semibold">Trigger Event</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                <th className="py-2.5 px-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EEE9]">
              {executions.map((exec) => (
                <tr key={exec.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-[#1C1C1F] tabular-nums">
                    {exec.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#1C1C1F]">
                    {exec.workflowName.split(':')[0]}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#555350]">
                    {exec.triggerEvent}
                  </td>
                  <td className="py-3 px-3">
                    {exec.status === 'success' ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        Success
                      </span>
                    ) : exec.status === 'warning' ? (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3" />
                        Warning Alert
                      </span>
                    ) : (
                      <span className="text-[10px] bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded flex items-center gap-1 w-max">
                        <XCircle className="w-3 h-3" />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[#7A7875] font-mono text-[11px]">
                    {new Date(exec.triggeredAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-[#555350] max-w-xs truncate">
                    {exec.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
