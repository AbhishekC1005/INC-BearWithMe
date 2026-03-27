import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

type BottomNavTab = 'Home' | 'Adam' | 'Journal' | 'Therapist';

type BottomNavProps = {
  active: BottomNavTab;
  onTabPress: (tab: BottomNavTab) => void;
};

type IconProps = {
  color: string;
};

const HomeIcon: React.FC<IconProps> = ({ color }) => (
  <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
    <Path
      d="M25 21.2502V14.3153C25 13.6474 24.9994 13.3132 24.9182 13.0024C24.8462 12.727 24.7281 12.4663 24.5682 12.2308C24.3878 11.965 24.1369 11.7446 23.6343 11.3048L17.6343 6.05478C16.701 5.23818 16.2344 4.83008 15.7092 4.67478C15.2465 4.53793 14.7533 4.53793 14.2905 4.67478C13.7658 4.82996 13.2998 5.23767 12.368 6.05305L6.36597 11.3048C5.8633 11.7446 5.61255 11.965 5.43213 12.2308C5.27224 12.4663 5.15319 12.727 5.08121 13.0024C5 13.3132 5 13.6474 5 14.3153V21.2502C5 22.4151 5 22.9973 5.1903 23.4567C5.44404 24.0693 5.9304 24.5565 6.54297 24.8103C7.0024 25.0006 7.58482 25.0006 8.74968 25.0006C9.91453 25.0006 10.4976 25.0006 10.957 24.8103C11.5696 24.5565 12.0558 24.0694 12.3096 23.4568C12.4999 22.9974 12.5 22.4149 12.5 21.2501V20.0001C12.5 18.6194 13.6193 17.5001 15 17.5001C16.3807 17.5001 17.5 18.6194 17.5 20.0001V21.2501C17.5 22.4149 17.5 22.9974 17.6903 23.4568C17.944 24.0694 18.4304 24.5565 19.043 24.8103C19.5024 25.0006 20.0848 25.0006 21.2497 25.0006C22.4145 25.0006 22.9976 25.0006 23.457 24.8103C24.0696 24.5565 24.5558 24.0693 24.8096 23.4567C24.9999 22.9973 25 22.4151 25 21.2502Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChatIcon: React.FC<IconProps> = ({ color }) => (
  <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
    <Path
      d="M9.38721 24.7522C11.0391 25.7049 12.9557 26.2499 14.9996 26.2499C21.2128 26.2499 26.25 21.2132 26.25 15C26.25 8.7868 21.2132 3.75 15 3.75C8.7868 3.75 3.75 8.7868 3.75 15C3.75 17.0439 4.29505 18.9605 5.24774 20.6123L5.25143 20.6187C5.3431 20.7777 5.38932 20.8578 5.41026 20.9336C5.43001 21.005 5.43552 21.0692 5.43047 21.1432C5.42503 21.2226 5.39825 21.305 5.34335 21.4697L4.38232 24.3528L4.38111 24.3566C4.17835 24.9649 4.07696 25.2691 4.14923 25.4717C4.21224 25.6484 4.35211 25.7879 4.52881 25.8509C4.73102 25.923 5.03381 25.8221 5.63943 25.6202L5.64697 25.6174L8.53006 24.6564C8.69422 24.6017 8.77767 24.5739 8.85699 24.5685C8.93094 24.5634 8.99472 24.5701 9.06616 24.5898C9.1421 24.6108 9.22229 24.6571 9.38204 24.7492L9.38721 24.7522Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.8185 10.2H13.7855L17.3485 20H15.5355L14.9055 18.264H10.7055L10.0755 20H8.26254L11.8185 10.2ZM11.3285 16.556H14.2755L12.7985 12.517L11.3285 16.556ZM18.533 20V10.2H20.241V20H18.533Z"
      fill={color}
    />
  </Svg>
);

const JournalIcon: React.FC<IconProps> = ({ color }) => (
  <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
    <Path
      d="M10 5H9.00024C7.60011 5 6.89953 5 6.36475 5.27248C5.89434 5.51217 5.51217 5.89434 5.27248 6.36475C5 6.89953 5 7.60011 5 9.00024V21.0002C5 22.4004 5 23.1001 5.27248 23.6349C5.51217 24.1053 5.89434 24.4881 6.36475 24.7278C6.899 25 7.59874 25 8.99614 25H10M10 5H21.0002C22.4004 5 23.0995 5 23.6342 5.27248C24.1046 5.51217 24.4881 5.89434 24.7278 6.36475C25 6.899 25 7.59874 25 8.99614V21.0045C25 22.4019 25 23.1006 24.7278 23.6349C24.4881 24.1053 24.1046 24.4881 23.6342 24.7278C23.1 25 22.4013 25 21.0039 25H10M10 5V25M15 13.75H20M15 10H20"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TherapistIcon: React.FC<IconProps> = ({ color }) => (
  <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
    <Path
      d="M11.6727 19.9881C15.6182 19.7689 18.75 16.5003 18.75 12.5C18.75 8.35786 15.3921 5 11.25 5C7.10786 5 3.75 8.35786 3.75 12.5C3.75 13.9759 4.17617 15.3521 4.91236 16.5125L4.38232 18.1026L4.38148 18.1049C4.17847 18.7139 4.07692 19.0186 4.14923 19.2214C4.21224 19.3981 4.35211 19.5373 4.52881 19.6004C4.7309 19.6724 5.03343 19.5716 5.63836 19.3699L5.64697 19.3673L7.23755 18.8373C8.39788 19.5735 9.77419 19.9998 11.2501 19.9998C11.3919 19.9998 11.5328 19.9958 11.6727 19.9881ZM11.6727 19.9881C11.6728 19.9884 11.6726 19.9878 11.6727 19.9881ZM11.6727 19.9881C12.6988 22.9074 15.4801 25.0002 18.7502 25.0002C20.2261 25.0002 21.6021 24.5735 22.7623 23.8373L24.3525 24.3673L24.3556 24.3679C24.9646 24.5709 25.2698 24.6727 25.4726 24.6003C25.6493 24.5373 25.7873 24.398 25.8504 24.2213C25.9228 24.0183 25.8215 23.7133 25.6179 23.1026L25.0879 21.5125L25.2654 21.2183C25.8922 20.1224 26.2493 18.8529 26.2493 17.5C26.2493 13.3579 22.8921 10 18.75 10L18.4692 10.0052L18.3276 10.0121"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TAB_CONFIG: Array<{
  key: BottomNavTab;
  label: string;
  Icon: React.FC<IconProps>;
}> = [
  { key: 'Home', label: 'Home', Icon: HomeIcon },
  { key: 'Adam', label: 'Adam', Icon: ChatIcon },
  { key: 'Journal', label: 'Journal', Icon: JournalIcon },
  { key: 'Therapist', label: 'Therapist', Icon: TherapistIcon },
];

const BottomNav: React.FC<BottomNavProps> = ({ active, onTabPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(8, insets.bottom) }]}> 
      <View style={styles.row}>
        {TAB_CONFIG.map(tab => {
          const isActive = tab.key === active;
          const Icon = tab.Icon;
          const iconColor = isActive ? '#7857e1' : '#302f2f';
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.item}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <Icon color={iconColor} />
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
    marginTop: 2,
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