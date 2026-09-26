import { prisma } from "../../lib/prisma";
import PageHeader from "../../components/PageHeader";
import RegisterForm from "./RegisterForm";

export default async function JoinPage() {
  const villages = await prisma.village.findMany({ orderBy: { name: "asc" } });

  return (
    <section className="block wrap">
      <PageHeader
        kicker="Join AYF"
        title="Member registration"
        lede="Membership is open to eligible Awka youths resident in Lagos State, subject to the AYF Constitution. An administrator reviews every application before it's approved."
      />
      <RegisterForm villages={villages} />
    </section>
  );
}
