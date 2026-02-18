import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  const textInputRef = useRef<TextInput>(null);

  const handleImagePress = async () => {
    try {
      const clipboardText = await Clipboard.getStringAsync();

      const scaleAnim = new Animated.Value(1);
      const rotateAnim = new Animated.Value(0);

      
      if (!clipboardText || clipboardText.trim() === '') {
        Alert.alert('Clipboard is empty');
        return;
      }

      // Paste clipboard content to the invisible textview
      if (textInputRef.current) {
        textInputRef.current.setNativeProps({ text: clipboardText });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to read clipboard');
    }
  };

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
            <Image
              source={require('@/assets/images/icon3-removebg.png')}
              style={styles.imagePlaceholder}
              resizeMode="contain"
            />
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
    fontSize: 36,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 20,
    paddingTop: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
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
