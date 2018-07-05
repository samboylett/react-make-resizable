// @flow
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { renderAs } from 'react-render-as';
import classnames from 'classnames';

type PositionEnum = 'top' | 'right' | 'bottom' | 'left';

type ResizerProps = {
  position: PositionEnum,
  thickness: number,
  [string]: any
};

const positionEnum = ['top', 'right', 'bottom', 'left'];

const Resizer = ({
  position, thickness, style, className, ...props
}: ResizerProps) => {
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

type ResizableProps = {
  children: React.Node,
  onResizeStart?: (MouseEvent, string) => void,
  onResizeEnd?: (MouseEvent, ClientRect, string) => void,
  onResizeDrag?: (MouseEvent, ClientRect, string) => void
};

const body = () => ((document.body: any): HTMLBodyElement);

export class Resizable extends React.Component<ResizableProps> {
  position: PositionEnum;

  get element(): HTMLElement {
    return ((findDOMNode(this): any): HTMLElement); // eslint-disable-line react/no-find-dom-node
  }

  get style(): Object {
    return this.element.style || {};
  }

  get box(): Object {
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
    this.style.position = this.style.position || 'relative';
    this.style.boxSizing = 'border-box';
  }

  setResizerEvents() {
    positionEnum.forEach((position) => {
      const node = ((this.element.querySelector(`.resizer-${position}`): any): HTMLElement);
      if (!node) return;

      node.addEventListener('mousedown', (e: MouseEvent) => {
        e.preventDefault();
        this.position = position;
        body().style.cursor = this.horizontal ? 'col-resize' : 'row-resize';
        body().addEventListener('mousemove', this.handleMouseMove);
        body().addEventListener('mouseup', this.handleMouseUp);
        if (this.props.onResizeStart) {
          this.props.onResizeStart(e, this.position);
        }
      });
    });
  }

  handleMouseMove = (e: MouseEvent) => {
    const sideUsed: PositionEnum = {
      left: 'right',
      right: 'left',
      top: 'bottom',
      bottom: 'top'
    }[this.position];

    let directionUsed: string = 'clientY';
    let styleAxis: string = 'height';

    if (this.horizontal) {
      directionUsed = 'clientX';
      styleAxis = 'width';
    }

    let distance = (e: Object)[directionUsed] - this.box[sideUsed];

    if (['left', 'top'].includes(this.position)) {
      distance = -distance;
    }

    this.style[styleAxis] = `${distance}px`;

    if (this.props.onResizeDrag) {
      this.props.onResizeDrag(e, this.box, this.position);
    }
  }

  handleMouseUp = (e: MouseEvent) => {
    body().removeEventListener('mousemove', this.handleMouseMove);
    body().removeEventListener('mouseup', this.handleMouseUp);
    body().style.cursor = 'auto';
    if (this.props.onResizeEnd) {
      this.props.onResizeEnd(e, this.box, this.position);
    }
  };

  render() {
    return this.props.children;
  }
}

type ResizableComponentProps = ResizableProps & {
  [string]: any
};

export const makeResizable = (Component: React.ComponentType<any>) => {
  const ResizableComponent = ({
    onResizeEnd,
    onResizeDrag,
    onResizeStart,
    children,
    ...props
  }: ResizableComponentProps) => (
    <Resizable
      onResizeStart={onResizeStart}
      onResizeDrag={onResizeDrag}
      onResizeEnd={onResizeEnd}
    >
      <Component {...props}>
        {children}
      </Component>
    </Resizable>
  );

  ResizableComponent.displayName = `makeResizable(${Component.displayName || Component.name || 'Component'})`;

  return ResizableComponent;
};
