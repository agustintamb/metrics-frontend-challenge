import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TrendArrowIcon } from "@/assets/TrendArrowIcon";
import { TrendNeutralIcon } from "@/assets/TrendNeutralIcon";

describe("TrendArrowIcon", () => {
  it("should render up arrow with green color when isUp is true", () => {
    const { container } = render(<TrendArrowIcon isUp={true} />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("text-green-500");
  });

  it("should render down arrow with red color when isUp is false", () => {
    const { container } = render(<TrendArrowIcon isUp={false} />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("text-red-500");
  });

  it("should have correct SVG attributes", () => {
    const { container } = render(<TrendArrowIcon isUp={true} />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("viewBox", "0 0 20 20");
    expect(svg).toHaveAttribute("fill", "currentColor");
    expect(svg).toHaveClass("w-4", "h-4");
  });
});

describe("TrendNeutralIcon", () => {
  it("should render neutral icon with gray color", () => {
    const { container } = render(<TrendNeutralIcon />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("text-gray-400");
  });

  it("should have correct SVG attributes", () => {
    const { container } = render(<TrendNeutralIcon />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("viewBox", "0 0 20 20");
    expect(svg).toHaveAttribute("fill", "currentColor");
    expect(svg).toHaveClass("w-4", "h-4");
  });
});
