import React, { useState, useEffect } from 'react';
import { IntegrationConfig } from '../../types/index.ts';
import { Link2, CheckCircle2, AlertCircle, HelpCircle, Play, Shield, RefreshCw, KeyRound, Loader2 } from 'lucide-react';

export const AdminIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; message: string; success: boolean } | null>(null);

  const fetchIntegrations = async () => {
    try {
      const res = await fetch('/api/integrations');
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data.integrations);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleTestIntegration = async (id: string) => {
    setTestingId(id);
    setTestResult(null);

    try {
      const res = await fetch(`/api/integrations/${id}/test`, { method: 'POST' });
      const data = await res.json();
      setTestResult({
        id,
        message: data.message || (data.success ? 'Connected successfully' : 'Integration test failed'),
        success: data.success
      });
      await fetchIntegrations();
    } catch (err: any) {
      setTestResult({
        id,
        message: err.message || 'Error executing integration ping',
        success: false
      });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7E2DA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8A7D6B] font-semibold">
            <Link2 className="w-4 h-4 text-[#B89758]" />
            <span>Third-Party & Ecosystem Connectors</span>
          </div>
          <h2 className="font-serif text-2xl font-medium text-[#1C1C1F] mt-0.5">
            Integrations & API Bridge
          </h2>
          <p className="text-xs text-[#7A7875]">
            Verified connection state for AI styling engines, automated ERP synchronizers, payment gateways, and logistics.
          </p>
        </div>

        <button
          onClick={() => fetchIntegrations()}
          className="p-2 text-[#7A7875] hover:text-[#1C1C1F] hover:bg-[#F3EFEA] rounded-lg transition-colors self-start sm:self-auto"
          title="Refresh Integration States"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Security Architecture Statement */}
      <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E7E2DA] text-xs text-[#555350] flex items-start gap-3">
        <Shield className="w-4 h-4 text-[#B89758] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#1C1C1F] block mb-0.5">Zero-Exposure Credential Architecture:</strong>
          <span>
            API secrets are strictly consumed server-side in Node.js. No private tokens or keys are exposed to the client bundle. Services lacking verified credentials remain marked as Not Configured until authenticated.
          </span>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integ) => {
          const isTesting = testingId === integ.id;
          const currentResult = testResult?.id === integ.id ? testResult : null;

          return (
            <div
              key={integ.id}
              className="bg-white p-6 rounded-2xl border border-[#E7E2DA] shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#1C1C1F]">
                      {integ.name}
                    </h3>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#8A7D6B]">
                      Category: {integ.category}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {integ.status === 'connected' ? (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Connected
                      </span>
                    ) : integ.status === 'mock_mode' ? (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-blue-100 text-blue-800 flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Simulation Mode
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded bg-neutral-100 text-neutral-600">
                        Not Configured
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#555350] mt-3 leading-relaxed">
                  {integ.description}
                </p>

                <div className="mt-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] space-y-1.5 text-xs">
                  <div className="text-[#1C1C1F] font-medium">Architecture Note:</div>
                  <p className="text-[11px] text-[#6B6864] leading-relaxed">
                    {integ.details}
                  </p>
                  {integ.lastVerified && (
                    <p className="text-[10px] text-[#2E7D32] font-mono pt-1">
                      Status: {integ.lastVerified}
                    </p>
                  )}
                </div>

                <div className="mt-3 text-[11px] text-[#7A7875] flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#8A7D6B]" />
                  <span>Setup: <strong>{integ.setupInstructions}</strong></span>
                </div>
              </div>

              {/* Feedback & Actions */}
              <div className="pt-2 border-t border-[#F2EEE9] space-y-2">
                {currentResult && (
                  <div className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    currentResult.success ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF3E0] text-[#E65100]'
                  }`}>
                    {currentResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{currentResult.message}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#8A7D6B] font-mono">
                    {integ.credentialsConfigured ? 'Secrets detected' : 'Requires API secret'}
                  </span>

                  {integ.canTest ? (
                    <button
                      onClick={() => handleTestIntegration(integ.id)}
                      disabled={isTesting}
                      className="px-3 py-1.5 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32] transition-colors flex items-center gap-1.5 disabled:bg-neutral-400"
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Testing ping...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-[#B89758]" />
                          <span>Test Connection</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-3 py-1.5 bg-[#F3EFEA] text-[#9A9690] text-xs font-medium rounded-lg cursor-not-allowed"
                    >
                      Awaiting Credentials
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
