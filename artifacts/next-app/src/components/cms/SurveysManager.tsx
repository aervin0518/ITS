"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ClipboardList, RefreshCw, BarChart3,
  ChevronLeft, ChevronRight, ExternalLink, CheckCircle2, AlertCircle, Clock,
} from "lucide-react";

interface Survey {
  id: string;
  name: string;
  source_system: string | null;
  version: string | null;
  active_flag: boolean;
}

interface SurveyResponse {
  id: string;
  survey_id: string | null;
  father_profile_id: string | null;
  submission_source: string | null;
  submitted_at: string;
  completion_status: string | null;
  surveys: { name: string; source_system: string } | null;
}

interface Assessment {
  id: string;
  name: string;
  version: string | null;
  scoring_model: string | null;
}

interface AssessmentResult {
  id: string;
  assessment_id: string | null;
  father_profile_id: string | null;
  submitted_at: string;
  score_total: number | null;
  score_breakdown_json: Record<string, unknown>;
  interpretation_text: string | null;
  assessments: { name: string; version: string | null; scoring_model: string | null } | null;
}

type ActiveTab = "surveys" | "assessments";

const COMPLETION_ICONS: Record<string, React.ReactNode> = {
  complete: <CheckCircle2 size={14} className="text-green-600" />,
  partial: <Clock size={14} className="text-amber-500" />,
  rejected: <AlertCircle size={14} className="text-red-500" />,
};

const JOTFORM_FORM_ID = "253554464301049";
const LIMIT = 50;

export default function SurveysManager() {
  const [tab, setTab] = useState<ActiveTab>("surveys");

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [surveyTotal, setSurveyTotal] = useState(0);
  const [surveyPage, setSurveyPage] = useState(1);
  const [filterSurveyId, setFilterSurveyId] = useState("");
  const [loadingSurveys, setLoadingSurveys] = useState(true);

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [assessmentTotal, setAssessmentTotal] = useState(0);
  const [assessmentPage, setAssessmentPage] = useState(1);
  const [filterAssessmentId, setFilterAssessmentId] = useState("");
  const [loadingAssessments, setLoadingAssessments] = useState(true);

  const fetchSurveyMeta = useCallback(async () => {
    const res = await fetch("/api/surveys");
    if (res.ok) { const d = await res.json(); setSurveys(d.surveys ?? []); }
  }, []);

  const fetchResponses = useCallback(async () => {
    setLoadingSurveys(true);
    const params = new URLSearchParams({ page: String(surveyPage) });
    if (filterSurveyId) params.set("survey_id", filterSurveyId);
    const res = await fetch(`/api/surveys/responses?${params}`);
    if (res.ok) {
      const d = await res.json();
      setResponses(d.responses ?? []);
      setSurveyTotal(d.total ?? 0);
    }
    setLoadingSurveys(false);
  }, [surveyPage, filterSurveyId]);

  const fetchAssessmentMeta = useCallback(async () => {
    const res = await fetch("/api/assessments");
    if (res.ok) { const d = await res.json(); setAssessments(d.assessments ?? []); }
  }, []);

  const fetchResults = useCallback(async () => {
    setLoadingAssessments(true);
    const params = new URLSearchParams({ page: String(assessmentPage) });
    if (filterAssessmentId) params.set("assessment_id", filterAssessmentId);
    const res = await fetch(`/api/assessments/results?${params}`);
    if (res.ok) {
      const d = await res.json();
      setResults(d.results ?? []);
      setAssessmentTotal(d.total ?? 0);
    }
    setLoadingAssessments(false);
  }, [assessmentPage, filterAssessmentId]);

  useEffect(() => { fetchSurveyMeta(); fetchAssessmentMeta(); }, [fetchSurveyMeta, fetchAssessmentMeta]);
  useEffect(() => { fetchResponses(); }, [fetchResponses]);
  useEffect(() => { fetchResults(); }, [fetchResults]);

  const surveyPages = Math.ceil(surveyTotal / LIMIT);
  const assessmentPages = Math.ceil(assessmentTotal / LIMIT);

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {(["surveys", "assessments"] as ActiveTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-white text-[#111114] shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "surveys" ? <ClipboardList size={15} /> : <BarChart3 size={15} />}
            {t === "surveys" ? "Survey Responses" : "Assessment Results"}
          </button>
        ))}
      </div>

      {/* ── SURVEYS TAB ── */}
      {tab === "surveys" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#111114]">Survey Responses</h2>
              <p className="text-sm text-gray-500 mt-0.5">{surveyTotal.toLocaleString()} submission{surveyTotal !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://form.jotform.com/${JOTFORM_FORM_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:border-gray-300 text-gray-600 transition-colors"
              >
                <ExternalLink size={14} />
                Open Form
              </a>
              <button onClick={fetchResponses} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:border-gray-300 text-gray-600 transition-colors">
                <RefreshCw size={14} className={loadingSurveys ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          {/* Survey filter */}
          {surveys.length > 0 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <button onClick={() => { setFilterSurveyId(""); setSurveyPage(1); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!filterSurveyId ? "bg-[#152A4A] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                All
              </button>
              {surveys.map((s) => (
                <button key={s.id} onClick={() => { setFilterSurveyId(s.id); setSurveyPage(1); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterSurveyId === s.id ? "bg-[#152A4A] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {s.name}
                </button>
              ))}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-sm text-blue-800">
            <p className="font-semibold mb-1">JotForm webhook endpoint</p>
            <code className="text-xs bg-blue-100 px-2 py-1 rounded font-mono break-all">
              POST /api/surveys/webhook/jotform
            </code>
            <p className="text-xs mt-2 text-blue-600">
              Add this URL in JotForm → Settings → Integrations → Webhooks to capture every submission automatically.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loadingSurveys ? (
              <div className="flex items-center justify-center py-20"><RefreshCw size={22} className="animate-spin text-[#152A4A]" /></div>
            ) : responses.length === 0 ? (
              <div className="text-center py-20">
                <ClipboardList size={36} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-500 text-sm font-medium">No survey responses yet</p>
                <p className="text-gray-400 text-xs mt-1">Configure the JotForm webhook to start capturing submissions.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Survey</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Father Profile</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {responses.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-[#111114]">{r.surveys?.name ?? "—"}</td>
                          <td className="px-5 py-3.5 text-gray-500 text-xs">{r.submission_source ?? "—"}</td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">{r.father_profile_id ? r.father_profile_id.slice(0, 8) + "…" : "—"}</td>
                          <td className="px-5 py-3.5">
                            <span className="flex items-center gap-1.5 text-xs font-medium capitalize">
                              {COMPLETION_ICONS[r.completion_status ?? ""] ?? null}
                              {r.completion_status ?? "—"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                            {new Date(r.submitted_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {surveyPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">Page {surveyPage} of {surveyPages}</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSurveyPage((p) => Math.max(1, p - 1))} disabled={surveyPage === 1} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"><ChevronLeft size={16} /></button>
                      <button onClick={() => setSurveyPage((p) => Math.min(surveyPages, p + 1))} disabled={surveyPage === surveyPages} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── ASSESSMENTS TAB ── */}
      {tab === "assessments" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#111114]">Assessment Results</h2>
              <p className="text-sm text-gray-500 mt-0.5">{assessmentTotal} result{assessmentTotal !== 1 ? "s" : ""} recorded</p>
            </div>
            <button onClick={fetchResults} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:border-gray-300 text-gray-600 transition-colors">
              <RefreshCw size={14} className={loadingAssessments ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Assessment filter */}
          {assessments.length > 0 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <button onClick={() => { setFilterAssessmentId(""); setAssessmentPage(1); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!filterAssessmentId ? "bg-[#152A4A] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                All Types
              </button>
              {assessments.map((a) => (
                <button key={a.id} onClick={() => { setFilterAssessmentId(a.id); setAssessmentPage(1); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterAssessmentId === a.id ? "bg-[#152A4A] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {a.name} {a.version ? `v${a.version}` : ""}
                </button>
              ))}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loadingAssessments ? (
              <div className="flex items-center justify-center py-20"><RefreshCw size={22} className="animate-spin text-[#152A4A]" /></div>
            ) : results.length === 0 ? (
              <div className="text-center py-20">
                <BarChart3 size={36} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-500 text-sm font-medium">No assessment results yet</p>
                <p className="text-gray-400 text-xs mt-1">Results are submitted via <code className="bg-gray-100 px-1 rounded">POST /api/assessments/results</code>.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assessment</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Father Profile</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Interpretation</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {results.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5">
                            <p className="font-medium text-[#111114]">{r.assessments?.name ?? "—"}</p>
                            {r.assessments?.version && <p className="text-xs text-gray-400">v{r.assessments.version}</p>}
                          </td>
                          <td className="px-5 py-3.5 font-bold text-[#111114]">
                            {r.score_total != null ? r.score_total : "—"}
                          </td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">
                            {r.father_profile_id ? r.father_profile_id.slice(0, 8) + "…" : "—"}
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 text-xs max-w-xs truncate">
                            {r.interpretation_text ?? "—"}
                          </td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                            {new Date(r.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {assessmentPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">Page {assessmentPage} of {assessmentPages}</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setAssessmentPage((p) => Math.max(1, p - 1))} disabled={assessmentPage === 1} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"><ChevronLeft size={16} /></button>
                      <button onClick={() => setAssessmentPage((p) => Math.min(assessmentPages, p + 1))} disabled={assessmentPage === assessmentPages} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
