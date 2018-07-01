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

  const alwaysStyleTests = () => {
    it('sets position to absolute', () => {
      const { style } = component.find('div').instance();

      expect(style).toEqual(expect.objectContaining({
        position: 'absolute'
      }));
    });
  };

  const verticalBorderStyleTests = () => {
    it('sets element style to be a vertical border', () => {
      const { style } = component.find('div').instance();

      expect(style).toEqual(expect.objectContaining({
        width: '1px',
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
        height: '1px',
        width: '',
        left: '0px',
        right: '0px',
        cursor: 'row-resize'
      }));
    });
  };

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

    it('renders the passed children', () => {
      expect(component.find('div')).toHaveText('Foo bar');
    });

    it('sets the child position to relative', () => {
      expect(component.find('div').instance().style.position).toEqual('relative');
    });
  });

  describe('with right resizer', () => {
    beforeEach(() => {
      component = mount((
        <Resizable>
          <div>
            Foo bar
            <Resizer position="right" />
          </div>
        </Resizable>
      ));
    });

    describe('when mouse down on resizer', () => {
      beforeEach(() => {
        jest.spyOn(document.body, 'addEventListener');

        const event = new MouseEvent('mousedown');

        component.find(Resizer).find('div').instance().dispatchEvent(event);
      });

      it('sets the position var to right', () => {
        expect(component.instance().position).toEqual('right');
      });

      it('sets the body cursor to col-resize', () => {
        expect(document.body.style.cursor).toEqual('col-resize');
      });

      it('adds a mouseup event listener to the body', () => {
        expect(document.body.addEventListener)
          .toHaveBeenCalledWith('mouseup', expect.any(Function));
      });

      it('adds a mousemove event listener to the body', () => {
        expect(document.body.addEventListener)
          .toHaveBeenCalledWith('mousemove', expect.any(Function));
      });

      describe('when mouse up on body', () => {
        beforeEach(() => {
          jest.spyOn(document.body, 'removeEventListener');

          const event = new MouseEvent('mouseup');

          document.body.dispatchEvent(event);
        });

        it('sets the body cursor to auto', () => {
          expect(document.body.style.cursor).toEqual('auto');
        });

        it('removes the mouseup event listener added the body', () => {
          const [, func] =
            document.body.addEventListener.mock.calls.find(([type]) => type === 'mouseup');

          expect(document.body.removeEventListener)
            .toHaveBeenCalledWith('mouseup', func);
        });

        it('removes the mousemove event listener added the body', () => {
          const [, func] =
            document.body.addEventListener.mock.calls.find(([type]) => type === 'mousemove');

          expect(document.body.removeEventListener)
            .toHaveBeenCalledWith('mousemove', func);
        });
      });
    });
  });
});
