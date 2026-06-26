import fs from "fs";

const path = "src/app/admin/actions.ts";
const content = fs.readFileSync(path, "utf8");
const lines = content.split("\n");
const headerEnd = lines.findIndex((l) => l.startsWith("export async function approveTopUp"));
const walletEnd = lines.findIndex((l) => l.startsWith("export async function toggleVerified"));
const agencyStart = lines.findIndex((l) => l === "export async function adjustAgencyWallet(");
const agencyEnd = lines.findIndex((l) =>
  l.startsWith("export async function grantIntelligenceSubscription")
);

const imports = lines.slice(0, headerEnd).join("\n");
const walletBody = lines.slice(headerEnd, walletEnd).join("\n");
const agencyBody = lines.slice(agencyStart, agencyEnd).join("\n");
fs.writeFileSync("src/app/admin/wallet.actions.ts", `${imports}\n${walletBody}\n${agencyBody}\n`);

const reexport = `export {
  approveTopUp,
  rejectTopUp,
  adjustWallet,
  setSparkTreasuryBalance,
  resetAllCreatorWalletBalances,
  adjustAgencyWallet,
  approveAgencyTopUp,
  rejectAgencyTopUp,
} from "./wallet.actions";

`;
const newContent =
  lines.slice(0, headerEnd).join("\n") +
  "\n" +
  reexport +
  lines.slice(walletEnd, agencyStart).join("\n") +
  "\n" +
  lines.slice(agencyEnd).join("\n");
fs.writeFileSync(path, newContent);
console.log("admin wallet split ok");
