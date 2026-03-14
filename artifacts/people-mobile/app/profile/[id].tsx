import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import C from '@/constants/colors';
import { useApp } from '@/context/AppContext';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sec.wrap}>
      <Text style={sec.title}>{title}</Text>
      {children}
    </View>
  );
}
const sec = StyleSheet.create({
  wrap: { marginBottom: 20 },
  title: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: C.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
});

function InfoCard({ children }: { children: React.ReactNode }) {
  return <View style={ic.wrap}>{children}</View>;
}
const ic = StyleSheet.create({
  wrap: {
    backgroundColor: C.panel,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },
});

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={ir.row}>
      <Feather name={icon as any} size={15} color={C.accent} style={ir.icon} />
      <View style={ir.text}>
        <Text style={ir.label}>{label}</Text>
        <Text style={ir.value}>{value}</Text>
      </View>
    </View>
  );
}
const ir = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  icon: { marginTop: 1 },
  text: { flex: 1 },
  label: { fontSize: 10, fontFamily: 'Inter_500Medium', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  value: { fontSize: 14, fontFamily: 'Inter_400Regular', color: C.text, lineHeight: 20 },
});

function TagChip({ tag }: { tag: string }) {
  const key = tag.toLowerCase() as keyof typeof C.tag;
  const colors = C.tag[key] ?? C.tag.custom;
  return (
    <View style={[tg.wrap, { backgroundColor: colors.bg }]}>
      <Text style={[tg.text, { color: colors.text }]}>{tag}</Text>
    </View>
  );
}
const tg = StyleSheet.create({
  wrap: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  text: { fontSize: 12, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.5 },
});

function TrustBar({ level }: { level: number }) {
  const color = level <= 3 ? C.red : level <= 6 ? C.yellow : C.green;
  const label = level <= 3 ? 'Low Trust' : level <= 6 ? 'Moderate Trust' : 'High Trust';
  return (
    <View style={tr.wrap}>
      <View style={tr.barBg}>
        <View style={[tr.barFill, { width: `${level * 10}%` as any, backgroundColor: color }]} />
      </View>
      <View style={tr.meta}>
        <Text style={[tr.level, { color }]}>{level} / 10</Text>
        <Text style={tr.label}>{label}</Text>
      </View>
    </View>
  );
}
const tr = StyleSheet.create({
  wrap: { gap: 8, paddingHorizontal: 16 },
  barBg: { height: 6, backgroundColor: C.border, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  level: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  label: { fontSize: 13, fontFamily: 'Inter_400Regular', color: C.textMuted },
});

function formatDate(s?: string) {
  if (!s) return null;
  try {
    return new Date(s).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return s; }
}

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPersonById, deletePerson } = useApp();
  const insets = useSafeAreaInsets();
  const person = getPersonById(id);

  if (!person) {
    return (
      <View style={[s.root, { paddingTop: insets.top }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={C.text} />
        </Pressable>
        <View style={s.notFound}>
          <Text style={s.notFoundText}>Person not found</Text>
        </View>
      </View>
    );
  }

  const avatar = person.name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
  const trustColor = person.trustLevel <= 3 ? C.red : person.trustLevel <= 6 ? C.yellow : C.green;

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      `Delete ${person.name}?`,
      'All data for this person will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePerson(person.id);
            router.replace('/dashboard');
          },
        },
      ]
    );
  };

  const allDates = [
    ...(person.birthday ? [{ date: person.birthday, label: 'Birthday' }] : []),
    ...(person.firstMet ? [{ date: person.firstMet, label: 'First met' }] : []),
    ...(person.lastMet ? [{ date: person.lastMet, label: 'Last met' }] : []),
    ...(person.nextMeeting ? [{ date: person.nextMeeting, label: 'Next meeting' }] : []),
    ...person.customDates.map(d => ({ date: d.date, label: d.label })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <View style={[s.root, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={s.navbar}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={C.text} />
        </Pressable>
        <View style={s.navActions}>
          <Pressable
            style={s.navBtn}
            onPress={() => router.push({ pathname: '/edit/[id]', params: { id: person.id } })}
          >
            <Feather name="edit-2" size={18} color={C.accent} />
          </Pressable>
          <Pressable style={[s.navBtn, s.deleteBtn]} onPress={handleDelete}>
            <Feather name="trash-2" size={18} color={C.red} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View style={s.hero}>
          <View style={[s.avatar, { borderColor: trustColor + '88' }]}>
            <Text style={s.avatarText}>{avatar}</Text>
          </View>
          <Text style={s.name}>{person.name}</Text>
          {person.tags.length > 0 && (
            <View style={s.tagRow}>
              {person.tags.map(t => <TagChip key={t} tag={t} />)}
            </View>
          )}
        </View>

        <Section title="Trust Level">
          <TrustBar level={person.trustLevel} />
        </Section>

        {person.description ? (
          <Section title="About">
            <InfoCard>
              <Text style={s.bodyText}>{person.description}</Text>
            </InfoCard>
          </Section>
        ) : null}

        {(person.likes || person.dislikes) ? (
          <Section title="Personality">
            <InfoCard>
              {person.likes ? <InfoRow icon="heart" label="Likes" value={person.likes} /> : null}
              {person.dislikes ? <InfoRow icon="x-circle" label="Dislikes" value={person.dislikes} /> : null}
            </InfoCard>
          </Section>
        ) : null}

        {person.thingsToRemember ? (
          <Section title="Remember">
            <InfoCard>
              <InfoRow icon="bookmark" label="Key Notes" value={person.thingsToRemember} />
            </InfoCard>
          </Section>
        ) : null}

        {person.quickFacts ? (
          <Section title="Quick Facts">
            <InfoCard>
              <Text style={s.bodyText}>{person.quickFacts}</Text>
            </InfoCard>
          </Section>
        ) : null}

        {allDates.length > 0 ? (
          <Section title="Timeline">
            <View style={tl.wrap}>
              {allDates.map((d, i) => (
                <View key={i} style={tl.item}>
                  <View style={tl.line}>
                    <View style={tl.dot} />
                    {i < allDates.length - 1 ? <View style={tl.connector} /> : null}
                  </View>
                  <View style={tl.content}>
                    <Text style={tl.dateLabel}>{d.label}</Text>
                    <Text style={tl.date}>{formatDate(d.date)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Section>
        ) : null}

        <View style={{ marginHorizontal: 16, marginTop: 8 }}>
          <Text style={s.meta}>Added {formatDate(person.createdAt)}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const tl = StyleSheet.create({
  wrap: { marginHorizontal: 16 },
  item: { flexDirection: 'row', gap: 12 },
  line: { alignItems: 'center', width: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.accent, marginTop: 4 },
  connector: { flex: 1, width: 2, backgroundColor: C.border, marginBottom: -4 },
  content: {
    flex: 1,
    backgroundColor: C.panel,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  dateLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: C.text },
  date: { fontSize: 12, fontFamily: 'Inter_400Regular', color: C.textMuted, marginTop: 2 },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.panel,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  navActions: { flexDirection: 'row', gap: 8 },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.panel,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  deleteBtn: { borderColor: C.red + '44' },
  hero: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: C.header,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 30, fontFamily: 'Inter_700Bold', color: C.text },
  name: { fontSize: 26, fontFamily: 'Inter_700Bold', color: C.textBright },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 16 },
  bodyText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: C.text, lineHeight: 22 },
  meta: { fontSize: 12, fontFamily: 'Inter_400Regular', color: C.textDim, textAlign: 'center' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: C.textMuted, fontFamily: 'Inter_400Regular' },
});
