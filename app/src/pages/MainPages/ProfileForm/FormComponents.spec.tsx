import React from "react";
import { act } from "react-dom/test-utils";
import { Input } from "./FormComponents";
import { render, unmountComponentAtNode } from "react-dom";

let container: HTMLDivElement | null = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container!.remove();
  container = null;
});

describe("Input tests", () => {
  test("Test", () => {
    act(() => {
      const props = {
        title: "A title",
        name: "A name",
        inputType: "text",
        placeholder: "place holder",
        value: "",
        onChange: () => {}
      };

      render(
        <Input
          title={props.title}
          name={props.name}
          inputType={props.inputType}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
        />,
        container
      );
    });
    expect(container!.textContent).toBe("A titleREQUIRED: place holder");
  });
});
