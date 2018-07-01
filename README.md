# React Make Resizable

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![npm version](https://badge.fury.io/js/react-make-resizable.svg)](https://badge.fury.io/js/react-make-resizable)
[![Build Status](https://travis-ci.org/samboylett/react-make-resizable.svg?branch=master)](https://travis-ci.org/samboylett/react-make-resizable)
[![codecov](https://codecov.io/gh/samboylett/react-make-resizable/branch/master/graph/badge.svg)](https://codecov.io/gh/samboylett/react-make-resizable)
[![Mutation testing badge](https://badge.stryker-mutator.io/github.com/samboylett/react-make-resizable/master)](https://stryker-mutator.github.io)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/16c9ec7ea48d408c96c9fdda7615fbb0)](https://www.codacy.com/app/samboylett/react-make-resizable?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=samboylett/react-make-resizable&amp;utm_campaign=Badge_Grade)

## Installation

```
npm i --save react-make-resizable
```

## Usage Examples

### As a normal component

```jsx
import { Resizable, Resizer } from 'react-make-resizable';

return (
  <Resizable
    onResizeStart={e => console.log(e)}
    onResizeDrag={(e, ({ width, height }), position) => console.log(e, width, height, position)}
    onResizeEnd={(e, ({ width, height }), position) => console.log(e, width, height, position)}
  >
    <div class="my-resizable-element">
      Resizable Box
      <Resizer position="top" />
      <Resizer position="right" />
      <Resizer position="bottom" />
      <Resizer position="left" />
    </div>
  </Resizable>
);
```

### As a HOC

Using `makeResizable` to wrap your component will remove the need to use `Resizable`, and automatically handle the `onResize*` props without you having to pass them through yourself.

```jsx
import { makeResizable, Resizer } from 'react-make-resizable';

class ResizableBox extends React.Component {
  render() {
    <div class="my-resizable-element">
      Resizable Box
      <Resizer position="top" />
      <Resizer position="right" />
      <Resizer position="bottom" />
      <Resizer position="left" />
    </div>
  }
}

export default makeResizable(ResizableBox);
```

## Components

### Resizable

This component adds nothing to the DOM, but must wrap the element that needs to be resizable. It takes the following props:

#### onResizeStart

Called when the element starts being resized, with the mouse event

#### onResizeDrag

Called on each update (i.e. when the mouse moves) with the mouse event, current bounding rectangle and the side being dragged

#### onResizeEnd

Called when the resize ends with the mouse event, final bounding rectangle of the element and the side which was being dragged

### makeResizable

Components returned by this HOC take the same props as Resizable, any other props will be passed to the wrapped component.

### Resizer

This component is used to make a side of the element resizable. You can make any side of the element resizable or not resizable. You can pass an `as` prop to render Resizer as a certain element or component. You can also style it.

The position prop must be present and be one of `top`, `right`, `bottom`, `left`
