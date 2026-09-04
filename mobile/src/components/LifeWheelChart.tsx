import { colors, polarPoint } from '@lifewheeluz/shared';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';

const SIZE = 260,
  CENTER = SIZE / 2,
  RADIUS = 92,
  RING_LEVELS = [2, 4, 6, 8, 10];

export function LifeWheelChart({
  labels,
  scores,
}: {
  labels: string[];
  scores: number[];
}) {
  const point = (i: number, v: number) =>
    polarPoint(i, v, scores.length, RADIUS, CENTER);

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {RING_LEVELS.map((level) => (
          <Polygon
            key={level}
            points={scores.map((_, i) => point(i, level).join(',')).join(' ')}
            fill="none"
            stroke="#dfe5df"
          />
        ))}
        {scores.map((_, i) => {
          const [x, y] = point(i, 10);
          return (
            <Line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="#e6eae6"
            />
          );
        })}
        <Polygon
          points={scores.map((v, i) => point(i, v).join(',')).join(' ')}
          fill="#2f776a"
          fillOpacity={0.18}
          stroke="#2f776a"
          strokeWidth={2.5}
        />
        {scores.map((v, i) => {
          const [x, y] = point(i, v);
          return (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r={4}
              fill={colors[i]}
              stroke="#fff"
              strokeWidth={2}
            />
          );
        })}
      </Svg>
      {labels.map((label, i) => {
        const [x, y] = polarPoint(i, 10, labels.length, RADIUS + 22, CENTER);
        return (
          <Text
            key={label}
            style={[styles.label, { left: x - 40, top: y - 8, width: 80 }]}
          >
            {label}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignSelf: 'center',
  },
  label: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '600',
    color: '#68766f',
    textAlign: 'center',
  },
});
