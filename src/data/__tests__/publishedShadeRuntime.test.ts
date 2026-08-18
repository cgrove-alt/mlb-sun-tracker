/** @jest-environment node */

import { MLB_STADIUMS } from '../stadiums';
import {
  auditPublishedMeasuredShadeRuntimeRegistry,
  hasPublishedMeasuredShadeRuntime,
} from '../publishedShadeRuntime';

describe('published measured shade runtime boundary', () => {
  it('has no invalid registrations', () => {
    expect(auditPublishedMeasuredShadeRuntimeRegistry()).toEqual([]);
  });

  it('does not treat any legacy MLB estimator as a measured runtime', () => {
    expect(MLB_STADIUMS.filter((stadium) => hasPublishedMeasuredShadeRuntime(stadium.id)))
      .toEqual([]);
  });
});

