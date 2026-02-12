import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: true, title: "Home" }}
      />
      <Stack.Screen
        name="components/details"
        options={{
          headerShown: true,
          title: "Details",
          headerBackButtonDisplayMode: "minimal",
          presentation: "formSheet",
          sheetAllowedDetents: [0.3, 0.5, 0.9],
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
          sheetInitialDetentIndex: 1,
          sheetLargestUndimmedDetentIndex: 0,
          sheetExpandsWhenScrolledToEdge: true,
          contentStyle: { backgroundColor: "white" },
        }}
      />
    </Stack>
  );
}
