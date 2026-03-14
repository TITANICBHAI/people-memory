import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import C from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'del'],
];

export default function PinScreen() {
  const { pinHash, isUnlocked, isLoading, setupPin, verifyPin } = useApp();
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'set' | 'confirm' | 'verify'>('verify');
  const [error, setError] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const dotScale = useRef([...Array(6)].map(() => new Animated.Value(1))).current;

  const isSetup = !pinHash;
  const maxLen = 6;

  useEffect(() => {
    if (!isLoading && isUnlocked) {
      router.replace('/dashboard');
    }
  }, [isUnlocked, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setStep(isSetup ? 'set' : 'verify');
    }
  }, [isSetup, isLoading]);

  const shake = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const animateDot = (i: number) => {
    Animated.sequence([
      Animated.timing(dotScale[i], { toValue: 1.4, duration: 80, useNativeDriver: true }),
      Animated.timing(dotScale[i], { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleKey = async (key: string) => {
    if (key === '') return;
    setError('');

    if (key === 'del') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const cur = step === 'confirm' ? confirmPin : pin;
      if (step === 'confirm') setConfirmPin(cur.slice(0, -1));
      else setPin(cur.slice(0, -1));
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const cur = step === 'confirm' ? confirmPin : pin;
    if (cur.length >= maxLen) return;

    const next = cur + key;
    animateDot(next.length - 1);

    if (step === 'confirm') {
      setConfirmPin(next);
      if (next.length >= 4) {
        setTimeout(async () => {
          if (next === pin) {
            await setupPin(next);
          } else {
            setError('PINs do not match. Try again.');
            setConfirmPin('');
            setPin('');
            setStep('set');
            shake();
          }
        }, 150);
      }
    } else if (step === 'set') {
      setPin(next);
      if (next.length >= 4) {
        setTimeout(() => {
          setStep('confirm');
          setConfirmPin('');
        }, 200);
      }
    } else {
      setPin(next);
      if (next.length >= 4) {
        setTimeout(async () => {
          const ok = await verifyPin(next);
          if (!ok) {
            setError('Incorrect PIN');
            setPin('');
            shake();
          }
        }, 150);
      }
    }
  };

  const currentLen = step === 'confirm' ? confirmPin.length : pin.length;

  const title = step === 'set' ? 'Set Your PIN' : step === 'confirm' ? 'Confirm PIN' : 'Enter PIN';
  const subtitle =
    step === 'set'
      ? 'Choose a 4–6 digit PIN to protect your data'
      : step === 'confirm'
      ? 'Enter the same PIN again'
      : 'Your data is locked';

  if (isLoading) return <View style={[s.root, { backgroundColor: C.bg }]} />;

  return (
    <View style={[s.root, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) }]}>
      <View style={s.top}>
        <View style={s.iconWrap}>
          <Feather name="lock" size={28} color={C.accent} />
        </View>
        <Text style={s.title}>{title}</Text>
        <Text style={s.subtitle}>{subtitle}</Text>
      </View>

      <Animated.View style={[s.dots, { transform: [{ translateX: shakeAnim }] }]}>
        {[...Array(Math.max(4, currentLen + (currentLen < 6 ? 1 : 0), 4))].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              s.dot,
              i < currentLen ? s.dotFilled : s.dotEmpty,
              { transform: [{ scale: i < currentLen ? dotScale[i] : 1 }] },
            ]}
          />
        ))}
      </Animated.View>

      {error ? <Text style={s.error}>{error}</Text> : <View style={{ height: 22 }} />}

      <View style={s.pad}>
        {KEYS.map((row, ri) => (
          <View key={ri} style={s.row}>
            {row.map((k, ki) => (
              <Pressable
                key={ki}
                style={({ pressed }) => [
                  s.key,
                  k === '' && s.keyInvisible,
                  pressed && k !== '' && s.keyPressed,
                ]}
                onPress={() => handleKey(k)}
                disabled={k === ''}
              >
                {k === 'del' ? (
                  <Feather name="delete" size={22} color={C.text} />
                ) : (
                  <Text style={s.keyText}>{k}</Text>
                )}
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  top: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 36,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: C.panel,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: C.textBright,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: C.textMuted,
    textAlign: 'center',
    maxWidth: 240,
  },
  dots: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotFilled: {
    backgroundColor: C.accent,
  },
  dotEmpty: {
    backgroundColor: C.border,
  },
  error: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: C.red,
    height: 22,
    textAlign: 'center',
  },
  pad: {
    gap: 12,
    marginTop: 28,
    width: 280,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  key: {
    width: 82,
    height: 64,
    borderRadius: 16,
    backgroundColor: C.panel,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  keyPressed: {
    backgroundColor: C.panelHigh,
    borderColor: C.accent,
  },
  keyInvisible: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  keyText: {
    fontSize: 22,
    fontFamily: 'Inter_400Regular',
    color: C.textBright,
  },
});
