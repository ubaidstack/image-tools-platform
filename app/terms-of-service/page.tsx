import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "The terms that apply when you use this website's free browser-based image tools.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      description="The terms that apply when you use this website and its image tools."
      lastUpdated="[DATE — SET AT PUBLICATION]"
    >
      <section className="space-y-3">
        <h2>1. About these terms</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of this
          website and its image tools (the &quot;Service&quot;). The Service is
          operated by <strong>[SITE OPERATOR / LEGAL ENTITY PLACEHOLDER]</strong>{" "}
          (&quot;we&quot;, &quot;us&quot; or &quot;our&quot;).
        </p>
        <p>
          Before publication, replace every bracketed placeholder and have this
          draft reviewed by qualified legal counsel. This draft is not legal
          advice.
        </p>
      </section>

      <section className="space-y-3">
        <h2>2. Acceptance of these terms</h2>
        <p>
          By accessing or using the Service, you agree to these Terms. If you do
          not agree, do not use the Service. If you use the Service on behalf of
          an organisation, you confirm that you have authority to accept these
          Terms on its behalf.
        </p>
      </section>

      <section className="space-y-3">
        <h2>3. The service</h2>
        <p>
          The Service provides free, browser-based tools for compressing,
          resizing, cropping, rotating and converting images. The core tools
          process images locally in your browser and do not require an account.
        </p>
        <p>
          We may add, change, suspend or discontinue features at any time. We do
          not guarantee that any particular tool, format or browser will remain
          available. The Service is provided free of charge, and we do not
          guarantee uninterrupted or error-free operation.
        </p>
      </section>

      <section className="space-y-3">
        <h2>4. Eligibility</h2>
        <p>
          You must be at least <strong>[MINIMUM AGE PLACEHOLDER]</strong> years
          old, or have the consent of a parent or guardian, to use the Service.
          You must use the Service in compliance with applicable law.
        </p>
      </section>

      <section className="space-y-3">
        <h2>5. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            use the Service for unlawful, infringing, fraudulent, harassing or
            harmful purposes;
          </li>
          <li>
            process images that you do not have the right to use, or that
            violate another person&apos;s privacy, intellectual-property or
            other rights;
          </li>
          <li>
            attempt to disrupt, overload, probe or gain unauthorised access to
            the Service or its infrastructure;
          </li>
          <li>
            use automated means to access the Service in a way that imposes an
            unreasonable load or bypasses technical protections; or
          </li>
          <li>
            remove or alter notices, attribution or legal terms displayed on
            the Service.
          </li>
        </ul>
        <p>
          We may suspend or restrict access where we reasonably believe these
          rules have been broken or the Service is being abused.
        </p>
      </section>

      <section className="space-y-3">
        <h2>6. Your content</h2>
        <p>
          You retain ownership of the images you select and the results you
          create. Because the core tools process files locally in your browser,
          we do not receive or store your images and do not claim any ownership
          or licence over them.
        </p>
        <p>
          You are responsible for ensuring that you have all necessary rights
          and permissions to use, edit and share the images you process. You
          must not use the Service in a way that infringes the rights of others.
        </p>
      </section>

      <section className="space-y-3">
        <h2>7. Our intellectual property</h2>
        <p>
          The Service, including its design, text, graphics, branding and code,
          is owned by us or our licensors and is protected by applicable
          intellectual-property laws. Subject to these Terms, we grant you a
          limited, non-exclusive, non-transferable licence to use the Service
          for its intended purpose.
        </p>
        <p>
          You may not copy, modify, distribute, sell, sublicense or create
          derivative works from the Service except as permitted by law or with
          our prior written permission.
        </p>
      </section>

      <section className="space-y-3">
        <h2>8. Third-party services and links</h2>
        <p>
          The Service may link to third-party websites or rely on third-party
          hosting and infrastructure. We do not control and are not responsible
          for third-party content, terms or privacy practices. Your use of a
          third-party service is governed by that provider&apos;s terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2>9. Disclaimer of warranties</h2>
        <p>
          To the maximum extent permitted by law, the Service is provided
          &quot;as is&quot; and &quot;as available&quot;, without warranties of
          any kind, whether express, implied or statutory, including warranties
          of merchantability, fitness for a particular purpose, title,
          non-infringement, accuracy or uninterrupted availability.
        </p>
        <p>
          You are responsible for reviewing processed images before using or
          sharing them. We do not warrant that a tool will produce a particular
          file size, quality or result.
        </p>
      </section>

      <section className="space-y-3">
        <h2>10. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, we will not be liable for any
          indirect, incidental, special, consequential or punitive damages, or
          for any loss of data, profits, revenue, goodwill or business
          opportunity, arising out of or in connection with the Service.
        </p>
        <p>
          To the maximum extent permitted by law, our total aggregate liability
          for all claims relating to the Service will not exceed{" "}
          <strong>[LIABILITY CAP PLACEHOLDER]</strong>. Some jurisdictions do
          not allow certain exclusions or limitations, so parts of this section
          may not apply to you.
        </p>
      </section>

      <section className="space-y-3">
        <h2>11. Indemnity</h2>
        <p>
          To the extent permitted by law, you agree to indemnify and hold us
          harmless from claims, losses and expenses arising from your misuse of
          the Service, your content, or your breach of these Terms. This section
          is <strong>[CONFIRM WITH COUNSEL PLACEHOLDER]</strong> and may be
          removed if it is not appropriate for the final service.
        </p>
      </section>

      <section className="space-y-3">
        <h2>12. Changes to the service and terms</h2>
        <p>
          We may update these Terms from time to time. The updated version will
          be posted on this page with a new review date. Continued use of the
          Service after an update means you accept the revised Terms, to the
          extent permitted by law.
        </p>
      </section>

      <section className="space-y-3">
        <h2>13. Governing law and disputes</h2>
        <p>
          These Terms are governed by the laws of{" "}
          <strong>[JURISDICTION PLACEHOLDER]</strong>, without regard to
          conflict-of-law rules. Disputes will be subject to the courts of{" "}
          <strong>[COURT / VENUE PLACEHOLDER]</strong>, unless mandatory law
          gives you the right to bring a claim elsewhere.
        </p>
      </section>

      <section className="space-y-3">
        <h2>14. Contact</h2>
        <p>
          Questions about these Terms can be sent to{" "}
          <strong>[LEGAL EMAIL PLACEHOLDER]</strong> or{" "}
          <strong>[POSTAL ADDRESS PLACEHOLDER]</strong>.
        </p>
      </section>
    </LegalPage>
  );
}
