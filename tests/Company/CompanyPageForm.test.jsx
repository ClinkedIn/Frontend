import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, test, vi ,beforeEach} from 'vitest';
import CompanyForm from '../../src/components/CompanyPageSections/CompanyPageForm.jsx';

describe('CompanyForm', () => {
    const mockProps = {
        errors: {},
        companyName: '',
        setCompanyName: vi.fn(),
        tagline: '',
        setTagline: vi.fn(),
        industry: '',
        setIndustry: vi.fn(),
        organizationType: '',
        setOrganizationType: vi.fn(),
        organizationSize: '',
        setOrganizationSize: vi.fn(),
        website: '',
        setWebsite: vi.fn(),
        checkbox: false,
        setCheckbox: vi.fn(),
        companyAddress: '',
        setCompanyAddress: vi.fn(),
        logoPreview: null,
        setLogoPreview: vi.fn(),
        logo: null,
        setLogo: vi.fn(),
        location: '',
        setCompanyLocation: vi.fn(),
        children: null,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders the form with all required fields', () => {
        render(<CompanyForm {...mockProps} />);

        expect(screen.getByLabelText(/Name\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Address\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Location\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Website/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Industry\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Organization Size\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Organization Type\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Logo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Tagline/i)).toBeInTheDocument();
    });

    test('calls setter functions when inputs change', () => {
        render(<CompanyForm {...mockProps} />);

        const nameInput = screen.getByLabelText(/Name\*/i);
        fireEvent.change(nameInput, { target: { value: 'Test Company' } });
        expect(mockProps.setCompanyName).toHaveBeenCalledWith('Test Company');

        const addressInput = screen.getByLabelText(/Address\*/i);
        fireEvent.change(addressInput, { target: { value: '123 Test St' } });
        expect(mockProps.setCompanyAddress).toHaveBeenCalledWith('123 Test St');

        const locationInput = screen.getByLabelText(/Location\*/i);
        fireEvent.change(locationInput, { target: { value: 'New York' } });
        expect(mockProps.setCompanyLocation).toHaveBeenCalledWith('New York');

        const websiteInput = screen.getByLabelText(/Website/i);
        fireEvent.change(websiteInput, { target: { value: 'https://example.com' } });
        expect(mockProps.setWebsite).toHaveBeenCalledWith('https://example.com');

        const industryInput = screen.getByLabelText(/Industry\*/i);
        fireEvent.change(industryInput, { target: { value: 'Technology' } });
        expect(mockProps.setIndustry).toHaveBeenCalledWith('Technology');
    });

    test('calls setter functions when dropdowns change', () => {
        render(<CompanyForm {...mockProps} />);

        const sizeSelect = screen.getByLabelText(/Organization Size\*/i);
        fireEvent.change(sizeSelect, { target: { value: '11-50' } });
        expect(mockProps.setOrganizationSize).toHaveBeenCalledWith('11-50');

        const typeSelect = screen.getByLabelText(/Organization Type\*/i);
        fireEvent.change(typeSelect, { target: { value: 'Private' } });
        expect(mockProps.setOrganizationType).toHaveBeenCalledWith('Private');
    });

    test('handles tagline with character limit', () => {
        render(<CompanyForm {...mockProps} />);

        const taglineInput = screen.getByLabelText(/Tagline/i);
        const validTagline = 'A'.repeat(120);
        const invalidTagline = 'A'.repeat(121);

        fireEvent.change(taglineInput, { target: { value: validTagline } });
        expect(mockProps.setTagline).toHaveBeenCalledWith(validTagline);

        fireEvent.change(taglineInput, { target: { value: invalidTagline } });
        expect(mockProps.setTagline).not.toHaveBeenCalledWith(invalidTagline);
    });

    test('displays error messages when errors are provided', () => {
        const errorsProps = {
            ...mockProps,
            errors: {
                companyName: 'Company name is required',
                companyAddress: 'Address is required',
                industry: 'Industry is required',
                organizationSize: 'Organization size is required',
                organizationType: 'Organization type is required',
                companyLocation: 'Location is required',
                website: 'Invalid website format'
            },
        };

        render(<CompanyForm {...errorsProps} />);

        expect(screen.getByText('Company name is required')).toBeInTheDocument();
        expect(screen.getByText('Address is required')).toBeInTheDocument();
        expect(screen.getByText('Industry is required')).toBeInTheDocument();
        expect(screen.getByText('Organization size is required')).toBeInTheDocument();
        expect(screen.getByText('Organization type is required')).toBeInTheDocument();
        expect(screen.getByText('Location is required')).toBeInTheDocument();
        expect(screen.getByText('Invalid website format')).toBeInTheDocument();
    });

    test('handles logo upload and reset', () => {
        const mockCreateObjectURL = vi.fn(() => 'mocked-url');
        global.URL.createObjectURL = mockCreateObjectURL;

        render(<CompanyForm {...mockProps} />);

        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        const fileInput = screen.getByTestId('logo-upload-input') || document.getElementById('logoUpload');

        if (fileInput) {
            fireEvent.change(fileInput, { target: { files: [file] } });
            expect(mockProps.setLogoPreview).toHaveBeenCalledWith('mocked-url');
            expect(mockProps.setLogo).toHaveBeenCalledWith(file);
            expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
        } else {
            throw new Error("File input element not found. Add data-testid='logo-upload-input' to your input element.");
        }

        const resetButton = screen.getByRole('button', { name: /reset/i });
        fireEvent.click(resetButton);

        expect(mockProps.setLogo).toHaveBeenCalledWith(null);
        expect(mockProps.setLogoPreview).toHaveBeenCalledWith(null);

        delete global.URL.createObjectURL;
    });

    test('renders children when provided', () => {
        const testId = 'child-element';
        render(
            <CompanyForm {...mockProps}>
                <div data-testid={testId}>Child Content</div>
            </CompanyForm>
        );

        expect(screen.getByTestId(testId)).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
});