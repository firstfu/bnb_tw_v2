import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, StyleProp } from "react-native";
import { colors, typography, borderRadius } from "../theme";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({ onPress, title, variant = "primary", size = "medium", disabled = false, loading = false, style, textStyle }: ButtonProps) {
  const getButtonStyle = (): StyleProp<ViewStyle>[] => {
    const baseStyle: StyleProp<ViewStyle>[] = [styles.button, styles[`${size}Button`]];

    switch (variant) {
      case "secondary":
        baseStyle.push(styles.secondaryButton);
        break;
      case "outline":
        baseStyle.push(styles.outlineButton);
        break;
      default:
        baseStyle.push(styles.primaryButton);
    }

    if (disabled) {
      baseStyle.push(styles.disabledButton);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = (): StyleProp<TextStyle>[] => {
    const baseStyle: StyleProp<TextStyle>[] = [styles.text, styles[`${size}Text`]];

    switch (variant) {
      case "outline":
        baseStyle.push(styles.outlineText);
        break;
      case "secondary":
        baseStyle.push(styles.secondaryText);
        break;
      default:
        baseStyle.push(styles.primaryText);
    }

    if (disabled) {
      baseStyle.push(styles.disabledText);
    }

    if (textStyle) {
      baseStyle.push(textStyle);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={getButtonStyle()}>
      {loading ? <ActivityIndicator color={variant === "outline" ? colors.primary : colors.background} size="small" /> : <Text style={getTextStyle()}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    textAlign: "center",
  },
  primaryText: {
    color: colors.background,
  },
  secondaryText: {
    color: colors.background,
  },
  outlineText: {
    color: colors.primary,
  },
  disabledText: {
    opacity: 0.5,
  },
  smallText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
  },
  mediumText: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
  largeText: {
    fontSize: typography.h3.fontSize,
    fontWeight: "600",
  },
});
