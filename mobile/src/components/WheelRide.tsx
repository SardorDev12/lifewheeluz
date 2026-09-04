import { computeWheelRideStats, polarPoint } from '@lifewheeluz/shared';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const WHEEL_SIZE = 120,
  C = WHEEL_SIZE / 2,
  R = 42,
  ROAD_HEIGHT = 3,
  DASH = 16,
  GAP = 16,
  DASH_PERIOD = DASH + GAP,
  ROAD_WIDTH = 800; // wide enough to tile across any phone screen

export function WheelRide({
  scores,
  label,
  caption,
}: {
  scores: number[];
  label: string;
  caption: string;
}) {
  const { bounce, duration } = computeWheelRideStats(scores);

  const spin = useSharedValue(0),
    bounceValue = useSharedValue(0),
    roadOffset = useSharedValue(0);

  useEffect(() => {
    spin.value = 0;
    spin.value = withRepeat(
      withTiming(360, { duration: duration * 1000, easing: Easing.linear }),
      -1,
    );
    bounceValue.value = 0;
    bounceValue.value = withRepeat(
      withTiming(1, {
        duration: (duration * 1000) / 2,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
    roadOffset.value = 0;
    roadOffset.value = withRepeat(
      withTiming(-DASH_PERIOD, {
        duration: duration * 1000,
        easing: Easing.linear,
      }),
      -1,
    );
    return () => {
      cancelAnimation(spin);
      cancelAnimation(bounceValue);
      cancelAnimation(roadOffset);
    };
  }, [duration, spin, bounceValue, roadOffset]);

  const wheelAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: -bounceValue.value * bounce },
        { rotate: `${spin.value}deg` },
      ],
    })),
    roadAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: roadOffset.value }],
    }));

  const point = (i: number, v: number) => polarPoint(i, v, scores.length, R, C);
  const dashes = Array.from({
    length: Math.ceil(ROAD_WIDTH / DASH_PERIOD) + 2,
  });

  return (
    <View>
      <Text style={styles.rideLabel}>{label}</Text>
      <Text style={styles.rideCaption}>{caption}</Text>
      <View style={styles.stage}>
        <View style={styles.roadClip}>
          <Animated.View style={[styles.road, roadAnimatedStyle]}>
            {dashes.map((_, i) => (
              <View key={i} style={[styles.dash, { left: i * DASH_PERIOD }]} />
            ))}
          </Animated.View>
        </View>
        <Animated.View style={[styles.wheel, wheelAnimatedStyle]}>
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox="0 0 120 120">
            {scores.map((_, i) => {
              const [x, y] = point(i, 10);
              return (
                <Line key={i} x1={C} y1={C} x2={x} y2={y} stroke="#bfe0d8" />
              );
            })}
            <Polygon
              points={scores.map((v, i) => point(i, v).join(',')).join(' ')}
              fill="#8fc3b7"
              fillOpacity={0.9}
              stroke="#2f776a"
              strokeWidth={3}
            />
            <Circle cx={C} cy={C} r={7} fill="#2f776a" />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rideLabel: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#2f776a',
  },
  rideCaption: {
    marginTop: 2,
    marginBottom: 12,
    fontSize: 12,
    color: '#94a3a8',
  },
  stage: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eef3ee',
  },
  roadClip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 56,
    height: ROAD_HEIGHT,
    overflow: 'hidden',
  },
  road: {
    height: ROAD_HEIGHT,
    width: ROAD_WIDTH,
  },
  dash: {
    position: 'absolute',
    top: 0,
    width: DASH,
    height: ROAD_HEIGHT,
    backgroundColor: '#97a89c',
  },
  wheel: {
    position: 'absolute',
    bottom: 32,
    left: '50%',
    marginLeft: -WHEEL_SIZE / 2,
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
});
