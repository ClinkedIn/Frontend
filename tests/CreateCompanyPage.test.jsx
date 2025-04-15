import { render, screen, fireEvent,waitFor } from "@testing-library/react";
import { describe, expect,vi,beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import CreateCompanyPage from "../src/pages/CompanyPages/CreateCompanyPage";
import { BASE_URL } from "../src/constants";

vi.mock("axios");

describe("CreateCompanyPage", () => {
  beforeEach(() => {
    
    axios.get.mockResolvedValue({
      data: {
        user: {
          _id: "123"  
        }
      }
    });
  });
  test("renders form correctly", async() => {
    
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/user/me`, { withCredentials: true });
    });
    expect(screen.getByText("Let's get started with a few details about your company")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add your organization's name")).toBeInTheDocument();
  });

  test("validates inputs before submission", () => {
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Create Page"));
    expect(screen.getByText("Please enter the company name")).toBeInTheDocument();
    expect(screen.getByText("Please enter the company address")).toBeInTheDocument();
  });

  test("submits form successfully when valid", async () => {
    axios.post.mockResolvedValue({ data: {} });
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/user/me`, { withCredentials: true });
    });
    fireEvent.change(screen.getByPlaceholderText("Add your organization's name"), { target: { value: "Test Company" } });
    fireEvent.change(screen.getByPlaceholderText("Add your company address"), { target: { value: "123 Street" } });
    fireEvent.change(screen.getByPlaceholderText("Begin with http://, https://, or www."), { target: { value: "www./example.com" } });
    fireEvent.change(screen.getByPlaceholderText("e.g., Information Services"), {target: { value: "Technology" }});
    fireEvent.change(screen.getByLabelText(/Organization Size/i), {  target:{ value: "501-1000" }});
    fireEvent.change(screen.getByLabelText(/Organization Type/i), {target: { value: "Private" }});
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByText("Create Page"));
    await waitFor(()=>{

      expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/companies`,
        expect.objectContaining({
          name: "Test Company",
          address: "123 Street",
          website: "www.example.com",
          industry: "Technology",
          size: "501-1000",
          type: "Private",
          userId: "123"
        })
      );
    })
    

  });
});
