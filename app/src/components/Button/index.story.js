import React, { Fragment, useState } from "react";
import { storiesOf } from "@storybook/react";
import Button from "./index";

const SimpleComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Fragment>
      {isVisible && <p>Hello World!</p>}
      <Button
        buttonLabelText="Say Hello"
        handleClickByParent={() => {
          setIsVisible(!isVisible);
        }}
      />
    </Fragment>
  );
};

storiesOf("Button", module)
  .addDecorator(storyFun => {
    return <div style={{ padding: "1rem" }}>{storyFun()}</div>;
  })
  .add("primary", () => <Button buttonLabelText="Button" kind="primary" />)
  .add("secondary", () => <Button buttonLabelText="Button" kind="secondary" />)
  .add("tertiary", () => <Button buttonLabelText="Button" kind="tertiary" />)
  .add("simple component", () => <SimpleComponent />);
