import { render, screen, fireEvent,waitFor } from "@testing-library/react";
import { describe, expect,vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import CreateCompanyPage from "../src/pages/CompanyPages/CreateCompanyPage";

vi.mock("axios");

describe("CreateCompanyPage", () => {
  test("renders form correctly", () => {
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>
    );

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
    axios.post.mockResolvedValue({ data: { _id: "12345" } });
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText("Add your organization's name"), { target: { value: "Test Company" } });
    fireEvent.change(screen.getByPlaceholderText("Add your company address"), { target: { value: "123 Street" } });
    fireEvent.change(screen.getByPlaceholderText("Begin with http://, https://, or www."), { target: { value: "https://example.com" } });
    fireEvent.change(screen.getByPlaceholderText("e.g., Information Services"), {target: { value: "Technology" }});
    fireEvent.change(screen.getByLabelText(/Organization Size/i), {  target:{ value: "1-10 employees" }});
    fireEvent.change(screen.getByLabelText(/Organization Type/i), {target: { value: "Private" }});
    fireEvent.click(screen.getByTestId("checkbox"));
    fireEvent.click(screen.getByText("Create Page"));
    expect(axios.post).toHaveBeenCalled();

  });
});
