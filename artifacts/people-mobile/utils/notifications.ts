import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const MEETING_KEY = (personId: string) => `notif_${personId}`;
const BIRTHDAY_KEY = (personId: string) => `notif_birthday_${personId}`;

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleNextMeetingNotification(
  personId: string,
  personName: string,
  date: string,
  time: string,
): Promise<void> {
  await cancelNextMeetingNotification(personId);

  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const trigger = new Date(year, month - 1, day, hour, minute, 0);

  if (trigger.getTime() <= Date.now()) return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Meeting Reminder',
      body: `You're meeting ${personName} today at ${time}`,
      sound: true,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
  });

  await AsyncStorage.setItem(MEETING_KEY(personId), id);
}

export async function cancelNextMeetingNotification(personId: string): Promise<void> {
  const id = await AsyncStorage.getItem(MEETING_KEY(personId));
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(MEETING_KEY(personId));
  }
}

export async function scheduleBirthdayNotification(
  personId: string,
  personName: string,
  birthday: string,
): Promise<void> {
  await cancelBirthdayNotification(personId);

  if (Platform.OS === 'web') return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  const [, month, day] = birthday.split('-').map(Number);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `🎂 ${personName}'s Birthday!`,
      body: `Today is ${personName}'s birthday — don't forget to wish them well!`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      repeats: true,
      month,
      day,
      hour: 9,
      minute: 0,
    },
  });

  await AsyncStorage.setItem(BIRTHDAY_KEY(personId), id);
}

export async function cancelBirthdayNotification(personId: string): Promise<void> {
  const id = await AsyncStorage.getItem(BIRTHDAY_KEY(personId));
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(BIRTHDAY_KEY(personId));
  }
}

const CUSTOM_DATE_KEY = (personId: string, dateId: string) => `notif_custom_${personId}_${dateId}`;

export async function scheduleCustomDateNotification(
  personId: string,
  personName: string,
  dateId: string,
  label: string,
  date: string,
): Promise<void> {
  await cancelCustomDateNotification(personId, dateId);

  if (Platform.OS === 'web') return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  const [, month, day] = date.split('-').map(Number);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `📅 ${label}`,
      body: `Today marks "${label}" for ${personName}`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      repeats: true,
      month,
      day,
      hour: 9,
      minute: 0,
    },
  });

  await AsyncStorage.setItem(CUSTOM_DATE_KEY(personId, dateId), id);
}

export async function cancelCustomDateNotification(personId: string, dateId: string): Promise<void> {
  const id = await AsyncStorage.getItem(CUSTOM_DATE_KEY(personId, dateId));
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(CUSTOM_DATE_KEY(personId, dateId));
  }
}
