import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { DetailScreen } from '../screens/DetailScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { useSavedStore } from '../stores/savedStore';
import { COLORS } from '../theme';
import type { HomeStackParamList, RootTabParamList } from './types';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator(): React.JSX.Element {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.accent,
        headerTitleStyle: { fontWeight: 'bold' as const },
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <HomeStack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ title: 'Nido Coworking' }}
      />
      <HomeStack.Screen
        name="HomeDetail"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  const savedCount = useSavedStore((state) => state.items.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        tabBarIcon: ({ color, size }) => {
          const iconName: keyof typeof Ionicons.glyphMap =
            route.name === 'Home' ? 'business-outline' : 'bookmark-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Espacios' }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Guardados',
          tabBarBadge: savedCount > 0 ? savedCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}
