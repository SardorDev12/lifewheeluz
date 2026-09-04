/**
 * Polar coordinate for point `index` of `count` evenly-spaced spokes, at
 * value `value` (0-10) along a radius `radius` centered at `center`.
 * Index 0 points straight up; going clockwise.
 */
export function polarPoint(
  index: number,
  value: number,
  count: number,
  radius: number,
  center: number,
): [number, number] {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2,
    distance = (radius * value) / 10;
  return [
    center + Math.cos(angle) * distance,
    center + Math.sin(angle) * distance,
  ];
}
