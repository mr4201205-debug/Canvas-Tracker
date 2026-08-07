package com.canvastracker.canvas_tracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class EncryptionService {

    @Value("${encryption.secret}")
    private String secret;

    private SecretKeySpec getKey() {
        byte[] key = secret.getBytes();
        byte[] keyBytes = new byte[16];
        System.arraycopy(key, 0, keyBytes, 0, Math.min(key.length, keyBytes.length));
        return new SecretKeySpec(keyBytes, "AES");
    }

    public String encrypt(String value) {
        if (value == null) return null;
        try {
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, getKey());
            return Base64.getEncoder().encodeToString(cipher.doFinal(value.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting value", e);
        }
    }

    public String decrypt(String value) {
        if (value == null) return null;
        try {
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, getKey());
            return new String(cipher.doFinal(Base64.getDecoder().decode(value)));
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting value", e);
        }
    }
}

/* AES encryption example -
* canvas token - canvas1234
* code splits token into 16 charcter block and adds xxxx.. to fill the rest
*  code uses secret password to convert canvas1234 to binary bytes &j&...
* using base64 bytes get converted to readable text that gets saved to databse - h73dbvk1...*/