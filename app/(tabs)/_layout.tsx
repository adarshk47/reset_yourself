import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerTitleAlign: "center" }}>
      <Tabs.Screen
        name="index"
        options={{ title: "Goals", tabBarLabel: "Goals" }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: "Chat", tabBarLabel: "Chat" }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Settings", tabBarLabel: "Settings" }}
      />
    </Tabs>
  );
}
