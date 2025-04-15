// import React from "react";
// import { render, screen, waitFor, fireEvent } from "@testing-library/react";
// import { describe, it, expect, beforeEach, vi } from 'vitest';
// import ReportedPosts from "./ReportedPostsAdmin";
// import { BASE_URL } from "../../constants";

// // Mock the fetch API
// global.fetch = vi.fn();

// // Mock the lucide-react icons
// vi.mock("lucide-react", () => ({
//   ChevronDown: () => <div data-testid="chevron-down" />,
//   ChevronUp: () => <div data-testid="chevron-up" />,
//   Filter: () => <div data-testid="filter" />,
//   Search: () => <div data-testid="search" />,
//   MoreVertical: () => <div data-testid="more-vertical" />,
//   CheckCircle: () => <div data-testid="check-circle" />,
//   XCircle: () => <div data-testid="x-circle" />,
//   AlertTriangle: () => <div data-testid="alert-triangle" />,
//   Clock: () => <div data-testid="clock" />,
// }));

// // Mock react-router-dom
// vi.mock("react-router-dom", () => ({
//   ...vi.importActual("react-router-dom"),
//   data: vi.fn(),
// }));

// describe("ReportedPosts Component", () => {
//   beforeEach(() => {
//     fetch.mockClear();
//   });

//   const mockApiResponse = {
//     status: "success",
//     data: [
//       {
//         report: {
//           _id: "1",
//           reportedId: "post123",
//           policy: "Hate speech",
//           userId: {
//             _id: "user789",
//             firstName: "Sarah",
//             lastName: "Smith",
//             profilePicture: "/api/placeholder/40/40",
//           },
//           createdAt: "2025-03-19T14:30:00Z",
//           status: "pending",
//         },
//         reportedUser: {
//           firstName: "John",
//           lastName: "Doe",
//           profilePicture: "/api/placeholder/40/40",
//         },
//       },
//     ],
//   };

//   it("renders loading state initially", () => {
//     render(<ReportedPosts />);
//     expect(screen.getByRole("status")).toHaveClass("animate-spin");
//   });

//   it("fetches and displays reported posts", async () => {
//     fetch.mockResolvedValueOnce({
//       ok: true,
//       json: () => Promise.resolve(mockApiResponse),
//     });

//     render(<ReportedPosts />);

//     await waitFor(() => {
//       expect(screen.getByText("John Doe")).toBeInTheDocument();
//       expect(screen.getByText("Sarah Smith")).toBeInTheDocument();
//       expect(screen.getByText("Hate speech")).toBeInTheDocument();
//       expect(screen.getByText("Pending")).toBeInTheDocument();
//     });

//     expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/admin/reports`, {
//       method: "GET",
//       credentials: "include",
//     });
//   });

//   it("displays error state when API call fails", async () => {
//     fetch.mockRejectedValueOnce(new Error("API request failed"));

//     render(<ReportedPosts />);

//     await waitFor(() => {
//       expect(screen.getByText("Error loading reports")).toBeInTheDocument();
//       expect(screen.getByText("API request failed")).toBeInTheDocument();
//       expect(screen.getByText("Try Again")).toBeInTheDocument();
//     });
//   });

//   it("filters posts by search term", async () => {
//     fetch.mockResolvedValueOnce({
//       ok: true,
//       json: () => Promise.resolve(mockApiResponse),
//     });

//     render(<ReportedPosts />);

//     await waitFor(() => {
//       expect(screen.getByText("John Doe")).toBeInTheDocument();
//     });

//     const searchInput = screen.getByPlaceholderText(
//       "Search reported content..."
//     );
//     fireEvent.change(searchInput, { target: { value: "John" } });

//     await waitFor(() => {
//       expect(screen.getByText("John Doe")).toBeInTheDocument();
//     });

//     fireEvent.change(searchInput, { target: { value: "Nonexistent" } });

//     await waitFor(() => {
//       expect(screen.getByText("No reported content found")).toBeInTheDocument();
//     });
//   });

//   it("filters posts by status", async () => {
//     fetch.mockResolvedValueOnce({
//       ok: true,
//       json: () => Promise.resolve(mockApiResponse),
//     });

//     render(<ReportedPosts />);

//     await waitFor(() => {
//       expect(screen.getByText("John Doe")).toBeInTheDocument();
//     });

//     const pendingButton = screen.getByRole("button", { name: "Pending" });
//     fireEvent.click(pendingButton);

//     await waitFor(() => {
//       expect(screen.getByText("John Doe")).toBeInTheDocument();
//     });

//     const actionedButton = screen.getByRole("button", { name: "Actioned" });
//     fireEvent.click(actionedButton);

//     await waitFor(() => {
//       expect(screen.getByText("No reported content found")).toBeInTheDocument();
//     });
//   });

//   it("updates post status when action buttons are clicked", async () => {
//     fetch
//       .mockResolvedValueOnce({
//         ok: true,
//         json: () => Promise.resolve(mockApiResponse),
//       })
//       .mockResolvedValueOnce({
//         ok: true,
//         json: () => Promise.resolve({ status: "success" }),
//       });

//     render(<ReportedPosts />);

//     await waitFor(() => {
//       expect(screen.getByText("John Doe")).toBeInTheDocument();
//     });

//     const takeActionButton = screen.getByRole("button", {
//       name: "Take Action",
//     });
//     fireEvent.click(takeActionButton);

//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/admin/reports/1`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           action: "approved",
//           reason: "Violation confirmed and action taken",
//         }),
//       });
//     });

//     expect(screen.getByText("Actioned")).toBeInTheDocument();
//   });

//   it("handles sort functionality", async () => {
//     fetch.mockResolvedValueOnce({
//       ok: true,
//       json: () =>
//         Promise.resolve({
//           status: "success",
//           data: [
//             ...mockApiResponse.data,
//             {
//               report: {
//                 _id: "2",
//                 reportedId: "post456",
//                 policy: "Spam",
//                 userId: {
//                   _id: "user222",
//                   firstName: "Michael",
//                   lastName: "Brown",
//                   profilePicture: "/api/placeholder/40/40",
//                 },
//                 createdAt: "2025-03-18T10:15:00Z",
//                 status: "pending",
//               },
//               reportedUser: {
//                 firstName: "Alex",
//                 lastName: "Johnson",
//                 profilePicture: "/api/placeholder/40/40",
//               },
//             },
//           ],
//         }),
//     });

//     render(<ReportedPosts />);

//     await waitFor(() => {
//       const posts = screen.getAllByRole("listitem");
//       expect(posts[0]).toHaveTextContent("John Doe");
//       expect(posts[1]).toHaveTextContent("Alex Johnson");
//     });
//   });
// });

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

  //   it.only('renders loading state initially', () => {
  //     fetch.mockImplementationOnce(() =>
  //       new Promise(() => {}) // Never resolves to keep loading
  //     )

  //     render(<ReportedPosts />)
  //     expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  //   })

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

  //   it.only('renders reported posts when data is loaded', async () => {
  //     fetch.mockResolvedValueOnce({
  //       ok: true,
  //       json: async () => mockData,
  //     })

  //     render(<ReportedPosts />)

  //     await waitFor(() => {
  //       expect(screen.getByText('Reported Content')).toBeInTheDocument()
  //       expect(screen.getByText('Post Author')).toBeInTheDocument()
  //       expect(screen.getByText('This is a test post content')).toBeInTheDocument()
  //       expect(screen.getByText('Reporter User')).toBeInTheDocument()
  //       expect(screen.getByText('I find this offensive')).toBeInTheDocument()
  //     })
  //   })

  //   it.only('filters posts by status', async () => {
  //     // First call returns mixed data
  //     fetch.mockResolvedValueOnce({
  //       ok: true,
  //       json: async () => ({
  //         status: 'success',
  //         data: [...mockData.data, ...mockActionedData.data],
  //       }),
  //     })

  //     render(<ReportedPosts />)

  //     await waitFor(() => {
  //       expect(screen.getAllByText(/Take Action/).length).toBe(2)
  //     })

  //     // Click on "Actioned" filter button
  //     fireEvent.click(screen.getByText('Actioned'))

  //     await waitFor(() => {
  //       expect(screen.getAllByText(/Take Action/).length).toBe(1)
  //       expect(screen.getByText('Another test post')).toBeInTheDocument()
  //     })
  //   })

  //   it.only('searches posts by content', async () => {
  //     fetch.mockResolvedValueOnce({
  //       ok: true,
  //       json: async () => ({
  //         status: 'success',
  //         data: [...mockData.data, ...mockActionedData.data],
  //       }),
  //     })

  //     render(<ReportedPosts />)

  //     await waitFor(() => {
  //       expect(screen.getByText('This is a test post content')).toBeInTheDocument()
  //       expect(screen.getByText('Another test post')).toBeInTheDocument()
  //     })

  //     // Type in search box
  //     const searchInput = screen.getByPlaceholderText('Search reported content...')
  //     fireEvent.change(searchInput, { target: { value: 'Another' } })

  //     await waitFor(() => {
  //       expect(screen.queryByText('This is a test post content')).not.toBeInTheDocument()
  //       expect(screen.getByText('Another test post')).toBeInTheDocument()
  //     })
  //   })

  //   it.only("updates post status when action buttons are clicked", async () => {
  //     fetch.mockResolvedValueOnce({
  //       ok: true,
  //       json: async () => mockData,
  //     });

  //     // Mock the PATCH response
  //     fetch.mockResolvedValueOnce({
  //       ok: true,
  //       json: async () => ({ status: "success" }),
  //     });

  //     render(<ReportedPosts />);

  //     await waitFor(() => {
  //       expect(
  //         screen.getByText("This is a test post content")
  //       ).toBeInTheDocument();
  //     });

  //     // Click "Take Action" button
  //     fireEvent.click(screen.getByText("Take Action"));

  //     await waitFor(() => {
  //       expect(fetch).toHaveBeenCalledWith(
  //         `${BASE_URL}/admin/reports/1`,
  //         expect.objectContaining({
  //           method: "PATCH",
  //           body: JSON.stringify({
  //             action: "approved",
  //             reason: "Violation confirmed and action taken",
  //           }),
  //         })
  //       );
  //     });
  //   });

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

//   it.only("handles API error when updating status", async () => {
//     fetch.mockResolvedValueOnce({
//       ok: true,
//       json: async () => mockData,
//     });

//     // Mock the PATCH response to fail
//     fetch.mockRejectedValueOnce(new Error("Update failed"));

//     render(<ReportedPosts />);

//     await waitFor(() => {
//       expect(
//         screen.getByText("This is a test post content")
//       ).toBeInTheDocument();
//     });

//     // Click "Dismiss" button
//     fireEvent.click(screen.getByText("Dismiss"));

//     await waitFor(() => {
//       // The error would show an alert, but we can't easily test that
//       // Instead we can verify the fetch was called
//       expect(fetch).toHaveBeenCalledWith(
//         `${BASE_URL}/admin/reports/1`,
//         expect.objectContaining({
//           method: "PATCH",
//           body: JSON.stringify({
//             action: "rejected",
//             reason: "Content reviewed and rejected",
//           }),
//         })
//       );
//     });
//   });
});
