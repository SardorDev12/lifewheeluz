import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GoalDetailScreen } from '../screens/GoalDetailScreen';
import { GoalsListScreen } from '../screens/GoalsListScreen';

export type GoalsStackParamList = {
  GoalsList: undefined;
  GoalDetail: { goalId: string };
};

const Stack = createNativeStackNavigator<GoalsStackParamList>();

export function GoalsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#f5f7f3' },
        headerTintColor: '#2f776a',
        headerShadowVisible: false,
        headerTitleStyle: { color: '#1f2c28' },
      }}
    >
      <Stack.Screen
        name="GoalsList"
        component={GoalsListScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="GoalDetail"
        component={GoalDetailScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}
