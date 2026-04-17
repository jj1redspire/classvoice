import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Link href="/" className="text-sm text-orange-500 font-semibold hover:underline mb-8 inline-block">
          &larr; Back to ClassVoice
        </Link>

        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: April 17, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using ClassVoice (&ldquo;the Service&rdquo;), operated by Ashward Group LLC (&ldquo;Company,&rdquo;
              &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) at classvoice.co, you agree to be bound by these Terms of
              Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the Service. These Terms apply to all
              users, including daycare administrators and staff who access the Service on behalf of a licensed childcare facility.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Subscription and Billing</h2>
            <p>
              ClassVoice is offered on a per-classroom monthly subscription basis. By starting a paid subscription, you authorize
              Ashward Group LLC to charge your payment method on a monthly recurring basis at the then-current subscription rate.
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Auto-Renewal:</strong> Subscriptions automatically renew each month on the anniversary of your billing
                date unless you cancel before the renewal date.
              </li>
              <li>
                <strong>No Refunds:</strong> All subscription fees are non-refundable. We do not provide refunds or credits for
                partial months, unused periods, or unused features.
              </li>
              <li>
                <strong>Free Trial:</strong> New accounts receive a 14-day free trial. You will not be charged during the trial
                period. If you cancel before the trial ends, you will not be charged.
              </li>
              <li>
                <strong>Cancellation:</strong> You may cancel your subscription at any time through your account settings. Your
                access will continue through the end of the current billing period.
              </li>
              <li>
                <strong>Price Changes:</strong> We may change subscription pricing with 30 days&rsquo; notice. Continued use after
                the notice period constitutes acceptance of the new pricing.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Authorized Use — Licensed Childcare Facilities</h2>
            <p>
              ClassVoice is a business-to-business (B2B) tool designed exclusively for use by licensed daycare centers,
              preschools, and childcare administrators. You represent and warrant that:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>You are authorized to act on behalf of a licensed childcare facility</li>
              <li>Your facility complies with all applicable childcare licensing laws and regulations in your jurisdiction</li>
              <li>You have obtained any necessary parental consents required by your facility policies or applicable law before
                generating reports about individual children</li>
              <li>You will use the Service only for generating daily activity reports to be shared with parents or guardians
                of children enrolled in your facility</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. COPPA / FERPA Awareness</h2>
            <p>
              ClassVoice is a B2B tool used by licensed daycare administrators. We do not collect data directly from children.
              All data entered into the Service is provided by authorized facility staff on behalf of their organization.
            </p>
            <p className="mt-3">
              You, as the facility operator, are responsible for ensuring your use of ClassVoice complies with the Children&rsquo;s
              Online Privacy Protection Act (COPPA), the Family Educational Rights and Privacy Act (FERPA) where applicable, and
              any state-level children&rsquo;s privacy laws in your jurisdiction.
            </p>
            <p className="mt-3">
              Ashward Group LLC processes daily report data solely to provide the Service to you. We do not sell, share, or use
              children&rsquo;s activity data for advertising or any purpose beyond service delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Prohibited Uses</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to any part of the Service or its related systems</li>
              <li>Reverse engineer, decompile, or disassemble any portion of the Service</li>
              <li>Reproduce, duplicate, copy, sell, or resell any portion of the Service without express written permission</li>
              <li>Upload or transmit viruses, malware, or any other harmful code</li>
              <li>Use the Service to generate reports for children not enrolled at your facility</li>
              <li>Share parent portal access credentials with unauthorized parties</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. Intellectual Property</h2>
            <p>
              The Service, including its original content, features, and functionality, is and will remain the exclusive property
              of Ashward Group LLC. You retain ownership of content you create through the Service (including daily reports), but
              you grant Ashward Group LLC a limited license to store, process, and transmit that content solely to provide the
              Service to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">7. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY
              SECURE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">8. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ASHWARD GROUP LLC, ITS OFFICERS, DIRECTORS,
              EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE
              OF OR INABILITY TO USE THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p className="mt-3">
              OUR TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR THE SERVICE WILL
              NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO US IN THE THREE MONTHS PRECEDING THE CLAIM OR (B) ONE HUNDRED
              DOLLARS ($100).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Ashward Group LLC and its officers, directors, employees, and agents from
              and against any claims, liabilities, damages, losses, and expenses arising out of or in connection with your use of
              the Service, your violation of these Terms, or your facility&rsquo;s failure to obtain required parental consents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, with or
              without notice, including for violation of these Terms. Upon termination, your right to use the Service will
              immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Oregon, without regard to
              its conflict of law provisions. Any dispute arising from these Terms or your use of the Service shall be resolved
              exclusively in the state or federal courts located in Oregon, and you consent to personal jurisdiction in such courts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated
              Terms on this page with a revised effective date. Continued use of the Service after changes are posted constitutes
              your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">13. Contact</h2>
            <p>
              For questions about these Terms, contact us at:{" "}
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
