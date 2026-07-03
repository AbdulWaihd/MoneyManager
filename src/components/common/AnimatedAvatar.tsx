import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

export default function AnimatedAvatar({ happy = false }: { happy?: boolean }) {
  const bounce = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.04, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  return (
    <Animated.View style={[styles.avatarWrap, { transform: [{ translateY }, { scale }] }]}> 
      <View style={styles.avatarBody}>
        <View style={styles.face}>
          <View style={styles.eyeRow}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
          <View style={styles.mouth} />
        </View>
        <View style={styles.wallet}>
          <Text style={styles.walletText}>$</Text>
        </View>
      </View>
      {happy ? (
        <View style={styles.sparkleWrap}>
          <Sparkles size={20} color="#f59e0b" />
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBody: {
    width: 150,
    height: 150,
    borderRadius: 70,
    backgroundColor: '#f8d4a9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#7c3f00',
    position: 'relative',
  },
  face: {
    width: 92,
    height: 72,
    backgroundColor: '#fff9ed',
    borderRadius: 30,
    paddingTop: 14,
    alignItems: 'center',
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  eye: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2d1b06',
  },
  mouth: {
    width: 28,
    height: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 3,
    borderTopWidth: 0,
    borderColor: '#c2410c',
    marginTop: 8,
  },
  wallet: {
    position: 'absolute',
    right: 6,
    bottom: 8,
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  sparkleWrap: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});
