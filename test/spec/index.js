/* globals jest */
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';
import { Resizable, Resizer } from '../../lib/index';

Enzyme.configure({ adapter: new Adapter() });

let component;

describe('Resizer', () => {
  describe('when position not left, right, top or bottom', () => {
    it('throws an error', () => {
      expect(() => {
        mount((
          <Resizer position="foo" />
        ));
      }).toThrow(new Error('Invalid position: "foo". Valid positions include: top, right, bottom, left'));
    });
  });

  const alwaysStyleTests = (tagType = 'div') => {
    it('sets position to absolute', () => {
      const { style } = component.find(tagType).instance();

      expect(style).toEqual(expect.objectContaining({
        position: 'absolute'
      }));
    });
  };

  const verticalBorderStyleTests = () => {
    it('sets element style to be a vertical border', () => {
      const { style } = component.find('div').instance();

      expect(style).toEqual(expect.objectContaining({
        width: '3px',
        height: '',
        top: '0px',
        bottom: '0px',
        cursor: 'col-resize'
      }));
    });
  };

  const horizontalBorderStyleTests = () => {
    it('sets element style to be a horizontal border', () => {
      const { style } = component.find('div').instance();

      expect(style).toEqual(expect.objectContaining({
        height: '3px',
        width: '',
        left: '0px',
        right: '0px',
        cursor: 'row-resize'
      }));
    });
  };

  describe('when styled', () => {
    beforeEach(() => {
      component = mount((
        <Resizer position="left" style={{ background: 'blue' }} />
      ));
    });

    it('maintains those styles', () => {
      expect(component.find('div').instance().style.background).toEqual('blue');
    });

    alwaysStyleTests();
  });

  describe('with as prop', () => {
    beforeEach(() => {
      component = mount((
        <Resizer position="left" as="p" />
      ));
    });

    it('renders as that element', () => {
      expect(component.find('div')).toHaveLength(0);
      expect(component.find('p')).toHaveLength(1);
    });

    alwaysStyleTests('p');
  });

  describe('when position left', () => {
    beforeEach(() => {
      component = mount((
        <Resizer position="left" />
      ));
    });

    it('sets left style to 0', () => {
      expect(component.find('div').instance().style.left).toEqual('0px');
    });

    verticalBorderStyleTests();
    alwaysStyleTests();
  });

  describe('when position top', () => {
    beforeEach(() => {
      component = mount((
        <Resizer position="top" />
      ));
    });

    it('sets top style to 0', () => {
      expect(component.find('div').instance().style.top).toEqual('0px');
    });

    horizontalBorderStyleTests();
    alwaysStyleTests();
  });

  describe('when position right', () => {
    beforeEach(() => {
      component = mount((
        <Resizer position="right" />
      ));
    });

    it('sets right style to 0', () => {
      expect(component.find('div').instance().style.right).toEqual('0px');
    });

    verticalBorderStyleTests();
    alwaysStyleTests();
  });

  describe('when position bottom', () => {
    beforeEach(() => {
      component = mount((
        <Resizer position="bottom" />
      ));
    });

    it('sets bottom style to 0', () => {
      expect(component.find('div').instance().style.bottom).toEqual('0px');
    });

    horizontalBorderStyleTests();
    alwaysStyleTests();
  });
});

describe('Resizable', () => {
  const withWhenComponentUpdates = (tests) => {
    tests();

    describe('when component updates', () => {
      beforeEach(() => {
        // Enzyme doesn't seem to remove old HTML elements like React in the browser does
        component.instance().element.style = {};
        component.instance().componentDidUpdate();
      });

      tests();
    });
  };

  describe('when passed more than 1 child', () => {
    it('throws an error', () => {
      expect(() => {
        mount((
          <Resizable>
            <div>Foo</div>
            <div>Bar</div>
          </Resizable>
        ));
      }).toThrow();
    });
  });

  describe('when element position is set', () => {
    beforeEach(() => {
      component = mount((
        <Resizable>
          <div style={{ position: 'absolute' }}>Foo bar</div>
        </Resizable>
      ));
    });

    it('does not change it', () => {
      expect(component.find('div').instance().style.position).toEqual('absolute');
    });
  });

  describe('with one child', () => {
    beforeEach(() => {
      component = mount((
        <Resizable>
          <div>Foo bar</div>
        </Resizable>
      ));
    });

    withWhenComponentUpdates(() => {
      it('renders the passed children', () => {
        expect(component.find('div')).toHaveText('Foo bar');
      });

      it('sets the child position to relative', () => {
        expect(component.find('div').instance().style.position).toEqual('relative');
      });

      it('sets the child box-sizing to border-box', () => {
        expect(component.find('div').instance().style.boxSizing).toEqual('border-box');
      });
    });
  });

  const mouseDownTests = (tests) => {
    withWhenComponentUpdates(() => {
      describe('when mouse down on resizer', () => {
        beforeEach(() => {
          jest.spyOn(component.find('span').instance(), 'getBoundingClientRect')
            .mockImplementation(() => ({
              left: 10,
              top: 10,
              right: 50,
              bottom: 50
            }));

          jest.spyOn(document.body, 'addEventListener');

          const event = new MouseEvent('mousedown');

          component.find(Resizer).find('div').instance().dispatchEvent(event);
        });

        ['mouseup', 'mousemove'].forEach((type) => {
          it(`adds a ${type} event listener to the body`, () => {
            expect(document.body.addEventListener)
              .toHaveBeenCalledWith(type, expect.any(Function));
          });
        });

        tests();

        describe('when mouse up on body', () => {
          beforeEach(() => {
            jest.spyOn(document.body, 'removeEventListener');

            const event = new MouseEvent('mouseup');

            document.body.dispatchEvent(event);
          });

          it('sets the body cursor to auto', () => {
            expect(document.body.style.cursor).toEqual('auto');
          });

          ['mouseup', 'mousemove'].forEach((eventType) => {
            it(`removes the ${eventType} event listener added the body`, () => {
              const [, func] =
                document.body.addEventListener.mock.calls.find(([type]) => type === eventType);

              expect(document.body.removeEventListener)
                .toHaveBeenCalledWith(eventType, func);
            });
          });
        });
      });
    });
  };

  describe('with right resizer', () => {
    beforeEach(() => {
      component = mount((
        <Resizable>
          <span>
            Foo bar
            <Resizer position="right" />
          </span>
        </Resizable>
      ));
    });

    mouseDownTests(() => {
      it('sets the body cursor to col-resize', () => {
        expect(document.body.style.cursor).toEqual('col-resize');
      });

      it('sets the position var to right', () => {
        expect(component.instance().position).toEqual('right');
      });

      describe('when mouse move on body', () => {
        beforeEach(() => {
          const event = new MouseEvent('mousemove', { clientX: 100 });

          document.body.dispatchEvent(event);
        });

        it('sets the width to the mouse distance from the left side', () => {
          expect(component.find('span').instance().style.width).toEqual('90px');
        });
      });
    });
  });

  describe('with left resizer', () => {
    beforeEach(() => {
      component = mount((
        <Resizable>
          <span>
            Foo bar
            <Resizer position="left" />
          </span>
        </Resizable>
      ));
    });

    mouseDownTests(() => {
      it('sets the body cursor to col-resize', () => {
        expect(document.body.style.cursor).toEqual('col-resize');
      });

      it('sets the position var to left', () => {
        expect(component.instance().position).toEqual('left');
      });

      describe('when mouse move on body', () => {
        beforeEach(() => {
          const event = new MouseEvent('mousemove', { clientX: 45 });

          document.body.dispatchEvent(event);
        });

        it('sets the width to the mouse distance from the right side', () => {
          expect(component.find('span').instance().style.width).toEqual('5px');
        });
      });
    });
  });

  describe('with top resizer', () => {
    beforeEach(() => {
      component = mount((
        <Resizable>
          <span>
            Foo bar
            <Resizer position="top" />
          </span>
        </Resizable>
      ));
    });

    mouseDownTests(() => {
      it('sets the body cursor to row-resize', () => {
        expect(document.body.style.cursor).toEqual('row-resize');
      });

      it('sets the position var to top', () => {
        expect(component.instance().position).toEqual('top');
      });

      describe('when mouse move on body', () => {
        beforeEach(() => {
          const event = new MouseEvent('mousemove', { clientY: 40 });

          document.body.dispatchEvent(event);
        });

        it('sets the height to the mouse distance from the bottom side', () => {
          expect(component.find('span').instance().style.height).toEqual('10px');
        });
      });
    });
  });

  describe('with bottom resizer', () => {
    beforeEach(() => {
      component = mount((
        <Resizable>
          <span>
            Foo bar
            <Resizer position="bottom" />
          </span>
        </Resizable>
      ));
    });

    mouseDownTests(() => {
      it('sets the body cursor to row-resize', () => {
        expect(document.body.style.cursor).toEqual('row-resize');
      });

      it('sets the position var to bottom', () => {
        expect(component.instance().position).toEqual('bottom');
      });

      describe('when mouse move on body', () => {
        beforeEach(() => {
          const event = new MouseEvent('mousemove', { clientY: 150 });

          document.body.dispatchEvent(event);
        });

        it('sets the height to the mouse distance from the top side', () => {
          expect(component.find('span').instance().style.height).toEqual('140px');
        });
      });
    });
  });

  const withCallbacks = (position, axis) => {
    describe(`with callbacks and position ${position}`, () => {
      let onResizeStart;
      let onResizeEnd;
      let onResizeDrag;

      beforeEach(() => {
        onResizeStart = jest.fn();
        onResizeEnd = jest.fn();
        onResizeDrag = jest.fn();

        component = mount((
          <Resizable
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
            onResizeDrag={onResizeDrag}
          >
            <span>
              Foo bar
              <Resizer position={position} />
            </span>
          </Resizable>
        ));
      });

      describe('when mouse down on resizer', () => {
        let event;

        beforeEach(() => {
          jest.spyOn(component.find('span').instance(), 'getBoundingClientRect')
            .mockImplementation(() => ({
              [axis]: 250
            }));

          event = new MouseEvent('mousedown');

          component.find(Resizer).find('div').instance().dispatchEvent(event);
        });

        it('calls onResizeStart prop with event', () => {
          expect(onResizeStart).toHaveBeenCalledWith(event, position);
        });

        describe('when mouse up on body', () => {
          beforeEach(() => {
            event = new MouseEvent('mouseup');

            document.body.dispatchEvent(event);
          });

          it(`calls onResizeEnd with element ${axis}`, () => {
            expect(onResizeEnd).toHaveBeenCalledWith(event, expect.objectContaining({
              [axis]: 250
            }), position);
          });
        });

        describe('when mouse move on body', () => {
          beforeEach(() => {
            event = new MouseEvent('mousemove', { clientX: 180, clientY: 280 });

            document.body.dispatchEvent(event);
          });

          it(`calls onResizeDrag with element ${axis}`, () => {
            expect(onResizeDrag).toHaveBeenCalledWith(event, expect.objectContaining({
              [axis]: 250
            }), position);
          });
        });
      });
    });
  };

  withCallbacks('right', 'width');
  withCallbacks('left', 'width');
  withCallbacks('top', 'height');
  withCallbacks('bottom', 'height');
});
