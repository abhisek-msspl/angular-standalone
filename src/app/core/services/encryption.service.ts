import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private saltKey = '3151316122414139'; // string key length must me 16 character

  /**
   * * Encrypt Using AES256
   *
   * @param request
   * @returns response
   *
   * @developer Abhisek Dhua
   */
  encryptUsingAES256(request: string) {
    const _key = CryptoJS.enc.Utf8.parse(this.saltKey);
    const _iv = CryptoJS.enc.Utf8.parse(this.saltKey);

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(request), _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    const response = encrypted.toString();
    return response;
  }

  /**
   * * Decrypt Using AES256
   * JSON Parse date before use
   * @param request
   * @returns response
   *
   * @developer Abhisek Dhua
   */
  decryptUsingAES256(request: string) {
    const _key = CryptoJS.enc.Utf8.parse(this.saltKey);
    const _iv = CryptoJS.enc.Utf8.parse(this.saltKey);

    const response = CryptoJS.AES.decrypt(request, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    return JSON.parse(response);
  }
}
