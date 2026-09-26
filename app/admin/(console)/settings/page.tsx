import { requireCapability } from "../../../../lib/guards";
import { getSiteConfig } from "../../../../lib/site-config";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  await requireCapability("settings.write");
  const site = await getSiteConfig();

  return (
    <section className="block wrap">
      <p className="kicker">Admin</p>
      <h1>Site settings</h1>
      <p>
        Contact details, social links and meeting information. Vision, mission and aims stay in the public site
        copy and are not edited here.
      </p>
      <SettingsForm site={site} />
    </section>
  );
}
