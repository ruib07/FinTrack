import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "titleSemiBold"
    | "defaultSemiBold"
    | "subtitle"
    | "subtitleSemiBold"
    | "link"
    | "table";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "titleSemiBold" ? styles.titleSemiBold : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "subtitleSemiBold" ? styles.subtitleSemiBold : undefined,
        type === "link" ? styles.link : undefined,
        type === "table" ? styles.table : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    lineHeight: 32,
  },
  titleSemiBold: {
    fontSize: 26,
    lineHeight: 24,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitleSemiBold: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "600",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#B0B0B0",
    textDecorationLine: "underline",
  },
  table: {
    fontSize: 14,
    lineHeight: 20,
  },
});
