import { configure } from '@storybook/react';
import "../src/app.scss";

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
