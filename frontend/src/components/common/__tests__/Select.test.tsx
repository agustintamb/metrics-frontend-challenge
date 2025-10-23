import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "@/components/common/Select";

const mockOptions = [
  { value: "option1", label: "Opción 1" },
  { value: "option2", label: "Opción 2" },
  { value: "option3", label: "Opción 3" },
];

describe("Select Component", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
    options: mockOptions,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render with placeholder when no value is selected", () => {
      render(<Select {...defaultProps} placeholder="Seleccionar opción" />);

      expect(screen.getByText("Seleccionar opción")).toBeInTheDocument();
    });

    it("should render selected option label", () => {
      render(<Select {...defaultProps} value="option2" />);

      expect(screen.getByText("Opción 2")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Select {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild?.firstChild).toHaveClass("custom-class");
    });

    it("should apply different variants correctly", () => {
      const { rerender, container } = render(
        <Select {...defaultProps} variant="outlined" />
      );

      expect(container.querySelector(".border-gray-400")).toBeInTheDocument();

      rerender(<Select {...defaultProps} variant="filled" />);
      expect(container.querySelector(".bg-gray-100")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should open dropdown when clicked", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      // Click on the select element (div with cursor-pointer)
      const selectElement = screen.getByText("Seleccionar...").closest("div");
      await user.click(selectElement!);

      await waitFor(() => {
        expect(screen.getByText("Opción 1")).toBeInTheDocument();
        expect(screen.getByText("Opción 2")).toBeInTheDocument();
        expect(screen.getByText("Opción 3")).toBeInTheDocument();
      });
    });

    it("should call onChange when option is selected", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(<Select {...defaultProps} onChange={mockOnChange} />);

      // Click to open dropdown
      const selectElement = screen.getByText("Seleccionar...").closest("div");
      await user.click(selectElement!);

      await waitFor(() => {
        expect(screen.getByText("Opción 2")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Opción 2"));

      expect(mockOnChange).toHaveBeenCalledWith("option2");
    });

    it("should close dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Select {...defaultProps} />
          <div data-testid="outside">Outside element</div>
        </div>
      );

      const selectElement = screen.getByText("Seleccionar...").closest("div");
      await user.click(selectElement!);

      await waitFor(() => {
        expect(screen.getByText("Opción 1")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("outside"));

      await waitFor(() => {
        // Should only see the placeholder, not the dropdown options
        expect(screen.getByText("Seleccionar...")).toBeInTheDocument();
        expect(screen.queryByText("Opción 1")).not.toBeInTheDocument();
      });
    });

    it("should rotate arrow icon when opened", async () => {
      const user = userEvent.setup();
      const { container } = render(<Select {...defaultProps} />);

      // Initially no rotation
      const arrow = container.querySelector(".rotate-180");
      expect(arrow).not.toBeInTheDocument();

      const selectElement = screen.getByText("Seleccionar...").closest("div");
      await user.click(selectElement!);

      await waitFor(() => {
        const rotatedArrow = container.querySelector(".rotate-180");
        expect(rotatedArrow).toBeInTheDocument();
      });
    });

    it("should handle keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectElement = screen.getByText("Seleccionar...").closest("div");

      // Focus and press Enter to open
      selectElement!.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("Opción 1")).toBeInTheDocument();
      });
    });
  });

  describe("Styling and Layout", () => {
    it("should apply custom width and minWidth", () => {
      const { container } = render(
        <Select {...defaultProps} width="200px" minWidth="150px" />
      );

      const selectContainer = container.firstChild;
      expect(selectContainer).toHaveStyle({
        width: "200px",
        minWidth: "150px",
      });
    });

    it("should highlight selected option in dropdown", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} value="option2" />);

      const selectElement = screen.getByText("Opción 2").closest("div");
      await user.click(selectElement!);

      await waitFor(() => {
        const dropdownOptions = screen.getAllByText("Opción 2");
        // Find the one in the dropdown (not the main display)
        const dropdownOption = dropdownOptions.find((el) =>
          el.closest("div")?.classList.contains("bg-gray-50")
        );
        expect(dropdownOption).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty options array", () => {
      render(<Select {...defaultProps} options={[]} />);

      expect(screen.getByText("Seleccionar...")).toBeInTheDocument();
    });

    it("should handle invalid selected value", () => {
      render(<Select {...defaultProps} value="invalid-option" />);

      expect(screen.getByText("Seleccionar...")).toBeInTheDocument();
    });

    it("should not crash when onChange is not provided", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} onChange={undefined as any} />);

      const selectElement = screen.getByText("Seleccionar...").closest("div");
      await user.click(selectElement!);

      await waitFor(() => {
        expect(screen.getByText("Opción 1")).toBeInTheDocument();
      });

      // Should not crash when clicking an option
      await user.click(screen.getByText("Opción 1"));
    });

    it("should handle very long option labels", () => {
      const longOptions = [
        {
          value: "long1",
          label: "This is a very long option label that might overflow",
        },
        {
          value: "long2",
          label: "Another extremely long label for testing purposes",
        },
      ];

      render(<Select {...defaultProps} options={longOptions} />);

      expect(screen.getByText("Seleccionar...")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(<Select {...defaultProps} onChange={mockOnChange} />);

      const selectElement = screen.getByText("Seleccionar...").closest("div");

      // Tab to focus
      await user.tab();
      expect(selectElement).toHaveFocus();

      // Enter to open
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("Opción 1")).toBeInTheDocument();
      });
    });

    it("should handle escape key to close dropdown", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectElement = screen.getByText("Seleccionar...").closest("div");
      await user.click(selectElement!);

      await waitFor(() => {
        expect(screen.getByText("Opción 1")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("Opción 1")).not.toBeInTheDocument();
      });
    });
  });

  describe("Integration with forms", () => {
    it("should work with controlled state updates", async () => {
      const TestWrapper = () => {
        const [value, setValue] = React.useState("");
        return <Select {...defaultProps} value={value} onChange={setValue} />;
      };

      const user = userEvent.setup();
      render(<TestWrapper />);

      const selectElement = screen.getByText("Seleccionar...").closest("div");
      await user.click(selectElement!);

      await user.click(screen.getByText("Opción 2"));

      await waitFor(() => {
        expect(screen.getByText("Opción 2")).toBeInTheDocument();
        expect(screen.queryByText("Seleccionar...")).not.toBeInTheDocument();
      });
    });
  });
});
