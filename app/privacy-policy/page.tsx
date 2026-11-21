import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How this website handles your data and the images you edit, including the browser-only processing used by the core tools.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="How this website handles your data and the images you edit."
      lastUpdated="[DATE — SET AT PUBLICATION]"
    >
      <section className="space-y-3">
        <h2>1. Who we are</h2>
        <p>
          This website is operated by{" "}
          <strong>[SITE OPERATOR / LEGAL ENTITY PLACEHOLDER]</strong>{" "}
          (&quot;we&quot;, &quot;us&quot; or &quot;our&quot;). This Privacy
          Policy explains what information is processed when you use the
          website and its image tools, and the choices available to you.
        </p>
        <p>
          Before publication, replace every bracketed placeholder in this
          document with the operator&apos;s real details and confirm the
          statements below against the final hosting and analytics setup.
        </p>
      </section>

      <section className="space-y-3">
        <h2>2. Images and files you select</h2>
        <p>
          The core image tools on this website process files locally in your
          browser using HTML Canvas. When you use those tools, your image is
          not uploaded to our servers, and we do not receive, access or store
          the image or the edited result.
        </p>
        <p>
          Because processing happens on your device, the image remains in your
          browser&apos;s memory until you close or reload the page, or until
          you remove it. Downloading a result saves it to your device using
          your browser&apos;s normal download behaviour.
        </p>
        <p>
          If a future feature requires server-side processing, it will be
          clearly labelled before you use it, and this Privacy Policy will be
          updated.
        </p>
        <p>
          The current version of the website does not require an account and
          does not ask you to provide your name, email address or other
          personal details in order to use the tools.
        </p>
      </section>

      <section className="space-y-3">
        <h2>3. Technical information</h2>
        <p>
          Like most websites, the hosting and content-delivery providers that
          serve this site may automatically process limited technical
          information. This can include your IP address, browser type and
          version, operating system, the pages you request, the date and time
          of a request, a referring page, and diagnostic or error logs.
        </p>
        <p>
          This information is used to deliver the website, protect it against
          abuse and attacks, diagnose faults, and understand aggregate usage.
          We do not use it to identify individual visitors.
        </p>
        <p>
          Retention periods for server and diagnostic logs are set by the
          hosting provider. The current provider and retention period are{" "}
          <strong>[HOSTING PROVIDER AND RETENTION PLACEHOLDER]</strong>.
        </p>
      </section>

      <section className="space-y-3">
        <h2>4. Cookies and similar technologies</h2>
        <p>
          The current version of the website does not use advertising cookies
          or third-party analytics cookies. The hosting or content-delivery
          provider may use strictly necessary cookies or similar technology
          for security, load balancing and performance.
        </p>
        <p>
          The image tools do not store your images in cookies or persistent
          browser storage. If analytics, advertising or other optional
          technologies are added later, this section and any required consent
          mechanism will be updated before they are used.
        </p>
      </section>

      <section className="space-y-3">
        <h2>5. Information you send to us</h2>
        <p>
          If you contact us by email or through a contact form, we receive the
          information you choose to include, such as your name, email address,
          message and any attachments. We use that information to respond to
          your enquiry, provide support and keep a record of the request.
        </p>
        <p>
          Please do not send sensitive personal information or confidential
          images unless it is necessary for your request. Contact details are
          shown on the <Link href="/contact">Contact page</Link>.
        </p>
      </section>

      <section className="space-y-3">
        <h2>6. How we use information and our legal bases</h2>
        <p>We process information only where we have a valid reason to do so, including:</p>
        <ul>
          <li>
            to operate, secure and improve the website (our legitimate
            interests, where recognised by law);
          </li>
          <li>
            to respond to enquiries and provide support (performance of a
            request you made, or our legitimate interests);
          </li>
          <li>
            to comply with legal obligations; and
          </li>
          <li>
            where you have given consent, for example if optional analytics or
            marketing technologies are introduced.
          </li>
        </ul>
        <p>
          The applicable legal bases depend on your jurisdiction. This draft
          assumes <strong>[JURISDICTION PLACEHOLDER]</strong> and should be
          reviewed against local law before publication.
        </p>
      </section>

      <section className="space-y-3">
        <h2>7. Sharing information</h2>
        <p>
          We do not sell personal information. We may share limited information
          with:
        </p>
        <ul>
          <li>
            hosting, content-delivery and security providers that help us run
            the website;
          </li>
          <li>
            professional advisers, such as lawyers or accountants, where
            necessary;
          </li>
          <li>
            authorities or other parties where required by law or necessary to
            protect rights, safety or the integrity of the service; and
          </li>
          <li>
            a successor organisation in connection with a merger, acquisition
            or transfer of the service.
          </li>
        </ul>
        <p>
          Provider names, locations and data-processing terms are{" "}
          <strong>[PROCESSOR DETAILS PLACEHOLDER]</strong>.
        </p>
      </section>

      <section className="space-y-3">
        <h2>8. International transfers</h2>
        <p>
          Some service providers may process information in countries other
          than your own. Where required, we will use appropriate safeguards for
          those transfers. The relevant countries and safeguards are{" "}
          <strong>[TRANSFER DETAILS PLACEHOLDER]</strong>.
        </p>
      </section>

      <section className="space-y-3">
        <h2>9. Retention</h2>
        <p>
          We keep information only for as long as necessary for the purposes
          described in this policy, including security, record-keeping and
          legal requirements. Specific retention periods are{" "}
          <strong>[RETENTION PERIODS PLACEHOLDER]</strong>. Images processed
          locally are not retained by us at all.
        </p>
      </section>

      <section className="space-y-3">
        <h2>10. Security</h2>
        <p>
          We take reasonable technical and organisational measures to protect
          the website and any information we hold. Local processing reduces the
          amount of data that travels over the internet, but no website or
          method of transmission is completely secure. We cannot guarantee
          absolute security.
        </p>
      </section>

      <section className="space-y-3">
        <h2>11. Your rights</h2>
        <p>
          Depending on your location, you may have the right to access,
          correct, delete, restrict or object to the processing of your
          personal information, to request a portable copy, or to withdraw
          consent. You may also have the right to complain to a data-protection
          authority.
        </p>
        <p>
          To exercise these rights, contact{" "}
          <strong>[PRIVACY EMAIL PLACEHOLDER]</strong>. We may need to verify
          your identity before responding. The supervisory authority for this
          service is <strong>[SUPERVISORY AUTHORITY PLACEHOLDER]</strong>.
        </p>
      </section>

      <section className="space-y-3">
        <h2>12. Children</h2>
        <p>
          The website is not directed to children under{" "}
          <strong>[MINIMUM AGE PLACEHOLDER]</strong>, and we do not knowingly
          collect personal information from children. If you believe a child
          has provided personal information to us, please contact us so we can
          address it.
        </p>
      </section>

      <section className="space-y-3">
        <h2>13. Third-party links</h2>
        <p>
          The website may link to third-party sites or services. We are not
          responsible for their content or privacy practices. Review their
          policies before providing information to them.
        </p>
      </section>

      <section className="space-y-3">
        <h2>14. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes to the website,
          our practices or the law. The updated version will be posted on this
          page with a new review date. Material changes should be highlighted
          where appropriate.
        </p>
      </section>

      <section className="space-y-3">
        <h2>15. Contact</h2>
        <p>
          Questions or requests about this policy can be sent to{" "}
          <strong>[PRIVACY EMAIL PLACEHOLDER]</strong> or{" "}
          <strong>[POSTAL ADDRESS PLACEHOLDER]</strong>. The data controller is{" "}
          <strong>[DATA CONTROLLER / LEGAL ENTITY PLACEHOLDER]</strong>.
        </p>
      </section>
    </LegalPage>
  );
}
