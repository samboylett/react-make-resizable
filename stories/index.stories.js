import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

const specialAction = (name) =>
  (...args) => {
    console.log(name, args);
    return action(name)(...args);
  };

import { Resizable, Resizer, makeResizable } from '../lib/index';

const MadeResizable = makeResizable('div');

storiesOf('Resizable', module)
  .addDecorator(story => (
    <div style={{ height: '100vh', width: '100vw' }}>
      {story()}
    </div>
  ))
  .add('every side resizable and centred', () => (
    <Resizable
      onResizeStart={specialAction('onResizeStart')}
      onResizeEnd={specialAction('onResizeEnd')}
    >
      <div style={{
        border: '1px solid black',
        display: 'inline-block',
        padding: '5px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        Foo bar
        <Resizer position="top" />
        <Resizer position="right" />
        <Resizer position="bottom" />
        <Resizer position="left" />
      </div>
    </Resizable>
  ))
  .add('only right', () => (
    <Resizable>
      <div style={{
        border: '1px solid black',
        display: 'inline-block',
        padding: '5px'
      }}>
        Foo bar
        <Resizer position="right" />
      </div>
    </Resizable>
  ))
  .add('styled resizer', () => (
    <Resizable>
      <div style={{
        border: '1px solid black',
        display: 'inline-block',
        padding: '5px'
      }}>
        Foo bar
        <Resizer position="right" thickness={5} style={{ background: 'blue' }} />
      </div>
    </Resizable>
  ))
  .add('using makeResizable', () => (
    <MadeResizable
      style={{
        border: '1px solid black',
        display: 'inline-block',
        padding: '5px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      Foo bar
      <Resizer position="right" thickness={5} style={{ background: 'blue' }} />
    </MadeResizable>
  ));
