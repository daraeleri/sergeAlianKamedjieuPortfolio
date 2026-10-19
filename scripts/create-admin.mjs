// Creates the dashboard admin account, or resets its password if the email exists.
//
//   pnpm admin:create
//
// Asks for name, email and password in the terminal. The password is hashed with
// scrypt in the same format as src/lib/auth/password.ts and never stored as text.
import { randomBytes, randomUUID, scrypt } from "node:crypto";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const COST = { N: 16384, r: 8, p: 1 };

function hashPassword(password) {
  const salt = randomBytes(16);
  return new Promise((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, 64, COST, (error, key) =>
      error
        ? reject(error)
        : resolve(
            [
              "scrypt",
              COST.N,
              COST.r,
              COST.p,
              salt.toString("base64"),
              key.toString("base64"),
            ].join("$"),
          ),
    ),
  );
}

/** Reads a line without echoing it. */
async function askHidden(question) {
  stdout.write(question);
  stdin.setRawMode?.(true);
  stdin.resume();
  stdin.setEncoding("utf8");
  let value = "";
  return new Promise((resolve) => {
    const onData = (char) => {
      if (char === "\r" || char === "\n" || char === "\u0004") {
        stdin.setRawMode?.(false);
        stdin.pause();
        stdin.off("data", onData);
        stdout.write("\n");
        resolve(value);
      } else if (char === "\u0003") {
        process.exit(1);
      } else if (char === "\u007f" || char === "\b") {
        value = value.slice(0, -1);
      } else {
        value += char;
      }
    };
    stdin.on("data", onData);
  });
}

const rl = createInterface({ input: stdin, output: stdout });
const name = (await rl.question("Name (shown in the dashboard): ")).trim() || "Admin";
const email = (await rl.question("Email: ")).trim().toLowerCase();
rl.close();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("That email doesn't look right.");
  process.exit(1);
}
const password = await askHidden("Password (at least 10 characters): ");
if (password.length < 10) {
  console.error("Use at least 10 characters.");
  process.exit(1);
}
if ((await askHidden("Repeat password: ")) !== password) {
  console.error("The passwords don't match.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: (process.env.DIRECT_URL ?? process.env.DATABASE_URL)?.replace(
    /sslmode=(prefer|require|verify-ca)\b/,
    "sslmode=verify-full",
  ),
});
await client.connect();
const passwordHash = await hashPassword(password);
const { rows } = await client.query(
  `INSERT INTO "User" (id, email, name, "passwordHash") VALUES ($1, $2, $3, $4)
   ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, "passwordHash" = EXCLUDED."passwordHash"
   RETURNING (xmax = 0) AS created`,
  [randomUUID(), email, name, passwordHash],
);
// A new password signs out every existing session of this account.
await client.query(
  `DELETE FROM "Session" WHERE "userId" = (SELECT id FROM "User" WHERE email = $1)`,
  [email],
);
await client.end();
console.log(rows[0].created ? `Admin ${email} created.` : `Password for ${email} updated.`);
