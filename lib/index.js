// @flow
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { renderAs } from 'react-render-as';
import classnames from 'classnames';

type ResizerProps = {
  position: 'top' | 'right' | 'bottom' | 'left',
  thickness: number,
  [string]: any
};

const Resizer = ({
  position, thickness, style, className, ...props
}: ResizerProps) => {
  const positionEnum = ['top', 'right', 'bottom', 'left'];

  if (!positionEnum.includes(position)) {
    throw new Error(`Invalid position: "${position}". Valid positions include: ${positionEnum.join(', ')}`);
  }

  const borderStyle = ['left', 'right'].includes(position)
    ? {
      top: 0, bottom: 0, width: thickness, cursor: 'col-resize'
    }
    : {
      left: 0, right: 0, height: thickness, cursor: 'row-resize'
    };

  const RenderAs = renderAs('div');

  return (
    <RenderAs
      {...props}
      className={classnames(className, `resizer-${position}`)}
      style={{
        ...(style || {}),
        ...borderStyle,
        position: 'absolute',
        [position]: 0
      }}
    />
  );
};

Resizer.defaultProps = {
  thickness: 3
};

export { Resizer };

export class Resizable extends React.Component {
  resizers: Array<Resizer> = [];
  position: string;

  get element() {
    return findDOMNode(this); // eslint-disable-line react/no-find-dom-node
  }

  get box() {
    return this.element.getBoundingClientRect();
  }

  get horizontal() {
    return ['left', 'right'].includes(this.position);
  }

  componentDidMount() {
    this.setStyles();
    this.setResizerEvents();
  }

  componentDidUpdate() {
    this.setStyles();
    this.setResizerEvents();
  }

  setStyles() {
    this.element.style.position = this.element.style.position || 'relative';
    this.element.style.boxSizing = 'border-box';
  }

  setResizerEvents() {
    this.resizers.forEach((resizer) => {
      const node = this.element.querySelector(`.resizer-${resizer.props.position}`);
      node.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.position = resizer.props.position;
        document.body.style.cursor = this.horizontal ? 'col-resize' : 'row-resize';
        document.body.addEventListener('mousemove', this.handleMouseMove);
        document.body.addEventListener('mouseup', this.handleMouseUp);
      });
    });
  }

  handleMouseMove = (e) => {
    const sideUsed = {
      left: 'right',
      right: 'left',
      top: 'bottom',
      bottom: 'top'
    }[this.position];

    let directionUsed;
    let styleAxis;

    if (this.horizontal) {
      directionUsed = 'clientX';
      styleAxis = 'width';
    } else {
      directionUsed = 'clientY';
      styleAxis = 'height';
    }

    let distance = e[directionUsed] - this.box[sideUsed];

    if (['left', 'top'].includes(this.position)) {
      distance = -distance;
    }

    this.element.style[styleAxis] = `${distance}px`;
  }

  handleMouseUp = () => {
    document.body.removeEventListener('mousemove', this.handleMouseMove);
    document.body.removeEventListener('mouseup', this.handleMouseUp);
    document.body.style.cursor = 'auto';
  };

  render() {
    const child = React.Children.only(this.props.children);

    this.resizers =
      React.Children.toArray(child.props.children)
        .filter(n => n.type === Resizer);

    return child;
  }
}
