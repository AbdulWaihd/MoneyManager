import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const BUBBLES = Array.from({ length: 8 }, (_, index) => index);

export default function FloatingMoney({ active = true }: { active?: boolean }) {
  const animations = useRef(BUBBLES.map(() => new Animated.Value(0))).current;

  const positions = useMemo(
    () => BUBBLES.map((_, index) => ({
      left: `${8 + (index % 4) * 18}%`,
      duration: 1400 + index * 140,
      delay: index * 90,
    })),
    []
  );

  useEffect(() => {
    if (!active) return;

    const sequence = animations.map((anim, index) =>
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: positions[index].duration,
          delay: positions[index].delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      )
    );

    sequence.forEach((animation) => animation.start());
    return () => sequence.forEach((animation) => animation.stop());
  }, [active, animations, positions]);

  return (
    <View pointerEvents="none" style={styles.container}>
      {animations.map((anim, index) => {
        const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -120] });
        const opacity = anim.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0.3, 1, 0] });
        const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['-10deg', '10deg'] });

        return (
          <Animated.Text
            key={index}
            style={{
              ...styles.coin,
              left: positions[index].left as any,
              opacity,
              transform: [{ translateY }, { rotate }],
            }}
          >
            ₿
          </Animated.Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  coin: {
    position: 'absolute',
    bottom: 56,
    fontSize: 24,
    color: '#fbbf24',
    fontWeight: '800',
  },
});
