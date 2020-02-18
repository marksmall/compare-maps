import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Measure from 'react-measure';

import Map from './map.component';

import { moveCompare } from './map.actions';

import styles from './app.module.css';

function App() {
  const dispatch = useDispatch();
  const compareRatio = useSelector(state => state.map.compareRatio);
  // const dimensions = useSelector(state => state.map.dimensions);
  // const bounds = useSelector(state => state.map.bounds);
  const [bounds, setBounds] = useState({ top: 0, right: 0, bottom: 0, left: 0 });

  const [dimensions, setDimensions] = useState({ width: 1920, height: 803 });

  const compareMove = e => {
    e = e.touches ? e.touches[0] : e;
    let x = e.clientX - bounds.left;
    if (x < 0) x = 0;
    if (x > bounds.width) x = bounds.width;
    const ratio = x / bounds.width;
    console.log('RATIO: ', ratio);
    dispatch(moveCompare(ratio));
  };

  const compareTouchEnd = () => {
    console.log('MOVING START');
    document.removeEventListener('touchmove', compareMove);
    document.removeEventListener('touchend', compareTouchEnd);
  };

  const compareMouseEnd = () => {
    console.log('MOVING END');
    document.removeEventListener('mousemove', compareMove);
    document.removeEventListener('mouseup', compareMouseEnd);
  };

  const compareDown = e => {
    if (e.touches) {
      document.addEventListener('touchmove', compareMove);
      document.addEventListener('touchend', compareTouchEnd);
    } else {
      document.addEventListener('mousemove', compareMove);
      document.addEventListener('mouseup', compareMouseEnd);
    }
  };

  return (
    <div className={styles.app}>
      <Measure
        bounds
        onResize={contentRect => {
          // const { width, height } = contentRect.bounds;
          console.log('BOUNDS: ', contentRect.bounds);
          setBounds(contentRect.bounds);
          // setDimensions(contentRect.bounds);
        }}
      >
        {({ measureRef }) => (
          <div ref={measureRef} style={{ width: '100%', height: '100%' }}>
            <div
              ref={div => {
                if (div && !bounds) {
                  console.log('DIV: ', div, div.getBoundingClientRect());
                  setBounds(div.getBoundingClientRect());
                }
              }}
              style={{ position: 'absolute', width: '100%', top: 0, bottom: 0 }}
            >
              <Map mapStyle="mapbox://styles/mapbox/dark-v10"></Map>

              <div
                className={styles.compare}
                style={{
                  transform: 'translate(' + compareRatio * bounds.width + 'px, 0px)'
                }}
                onMouseDown={compareDown}
                onTouchStart={compareDown}
              >
                <div className={styles.swiper} />
              </div>
            </div>
          </div>
        )}
      </Measure>

      <div
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          bottom: 0,
          clip: 'rect(0px, 999em, ' + dimensions.height + 'px, ' + compareRatio * dimensions.width + 'px)'
        }}
      >
        <Map mapStyle="mapbox://styles/mapbox/streets-v11" />
      </div>
    </div>
  );
}

export default App;
