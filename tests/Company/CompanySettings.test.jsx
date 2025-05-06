import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import CompanySettingPage from "./CompanySettingPage";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";

// Mock modules
vi.mock("axios");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useOutletContext: () => ({
      companyInfo: { id: "company123", name: "TestCompany" },
    }),
  };
});
vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderComponent = () =>
  render(
    <BrowserRouter>
      <Toaster />
      <CompanySettingPage />
    </BrowserRouter>
  );

describe("CompanySettingPage (Vitest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders and fetches admins", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        admins: [
          { id: "admin1", firstName: "John", lastName: "Doe", email: "john@example.com", role: "admin" },
        ],
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    });
  });

  test("searches and displays users", async () => {
    axios.get.mockResolvedValueOnce({ data: { admins: [] } });
    axios.get.mockResolvedValueOnce({
      data: {
        users: [
          { _id: "u1", firstName: "Alice", lastName: "Smith", email: "alice@example.com", status: "active" },
        ],
      },
    });

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/Search for a user/i), {
      target: { value: "alice" },
    });

    await waitFor(() => {
      expect(screen.getByText(/Alice Smith/)).toBeInTheDocument();
    });
  });

  test("adds an admin", async () => {
    const user = {
      _id: "u1",
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      status: "active",
    };

    axios.get
      .mockResolvedValueOnce({ data: { admins: [] } }) // initial
      .mockResolvedValueOnce({ data: { users: [user] } }) // search
      .mockResolvedValueOnce({ data: { admins: [user] } }); // after add
    axios.post.mockResolvedValueOnce({});

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/Search for a user/i), {
      target: { value: "alice" },
    });

    await waitFor(() => screen.getByText(/Add as Admin/i));
    fireEvent.click(screen.getByText(/Add as Admin/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  test("removes an admin", async () => {
    const admin = {
      id: "admin1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "admin",
    };

    axios.get
      .mockResolvedValueOnce({ data: { admins: [admin] } }) // load
      .mockResolvedValueOnce({ data: { admins: [] } }); // after remove
    axios.delete.mockResolvedValueOnce({});

    renderComponent();

    await waitFor(() => screen.getByText(/Remove/i));
    fireEvent.click(screen.getByText(/Remove/i));

    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
  });

  test("deletes company", async () => {
    axios.get.mockResolvedValueOnce({ data: { admins: [] } });
    axios.delete.mockResolvedValueOnce({});

    renderComponent();

    fireEvent.click(screen.getByText(/Delete Company/i));
    await waitFor(() => screen.getByText(/Confirm Deletion/i));

    fireEvent.click(screen.getByText(/Delete Company/i));

    await waitFor(() =>
      expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining("company123"), expect.anything())
    );
  });
});
