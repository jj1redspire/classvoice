import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Link href="/" className="text-sm text-orange-500 font-semibold hover:underline mb-8 inline-block">
          &larr; Back to ClassVoice
        </Link>

        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: April 17, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Overview</h2>
            <p>
              Ashward Group LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates ClassVoice at classvoice.co.
              This Privacy Policy explains how we collect, use, and protect information when you use our Service. By using
              ClassVoice, you agree to the practices described in this policy.
            </p>
            <p className="mt-3">
              ClassVoice is a B2B tool used by licensed daycare administrators. We do not collect data directly from children.
              All information in the Service is entered by authorized facility staff on behalf of their organization.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Information We Collect</h2>
            <p>We collect the following categories of information:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Account Information:</strong> Name, email address, and password when you create an account. Facility name
                and classroom information you provide during setup.
              </li>
              <li>
                <strong>Children&rsquo;s Daily Activity Data:</strong> Activity summaries, meal notes, nap times, mood
                observations, and other information about enrolled children that facility staff enter or dictate to generate
                daily reports. This data is entered by and on behalf of the licensed facility.
              </li>
              <li>
                <strong>Voice Recordings and Transcripts:</strong> Audio recordings captured by staff during report creation,
                and the text transcripts produced from those recordings. Raw audio is transmitted for transcription and is not
                stored permanently beyond the transcription process (see Section 4).
              </li>
              <li>
                <strong>Photos:</strong> Images attached to daily reports by facility staff.
              </li>
              <li>
                <strong>Parent Contact Information:</strong> Parent or guardian email addresses provided by facility staff
                for report delivery. We use this information only to send the daily reports you generate.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with the Service, including pages visited,
                features used, and timestamps, collected automatically via server logs.
              </li>
              <li>
                <strong>Payment Information:</strong> Billing details are handled directly by Stripe and are not stored on our
                servers. We receive only transaction confirmation and a payment method summary (e.g., last four digits).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>To provide, operate, and improve the Service</li>
              <li>To process voice input and generate formatted daily reports via AI (see Section 4)</li>
              <li>To deliver daily reports to parent email addresses provided by facility staff</li>
              <li>To maintain a report history accessible to authorized facility staff</li>
              <li>To process subscription payments through Stripe</li>
              <li>To send transactional emails related to your account</li>
              <li>To respond to support requests and communicate with you about the Service</li>
              <li>To detect and prevent fraud, abuse, or violations of our Terms of Service</li>
            </ul>
            <p className="mt-3">
              We do not sell, share, or use children&rsquo;s activity data for advertising, profiling, or any purpose beyond
              providing the Service to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. AI Processing and Voice Data</h2>
            <p>
              ClassVoice uses artificial intelligence to convert staff voice recordings into formatted daily reports. Specifically:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>OpenAI Whisper:</strong> Voice audio recorded by staff is sent to OpenAI&rsquo;s Whisper API for
                transcription into text. Audio is transmitted securely over encrypted connections.{" "}
                <strong>We do not store raw audio recordings beyond the transcription process.</strong> Once a transcript is
                returned, the audio is discarded and not retained on our servers or by our processors beyond what is required
                to complete the transcription.
              </li>
              <li>
                <strong>Anthropic Claude:</strong> Transcribed text is sent to Anthropic&rsquo;s Claude API to structure,
                format, and generate the final daily report. The report text is then stored in your account for delivery and
                record-keeping.
              </li>
            </ul>
            <p className="mt-3">
              Both OpenAI and Anthropic process data under their respective privacy policies and data processing agreements.
              We transmit only the minimum data necessary for AI processing. We do not use your data or children&rsquo;s
              activity information to train AI models.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Third-Party Services</h2>
            <p>We use the following third-party service providers to operate ClassVoice:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Supabase:</strong> Database storage and user authentication. Account information, classroom data, and
                generated reports are stored in Supabase-hosted PostgreSQL databases with row-level security.
              </li>
              <li>
                <strong>Stripe:</strong> Payment processing for subscriptions. We do not store your full payment card details.
              </li>
              <li>
                <strong>OpenAI:</strong> Voice transcription via the Whisper API. Subject to{" "}
                <a href="https://openai.com/policies/privacy-policy" className="text-orange-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  OpenAI&rsquo;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong>Anthropic:</strong> AI-powered report generation via the Claude API. Subject to{" "}
                <a href="https://www.anthropic.com/legal/privacy" className="text-orange-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  Anthropic&rsquo;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong>Resend:</strong> Transactional email delivery for account notifications and daily report distribution
                to parents.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. Children&rsquo;s Privacy (COPPA / FERPA)</h2>
            <p>
              ClassVoice is designed for use by licensed daycare professionals, not by children or parents directly. We do not
              knowingly collect personal information directly from children under 13.
            </p>
            <p className="mt-3">
              Daily activity data about enrolled children is entered by authorized facility staff on behalf of the facility.
              The facility operator is responsible for obtaining any required parental consent under applicable law, including
              COPPA and FERPA, before using ClassVoice to generate and distribute reports about individual children.
            </p>
            <p className="mt-3">
              We process children&rsquo;s activity data solely on behalf of the licensed facility to deliver the Service. We
              do not use this data for any secondary purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">7. Data Retention</h2>
            <p>
              We retain your account data and generated reports for as long as your account is active. If you cancel your
              subscription, your data remains accessible for 30 days, after which it may be permanently deleted. You may
              request deletion of your data at any time by contacting us.
            </p>
            <p className="mt-3">
              As noted in Section 4, raw audio recordings are not stored beyond the transcription process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">8. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including encrypted data transmission
              (TLS), database-level access controls, and row-level security policies that restrict data access to authorized
              account holders. No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">9. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Access the personal information we hold about you and your facility</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your report history in a portable format</li>
              <li>Opt out of non-essential communications</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:joel@ashwardgroup.com" className="text-orange-500 hover:underline">
                joel@ashwardgroup.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">10. Cookies</h2>
            <p>
              ClassVoice uses essential cookies and local storage to maintain your authenticated session. We do not use
              third-party advertising cookies or tracking pixels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated
              policy on this page with a revised effective date. Your continued use of the Service after changes are posted
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">12. Contact</h2>
            <p>
              For questions or concerns about this Privacy Policy, contact us at:{" "}
              <a href="mailto:joel@ashwardgroup.com" className="text-orange-500 hover:underline">
                joel@ashwardgroup.com
              </a>
            </p>
            <p className="mt-2">
              Ashward Group LLC<br />
              Oregon, United States
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
