import type { Metadata } from "next";
import { InfoPage, Prose } from "@/components/layout/InfoPage";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <InfoPage title="Terms of use" eyebrow="Legal" intro="Placeholder terms for the Heritage Loom student prototype.">
      <Prose>
        <p>
          <strong>Heritage Loom is a student project and prototype.</strong> No real purchases can be made, and no payments
          are processed. These terms are a placeholder to show where final, reviewed terms will live.
        </p>
        <h2>Marketplace role</h2>
        <p>Heritage Loom connects customers with independent artisans. Each artisan is responsible for the accuracy of their listings and the quality of their work.</p>
        <h2>Orders and delivery</h2>
        <ul>
          <li>Prices are shown in Bhutanese Ngultrum (Nu.) and include applicable taxes.</li>
          <li>Delivery estimates depend on the destination dzongkhag.</li>
          <li>Handmade items may vary slightly from photographs.</li>
        </ul>
        <h2>Returns</h2>
        <p>A clear returns policy will be agreed with artisans before launch and published here.</p>
      </Prose>
    </InfoPage>
  );
}
