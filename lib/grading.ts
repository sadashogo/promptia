import type { FreeWriteCheck } from "./types";

export interface CheckResult {
  id: string;
  label: string;
  passed: boolean;
}

export function gradeFreeWrite(
  text: string,
  checks: FreeWriteCheck[],
): CheckResult[] {
  return checks.map((c) => {
    let passed = false;
    try {
      const re = new RegExp(c.pattern, c.flags ?? "");
      passed = re.test(text);
    } catch {
      passed = false;
    }
    return { id: c.id, label: c.label, passed };
  });
}
