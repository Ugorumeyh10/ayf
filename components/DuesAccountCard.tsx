import CopyAccount from "./CopyAccount";

export default function DuesAccountCard({
  bankName,
  accountName,
  accountNumber,
}: {
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
}) {
  if (!accountNumber) return null;
  return (
    <CopyAccount accountNumber={accountNumber} bankName={bankName} accountName={accountName} />
  );
}
