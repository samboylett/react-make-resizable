import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Resizable, Resizer } from '../lib/index';

storiesOf('Resizable', module)
  .add('every side resize', () => (
    <Resizable>
      <div style={{
        border: '1px solid black',
        display: 'inline-block',
        padding: '5px',
        margin: '10px 10px 500px 10px'
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
        padding: '5px',
        margin: '10px 10px 500px 10px'
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
        padding: '5px',
        margin: '10px 10px 500px 10px'
      }}>
        Foo bar
        <Resizer position="right" thickness={3} style={{ background: 'blue' }} />
      </div>
    </Resizable>
  ));
