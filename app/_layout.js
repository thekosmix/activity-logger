import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="add-activity"
        options={{
          tabBarLabel: 'Add Activity',
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          tabBarLabel: 'Menu',
        }}
      />
      <Tabs.Screen
        name="admin/employees"
        options={{
          tabBarLabel: 'Employees',
        }}
      />
    </Tabs>
  );
}
