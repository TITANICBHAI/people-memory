import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import C from '@/constants/colors';
import { Person, useApp } from '@/context/AppContext';

function TrustBadge({ level }: { level: number }) {
  const color = level <= 3 ? C.red : level <= 6 ? C.yellow : C.green;
  return (
    <View style={[tb.wrap, { borderColor: color + '55' }]}>
      <View style={[tb.dot, { backgroundColor: color }]} />
      <Text style={[tb.num, { color }]}>{level}</Text>
    </View>
  );
}
const tb = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 3 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  num: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
});

function TagChip({ tag }: { tag: string }) {
  const key = tag.toLowerCase() as keyof typeof C.tag;
  const colors = C.tag[key] ?? C.tag.custom;
  return (
    <View style={[chip.wrap, { backgroundColor: colors.bg }]}>
      <Text style={[chip.text, { color: colors.text }]}>{tag}</Text>
    </View>
  );
}
const chip = StyleSheet.create({
  wrap: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  text: { fontSize: 11, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.5 },
});

function PersonCard({ person, onPress, onDelete }: { person: Person; onPress: () => void; onDelete: () => void }) {
  const avatar = person.name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
  const trustColor = person.trustLevel <= 3 ? C.red : person.trustLevel <= 6 ? C.yellow : C.green;

  return (
    <Pressable
      style={({ pressed }) => [card.row, pressed && card.pressed]}
      onPress={onPress}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(
          `Delete ${person.name}?`,
          'This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: onDelete },
          ]
        );
      }}
    >
      <View style={[card.avatar, { borderColor: trustColor + '66' }]}>
        <Text style={card.avatarText}>{avatar}</Text>
      </View>
      <View style={card.info}>
        <View style={card.nameRow}>
          <Text style={card.name} numberOfLines={1}>{person.name}</Text>
          <TrustBadge level={person.trustLevel} />
        </View>
        {person.tags.length > 0 && (
          <View style={card.tags}>
            {person.tags.slice(0, 3).map(t => <TagChip key={t} tag={t} />)}
          </View>
        )}
        {person.description ? (
          <Text style={card.desc} numberOfLines={1}>{person.description}</Text>
        ) : null}
      </View>
      <Feather name="chevron-right" size={16} color={C.textDim} />
    </Pressable>
  );
}

const card = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: C.panel,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: C.border,
  },
  pressed: { backgroundColor: C.panelHigh, borderColor: C.borderLight },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.header,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: C.text },
  info: { flex: 1, gap: 5 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: C.textBright, flex: 1 },
  tags: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  desc: { fontSize: 12, fontFamily: 'Inter_400Regular', color: C.textMuted },
});

export default function Dashboard() {
  const { people, deletePerson, lock } = useApp();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [...people].sort((a, b) => a.name.localeCompare(b.name));
    return people.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q) ||
      p.likes.toLowerCase().includes(q) ||
      p.dislikes.toLowerCase().includes(q)
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [people, query]);

  return (
    <View style={[s.root, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={s.header}>
        <View>
          <Text style={s.appName}>PEOPLE</Text>
          <Text style={s.count}>{people.length} {people.length === 1 ? 'person' : 'people'}</Text>
        </View>
        <Pressable style={s.lockBtn} onPress={lock}>
          <Feather name="lock" size={18} color={C.textMuted} />
        </Pressable>
      </View>

      <View style={s.searchWrap}>
        <Feather name="search" size={16} color={C.textMuted} style={s.searchIcon} />
        <TextInput
          style={s.search}
          placeholder="Search name, tags, notes…"
          placeholderTextColor={C.textDim}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {people.length === 0 ? (
        <View style={s.empty}>
          <Feather name="users" size={48} color={C.textDim} />
          <Text style={s.emptyTitle}>No people yet</Text>
          <Text style={s.emptyText}>Tap + to add your first person</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={s.empty}>
          <Feather name="search" size={40} color={C.textDim} />
          <Text style={s.emptyTitle}>No results</Text>
          <Text style={s.emptyText}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={p => p.id}
          renderItem={({ item }) => (
            <PersonCard
              person={item}
              onPress={() => router.push({ pathname: '/profile/[id]', params: { id: item.id } })}
              onDelete={() => deletePerson(item.id)}
            />
          )}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable
        style={({ pressed }) => [s.fab, pressed && s.fabPressed]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/add');
        }}
      >
        <Feather name="plus" size={26} color={C.textBright} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: C.textBright,
    letterSpacing: 4,
  },
  count: { fontSize: 13, fontFamily: 'Inter_400Regular', color: C.textMuted, marginTop: 2 },
  lockBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.panel,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.panel,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: C.border,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  search: {
    flex: 1,
    color: C.text,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    height: 44,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 60,
  },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: C.text },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: C.textMuted },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  fabPressed: { backgroundColor: C.accentDim, transform: [{ scale: 0.95 }] },
});
