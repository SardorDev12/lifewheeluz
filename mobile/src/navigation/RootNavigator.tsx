import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { copy } from '@lifewheeluz/shared';
import {
  Compass,
  LayoutDashboard,
  RefreshCw,
  Settings,
  Target,
} from 'lucide-react-native';
import { useDraft } from '../hooks/useDataStore';
import { GoalsStack } from './GoalsStack';
import { MyLifeScreen } from '../screens/MyLifeScreen';
import { ReviewsScreen } from '../screens/ReviewsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TodayScreen } from '../screens/TodayScreen';

export type RootTabParamList = {
  Today: undefined;
  MyLife: undefined;
  Goals: undefined;
  Reviews: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const { locale } = useDraft(),
    t = copy[locale];
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2f776a',
          tabBarInactiveTintColor: '#94a3a8',
          tabBarStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Tab.Screen
          name="Today"
          component={TodayScreen}
          options={{
            title: t.today,
            tabBarIcon: ({ color, size }) => (
              <LayoutDashboard color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="MyLife"
          component={MyLifeScreen}
          options={{
            title: t.life,
            tabBarIcon: ({ color, size }) => (
              <Compass color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Goals"
          component={GoalsStack}
          options={{
            title: t.goals,
            tabBarIcon: ({ color, size }) => (
              <Target color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Reviews"
          component={ReviewsScreen}
          options={{
            title: t.reviews,
            tabBarIcon: ({ color, size }) => (
              <RefreshCw color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: t.settings,
            tabBarIcon: ({ color, size }) => (
              <Settings color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
