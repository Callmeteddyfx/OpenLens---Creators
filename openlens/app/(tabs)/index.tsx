import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing as ReanimatedEasing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  const textInputRef = useRef<TextInput>(null);

  // shared values for reanimated
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0); // normalized 0..1
  const glow = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const spin = `${interpolate(rotate.value, [0, 1], [0, 1080])}deg`;
    const glowRadius = interpolate(glow.value, [0, 1], [0, 20]);
    const glowOpacity = interpolate(glow.value, [0, 1], [0, 0.8]);

    return {
      transform: [{ scale: scale.value }, { rotate: spin }],
      shadowColor: '#4F46E5',
      shadowRadius: glowRadius,
      shadowOpacity: glowOpacity,
      elevation: glowRadius,
    };
  });

  const handleImagePress = useCallback(async () => {
    try {
      const clipboardText = await Clipboard.getStringAsync();

      if (!clipboardText || clipboardText.trim() === '') {
        Alert.alert('Clipboard is empty');
        return;
      }

      // paste content first; not animated
      if (textInputRef.current) {
        textInputRef.current.setNativeProps({ text: clipboardText });
      }

      // start animation sequence on UI thread
      // pop scale up immediately
      scale.value = withSpring(1.1);

      // perform rotation and glow concurrently
      rotate.value = withTiming(1, {
        duration: 3000,
        easing: ReanimatedEasing.linear,
      }, (isFinished) => {
        if (isFinished) {
          // reset values after spin
          scale.value = withSpring(1);
          glow.value = withTiming(0, { duration: 500 });
          // clear rotate without animation so next press starts fresh
          rotate.value = 0;
        }
      });
      glow.value = withTiming(1, { duration: 3000 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'goon';
      Alert.alert('Error', message);
    }
  }, [scale, rotate, glow]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.header}>OpenLens</Text>

      <View style={styles.bottomContent}>
        <View style={styles.card}>
          <TextInput
            ref={textInputRef}
            style={styles.invisibleInput}
            editable={false}
          />
          <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
              <Animated.View style={animatedStyle}>
            <Image
              source={require('@/assets/images/icon3-removebg.png')}
              style={styles.imagePlaceholder}
              resizeMode="contain"
            />
          </Animated.View>
          </TouchableOpacity>
          </View>

        <Text style={styles.helperText}>
          Download any video using the video's link.
        </Text>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/(tabs)/explore')}
          activeOpacity={0.7}
        >
          <IconSymbol name="gearshape.fill" size={28} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    width: '100%',
    fontSize: 36,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 20,
    paddingTop: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#transparent',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  invisibleInput: {
    display: 'flex',
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  helperText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
  settingsButton: {
    marginTop: 24,
    padding: 8,
  },
});
