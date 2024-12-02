import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TicketForm from "./TicketCreation";
import "@testing-library/jest-dom";

jest.mock("react-bootstrap", () => ({
  Modal: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

global.fetch = jest.fn();

describe("TicketForm Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders TicketForm with all inputs", () => {
    render(<TicketForm />);

    expect(screen.getByLabelText(/ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Request Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Shop/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
  });

  test("generates a ticket ID on form load", () => {
    render(<TicketForm />);
    const idInput = screen.getByLabelText(/ID/i);
    expect(idInput.value).toMatch(/^26-\d{5}$/);
  });

  test("form reset works as expected", () => {
    render(<TicketForm />);

    // Fill the form with data
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText(/Status/i), {
      target: { value: "Open" },
    });
    fireEvent.change(screen.getByLabelText(/Location/i), {
      target: { value: "Test Location" },
    });
    fireEvent.change(screen.getByLabelText(/Request Date/i), {
      target: { value: "2024-12-01" },
    });
    fireEvent.change(screen.getByLabelText(/Shop/i), {
      target: { value: "Test Shop" },
    });
    fireEvent.change(screen.getByLabelText(/Priority/i), {
      target: { value: "High" },
    });

    // Reset the form
    fireEvent.click(screen.getByText(/Reset/i));

    expect(screen.getByLabelText(/Description/i).value).toBe("");
    expect(screen.getByLabelText(/Status/i).value).toBe("");
    expect(screen.getByLabelText(/Location/i).value).toBe("");
    expect(screen.getByLabelText(/Request Date/i).value).toBe("");
    expect(screen.getByLabelText(/Shop/i).value).toBe("");
    expect(screen.getByLabelText(/Priority/i).value).toBe("");
  });
});
