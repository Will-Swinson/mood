import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import HomePage from "../app/page";

// Mock the Clerk functions you're using in the component
// Mock is used to replace the Clerk functions with a mock function
// Mocking is used for scenarios where you want to seperate your tests from the actual third party dependencies
// Sometimes mocking shouldn't be used in a real world user POV test
vi.mock("@clerk/nextjs", () => {
  const mockedFunctions = {
    useUser: () => ({
      isSignedIn: true,
      user: {
        id: "user_dsadsadsadsa",
        fullName: "asdasds",
      },
    }),
    auth: () =>
      new Promise((resolve) => resolve({ userId: "user_dsadsadsadsa" })),
    ClerkProvider: ({ children }) => <div>{children}</div>,
  };

  return mockedFunctions;
});

// Describe the thing you're testing, takes a string and a function
describe("Testing for the home page to confirm it indeed renders", () => {
  // it takes a string and a function and describe exactly what you expect to happen
  it("should render without crashing", async () => {
    // render the component you're testing
    render(await HomePage());
    // use the screen object from testing library to find the text you're expecting
    expect(screen.getByText("The best journal app, period.")).toBeTruthy();
  });
});
