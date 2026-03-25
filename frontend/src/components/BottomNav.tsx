import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomNavTab = 'Home' | 'Adam' | 'Journal' | 'Therapist';

type BottomNavProps = {
  active: BottomNavTab;
  onTabPress: (tab: BottomNavTab) => void;
};

const TAB_CONFIG: Array<{
  key: BottomNavTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { key: 'Home', label: 'Home', icon: 'home-outline' },
  { key: 'Adam', label: 'Adam', icon: 'chatbubble-ellipses-outline' },
  { key: 'Journal', label: 'Journal', icon: 'book-outline' },
  { key: 'Therapist', label: 'Therapist', icon: 'people-outline' },
];

const BottomNav: React.FC<BottomNavProps> = ({ active, onTabPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(8, insets.bottom) }]}> 
      <View style={styles.row}>
        {TAB_CONFIG.map(tab => {
          const isActive = tab.key === active;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.item}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <Ionicons
                  name={tab.icon}
                  size={22}
                  color={isActive ? '#7857e1' : '#2f2f2f'}
                />
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#ece8f5',
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    width: 80,
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(120, 87, 225, 0.12)',
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: '#2f2f2f',
  },
  labelActive: {
    color: '#7857e1',
    fontFamily: 'Urbanist-SemiBold',
  },
});

export default BottomNav;