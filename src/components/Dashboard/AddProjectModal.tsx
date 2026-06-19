import { useState } from "react";
import {
  X,
  Plus,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type {
  Project,
  ProjectCategory,
  ProjectStatus,
  ExpenseBreakdownItem,
} from "../../types/project";

/* ─────────── Types ─────────── */

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
  /** Called with the validated project payload (no `id` — the API assigns it). */
  onSave: (project: Omit<Project, "id">) => void;
  submitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

interface FormErrors {
  projectName?: string;
  location?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  income?: string;
  expenses?: string;
  breakdown?: string;
}

/* ─────────── Constants ─────────── */

const CATEGORIES: { label: string; value: ProjectCategory }[] = [
  { label: "Commercial", value: "commercial" },
  { label: "Residential", value: "residential" },
  { label: "Infrastructure", value: "infrastructure" },
  { label: "Industrial", value: "industrial" },
  { label: "Institutional", value: "institutional" },
];

const STATUSES: { label: string; value: ProjectStatus }[] = [
  { label: "Ongoing", value: "Ongoing" },
  { label: "Completed", value: "Completed" },
  { label: "Delayed", value: "Delayed" },
];

const DEFAULT_BREAKDOWN: ExpenseBreakdownItem[] = [
  { category: "Materials", amount: 0 },
  { category: "Labor", amount: 0 },
  { category: "Equipment", amount: 0 },
  { category: "Subcontractors", amount: 0 },
  { category: "Permits & Fees", amount: 0 },
];

const EMPTY_FORM = {
  projectName: "",
  location: "",
  category: "" as ProjectCategory | "",
  status: "Ongoing" as ProjectStatus,
  startDate: "",
  endDate: "",
  budget: "",
  income: "",
  expenses: "",
};

/* ─────────── Component ─────────── */

export default function AddProjectModal({
  open,
  onClose,
  onSave,
  submitting,
  submitError,
  submitSuccess,
}: AddProjectModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [breakdown, setBreakdown] = useState<ExpenseBreakdownItem[]>(
    DEFAULT_BREAKDOWN.map((b) => ({ ...b }))
  );
  const [errors, setErrors] = useState<FormErrors>({});

  if (!open) return null;

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof FormErrors];
        return next;
      });
    }
  }

  function setBreakdownAmount(index: number, raw: string) {
    const val = raw === "" ? 0 : Number(raw);
    setBreakdown((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], amount: val };
      return next;
    });
    if (errors.breakdown) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.breakdown;
        return next;
      });
    }
  }

  function validate(): FormErrors {
    const e: FormErrors = {};

    if (!form.projectName.trim()) e.projectName = "Project name is required.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!form.category) e.category = "Select a category.";
    if (!form.status) e.status = "Select a status.";
    if (!form.startDate) e.startDate = "Start date is required.";
    if (!form.endDate) e.endDate = "End date is required.";

    const budget = Number(form.budget);
    const income = Number(form.income);
    const expenses = Number(form.expenses);

    if (!form.budget || budget <= 0)
      e.budget = "Enter a valid budget (> $0).";
    if (!form.income || income < 0)
      e.income = "Enter a valid income (≥ $0).";
    if (!form.expenses || expenses < 0)
      e.expenses = "Enter valid expenses (≥ $0).";

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = "End date must be after start date.";
    }

    const breakdownTotal = breakdown.reduce((s, b) => s + b.amount, 0);
    if (expenses > 0 && breakdownTotal !== expenses) {
      e.breakdown = `Breakdown total ($${breakdownTotal.toLocaleString()}) must equal expenses ($${expenses.toLocaleString()}).`;
    }

    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const budget = Number(form.budget);
    const income = Number(form.income);
    const expenses = Number(form.expenses);

    const payload: Omit<Project, "id"> = {
      projectName: form.projectName.trim(),
      location: form.location.trim(),
      category: form.category as ProjectCategory,
      status: form.status as ProjectStatus,
      startDate: form.startDate,
      endDate: form.endDate,
      budget,
      income,
      expenses,
      expenseBreakdown: breakdown.map((b) => ({ ...b })),
    };

    onSave(payload);
  }

  function handleClose() {
    if (submitting) return;
    setForm(EMPTY_FORM);
    setBreakdown(DEFAULT_BREAKDOWN.map((b) => ({ ...b })));
    setErrors({});
    onClose();
  }

  const field =
    "w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const fieldError = "border-rose-300 bg-rose-50/30";
  const fieldNormal = "border-slate-200 bg-white";
  const label = "block text-xs font-semibold text-slate-600 mb-1.5";
  const errorMsg = "text-xs text-rose-500 mt-1";

  /* Success state after API POST */
  if (submitSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] px-4">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Project Created
          </h3>
          <p className="text-sm text-slate-500">
            The project has been added and the list is updating…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                New Project
              </h2>
              <p className="text-xs text-slate-400">POST to MockAPI.io</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* API error banner */}
        {submitError && (
          <div className="mx-6 mt-4 flex items-start gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-rose-800">API Error</p>
              <p className="text-sm text-rose-600 mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="px-6 py-5 space-y-6">
            {/* ── Basic Info ── */}
            <fieldset>
              <legend className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Basic Information
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Project Name */}
                <div>
                  <label className={label}>Project Name *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.projectName}
                      onChange={(e) => set("projectName", e.target.value)}
                      disabled={submitting}
                      className={`${field} pl-10 ${
                        errors.projectName ? fieldError : fieldNormal
                      }`}
                      placeholder="e.g. Oakwood Residence"
                    />
                  </div>
                  {errors.projectName && (
                    <p className={errorMsg}>{errors.projectName}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className={label}>Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      disabled={submitting}
                      className={`${field} pl-10 ${
                        errors.location ? fieldError : fieldNormal
                      }`}
                      placeholder="e.g. Seattle, WA"
                    />
                  </div>
                  {errors.location && (
                    <p className={errorMsg}>{errors.location}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className={label}>Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      set("category", e.target.value as ProjectCategory)
                    }
                    disabled={submitting}
                    className={`${field} ${
                      errors.category ? fieldError : fieldNormal
                    }`}
                  >
                    <option value="" disabled>
                      Select category…
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className={errorMsg}>{errors.category}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className={label}>Status *</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      set("status", e.target.value as ProjectStatus)
                    }
                    disabled={submitting}
                    className={`${field} ${
                      errors.status ? fieldError : fieldNormal
                    }`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className={errorMsg}>{errors.status}</p>
                  )}
                </div>

                {/* Dates */}
                <div>
                  <label className={label}>Start Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => set("startDate", e.target.value)}
                      disabled={submitting}
                      className={`${field} pl-10 ${
                        errors.startDate ? fieldError : fieldNormal
                      }`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className={errorMsg}>{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className={label}>End Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => set("endDate", e.target.value)}
                      disabled={submitting}
                      className={`${field} pl-10 ${
                        errors.endDate ? fieldError : fieldNormal
                      }`}
                    />
                  </div>
                  {errors.endDate && (
                    <p className={errorMsg}>{errors.endDate}</p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* ── Financials ── */}
            <fieldset>
              <legend className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Financial Details
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Budget */}
                <div>
                  <label className={label}>Budget *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={form.budget}
                      onChange={(e) => set("budget", e.target.value)}
                      disabled={submitting}
                      className={`${field} pl-10 ${
                        errors.budget ? fieldError : fieldNormal
                      }`}
                      placeholder="e.g. 15000000"
                    />
                  </div>
                  {errors.budget && (
                    <p className={errorMsg}>{errors.budget}</p>
                  )}
                </div>

                {/* Income */}
                <div>
                  <label className={label}>Income (revenue to date)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={form.income}
                      onChange={(e) => set("income", e.target.value)}
                      disabled={submitting}
                      className={`${field} pl-10 ${
                        errors.income ? fieldError : fieldNormal
                      }`}
                      placeholder="e.g. 5000000"
                    />
                  </div>
                  {errors.income && (
                    <p className={errorMsg}>{errors.income}</p>
                  )}
                </div>

                {/* Expenses */}
                <div>
                  <label className={label}>Expenses (costs to date)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={form.expenses}
                      onChange={(e) => set("expenses", e.target.value)}
                      disabled={submitting}
                      className={`${field} pl-10 ${
                        errors.expenses ? fieldError : fieldNormal
                      }`}
                      placeholder="e.g. 3200000"
                    />
                  </div>
                  {errors.expenses && (
                    <p className={errorMsg}>{errors.expenses}</p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* ── Expense Breakdown ── */}
            <fieldset>
              <legend className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Expense Breakdown
                <span className="text-slate-400 font-normal ml-1">
                  (must sum to expenses)
                </span>
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {breakdown.map((item, i) => (
                  <div key={item.category} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-28 flex-shrink-0">
                      {item.category}
                    </span>
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={item.amount || ""}
                        onChange={(e) => setBreakdownAmount(i, e.target.value)}
                        disabled={submitting}
                        className={`w-full pl-8 pr-3 py-2 rounded-lg border text-sm outline-none transition-colors disabled:opacity-50 ${
                          errors.breakdown ? fieldError : fieldNormal
                        }`}
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {errors.breakdown && (
                <p className={errorMsg}>{errors.breakdown}</p>
              )}

              {/* Running breakdown total */}
              {(() => {
                const total = breakdown.reduce((s, b) => s + b.amount, 0);
                const expenses = Number(form.expenses) || 0;
                const diff = total - expenses;
                if (total === 0) return null;
                return (
                  <p
                    className={`text-xs mt-2 font-medium ${
                      diff === 0 ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    Breakdown total: ${total.toLocaleString()}
                    {expenses > 0 && diff !== 0 && (
                      <>
                        {" "}
                        · {diff > 0 ? "Over" : "Under"} by $
                        {Math.abs(diff).toLocaleString()}
                      </>
                    )}
                    {expenses > 0 && diff === 0 && " ✓"}
                  </p>
                );
              })()}
            </fieldset>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 px-6 py-4 border-t border-slate-100 bg-white rounded-b-2xl flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
