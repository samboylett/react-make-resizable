# React Make Resizable

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![npm version](https://badge.fury.io/js/react-make-resizable.svg)](https://badge.fury.io/js/react-make-resizable)
[![Build Status](https://travis-ci.org/samboylett/react-make-resizable.svg?branch=master)](https://travis-ci.org/samboylett/react-make-resizable)
[![codecov](https://codecov.io/gh/samboylett/react-make-resizable/branch/master/graph/badge.svg)](https://codecov.io/gh/samboylett/react-make-resizable)
[![Mutation testing badge](https://badge.stryker-mutator.io/github.com/samboylett/react-make-resizable/master)](https://stryker-mutator.github.io)

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

## Components

### Resizable

This component adds nothing to the DOM, but must wrap the element that needs to be resizable. It takes the following props:

#### onResizeStart

Called when the element starts being resized, with the mouse event

#### onResizeDrag

Called on each update (i.e. when the mouse moves) with the mouse event, current bounding rectangle and the side being dragged

#### onResizeEnd

Called when the resize ends with the mouse event, final bounding rectangle of the element and the side which was being dragged

### Resizer

This component is used to make a side of the element resizable. You can make any side of the element resizable or not resizable. You can pass an `as` prop to render Resizer as a certain element or component. You can also style it.

The position prop must be present and be one of `top`, `right`, `bottom`, `left`
