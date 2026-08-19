package com.caraivatours.hub.shared.utils;

public final class PhoneFormatter {

    private PhoneFormatter() {}

    public static String format(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }

        String digits = value.replaceAll("[^0-9]", "");
        return switch (digits.length()) {
            case 11 -> "(%s) %s-%s".formatted(
                    digits.substring(0, 2), digits.substring(2, 7), digits.substring(7));
            case 10 -> "(%s) %s-%s".formatted(
                    digits.substring(0, 2), digits.substring(2, 6), digits.substring(6));
            case 9 -> "%s-%s".formatted(digits.substring(0, 5), digits.substring(5));
            case 8 -> "%s-%s".formatted(digits.substring(0, 4), digits.substring(4));
            default -> value.trim();
        };
    }
}
