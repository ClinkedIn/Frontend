import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import AdminDashboard from "./Analytics";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// Mock the recharts components to avoid errors in tests
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  PieChart: ({ children }) => <div>{children}</div>,
  Pie: ({ children }) => <div>{children}</div>,
  Cell: () => <div></div>,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: ({ children }) => <div>{children}</div>,
  XAxis: () => <div></div>,
  YAxis: () => <div></div>,
  CartesianGrid: () => <div></div>,
  Tooltip: () => <div></div>,
  Legend: () => <div></div>,
  LineChart: () => <div></div>,
  Line: () => <div></div>,
}));

// Mock the Lucide icons
vi.mock("lucide-react", () => ({
  Activity: () => <div>ActivityIcon</div>,
  Users: () => <div>UsersIcon</div>,
  UserPlus: () => <div>UserPlusIcon</div>,
  FileText: () => <div>FileTextIcon</div>,
  Briefcase: () => <div>BriefcaseIcon</div>,
  MessageSquare: () => <div>MessageSquareIcon</div>,
  UserCheck: () => <div>UserCheckIcon</div>,
  Clock: () => <div>ClockIcon</div>,
  Zap: () => <div>ZapIcon</div>,
  PieChartIcon: () => <div>PieChartIcon</div>,
  Building: () => <div>BuildingIcon</div>,
  BriefcaseIcon: () => <div>BriefcaseIcon</div>,
  Shield: () => <div>ShieldIcon</div>,
  Monitor: () => <div>MonitorIcon</div>,
  Sun: () => <div>SunIcon</div>,
  Moon: () => <div>MoonIcon</div>,
  Globe: () => <div>GlobeIcon</div>,
  Lock: () => <div>LockIcon</div>,
  BarChartIcon: () => <div>BarChartIcon</div>,
  GitBranch: () => <div>GitBranchIcon</div>,
}));

// Mock data for the API response
const mockAnalyticsData = {
  status: "success",
  data: {
    userStats: {
      totalUsers: 1250,
      activeUsers: 843,
      premiumUsers: 420,
      averageConnections: 24,
      employmentTypeCounts: [
        { _id: "Full-time", count: 750 },
        { _id: "Part-time", count: 300 },
        { _id: "Contract", count: 200 },
      ],
      usersByProfilePrivacy: [
        { _id: "public", count: 600 },
        { _id: "connectionsOnly", count: 500 },
        { _id: "private", count: 150 },
      ],
      usersByDefaultMode: [
        { _id: "dark", count: 800 },
        { _id: "light", count: 450 },
      ],
      usersByConnectionRequestPrivacy: [
        { _id: "everyone", count: 700 },
        { _id: "connectionsOnly", count: 550 },
      ],
    },
    postStats: {
      totalPosts: 5243,
      totalImpressions: 1250000,
      averageEngagement: {
        impressions: 238,
        comments: 12,
        reposts: 8,
      },
    },
    jobStats: {
      totalJobs: 876,
      averageApplications: 15,
      jobsByWorkplaceType: [
        { _id: "Remote", count: 500 },
        { _id: "Hybrid", count: 250 },
        { _id: "On-site", count: 126 },
      ],
      jobsByType: [
        { _id: "Full-time", count: 500 },
        { _id: "Part-time", count: 200 },
        { _id: "Contract", count: 100 },
        { _id: "Internship", count: 76 },
      ],
    },
    companyStats: {
      totalCompanies: 320,
      activeCompanies: 280,
      averageFollowers: 45,
      companiesBySize: [
        { _id: "1-10", count: 100 },
        { _id: "11-50", count: 120 },
        { _id: "51-200", count: 70 },
        { _id: "201-500", count: 20 },
        { _id: "501+", count: 10 },
      ],
      companiesByIndustry: [
        { _id: "Technology", count: 120 },
        { _id: "Finance", count: 80 },
        { _id: "Healthcare", count: 50 },
        { _id: "Education", count: 30 },
        { _id: "Retail", count: 20 },
        { _id: "Manufacturing", count: 20 },
      ],
    },
  },
};

// Setup mock server
const server = setupServer(
  http.get("http://localhost:3000/admin/analytics/overview", () => {
    return HttpResponse.json(mockAnalyticsData);
  })
);

describe("AdminDashboard", () => {
  beforeAll(() => {
    server.listen();
    // Mock timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
    vi.useRealTimers();
  });

  it("renders loading state initially", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Loading dashboard data...")).toBeInTheDocument();
  });

  it("displays error message when API fails", async () => {
    server.use(
      http.get("http://localhost:3000/admin/analytics/overview", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Error Loading Data")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    });
  });

  it("renders dashboard with data after successful API call", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Platform Analytics")).toBeInTheDocument();
      expect(screen.getByText("Key Metrics")).toBeInTheDocument();
      expect(screen.getByText("Total Users")).toBeInTheDocument();
      expect(screen.getByText("1,250")).toBeInTheDocument(); // Formatted number
      expect(screen.getByText("Active Users")).toBeInTheDocument();
      expect(screen.getByText("843")).toBeInTheDocument();
    });
  });

  it("displays all metric sections with correct data", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      // Key Metrics
      expect(screen.getByText("Total Users")).toBeInTheDocument();
      expect(screen.getByText("1,250")).toBeInTheDocument();
      expect(screen.getByText("Avg Connections")).toBeInTheDocument();
      expect(screen.getByText("24")).toBeInTheDocument();

      // Content & Engagement
      expect(screen.getByText("Total Posts")).toBeInTheDocument();
      expect(screen.getByText("5,243")).toBeInTheDocument();
      expect(screen.getByText("Total Impressions")).toBeInTheDocument();
      expect(screen.getByText("1,250,000")).toBeInTheDocument();

      // Company Metrics
      expect(screen.getByText("Total Companies")).toBeInTheDocument();
      expect(screen.getByText("320")).toBeInTheDocument();
      expect(screen.getByText("Active Companies")).toBeInTheDocument();
      expect(screen.getByText("280")).toBeInTheDocument();
    });
  });

  it("displays all chart sections", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText("User Subscription Distribution")
      ).toBeInTheDocument();
      expect(screen.getByText("UI Theme Preference")).toBeInTheDocument();
      expect(screen.getByText("Profile Privacy Settings")).toBeInTheDocument();
      expect(
        screen.getByText("Connection Request Privacy")
      ).toBeInTheDocument();
      expect(screen.getByText("Job Distribution")).toBeInTheDocument();
      expect(screen.getByText("Employment Types")).toBeInTheDocument();
      expect(screen.getByText("Company Size Distribution")).toBeInTheDocument();
      expect(screen.getByText("Top Industries")).toBeInTheDocument();
      expect(screen.getByText("Post Engagement Metrics")).toBeInTheDocument();
    });
  });

  it("updates data periodically", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("843")).toBeInTheDocument(); // Initial active users
    });

    // Advance timers by 5 seconds to trigger the update
    vi.advanceTimersByTime(5000);

    // The component adds a random number between -1 and 1 to activeUsers
    // We can't predict the exact value, but we can check if the value has changed
    await waitFor(() => {
      const activeUsersText = screen.getByText("843").textContent;
      expect(activeUsersText).not.toBe("843");
    });
  });

  it("refreshes data every 5 minutes", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    // Advance timers by 5 minutes
    vi.advanceTimersByTime(5 * 60 * 1000);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
  });

  it("highlights important metrics", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      const activeUsersCard = screen.getByText("Active Users").closest("div");
      expect(activeUsersCard).toHaveClass("border-l-4 border-blue-500");

      const totalImpressionsCard = screen
        .getByText("Total Impressions")
        .closest("div");
      expect(totalImpressionsCard).toHaveClass("border-l-4 border-blue-500");

      const activeCompaniesCard = screen
        .getByText("Active Companies")
        .closest("div");
      expect(activeCompaniesCard).toHaveClass("border-l-4 border-blue-500");
    });
  });
});
