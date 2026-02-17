package com.uneg.pictorialArcane.domain.tools;

import java.security.SecureRandom;

public class SecurityCodeGenerator {
    private static final SecureRandom secureRandom = new SecureRandom();

    /**
     * Genera un código numérico aleatorio con la longitud especificada.
     * @param length Longitud del código (ej. 3 para CVV).
     * @return String con el código generado.
     */
    public static String generateNumericPin(int length) {
        StringBuilder pin = new StringBuilder();
        for (int i = 0; i < length; i++) {
            pin.append(secureRandom.nextInt(10)); // Agrega un dígito de 0-9
        }
        return pin.toString();
    }
}
