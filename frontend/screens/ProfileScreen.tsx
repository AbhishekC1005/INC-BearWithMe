import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Therapist = {
  id: string;
  name: string;
  specialty: string;
  distance: string;
  rating: string;
  availability: string;
  area: string;
};

const colors = {
  primary: '#7857e1',
  background: '#f3eded',
  white: '#ffffff',
  textPrimary: '#302f2f',
  textSecondary: '#7857e1',
  softPrimary: 'rgba(120, 87, 225, 0.12)',
};

const therapistData: Therapist[] = [
  {
    id: '1',
    name: 'Dr. Ananya Sharma',
    specialty: 'Anxiety and Stress',
    distance: '1.8 km',
    rating: '4.9',
    availability: 'Available Today',
    area: 'Indiranagar',
  },
  {
    id: '2',
    name: 'Dr. Rohit Menon',
    specialty: 'Relationships and Family',
    distance: '2.4 km',
    rating: '4.8',
    availability: 'Next Slot: 6:30 PM',
    area: 'Koramangala',
  },
  {
    id: '3',
    name: 'Dr. Priya Nair',
    specialty: 'Career and Burnout',
    distance: '3.1 km',
    rating: '4.7',
    availability: 'Available Tomorrow',
    area: 'HSR Layout',
  },
  {
    id: '4',
    name: 'Dr. Arjun Patel',
    specialty: 'Student Well-being',
    distance: '4.2 km',
    rating: '4.8',
    availability: 'Next Slot: 11:00 AM',
    area: 'BTM Layout',
  },
];

const ProfileScreen: React.FC = () => {
  const [query, setQuery] = useState('');

  const filteredTherapists = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) {
      return therapistData;
    }

    return therapistData.filter(item => {
      return (
        item.name.toLowerCase().includes(text) ||
        item.area.toLowerCase().includes(text) ||
        item.specialty.toLowerCase().includes(text)
      );
    });
  }, [query]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Therapist Finder</Text>
        <Text style={styles.subtitle}>Find available therapists near your area</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search area, name, or concern"
          placeholderTextColor="rgba(120, 87, 225, 0.5)"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTherapists.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No therapists found</Text>
            <Text style={styles.emptyText}>Try searching with a nearby area or specialty.</Text>
          </View>
        ) : (
          filteredTherapists.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.cardMainInfo}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.specialty}>{item.specialty}</Text>
                </View>
                <View style={styles.ratingChip}>
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{item.area}</Text>
                <Text style={styles.metaDot}>|</Text>
                <Text style={styles.metaText}>{item.distance}</Text>
                <Text style={styles.metaDot}>|</Text>
                <Text style={styles.metaText}>{item.availability}</Text>
              </View>

              <TouchableOpacity style={styles.bookButton} activeOpacity={0.85}>
                <Text style={styles.bookButtonText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Urbanist-Medium',
    color: colors.textSecondary,
    fontWeight: '100',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Urbanist',
    color: colors.textSecondary,
    marginTop: 2,
    opacity: 0.8,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    backgroundColor: colors.softPrimary,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 15,
    fontFamily: 'Urbanist',
    color: colors.primary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(120, 87, 225, 0.2)',
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.softPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(120, 87, 225, 0.3)',
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
    color: colors.primary,
  },
  cardMainInfo: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: colors.textPrimary,
  },
  specialty: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingChip: {
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.softPrimary,
    borderWidth: 1,
    borderColor: 'rgba(120, 87, 225, 0.28)',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Urbanist-SemiBold',
    color: colors.primary,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    opacity: 0.8,
  },
  metaDot: {
    marginHorizontal: 6,
    color: colors.primary,
    opacity: 0.8,
  },
  bookButton: {
    marginTop: 12,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: 15,
    fontFamily: 'Urbanist-SemiBold',
    color: colors.white,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 87, 225, 0.2)',
    padding: 18,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: colors.primary,
  },
  emptyText: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    opacity: 0.7,
  },
});

export default ProfileScreen;