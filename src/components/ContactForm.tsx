"use client";

import { useState } from "react";

type ContactMessages = {
  fullName: string;
  fullNamePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  subject: string;
  subjectPlaceholder: string;
  subjectOptions: {
    general: string;
    reservation: string;
    technical: string;
    feedback: string;
    other: string;
  };
  message: string;
  messagePlaceholder: string;
  sendButton: string;
};

export default function ContactForm({ t }: { t: ContactMessages }) {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setSuccess(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, subject, message }),
      });

      type ContactResponse = {
        ok?: boolean;
        id?: number;
        warning?: string;
        error?: string;
      } | null;

      let data: ContactResponse = null;
      try {
        data = await res.json();
      } catch {
        // ignore parse errors; we'll fall back to status checks
      }

      // Treat any response with ok:true as a successful submission,
      // even if the HTTP status is not 2xx (e.g. email warning only).
      if (data && data.ok) {
        setSuccess("Message sent successfully.");
        event.currentTarget.reset();
        return;
      }

      if (!res.ok || (data && data.error)) {
        const serverError = data && typeof data.error === "string" ? data.error : null;
        setError(serverError || "Failed to send message. Please try again later.");
        return;
      }

      // Fallback: treat unknown but non-error responses as success
      setSuccess("Message sent successfully.");
      event.currentTarget.reset();
    } catch {
      setError("Message sent successfully.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-sm text-gray-600 mb-1">{t.fullName}</div>
          <input
            name="name"
            placeholder={t.fullNamePlaceholder}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">{t.email}</div>
          <input
            name="email"
            type="email"
            placeholder={t.emailPlaceholder}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </div>

      <div>
        <div className="text-sm text-gray-600 mb-1">{t.subject}</div>
        <select
          name="subject"
          defaultValue=""
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="" disabled className="text-gray-500">{t.subjectPlaceholder}</option>
          <option>{t.subjectOptions.general}</option>
          <option>{t.subjectOptions.reservation}</option>
          <option>{t.subjectOptions.technical}</option>
          <option>{t.subjectOptions.feedback}</option>
          <option>{t.subjectOptions.other}</option>
        </select>
      </div>

      <div>
        <div className="text-sm text-gray-600 mb-1">{t.message}</div>
        <textarea
          name="message"
          placeholder={t.messagePlaceholder}
          rows={5}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      {error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : success ? (
        <div className="text-sm text-green-600">{success}</div>
      ) : null}

      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Sending..." : t.sendButton}
        </button>
      </div>
    </form>
  );
}
