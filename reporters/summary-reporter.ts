import fs from "node:fs";
import path from "node:path";
import type {
  FullResult,
  Reporter,
  Suite,
  TestCase,
} from "@playwright/test/reporter";

const icons = {
  expected: "✅",
  unexpected: "❌",
  flaky: "⚠️",
  skipped: "⏭️",
};

const stripAnsi = (text: string) => text.replace(/\u001b\[[0-9;]*m/g, "");

export default class SummaryReporter implements Reporter {
  private tests: TestCase[] = [];

  onBegin(_config: unknown, suite: Suite) {
    this.tests = suite.allTests();
  }

  onEnd(result: FullResult) {
    const summaryFile = process.env.GITHUB_STEP_SUMMARY;
    if (!summaryFile) return;

    const byFile = new Map<string, TestCase[]>();
    for (const test of this.tests) {
      const file = path.relative(process.cwd(), test.location.file);
      byFile.set(file, [...(byFile.get(file) ?? []), test]);
    }

    const failed = this.tests.filter((t) => t.outcome() === "unexpected");
    const lines = [
      "## Playwright results",
      "",
      `${failed.length === 0 ? "✅" : "❌"} **${this.tests.length - failed.length} of ${this.tests.length} passed** (${result.status})`,
      "",
    ];

    for (const [file, tests] of byFile) {
      lines.push(`### ${file}`, "", "| | Test |", "|---|---|");
      for (const test of tests) {
        const name = test.titlePath().slice(3).join(" › ");
        lines.push(`| ${icons[test.outcome()]} | ${name} |`);
      }
      lines.push("");
    }

    if (failed.length > 0) {
      lines.push("## Failures", "");
      for (const test of failed) {
        const name = test.titlePath().slice(2).join(" › ");
        const message = test.results.at(-1)?.error?.message ?? "";
        lines.push(
          `**${name}**`,
          "",
          "```",
          stripAnsi(message).split("\n").slice(0, 15).join("\n"),
          "```",
          "",
        );
      }
    }

    fs.appendFileSync(summaryFile, lines.join("\n") + "\n");
  }
}
