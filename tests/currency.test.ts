import assert from "node:assert/strict";
import { test } from "node:test";
import { formatCurrency } from "../src/lib/currency.js";

test("formatCurrency formats values as South African Rand", () => {
  assert.equal(formatCurrency(1234.5), "R\u00a01\u00a0234,50");
});

test("formatCurrency preserves negative values", () => {
  assert.equal(formatCurrency(-42), "-R\u00a042,00");
});
