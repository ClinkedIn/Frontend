import { render, screen, fireEvent } from "@testing-library/react";
import { describe,expect, beforeEach,vi } from "vitest";
import CompanyForm from "../src/components/CompanyPageSections/CompanyPageForm";
import "@testing-library/jest-dom";


describe("CompanyForm Component", () => {
    let mockSetState;

    beforeEach(() => {
        mockSetState = vi.fn();
        render(
            <CompanyForm
                errors={{}}
                companyName=""
                setCompanyName={mockSetState}
                tagline=""
                setTagline={mockSetState}
                industry=""
                setIndustry={mockSetState}
                organizationType=""
                setOrganizationType={mockSetState}
                organizationSize=""
                setOrganizationSize={mockSetState}
                website=""
                setWebsite={mockSetState}
                checkbox={false}
                setCheckbox={mockSetState}
                companyAddress=""
                setCompanyAddress={mockSetState}
                logoPreview={null}
                setLogoPreview={mockSetState}
                showTerms={true}
            />
        );
    });

    test("renders form inputs correctly", () => {
        expect(screen.getByLabelText(/Name\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Address\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Website/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Industry\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Organization Size\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Organization Type\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Tagline/i)).toBeInTheDocument();
    });

        test("updates input values when changed", () => {
            const nameInput = screen.getByLabelText(/Name\*/i);
            fireEvent.change(nameInput, { target: { value: "Test Company" } });
            expect(mockSetState).toHaveBeenCalledWith("Test Company");
        });

    test("shows error messages when errors exist", () => {
        render(
            <CompanyForm
                errors={{ companyName: "Name is required" }}
                companyName=""
                setCompanyName={mockSetState}
                tagline=""
                setTagline={mockSetState}
                industry=""
                setIndustry={mockSetState}
                organizationType=""
                setOrganizationType={mockSetState}
                organizationSize=""
                setOrganizationSize={mockSetState}
                website=""
                setWebsite={mockSetState}
                checkbox={false}
                setCheckbox={mockSetState}
                companyAddress=""
                setCompanyAddress={mockSetState}
                logoPreview={null}
                setLogoPreview={mockSetState}
              />
        );
        expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
    
 test("reset logo preview when reset button is clicked", () => {
        const resetButton = screen.getByText(/reset/i);
        fireEvent.click(resetButton);
        expect(mockSetState).toHaveBeenCalledWith(null);
    });
});
