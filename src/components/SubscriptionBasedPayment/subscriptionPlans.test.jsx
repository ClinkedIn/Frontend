import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SubscriptionPlans from "./subscriptionPlans";

// Mock fetch globally
// Ensure jsdom environment for DOM APIs
// If using Vitest, add this to your config or at the top of this file:
// import { beforeAll } from "vitest";
// beforeAll(() => { if (!globalThis.document) require("jsdom-global")(); });

beforeEach(() => {
    global.fetch = vi.fn(() =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    user: {
                        isPremium: false,
                        subscription: null,
                    },
                }),
        })
    );
    // Use a real localStorage mock for jsdom
    if (!global.localStorage) {
        let store = {};
        global.localStorage = {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => { store[key] = value.toString(); },
            removeItem: (key) => { delete store[key]; },
            clear: () => { store = {}; },
        };
    }
    localStorage.setItem("token", "test-token");
});

    

// Integration tests (real API)
describe("SubscriptionPlans (integration with real API)", () => {
    function shouldSkip() {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://your-api-url.com";
        const token = localStorage.getItem("token");
        return !baseUrl || !token || baseUrl.includes("your-api-url.com");
    }

    it("renders real subscription data from API", async () => {
        if (shouldSkip()) return;
        global.fetch = undefined;
        render(<SubscriptionPlans />);
        const plan = await screen.findByText(/plan/i, {}, { timeout: 5000 });
        expect(plan).toBeInTheDocument();
        expect(screen.getAllByText(/current plan/i).length).toBeGreaterThan(0);
    });

    it("shows error if API is unreachable", async () => {
        if (shouldSkip()) return;
        const oldBaseUrl = import.meta.env.VITE_API_BASE_URL;
        Object.defineProperty(import.meta.env, "VITE_API_BASE_URL", {
            value: "https://invalid-url-for-test.com",
            configurable: true,
            writable: true,
        });
        global.fetch = undefined;
        render(<SubscriptionPlans />);
        const error = await screen.findByText(/error loading subscription/i, {}, { timeout: 5000 });
        expect(error).toBeInTheDocument();
        Object.defineProperty(import.meta.env, "VITE_API_BASE_URL", {
            value: oldBaseUrl,
            configurable: true,
            writable: true,
        });
    });
});

// Mock localStorage for Vitest
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Pseudocode plan:
// 1. Remove fetch mocking for these tests to allow real network requests.
// 2. Add tests that:
//    a) Render the component and check for real API data (if available).
//    b) Optionally, skip tests if no API or token is set, to avoid failures in CI.
//    c) Check for correct rendering of plan info based on real API response.
//    d) Optionally, test subscribe/cancel flows if API allows (but avoid destructive actions).

describe("SubscriptionPlans (integration with real API)", () => {
  // Helper to skip tests if no API or token is set
  function shouldSkip() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://your-api-url.com";
    const token = localStorage.getItem("token");
    return !baseUrl || !token || baseUrl.includes("your-api-url.com");
  }

  it("renders real subscription data from API", async () => {
    if (shouldSkip()) return;
    // Remove fetch mock for this test
    global.fetch = undefined;
    render(<SubscriptionPlans />);
    // Wait for either plan to appear
    const plan = await screen.findByText(/plan/i, {}, {timeout: 5000});
    expect(plan).toBeInTheDocument();
    // Should show either Free or Premium plan as current
    expect(
      screen.getAllByText(/current plan/i).length
    ).toBeGreaterThan(0);
  });

  it("shows error if API is unreachable", async () => {
    if (shouldSkip()) return;
    // Temporarily set an invalid API URL
    const oldBaseUrl = import.meta.env.VITE_API_BASE_URL;
    Object.defineProperty(import.meta.env, "VITE_API_BASE_URL", {
      value: "https://invalid-url-for-test.com",
      configurable: true,
      writable: true,
    });
    global.fetch = undefined;
    render(<SubscriptionPlans />);
    const error = await screen.findByText(/error loading subscription/i, {}, {timeout: 5000});
    expect(error).toBeInTheDocument();
    // Restore
    Object.defineProperty(import.meta.env, "VITE_API_BASE_URL", {
      value: oldBaseUrl,
      configurable: true,
      writable: true,
    });
  });
});