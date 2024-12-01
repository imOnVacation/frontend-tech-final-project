import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TicketEdit from "./TicketEdit";

test("renders TicketEdit component with form fields", () => {
  render(
    <MemoryRouter>
      <TicketEdit />
    </MemoryRouter>
  );

  expect(screen.getByText(/Edit Ticket/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Ticket ID/i)).toBeInTheDocument();
  expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  const cancelButton = screen.getByRole("button", { name: /Cancel/i });
  expect(cancelButton).toBeInTheDocument();
});

test("populates fields with ticket data from location state", () => {
  const ticket = {
    id: "123",
    description: "Sample ticket description",
    status: "Open",
    location: "Main Office",
    request_date: "2024-01-01",
    shop: "Shop A",
    priority: "High",
  };

  render(
    <MemoryRouter initialEntries={[{ state: { ticket } }]}>
      <TicketEdit />
    </MemoryRouter>
  );

  expect(screen.getByDisplayValue(ticket.description)).toBeInTheDocument();
  expect(screen.getByDisplayValue(ticket.status)).toBeInTheDocument();
  expect(screen.getByDisplayValue(ticket.location)).toBeInTheDocument();
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ shop: "Shop A" }, { shop: "Shop B" }]),
  })
);

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ shop: "Shop A" }, { shop: "Shop B" }]),
  })
);

beforeEach(() => {
  // Reset fetch mock before each test
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([{ shop: "Shop A" }, { shop: "Shop B" }]),
    })
  );
});

test("fetches and displays shop options", async () => {
  render(
    <MemoryRouter>
      <TicketEdit />
    </MemoryRouter>
  );

  expect(await screen.findByText("Shop A")).toBeInTheDocument();
  expect(await screen.findByText("Shop B")).toBeInTheDocument();
});

test("handles input changes", () => {
  render(
    <MemoryRouter>
      <TicketEdit />
    </MemoryRouter>
  );

  const descriptionInput = screen.getByLabelText(/Description/i);
  fireEvent.change(descriptionInput, {
    target: { value: "Updated description" },
  });

  expect(descriptionInput.value).toBe("Updated description");
});
