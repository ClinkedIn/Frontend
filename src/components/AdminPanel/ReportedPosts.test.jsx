import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReportedPosts from "./ReportedPostsAdmin";
import { BASE_URL } from "../../constants";

// Mock the Lucide icons
vi.mock("lucide-react", () => ({
  ChevronDown: () => <div>ChevronDown</div>,
  ChevronUp: () => <div>ChevronUp</div>,
  Filter: () => <div>Filter</div>,
  Search: () => <div>Search</div>,
  MoreVertical: () => <div>MoreVertical</div>,
  CheckCircle: () => <div>CheckCircle</div>,
  XCircle: () => <div>XCircle</div>,
  AlertTriangle: () => <div>AlertTriangle</div>,
  Clock: () => <div>Clock</div>,
}));

// Mock the fetch API
global.fetch = vi.fn();

describe("ReportedPosts Component", () => {
  const mockData = {
    status: "success",
    data: [
      {
        report: {
          _id: "1",
          reportedId: "post1",
          policy: "This is a test post content",
          userId: {
            _id: "user2",
            firstName: "Reporter",
            lastName: "User",
            profilePicture: "/reporter.jpg",
          },
          reportedType: "post",
          createdAt: "2023-01-01T00:00:00Z",
          status: "pending",
          moderatedAt: null,
          dontWantToSee: "I find this offensive",
        },
        reportedUser: null,
        reportedPost: {
          userId: {
            firstName: "Post",
            lastName: "Author",
            profilePicture: "/author.jpg",
          },
        },
      },
    ],
  };

  const mockActionedData = {
    status: "success",
    data: [
      {
        report: {
          _id: "2",
          reportedId: "post2",
          policy: "Another test post",
          userId: {
            _id: "user3",
            firstName: "Another",
            lastName: "Reporter",
            profilePicture: "/reporter2.jpg",
          },
          reportedType: "comment",
          createdAt: "2023-01-02T00:00:00Z",
          status: "approved",
          moderatedAt: "2023-01-02T01:00:00Z",
          moderationReason: "Violation confirmed",
        },
        reportedUser: {
          firstName: "Comment",
          lastName: "Author",
          profilePicture: "/comment-author.jpg",
        },
        reportedPost: null,
      },
    ],
  };

  beforeEach(() => {
    fetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  

  it("renders error state when API fails", async () => {
    fetch.mockRejectedValueOnce(new Error("API Error"));

    render(<ReportedPosts />);

    await waitFor(() => {
      expect(screen.getByText("Error loading reports")).toBeInTheDocument();
      expect(screen.getByText("API Error")).toBeInTheDocument();
      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });
  });

  it("renders empty state when no reports are found", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "success", data: [] }),
    });

    render(<ReportedPosts />);

    await waitFor(() => {
      expect(screen.getByText("No reported content found")).toBeInTheDocument();
    });
  });



  it("shows correct status badges", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "success",
        data: [...mockData.data, ...mockActionedData.data],
      }),
    });

    render(<ReportedPosts />);

    await waitFor(() => {
      expect(screen.getByText("Pending")).toBeInTheDocument();
      expect(screen.getByText("Actioned")).toBeInTheDocument();
    });
  });

  it("formats dates correctly", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<ReportedPosts />);

    await waitFor(() => {
      // The exact format might vary based on locale, so we check for parts we know should be there
      expect(screen.getByText(/Jan/)).toBeInTheDocument();
      expect(screen.getByText(/2023/)).toBeInTheDocument();
    });
  });

});
