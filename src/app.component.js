import React, { useState, useRef, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Measure from 'react-measure';

import syncMaps from './mapbox-gl-sync-move';

import Map from './map.component';

import { moveCompare } from './map.actions';

import styles from './app.module.css';

function App() {
  const dispatch = useDispatch();
  const compareRatio = useSelector(state => state.map.compareRatio);
  const [bounds, setBounds] = useState({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });

  const map1Ref = useRef(null);
  const map2Ref = useRef(null);
  const mapRefs = [map1Ref, map2Ref];
  const mapRefCount = mapRefs.filter(ref => {
    console.log('CURRENT REF: ', ref);
    return ref.current;
  }).length;

  const compareMove = e => {
    e = e.touches ? e.touches[0] : e;
    let x = e.clientX - bounds.left;
    if (x < 0) x = 0;
    if (x > bounds.width) x = bounds.width;
    const ratio = x / bounds.width;
    dispatch(moveCompare(ratio));
  };

  const compareTouchEnd = () => {
    document.removeEventListener('touchmove', compareMove);
    document.removeEventListener('touchend', compareTouchEnd);
  };

  const compareMouseEnd = () => {
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

  useEffect(() => {
    console.log('MAP REF COUNT: ', mapRefCount);
    if (mapRefCount > 1) {
      console.log('SYNC MAPS: ', mapRefCount, mapRefs, map1Ref, map2Ref);
      const removeSyncMove = Promise.all([map1Ref.current, map2Ref.current].filter(ref => ref)).then(maps => {
        console.log('MAPS: ', maps);

        syncMaps(maps.map(mapRef => mapRef.current));
      });

      return () => {
        removeSyncMove.then(cb => cb());
      };
      // } else {
      //   Promise.all([map1Ref.current].filter(ref => ref)).then(maps => setMaps(maps));
    }
  }, [mapRefCount]);

  return (
    <div className={styles.app}>
      <Measure bounds onResize={contentRect => setBounds(contentRect.bounds)}>
        {({ measureRef }) => (
          <div ref={measureRef}>
            <Map ref={mapRefs[0]} mapStyle="mapbox://styles/mapbox/dark-v10"></Map>

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
        )}
      </Measure>

      <div
        style={{
          position: 'absolute',
          clip: `rect(0px, 999em, 100vh, ${compareRatio * bounds.width}px)`
        }}
      >
        <Map ref={mapRefs[1]} mapStyle="mapbox://styles/mapbox/streets-v11" />
      </div>
    </div>
  );
}

export default App;
