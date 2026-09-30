'use client';

import { Slider as SliderPrimitive } from '@base-ui/react/slider';

export function Slider(
  props: SliderPrimitive.Root.Props<number | readonly number[]>,
) {
  return (
    <SliderPrimitive.Root {...props} data-slot="slider">
      <SliderPrimitive.Control data-slot="slider-control">
        <SliderPrimitive.Track data-slot="slider-track">
          <SliderPrimitive.Indicator data-slot="slider-range" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          aria-label="Amount of rewriting"
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}
