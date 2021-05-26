import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CookieService {
  constructor() {}

  setCloudFrontCookie(cookies) {
    const cookiePrefix = [
      "CloudFront-Policy",
      "CloudFront-Key-Pair-Id",
      "CloudFront-Signature",
    ];
    cookiePrefix.forEach((prefix) => {
      this.setCookie(prefix + "=" + cookies[prefix]);
    });
  }

  verifyCloudFrontCookie() {
    const cookiePrefix = [
      "CloudFront-Policy",
      "CloudFront-Key-Pair-Id",
      "CloudFront-Signature",
    ];

    const prefixFlagIndex = ["unchecked", "unchecked", "unchecked"];
    const cookies = this.getCookie();

    cookies.forEach((cookie) => {
      if (prefixFlagIndex.indexOf("unchecked") > -1) {
        cookiePrefix.forEach((prefix, key) => {
          if (
            cookie.trim().includes(prefix + "=") &&
            prefixFlagIndex[key] == "unchecked"
          ) {
            prefixFlagIndex[key] = "checked";
          }
        });
      }
    });
    return prefixFlagIndex.indexOf("unchecked") > -1 ? false : true;
  }

  clearCloudfrontCookies() {
    const cookiePrefix = [
      "CloudFront-Policy",
      "CloudFront-Key-Pair-Id",
      "CloudFront-Signature",
    ];
    const prefixFlagIndex = ["unchecked", "unchecked", "unchecked"];
    const cookies = this.getCookie();

    cookies.forEach((cookie) => {
      if (prefixFlagIndex.indexOf("unchecked") > -1) {
        cookiePrefix.forEach((prefix, key) => {
          if (
            cookie.trim().includes(prefix + "=") &&
            prefixFlagIndex[key] == "unchecked"
          ) {
            this.setCookie(
              cookie + ";path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;"
            );
            prefixFlagIndex[key] = "checked";
          }
        });
      }
    });
  }

  getCookie() {
    return [...document.cookie.split(";")];
  }

  setCookie(cookie) {
    document.cookie = cookie;
  }
}
