import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CampaignList } from "./CampaignList";

// Mock useWallet
vi.mock("@/lib/WalletProvider", () => ({
  useWallet: () => ({
    address: "GA...",
    isConnected: true,
  }),
}));

// Mock @sentry/nextjs
vi.mock("@sentry/nextjs", () => ({
  setUser: vi.fn(),
  init: vi.fn(),
}));

// Mock @stellar/stellar-sdk to prevent RpcServer errors
vi.mock("@stellar/stellar-sdk", async (importActual) => {
  const actual = await importActual<typeof import("@stellar/stellar-sdk")>();
  return {
    ...actual,
    rpc: {
      ...actual.rpc,
      Server: vi.fn(() => ({})),
    },
  };
});

// Mock @/lib/soroban to provide necessary types and helpers
vi.mock("@/lib/soroban", () => ({
  fromStroops: (stroops: bigint | string | number): string => {
    return (BigInt(stroops) / 10_000_000n).toString();
  },
  toStroops: (amount: string | number): bigint => {
    return BigInt(amount) * 10_000_000n;
  },
}));

// Mock CampaignCard
vi.mock("./CampaignCard", () => ({
  CampaignCard: ({ campaign }: any) => <div data-testid="campaign-card">{campaign.title}</div>,
}));

// Mock the useRecentCampaigns hook
vi.mock("@/hooks/useSoroban", () => ({
  useRecentCampaigns: vi.fn(),
}));

import { useRecentCampaigns } from "@/hooks/useSoroban";

describe("CampaignList - Empty States", () => {
  it("displays 'No campaigns found' and 'Create campaign' button when no campaigns exist", () => {
    vi.mocked(useRecentCampaigns).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);

    render(<CampaignList />);

    expect(screen.getByText(/No campaigns found/i)).toBeInTheDocument();
    expect(screen.getByText(/Why not create the first one\?/i)).toBeInTheDocument();
    const createButton = screen.getByRole("link", { name: /Create campaign/i });
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveAttribute("href", "/create");
  });

  it("displays 'No results found' when search filters out all campaigns", async () => {
    vi.mocked(useRecentCampaigns).mockReturnValue({
      data: [
        {
          id: 1n,
          title: "Flood Relief",
          creator: "GA...",
          beneficiary: "GB...",
          raised_amount: 0n,
          target_amount: 100n,
          deadline: 123n,
          status: "Active",
        },
      ],
      isLoading: false,
      error: null,
    } as any);

    render(<CampaignList />);

    const searchInput = screen.getByPlaceholderText(/Search campaigns/i);
    fireEvent.change(searchInput, { target: { value: "Non-existent-campaign" } });

    // Wait for debounced search (300ms)
    await waitFor(() => {
      expect(screen.getByText(/No results found/i)).toBeInTheDocument();
    }, { timeout: 1000 });

    expect(screen.getByText(/Clear your search or create a new campaign/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear search/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Create campaign/i })).toBeInTheDocument();
  });

  it("clears search results when 'Clear search' button is clicked", async () => {
    vi.mocked(useRecentCampaigns).mockReturnValue({
      data: [
        {
          id: 1n,
          title: "Flood Relief",
          creator: "GA...",
          beneficiary: "GB...",
          raised_amount: 0n,
          target_amount: 100n,
          deadline: 123n,
          status: "Active",
        },
      ],
      isLoading: false,
      error: null,
    } as any);

    render(<CampaignList />);

    const searchInput = screen.getByPlaceholderText(/Search campaigns/i);
    fireEvent.change(searchInput, { target: { value: "Non-existent-campaign" } });

    await waitFor(() => {
      expect(screen.getByText(/No results found/i)).toBeInTheDocument();
    });

    const clearButton = screen.getByRole("button", { name: /Clear search/i });
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.queryByText(/No results found/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Flood Relief/i)).toBeInTheDocument();
    });
  });
});
