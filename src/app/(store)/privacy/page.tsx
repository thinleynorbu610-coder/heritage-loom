import type { Metadata } from "next";
import { InfoPage, Prose } from "@/components/layout/InfoPage";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy" eyebrow="Legal" intro="How the Heritage Loom prototype handles information.">
      <Prose>
        <p>
          <strong>This prototype does not send your data anywhere.</strong> Your cart, wishlist, demo login and demo
          orders are stored only in your own browser (local storage) so the experience can be demonstrated. Clearing
          your browser data removes them.
        </p>
        <h2>When the platform launches</h2>
        <ul>
          <li>We will collect only what is needed to deliver orders: name, phone number and delivery address.</li>
          <li>Payment details will be handled by the external payment gateway, never stored by Heritage Loom.</li>
          <li>Artisans will see the delivery details needed to fulfil your order.</li>
        </ul>
      </Prose>
    </InfoPage>
  );
}
