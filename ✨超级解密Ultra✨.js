// ULTRA_IMPL_VERSION = 20260935  （preRule 用此标记比对版本，请勿删除）
var ULTRA_IMPL_VERSION = 20260935;
var d = [];
// ===== 远程开关（preRule 每天联网更新 ultra_disabled 标记） =====
var _ultraDisabled = '';
try { _ultraDisabled = getMyVar('ultra_disabled'); } catch(e) {}
if (_ultraDisabled == '1') {
    d.push({ title: '跑路了', desc: '作者已停止维护该规则', url: 'toast://跑路了', col_type: 'text_1' });
    setResult(d);
} else {


// ===== 自包含加密核心（与原版 evalPrivateJS 完全兼容，纯本机运算） =====
// ===== 超级解密Ultra 重构版 · 自包含加密核心 =====
// 算法：AES-256/ECB/PKCS7，密钥 "hk6666666109" 右补 '0' 至32字节（与原版 CryptoJS 实现一致）
// 输出：base64(密文)；加密包装为 js:\nevalPrivateJS("...")

var AES_SBOX = [
0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];

var AES_INV_SBOX = (function(){ var t = new Array(256); for (var i = 0; i < 256; i++) t[AES_SBOX[i]] = i; return t; })();

function aesKeyExpand256(key) {
    var w = new Array(240), i;
    for (i = 0; i < 32; i++) w[i] = key[i] & 0xff;
    var rcon = 0x01;
    for (i = 8; i < 60; i++) {
        var t0 = w[4*(i-1)], t1 = w[4*(i-1)+1], t2 = w[4*(i-1)+2], t3 = w[4*(i-1)+3];
        if (i % 8 === 0) {
            var u = t0;
            t0 = (AES_SBOX[t1] ^ rcon) & 0xff; t1 = AES_SBOX[t2]; t2 = AES_SBOX[t3]; t3 = AES_SBOX[u];
            rcon = (rcon << 1) ^ ((rcon & 0x80) ? 0x11b : 0); rcon &= 0xff;
        } else if (i % 8 === 4) {
            t0 = AES_SBOX[t0]; t1 = AES_SBOX[t1]; t2 = AES_SBOX[t2]; t3 = AES_SBOX[t3];
        }
        w[4*i] = w[4*(i-8)] ^ t0; w[4*i+1] = w[4*(i-8)+1] ^ t1;
        w[4*i+2] = w[4*(i-8)+2] ^ t2; w[4*i+3] = w[4*(i-8)+3] ^ t3;
    }
    return w;
}
function aesAddRoundKey(s, w, off) { for (var i = 0; i < 16; i++) s[i] ^= w[off+i]; }
function aesSubBytes(s) { for (var i = 0; i < 16; i++) s[i] = AES_SBOX[s[i]]; }
function aesInvSubBytes(s) { for (var i = 0; i < 16; i++) s[i] = AES_INV_SBOX[s[i]]; }
function aesShiftRows(s) {
    var t = s.slice(0);
    s[0]=t[0];  s[4]=t[4];  s[8]=t[8];   s[12]=t[12];
    s[1]=t[5];  s[5]=t[9];  s[9]=t[13];  s[13]=t[1];
    s[2]=t[10]; s[6]=t[14]; s[10]=t[2];  s[14]=t[6];
    s[3]=t[15]; s[7]=t[3];  s[11]=t[7];  s[15]=t[11];
}
function aesInvShiftRows(s) {
    var t = s.slice(0);
    s[0]=t[0];  s[4]=t[4];  s[8]=t[8];   s[12]=t[12];
    s[1]=t[13]; s[5]=t[1];  s[9]=t[5];   s[13]=t[9];
    s[2]=t[10]; s[6]=t[14]; s[10]=t[2];  s[14]=t[6];
    s[3]=t[7];  s[7]=t[11]; s[11]=t[15]; s[15]=t[3];
}
function xtime(a) { return ((a << 1) ^ ((a & 0x80) ? 0x1b : 0)) & 0xff; }
function aesMixColumns(s) {
    for (var c = 0; c < 4; c++) {
        var i = c*4, a0=s[i], a1=s[i+1], a2=s[i+2], a3=s[i+3];
        s[i]   = xtime(a0)^xtime(a1)^a1^a2^a3;
        s[i+1] = a0^xtime(a1)^xtime(a2)^a2^a3;
        s[i+2] = a0^a1^xtime(a2)^xtime(a3)^a3;
        s[i+3] = xtime(a0)^a0^a1^a2^xtime(a3);
    }
}
function gmul(a, b) {
    var p = 0;
    for (var i = 0; i < 8; i++) {
        if (b & 1) p ^= a;
        var hi = a & 0x80; a = (a << 1) & 0xff;
        if (hi) a ^= 0x1b;
        b >>= 1;
    }
    return p;
}
function aesInvMixColumns(s) {
    for (var c = 0; c < 4; c++) {
        var i = c*4, a0=s[i], a1=s[i+1], a2=s[i+2], a3=s[i+3];
        s[i]   = gmul(a0,0x0e)^gmul(a1,0x0b)^gmul(a2,0x0d)^gmul(a3,0x09);
        s[i+1] = gmul(a0,0x09)^gmul(a1,0x0e)^gmul(a2,0x0b)^gmul(a3,0x0d);
        s[i+2] = gmul(a0,0x0d)^gmul(a1,0x09)^gmul(a2,0x0e)^gmul(a3,0x0b);
        s[i+3] = gmul(a0,0x0b)^gmul(a1,0x0d)^gmul(a2,0x09)^gmul(a3,0x0e);
    }
}
function aesEncryptBlock(pt, w) {
    var s = pt.slice(0), r;
    aesAddRoundKey(s, w, 0);
    for (r = 1; r <= 13; r++) { aesSubBytes(s); aesShiftRows(s); aesMixColumns(s); aesAddRoundKey(s, w, r*16); }
    aesSubBytes(s); aesShiftRows(s); aesAddRoundKey(s, w, 14*16);
    return s;
}
function aesDecryptBlock(ct, w) {
    var s = ct.slice(0), r;
    aesAddRoundKey(s, w, 14*16);
    for (r = 13; r >= 1; r--) { aesInvShiftRows(s); aesInvSubBytes(s); aesAddRoundKey(s, w, r*16); aesInvMixColumns(s); }
    aesInvShiftRows(s); aesInvSubBytes(s); aesAddRoundKey(s, w, 0);
    return s;
}

// ---------- UTF-8 ----------
function utf8Encode(str) {
    var out = [], i, c;
    for (i = 0; i < str.length; i++) {
        c = str.charCodeAt(i);
        if (c < 0x80) out.push(c);
        else if (c < 0x800) out.push(0xc0|(c>>6), 0x80|(c&0x3f));
        else if (c >= 0xd800 && c <= 0xdbff) {
            var h = c, l = str.charCodeAt(++i), cp = 0x10000 + ((h-0xd800)<<10) + (l-0xdc00);
            out.push(0xf0|(cp>>18), 0x80|((cp>>12)&0x3f), 0x80|((cp>>6)&0x3f), 0x80|(cp&0x3f));
        } else out.push(0xe0|(c>>12), 0x80|((c>>6)&0x3f), 0x80|(c&0x3f));
    }
    return out;
}
function utf8Decode(bytes) {
    var out = "", i = 0, b, b2, b3, b4, cp;
    while (i < bytes.length) {
        b = bytes[i++];
        if (b < 0x80) out += String.fromCharCode(b);
        else if ((b & 0xe0) === 0xc0) {
            b2 = bytes[i++]; if ((b2 & 0xc0) !== 0x80) throw "bad utf8";
            cp = ((b & 0x1f) << 6) | (b2 & 0x3f); if (cp < 0x80) throw "bad utf8";
            out += String.fromCharCode(cp);
        } else if ((b & 0xf0) === 0xe0) {
            b2 = bytes[i++]; b3 = bytes[i++];
            if ((b2 & 0xc0) !== 0x80 || (b3 & 0xc0) !== 0x80) throw "bad utf8";
            cp = ((b & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f); if (cp < 0x800) throw "bad utf8";
            out += String.fromCharCode(cp);
        } else if ((b & 0xf8) === 0xf0) {
            b2 = bytes[i++]; b3 = bytes[i++]; b4 = bytes[i++];
            if ((b2 & 0xc0) !== 0x80 || (b3 & 0xc0) !== 0x80 || (b4 & 0xc0) !== 0x80) throw "bad utf8";
            cp = ((b & 0x07) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f);
            if (cp < 0x10000 || cp > 0x10ffff) throw "bad utf8";
            cp -= 0x10000; out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
        } else throw "bad utf8";
    }
    return out;
}

// ---------- Base64 ----------
var B64CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64Encode(bytes) {
    var out = "", i, n, rem;
    for (i = 0; i + 2 < bytes.length; i += 3) {
        n = (bytes[i] << 16) | (bytes[i+1] << 8) | bytes[i+2];
        out += B64CHARS[(n>>18)&63] + B64CHARS[(n>>12)&63] + B64CHARS[(n>>6)&63] + B64CHARS[n&63];
    }
    rem = bytes.length - i;
    if (rem === 1) { n = bytes[i] << 16; out += B64CHARS[(n>>18)&63] + B64CHARS[(n>>12)&63] + "=="; }
    else if (rem === 2) { n = (bytes[i] << 16) | (bytes[i+1] << 8); out += B64CHARS[(n>>18)&63] + B64CHARS[(n>>12)&63] + B64CHARS[(n>>6)&63] + "="; }
    return out;
}
function b64DecodeToBytes(s) {
    s = ("" + s).replace(/\s+/g, "");
    if (/[^A-Za-z0-9+\/=]/.test(s)) throw "bad base64";
    if (s.length % 4 !== 0) throw "bad base64";
    var out = [], i, c0, c1, c2, c3, n;
    for (i = 0; i < s.length; i += 4) {
        c0 = B64CHARS.indexOf(s.charAt(i)); c1 = B64CHARS.indexOf(s.charAt(i+1));
        c2 = s.charAt(i+2) === "=" ? 0 : B64CHARS.indexOf(s.charAt(i+2));
        c3 = s.charAt(i+3) === "=" ? 0 : B64CHARS.indexOf(s.charAt(i+3));
        if (c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0) throw "bad base64";
        n = (c0 << 18) | (c1 << 12) | (c2 << 6) | c3;
        out.push((n >> 16) & 0xff);
        if (s.charAt(i+2) !== "=") out.push((n >> 8) & 0xff);
        if (s.charAt(i+3) !== "=") out.push(n & 0xff);
    }
    return out;
}

// ---------- PKCS7 ----------
function pkcs7Pad(b) { var p = 16 - (b.length % 16), i; for (i = 0; i < p; i++) b.push(p); return b; }
function pkcs7Unpad(b) {
    if (b.length === 0 || b.length % 16 !== 0) throw "bad padding";
    var p = b[b.length-1], i;
    if (p < 1 || p > 16) throw "bad padding";
    for (i = 0; i < p; i++) if (b[b.length-1-i] !== p) throw "bad padding";
    return b.slice(0, b.length - p);
}

// ---------- Ultra 加解密（与原版兼容） ----------
function ultraKeyBytes() { var k = "hk6666666109"; while (k.length < 32) k += "0"; return utf8Encode(k); }
var _ULTRA_W = null;
function ultraRoundKeys() { if (!_ULTRA_W) _ULTRA_W = aesKeyExpand256(ultraKeyBytes()); return _ULTRA_W; }
function ultraEncrypt(text) {
    var b = pkcs7Pad(utf8Encode("" + text)), w = ultraRoundKeys(), out = [], i, j, blk;
    for (i = 0; i < b.length; i += 16) { blk = aesEncryptBlock(b.slice(i, i+16), w); for (j = 0; j < 16; j++) out.push(blk[j]); }
    return b64Encode(out);
}
function ultraDecrypt(b64) {
    var b = b64DecodeToBytes(b64);
    if (b.length === 0 || b.length % 16 !== 0) throw "bad data";
    var w = ultraRoundKeys(), out = [], i, j, blk;
    for (i = 0; i < b.length; i += 16) { blk = aesDecryptBlock(b.slice(i, i+16), w); for (j = 0; j < 16; j++) out.push(blk[j]); }
    return utf8Decode(pkcs7Unpad(out));
}

// ---------- 业务逻辑 ----------
function ultraEncryptAll(code) {
    // 与海阔 开发者模式→生成加密代码 完全一致：只剥掉开头的 js: 及一个换行
    var body = ("" + code).replace(/^js:(\r\n|\n|\r)?/, "");
    if (/^\s*evalPrivateJS\(['"][^"']+['"]\);?\s*$/.test(body)) return { skip: true };
    return { text: "js:\nevalPrivateJS(\"" + ultraEncrypt(body) + "\");" };
}
function ultraDecryptAll(code) {
    var ok = 0, fail = 0, guard = 0, cur = "" + code;
    var failedSet = {};
    while (guard < 10) {
        guard++;
        var re = /evalPrivateJS\(['"]([^"']+)['"]\);?/g, out = "", last = 0, m, okThisPass = 0;
        while ((m = re.exec(cur))) {
            out += cur.slice(last, m.index);
            try { out += ultraDecrypt(m[1]); ok++; okThisPass++; }
            catch (e) { out += m[0]; if (!failedSet[m[1]]) { failedSet[m[1]] = 1; fail++; } }
            last = m.index + m[0].length;
        }
        if (okThisPass === 0) break;
        out += cur.slice(last);
        if (out === cur) break;
        cur = out;
    }
    if (ok === 0) {
        try { var dec = ultraDecrypt(cur.trim()); if (dec && dec.length > 0) return { text: dec, ok: 1, fail: 0, raw: true }; } catch (e) {}
    }
    return { text: cur, ok: ok, fail: fail };
}

function getClipboardText() {
    try {
        var Context = android.content.Context;
        var context = getCurrentActivity();
        var clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE);
        var clipData = clipboard.getPrimaryClip();
        if (clipData != null && clipData.getItemCount() > 0) {
            var text = clipData.getItemAt(0).getText();
            if (text != null) { return String(text.toString()); }
        }
        return null;
    } catch (e) { return null; }
}

// ===== 界面 =====
d.push({
    title: "✨超级解密Ultra✨",
    desc: "AES-256/ECB 本地加解密 · 数据不出本机 · 无需联网",
    url: "hiker://empty",
    col_type: "text_1"
});

// 上：原码框
d.push({
    title: "📝 原码",
    url: "",
    col_type: "input",
    desc: "要加密的明文写这里；解密后的明文也显示在这里",
    extra: {
        id: "plain",
        type: "textarea",
        highlight: true,
        onChange: $.toString(() => { putMyVar("plain", input); }),
        defaultValue: getMyVar("plain") || ""
    }
});

// 下：加密代码框
d.push({
    title: "🔐 加密代码",
    url: "",
    col_type: "input",
    desc: "加密结果显示在这里；要解密的代码也可以直接贴这里",
    extra: {
        id: "cipher",
        type: "textarea",
        highlight: true,
        onChange: $.toString(() => { putMyVar("cipher", input); }),
        defaultValue: getMyVar("cipher") || ""
    }
});

d.push({
    title: "复制",
    url: $("#noLoading#").lazyRule(() => {
        var t = getMyVar("cipher") || getMyVar("plain") || "";
        if (!t) return "toast://内容为空，无法复制";
        return "copy://" + t;
    }),
    col_type: "text_2"
});

d.push({
    title: "粘贴",
    url: $("#noLoading#").lazyRule(() => {
        function getClipboardText() {
            try {
                var Context = android.content.Context;
                var context = getCurrentActivity();
                var clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE);
                var clipData = clipboard.getPrimaryClip();
                if (clipData != null && clipData.getItemCount() > 0) {
                    var text = clipData.getItemAt(0).getText();
                    if (text != null) { return String(text.toString()); }
                }
                return null;
            } catch (e) { return null; }
        }
        var t = getClipboardText();
        if (t == null || t === "") return "toast://剪贴板为空";
        putMyVar("plain", t);
        updateItem("plain", { extra: Object.assign(findItem("plain").extra, { defaultValue: t }) });
        putMyVar("cipher", "");
        updateItem("cipher", { extra: Object.assign(findItem("cipher").extra, { defaultValue: "" }) });
        return "toast://已粘贴到原码框";
    }),
    col_type: "text_2"
});

d.push({
    title: "清除",
    url: $("#noLoading#").lazyRule(() => {
        putMyVar("plain", "");
        updateItem("plain", { extra: Object.assign(findItem("plain").extra, { defaultValue: "" }) });
        putMyVar("cipher", "");
        updateItem("cipher", { extra: Object.assign(findItem("cipher").extra, { defaultValue: "" }) });
        return "toast://已清空";
    }),
    col_type: "text_2"
});

d.push({
    title: "加密",
    url: $().lazyRule(() => {
        // ===== 超级解密Ultra 重构版 · 自包含加密核心 =====
        // 算法：AES-256/ECB/PKCS7，密钥 "hk6666666109" 右补 '0' 至32字节（与原版 CryptoJS 实现一致）
        // 输出：base64(密文)；加密包装为 js:\nevalPrivateJS("...")

        var AES_SBOX = [
        0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
        0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
        0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
        0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
        0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
        0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
        0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
        0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
        0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
        0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
        0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
        0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
        0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
        0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
        0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
        0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];

        var AES_INV_SBOX = (function(){ var t = new Array(256); for (var i = 0; i < 256; i++) t[AES_SBOX[i]] = i; return t; })();

        function aesKeyExpand256(key) {
            var w = new Array(240), i;
            for (i = 0; i < 32; i++) w[i] = key[i] & 0xff;
            var rcon = 0x01;
            for (i = 8; i < 60; i++) {
                var t0 = w[4*(i-1)], t1 = w[4*(i-1)+1], t2 = w[4*(i-1)+2], t3 = w[4*(i-1)+3];
                if (i % 8 === 0) {
                    var u = t0;
                    t0 = (AES_SBOX[t1] ^ rcon) & 0xff; t1 = AES_SBOX[t2]; t2 = AES_SBOX[t3]; t3 = AES_SBOX[u];
                    rcon = (rcon << 1) ^ ((rcon & 0x80) ? 0x11b : 0); rcon &= 0xff;
                } else if (i % 8 === 4) {
                    t0 = AES_SBOX[t0]; t1 = AES_SBOX[t1]; t2 = AES_SBOX[t2]; t3 = AES_SBOX[t3];
                }
                w[4*i] = w[4*(i-8)] ^ t0; w[4*i+1] = w[4*(i-8)+1] ^ t1;
                w[4*i+2] = w[4*(i-8)+2] ^ t2; w[4*i+3] = w[4*(i-8)+3] ^ t3;
            }
            return w;
        }
        function aesAddRoundKey(s, w, off) { for (var i = 0; i < 16; i++) s[i] ^= w[off+i]; }
        function aesSubBytes(s) { for (var i = 0; i < 16; i++) s[i] = AES_SBOX[s[i]]; }
        function aesInvSubBytes(s) { for (var i = 0; i < 16; i++) s[i] = AES_INV_SBOX[s[i]]; }
        function aesShiftRows(s) {
            var t = s.slice(0);
            s[0]=t[0];  s[4]=t[4];  s[8]=t[8];   s[12]=t[12];
            s[1]=t[5];  s[5]=t[9];  s[9]=t[13];  s[13]=t[1];
            s[2]=t[10]; s[6]=t[14]; s[10]=t[2];  s[14]=t[6];
            s[3]=t[15]; s[7]=t[3];  s[11]=t[7];  s[15]=t[11];
        }
        function aesInvShiftRows(s) {
            var t = s.slice(0);
            s[0]=t[0];  s[4]=t[4];  s[8]=t[8];   s[12]=t[12];
            s[1]=t[13]; s[5]=t[1];  s[9]=t[5];   s[13]=t[9];
            s[2]=t[10]; s[6]=t[14]; s[10]=t[2];  s[14]=t[6];
            s[3]=t[7];  s[7]=t[11]; s[11]=t[15]; s[15]=t[3];
        }
        function xtime(a) { return ((a << 1) ^ ((a & 0x80) ? 0x1b : 0)) & 0xff; }
        function aesMixColumns(s) {
            for (var c = 0; c < 4; c++) {
                var i = c*4, a0=s[i], a1=s[i+1], a2=s[i+2], a3=s[i+3];
                s[i]   = xtime(a0)^xtime(a1)^a1^a2^a3;
                s[i+1] = a0^xtime(a1)^xtime(a2)^a2^a3;
                s[i+2] = a0^a1^xtime(a2)^xtime(a3)^a3;
                s[i+3] = xtime(a0)^a0^a1^a2^xtime(a3);
            }
        }
        function gmul(a, b) {
            var p = 0;
            for (var i = 0; i < 8; i++) {
                if (b & 1) p ^= a;
                var hi = a & 0x80; a = (a << 1) & 0xff;
                if (hi) a ^= 0x1b;
                b >>= 1;
            }
            return p;
        }
        function aesInvMixColumns(s) {
            for (var c = 0; c < 4; c++) {
                var i = c*4, a0=s[i], a1=s[i+1], a2=s[i+2], a3=s[i+3];
                s[i]   = gmul(a0,0x0e)^gmul(a1,0x0b)^gmul(a2,0x0d)^gmul(a3,0x09);
                s[i+1] = gmul(a0,0x09)^gmul(a1,0x0e)^gmul(a2,0x0b)^gmul(a3,0x0d);
                s[i+2] = gmul(a0,0x0d)^gmul(a1,0x09)^gmul(a2,0x0e)^gmul(a3,0x0b);
                s[i+3] = gmul(a0,0x0b)^gmul(a1,0x0d)^gmul(a2,0x09)^gmul(a3,0x0e);
            }
        }
        function aesEncryptBlock(pt, w) {
            var s = pt.slice(0), r;
            aesAddRoundKey(s, w, 0);
            for (r = 1; r <= 13; r++) { aesSubBytes(s); aesShiftRows(s); aesMixColumns(s); aesAddRoundKey(s, w, r*16); }
            aesSubBytes(s); aesShiftRows(s); aesAddRoundKey(s, w, 14*16);
            return s;
        }
        function aesDecryptBlock(ct, w) {
            var s = ct.slice(0), r;
            aesAddRoundKey(s, w, 14*16);
            for (r = 13; r >= 1; r--) { aesInvShiftRows(s); aesInvSubBytes(s); aesAddRoundKey(s, w, r*16); aesInvMixColumns(s); }
            aesInvShiftRows(s); aesInvSubBytes(s); aesAddRoundKey(s, w, 0);
            return s;
        }

        // ---------- UTF-8 ----------
        function utf8Encode(str) {
            var out = [], i, c;
            for (i = 0; i < str.length; i++) {
                c = str.charCodeAt(i);
                if (c < 0x80) out.push(c);
                else if (c < 0x800) out.push(0xc0|(c>>6), 0x80|(c&0x3f));
                else if (c >= 0xd800 && c <= 0xdbff) {
                    var h = c, l = str.charCodeAt(++i), cp = 0x10000 + ((h-0xd800)<<10) + (l-0xdc00);
                    out.push(0xf0|(cp>>18), 0x80|((cp>>12)&0x3f), 0x80|((cp>>6)&0x3f), 0x80|(cp&0x3f));
                } else out.push(0xe0|(c>>12), 0x80|((c>>6)&0x3f), 0x80|(c&0x3f));
            }
            return out;
        }
        function utf8Decode(bytes) {
            var out = "", i = 0, b, b2, b3, b4, cp;
            while (i < bytes.length) {
                b = bytes[i++];
                if (b < 0x80) out += String.fromCharCode(b);
                else if ((b & 0xe0) === 0xc0) {
                    b2 = bytes[i++]; if ((b2 & 0xc0) !== 0x80) throw "bad utf8";
                    cp = ((b & 0x1f) << 6) | (b2 & 0x3f); if (cp < 0x80) throw "bad utf8";
                    out += String.fromCharCode(cp);
                } else if ((b & 0xf0) === 0xe0) {
                    b2 = bytes[i++]; b3 = bytes[i++];
                    if ((b2 & 0xc0) !== 0x80 || (b3 & 0xc0) !== 0x80) throw "bad utf8";
                    cp = ((b & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f); if (cp < 0x800) throw "bad utf8";
                    out += String.fromCharCode(cp);
                } else if ((b & 0xf8) === 0xf0) {
                    b2 = bytes[i++]; b3 = bytes[i++]; b4 = bytes[i++];
                    if ((b2 & 0xc0) !== 0x80 || (b3 & 0xc0) !== 0x80 || (b4 & 0xc0) !== 0x80) throw "bad utf8";
                    cp = ((b & 0x07) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f);
                    if (cp < 0x10000 || cp > 0x10ffff) throw "bad utf8";
                    cp -= 0x10000; out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
                } else throw "bad utf8";
            }
            return out;
        }

        // ---------- Base64 ----------
        var B64CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        function b64Encode(bytes) {
            var out = "", i, n, rem;
            for (i = 0; i + 2 < bytes.length; i += 3) {
                n = (bytes[i] << 16) | (bytes[i+1] << 8) | bytes[i+2];
                out += B64CHARS[(n>>18)&63] + B64CHARS[(n>>12)&63] + B64CHARS[(n>>6)&63] + B64CHARS[n&63];
            }
            rem = bytes.length - i;
            if (rem === 1) { n = bytes[i] << 16; out += B64CHARS[(n>>18)&63] + B64CHARS[(n>>12)&63] + "=="; }
            else if (rem === 2) { n = (bytes[i] << 16) | (bytes[i+1] << 8); out += B64CHARS[(n>>18)&63] + B64CHARS[(n>>12)&63] + B64CHARS[(n>>6)&63] + "="; }
            return out;
        }
        function b64DecodeToBytes(s) {
            s = ("" + s).replace(/\s+/g, "");
            if (/[^A-Za-z0-9+\/=]/.test(s)) throw "bad base64";
            if (s.length % 4 !== 0) throw "bad base64";
            var out = [], i, c0, c1, c2, c3, n;
            for (i = 0; i < s.length; i += 4) {
                c0 = B64CHARS.indexOf(s.charAt(i)); c1 = B64CHARS.indexOf(s.charAt(i+1));
                c2 = s.charAt(i+2) === "=" ? 0 : B64CHARS.indexOf(s.charAt(i+2));
                c3 = s.charAt(i+3) === "=" ? 0 : B64CHARS.indexOf(s.charAt(i+3));
                if (c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0) throw "bad base64";
                n = (c0 << 18) | (c1 << 12) | (c2 << 6) | c3;
                out.push((n >> 16) & 0xff);
                if (s.charAt(i+2) !== "=") out.push((n >> 8) & 0xff);
                if (s.charAt(i+3) !== "=") out.push(n & 0xff);
            }
            return out;
        }

        // ---------- PKCS7 ----------
        function pkcs7Pad(b) { var p = 16 - (b.length % 16), i; for (i = 0; i < p; i++) b.push(p); return b; }
        function pkcs7Unpad(b) {
            if (b.length === 0 || b.length % 16 !== 0) throw "bad padding";
            var p = b[b.length-1], i;
            if (p < 1 || p > 16) throw "bad padding";
            for (i = 0; i < p; i++) if (b[b.length-1-i] !== p) throw "bad padding";
            return b.slice(0, b.length - p);
        }

        // ---------- Ultra 加解密（与原版兼容） ----------
        function ultraKeyBytes() { var k = "hk6666666109"; while (k.length < 32) k += "0"; return utf8Encode(k); }
        var _ULTRA_W = null;
        function ultraRoundKeys() { if (!_ULTRA_W) _ULTRA_W = aesKeyExpand256(ultraKeyBytes()); return _ULTRA_W; }
        function ultraEncrypt(text) {
            var b = pkcs7Pad(utf8Encode("" + text)), w = ultraRoundKeys(), out = [], i, j, blk;
            for (i = 0; i < b.length; i += 16) { blk = aesEncryptBlock(b.slice(i, i+16), w); for (j = 0; j < 16; j++) out.push(blk[j]); }
            return b64Encode(out);
        }
        function ultraDecrypt(b64) {
            var b = b64DecodeToBytes(b64);
            if (b.length === 0 || b.length % 16 !== 0) throw "bad data";
            var w = ultraRoundKeys(), out = [], i, j, blk;
            for (i = 0; i < b.length; i += 16) { blk = aesDecryptBlock(b.slice(i, i+16), w); for (j = 0; j < 16; j++) out.push(blk[j]); }
            return utf8Decode(pkcs7Unpad(out));
        }

        // ---------- 业务逻辑 ----------
        function ultraEncryptAll(code) {
            // 与海阔 开发者模式→生成加密代码 完全一致：只剥掉开头的 js: 及一个换行
            var body = ("" + code).replace(/^js:(\r\n|\n|\r)?/, "");
            if (/^\s*evalPrivateJS\(['"][^"']+['"]\);?\s*$/.test(body)) return { skip: true };
            return { text: "js:\nevalPrivateJS(\"" + ultraEncrypt(body) + "\");" };
        }
        function ultraDecryptAll(code) {
            var ok = 0, fail = 0, guard = 0, cur = "" + code;
            var failedSet = {};
            while (guard < 10) {
                guard++;
                var re = /evalPrivateJS\(['"]([^"']+)['"]\);?/g, out = "", last = 0, m, okThisPass = 0;
                while ((m = re.exec(cur))) {
                    out += cur.slice(last, m.index);
                    try { out += ultraDecrypt(m[1]); ok++; okThisPass++; }
                    catch (e) { out += m[0]; if (!failedSet[m[1]]) { failedSet[m[1]] = 1; fail++; } }
                    last = m.index + m[0].length;
                }
                if (okThisPass === 0) break;
                out += cur.slice(last);
                if (out === cur) break;
                cur = out;
            }
            if (ok === 0) {
                try { var dec = ultraDecrypt(cur.trim()); if (dec && dec.length > 0) return { text: dec, ok: 1, fail: 0, raw: true }; } catch (e) {}
            }
            return { text: cur, ok: ok, fail: fail };
        }
        var code = getMyVar("plain") || "";
        if (!code) return "toast://原码框为空，请先输入或粘贴";
        try {
            var r = ultraEncryptAll(code);
            if (r.skip) return "toast://已是加密格式，无需重复加密";
            putMyVar("cipher", r.text);
            updateItem("cipher", { extra: Object.assign(findItem("cipher").extra, { defaultValue: r.text }) });
            return "toast://加密成功，已写入加密代码框";
        } catch (e) { return "toast://加密失败:" + e; }
    }),
    col_type: "text_2"
});

d.push({
    title: "解密",
    url: $().lazyRule(() => {
        // ===== 超级解密Ultra 重构版 · 自包含加密核心 =====
        // 算法：AES-256/ECB/PKCS7，密钥 "hk6666666109" 右补 '0' 至32字节（与原版 CryptoJS 实现一致）
        // 输出：base64(密文)；加密包装为 js:\nevalPrivateJS("...")

        var AES_SBOX = [
        0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
        0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
        0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
        0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
        0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
        0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
        0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
        0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
        0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
        0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
        0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
        0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
        0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
        0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
        0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
        0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];

        var AES_INV_SBOX = (function(){ var t = new Array(256); for (var i = 0; i < 256; i++) t[AES_SBOX[i]] = i; return t; })();

        function aesKeyExpand256(key) {
            var w = new Array(240), i;
            for (i = 0; i < 32; i++) w[i] = key[i] & 0xff;
            var rcon = 0x01;
            for (i = 8; i < 60; i++) {
                var t0 = w[4*(i-1)], t1 = w[4*(i-1)+1], t2 = w[4*(i-1)+2], t3 = w[4*(i-1)+3];
                if (i % 8 === 0) {
                    var u = t0;
                    t0 = (AES_SBOX[t1] ^ rcon) & 0xff; t1 = AES_SBOX[t2]; t2 = AES_SBOX[t3]; t3 = AES_SBOX[u];
                    rcon = (rcon << 1) ^ ((rcon & 0x80) ? 0x11b : 0); rcon &= 0xff;
                } else if (i % 8 === 4) {
                    t0 = AES_SBOX[t0]; t1 = AES_SBOX[t1]; t2 = AES_SBOX[t2]; t3 = AES_SBOX[t3];
                }
                w[4*i] = w[4*(i-8)] ^ t0; w[4*i+1] = w[4*(i-8)+1] ^ t1;
                w[4*i+2] = w[4*(i-8)+2] ^ t2; w[4*i+3] = w[4*(i-8)+3] ^ t3;
            }
            return w;
        }
        function aesAddRoundKey(s, w, off) { for (var i = 0; i < 16; i++) s[i] ^= w[off+i]; }
        function aesSubBytes(s) { for (var i = 0; i < 16; i++) s[i] = AES_SBOX[s[i]]; }
        function aesInvSubBytes(s) { for (var i = 0; i < 16; i++) s[i] = AES_INV_SBOX[s[i]]; }
        function aesShiftRows(s) {
            var t = s.slice(0);
            s[0]=t[0];  s[4]=t[4];  s[8]=t[8];   s[12]=t[12];
            s[1]=t[5];  s[5]=t[9];  s[9]=t[13];  s[13]=t[1];
            s[2]=t[10]; s[6]=t[14]; s[10]=t[2];  s[14]=t[6];
            s[3]=t[15]; s[7]=t[3];  s[11]=t[7];  s[15]=t[11];
        }
        function aesInvShiftRows(s) {
            var t = s.slice(0);
            s[0]=t[0];  s[4]=t[4];  s[8]=t[8];   s[12]=t[12];
            s[1]=t[13]; s[5]=t[1];  s[9]=t[5];   s[13]=t[9];
            s[2]=t[10]; s[6]=t[14]; s[10]=t[2];  s[14]=t[6];
            s[3]=t[7];  s[7]=t[11]; s[11]=t[15]; s[15]=t[3];
        }
        function xtime(a) { return ((a << 1) ^ ((a & 0x80) ? 0x1b : 0)) & 0xff; }
        function aesMixColumns(s) {
            for (var c = 0; c < 4; c++) {
                var i = c*4, a0=s[i], a1=s[i+1], a2=s[i+2], a3=s[i+3];
                s[i]   = xtime(a0)^xtime(a1)^a1^a2^a3;
                s[i+1] = a0^xtime(a1)^xtime(a2)^a2^a3;
                s[i+2] = a0^a1^xtime(a2)^xtime(a3)^a3;
                s[i+3] = xtime(a0)^a0^a1^a2^xtime(a3);
            }
        }
        function gmul(a, b) {
            var p = 0;
            for (var i = 0; i < 8; i++) {
                if (b & 1) p ^= a;
                var hi = a & 0x80; a = (a << 1) & 0xff;
                if (hi) a ^= 0x1b;
                b >>= 1;
            }
            return p;
        }
        function aesInvMixColumns(s) {
            for (var c = 0; c < 4; c++) {
                var i = c*4, a0=s[i], a1=s[i+1], a2=s[i+2], a3=s[i+3];
                s[i]   = gmul(a0,0x0e)^gmul(a1,0x0b)^gmul(a2,0x0d)^gmul(a3,0x09);
                s[i+1] = gmul(a0,0x09)^gmul(a1,0x0e)^gmul(a2,0x0b)^gmul(a3,0x0d);
                s[i+2] = gmul(a0,0x0d)^gmul(a1,0x09)^gmul(a2,0x0e)^gmul(a3,0x0b);
                s[i+3] = gmul(a0,0x0b)^gmul(a1,0x0d)^gmul(a2,0x09)^gmul(a3,0x0e);
            }
        }
        function aesEncryptBlock(pt, w) {
            var s = pt.slice(0), r;
            aesAddRoundKey(s, w, 0);
            for (r = 1; r <= 13; r++) { aesSubBytes(s); aesShiftRows(s); aesMixColumns(s); aesAddRoundKey(s, w, r*16); }
            aesSubBytes(s); aesShiftRows(s); aesAddRoundKey(s, w, 14*16);
            return s;
        }
        function aesDecryptBlock(ct, w) {
            var s = ct.slice(0), r;
            aesAddRoundKey(s, w, 14*16);
            for (r = 13; r >= 1; r--) { aesInvShiftRows(s); aesInvSubBytes(s); aesAddRoundKey(s, w, r*16); aesInvMixColumns(s); }
            aesInvShiftRows(s); aesInvSubBytes(s); aesAddRoundKey(s, w, 0);
            return s;
        }

        // ---------- UTF-8 ----------
        function utf8Encode(str) {
            var out = [], i, c;
            for (i = 0; i < str.length; i++) {
                c = str.charCodeAt(i);
                if (c < 0x80) out.push(c);
                else if (c < 0x800) out.push(0xc0|(c>>6), 0x80|(c&0x3f));
                else if (c >= 0xd800 && c <= 0xdbff) {
                    var h = c, l = str.charCodeAt(++i), cp = 0x10000 + ((h-0xd800)<<10) + (l-0xdc00);
                    out.push(0xf0|(cp>>18), 0x80|((cp>>12)&0x3f), 0x80|((cp>>6)&0x3f), 0x80|(cp&0x3f));
                } else out.push(0xe0|(c>>12), 0x80|((c>>6)&0x3f), 0x80|(c&0x3f));
            }
            return out;
        }
        function utf8Decode(bytes) {
            var out = "", i = 0, b, b2, b3, b4, cp;
            while (i < bytes.length) {
                b = bytes[i++];
                if (b < 0x80) out += String.fromCharCode(b);
                else if ((b & 0xe0) === 0xc0) {
                    b2 = bytes[i++]; if ((b2 & 0xc0) !== 0x80) throw "bad utf8";
                    cp = ((b & 0x1f) << 6) | (b2 & 0x3f); if (cp < 0x80) throw "bad utf8";
                    out += String.fromCharCode(cp);
                } else if ((b & 0xf0) === 0xe0) {
                    b2 = bytes[i++]; b3 = bytes[i++];
                    if ((b2 & 0xc0) !== 0x80 || (b3 & 0xc0) !== 0x80) throw "bad utf8";
                    cp = ((b & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f); if (cp < 0x800) throw "bad utf8";
                    out += String.fromCharCode(cp);
                } else if ((b & 0xf8) === 0xf0) {
                    b2 = bytes[i++]; b3 = bytes[i++]; b4 = bytes[i++];
                    if ((b2 & 0xc0) !== 0x80 || (b3 & 0xc0) !== 0x80 || (b4 & 0xc0) !== 0x80) throw "bad utf8";
                    cp = ((b & 0x07) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f);
                    if (cp < 0x10000 || cp > 0x10ffff) throw "bad utf8";
                    cp -= 0x10000; out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
                } else throw "bad utf8";
            }
            return out;
        }

        // ---------- Base64 ----------
        var B64CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        function b64Encode(bytes) {
            var out = "", i, n, rem;
            for (i = 0; i + 2 < bytes.length; i += 3) {
                n = (bytes[i] << 16) | (bytes[i+1] << 8) | bytes[i+2];
                out += B64CHARS[(n>>18)&63] + B64CHARS[(n>>12)&63] + B64CHARS[(n>>6)&63] + B64CHARS[n&63];
            }
            rem = bytes.length - i;
            if (rem === 1) { n = bytes[i] << 16; out += B64CHARS[(n>>18)&63] + B64CHARS[(n>>12)&63] + "=="; }
            else if (rem === 2) { n = (bytes[i] << 16) | (bytes[i+1] << 8); out += B64CHARS[(n>>18)&63] + B64CHARS[(n>>12)&63] + B64CHARS[(n>>6)&63] + "="; }
            return out;
        }
        function b64DecodeToBytes(s) {
            s = ("" + s).replace(/\s+/g, "");
            if (/[^A-Za-z0-9+\/=]/.test(s)) throw "bad base64";
            if (s.length % 4 !== 0) throw "bad base64";
            var out = [], i, c0, c1, c2, c3, n;
            for (i = 0; i < s.length; i += 4) {
                c0 = B64CHARS.indexOf(s.charAt(i)); c1 = B64CHARS.indexOf(s.charAt(i+1));
                c2 = s.charAt(i+2) === "=" ? 0 : B64CHARS.indexOf(s.charAt(i+2));
                c3 = s.charAt(i+3) === "=" ? 0 : B64CHARS.indexOf(s.charAt(i+3));
                if (c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0) throw "bad base64";
                n = (c0 << 18) | (c1 << 12) | (c2 << 6) | c3;
                out.push((n >> 16) & 0xff);
                if (s.charAt(i+2) !== "=") out.push((n >> 8) & 0xff);
                if (s.charAt(i+3) !== "=") out.push(n & 0xff);
            }
            return out;
        }

        // ---------- PKCS7 ----------
        function pkcs7Pad(b) { var p = 16 - (b.length % 16), i; for (i = 0; i < p; i++) b.push(p); return b; }
        function pkcs7Unpad(b) {
            if (b.length === 0 || b.length % 16 !== 0) throw "bad padding";
            var p = b[b.length-1], i;
            if (p < 1 || p > 16) throw "bad padding";
            for (i = 0; i < p; i++) if (b[b.length-1-i] !== p) throw "bad padding";
            return b.slice(0, b.length - p);
        }

        // ---------- Ultra 加解密（与原版兼容） ----------
        function ultraKeyBytes() { var k = "hk6666666109"; while (k.length < 32) k += "0"; return utf8Encode(k); }
        var _ULTRA_W = null;
        function ultraRoundKeys() { if (!_ULTRA_W) _ULTRA_W = aesKeyExpand256(ultraKeyBytes()); return _ULTRA_W; }
        function ultraEncrypt(text) {
            var b = pkcs7Pad(utf8Encode("" + text)), w = ultraRoundKeys(), out = [], i, j, blk;
            for (i = 0; i < b.length; i += 16) { blk = aesEncryptBlock(b.slice(i, i+16), w); for (j = 0; j < 16; j++) out.push(blk[j]); }
            return b64Encode(out);
        }
        function ultraDecrypt(b64) {
            var b = b64DecodeToBytes(b64);
            if (b.length === 0 || b.length % 16 !== 0) throw "bad data";
            var w = ultraRoundKeys(), out = [], i, j, blk;
            for (i = 0; i < b.length; i += 16) { blk = aesDecryptBlock(b.slice(i, i+16), w); for (j = 0; j < 16; j++) out.push(blk[j]); }
            return utf8Decode(pkcs7Unpad(out));
        }

        // ---------- 业务逻辑 ----------
        function ultraEncryptAll(code) {
            // 与海阔 开发者模式→生成加密代码 完全一致：只剥掉开头的 js: 及一个换行
            var body = ("" + code).replace(/^js:(\r\n|\n|\r)?/, "");
            if (/^\s*evalPrivateJS\(['"][^"']+['"]\);?\s*$/.test(body)) return { skip: true };
            return { text: "js:\nevalPrivateJS(\"" + ultraEncrypt(body) + "\");" };
        }
        function ultraDecryptAll(code) {
            var ok = 0, fail = 0, guard = 0, cur = "" + code;
            var failedSet = {};
            while (guard < 10) {
                guard++;
                var re = /evalPrivateJS\(['"]([^"']+)['"]\);?/g, out = "", last = 0, m, okThisPass = 0;
                while ((m = re.exec(cur))) {
                    out += cur.slice(last, m.index);
                    try { out += ultraDecrypt(m[1]); ok++; okThisPass++; }
                    catch (e) { out += m[0]; if (!failedSet[m[1]]) { failedSet[m[1]] = 1; fail++; } }
                    last = m.index + m[0].length;
                }
                if (okThisPass === 0) break;
                out += cur.slice(last);
                if (out === cur) break;
                cur = out;
            }
            if (ok === 0) {
                try { var dec = ultraDecrypt(cur.trim()); if (dec && dec.length > 0) return { text: dec, ok: 1, fail: 0, raw: true }; } catch (e) {}
            }
            return { text: cur, ok: ok, fail: fail };
        }
        var src = getMyVar("cipher") || getMyVar("plain") || "";
        if (!src) return "toast://两个框都为空，请先粘贴要解密的代码";
        try {
            var r = ultraDecryptAll(src);
            if (r.ok === 0) return "toast://未发现可解密内容";
            putMyVar("plain", r.text);
            updateItem("plain", { extra: Object.assign(findItem("plain").extra, { defaultValue: r.text }) });
            return "toast://解密成功，已写入原码框" + (r.fail > 0 ? ("，" + r.fail + "处失败已保留原文") : "");
        } catch (e) { return "toast://解密失败:" + e; }
    }),
    col_type: "text_2"
});

d.push({
    title: "导入",
    url: $("#noLoading#").lazyRule(() => {
        // ===== 超级解密Ultra 重构版 · 自包含加密核心 =====
        // 算法：AES-256/ECB/PKCS7，密钥 "hk6666666109" 右补 '0' 至32字节（与原版 CryptoJS 实现一致）
        // 输出：base64(密文)；加密包装为 js:\nevalPrivateJS("...")

        var AES_SBOX = [
        0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
        0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
        0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
        0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
        0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
        0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
        0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
        0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
        0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
        0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
        0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
        0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
        0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
        0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
        0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
        0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];

        var AES_INV_SBOX = (function(){ var t = new Array(256); for (var i = 0; i < 256; i++) t[AES_SBOX[i]] = i; return t; })();

        function aesKeyExpand256(key) {
            var w = new Array(240), i;
            for (i = 0; i < 32; i++) w[i] = key[i] & 0xff;
            var rcon = 0x01;
            for (i = 8; i < 60; i++) {
                var t0 = w[4*(i-1)], t1 = w[4*(i-1)+1], t2 = w[4*(i-1)+2], t3 = w[4*(i-1)+3];
                if (i % 8 === 0) {
                    var u = t0;
                    t0 = (AES_SBOX[t1] ^ rcon) & 0xff; t1 = AES_SBOX[t2]; t2 = AES_SBOX[t3]; t3 = AES_SBOX[u];
                    rcon = (rcon << 1) ^ ((rcon & 0x80) ? 0x11b : 0); rcon &= 0xff;
                } else if (i % 8 === 4) {
                    t0 = AES_SBOX[t0]; t1 = AES_SBOX[t1]; t2 = AES_SBOX[t2]; t3 = AES_SBOX[t3];
                }
                w[4*i] = w[4*(i-8)] ^ t0; w[4*i+1] = w[4*(i-8)+1] ^ t1;
                w[4*i+2] = w[4*(i-8)+2] ^ t2; w[4*i+3] = w[4*(i-8)+3] ^ t3;
            }
            return w;
        }
        function aesAddRoundKey(s, w, off) { for (var i = 0; i < 16; i++) s[i] ^= w[off+i]; }
        function aesSubBytes(s) { for (var i = 0; i < 16; i++) s[i] = AES_SBOX[s[i]]; }
        function aesInvSubBytes(s) { for (var i = 0; i < 16; i++) s[i] = AES_INV_SBOX[s[i]]; }
        function aesShiftRows(s) {
            var t = s.slice(0);
            s[0]=t[0];  s[4]=t[4];  s[8]=t[8];   s[12]=t[12];
            s[1]=t[5];  s[5]=t[9];  s[9]=t[13];  s[13]=t[1];
            s[2]=t[10]; s[6]=t[14]; s[10]=t[2];  s[14]=t[6];
            s[3]=t[15]; s[7]=t[3];  s[11]=t[7];  s[15]=t[11];
        }
        function aesInvShiftRows(s) {
            var t = s.slice(0);
            s[0]=t[0];  s[4]=t[4];  s[8]=t[8];   s[12]=t[12];
            s[1]=t[13]; s[5]=t[1];  s[9]=t[5];   s[13]=t[9];
            s[2]=t[10]; s[6]=t[14]; s[10]=t[2];  s[14]=t[6];
            s[3]=t[7];  s[7]=t[11]; s[11]=t[15]; s[15]=t[3];
        }
        function xtime(a) { return ((a << 1) ^ ((a & 0x80) ? 0x1b : 0)) & 0xff; }
        function aesMixColumns(s) {
            for (var c = 0; c < 4; c++) {
                var i = c*4, a0=s[i], a1=s[i+1], a2=s[i+2], a3=s[i+3];
                s[i]   = xtime(a0)^xtime(a1)^a1^a2^a3;
                s[i+1] = a0^xtime(a1)^xtime(a2)^a2^a3;
                s[i+2] = a0^a1^xtime(a2)^xtime(a3)^a3;
                s[i+3] = xtime(a0)^a0^a1^a2^xtime(a3);
            }
        }
        function gmul(a, b) {
            var p = 0;
            for (var i = 0; i < 8; i++) {
                if (b & 1) p ^= a;
                var hi = a & 0x80; a = (a << 1) & 0xff;
                if (hi) a ^= 0x1b;
                b >>= 1;
            }
            return p;
        }
        function aesInvMixColumns(s) {
            for (var c = 0; c < 4; c++) {
                var i = c*4, a0=s[i], a1=s[i+1], a2=s[i+2], a3=s[i+3];
                s[i]   = gmul(a0,0x0e)^gmul(a1,0x0b)^gmul(a2,0x0d)^gmul(a3,0x09);
                s[i+1] = gmul(a0,0x09)^gmul(a1,0x0e)^gmul(a2,0x0b)^gmul(a3,0x0d);
                s[i+2] = gmul(a0,0x0d)^gmul(a1,0x09)^gmul(a2,0x0e)^gmul(a3,0x0b);
                s[i+3] = gmul(a0,0x0b)^gmul(a1,0x0d)^gmul(a2,0x09)^gmul(a3,0x0e);
            }
        }
        function aesEncryptBlock(pt, w) {
            var s = pt.slice(0), r;
            aesAddRoundKey(s, w, 0);
            for (r = 1; r <= 13; r++) { aesSubBytes(s); aesShiftRows(s); aesMixColumns(s); aesAddRoundKey(s, w, r*16); }
            aesSubBytes(s); aesShiftRows(s); aesAddRoundKey(s, w, 14*16);
            return s;
        }
        function aesDecryptBlock(ct, w) {
            var s = ct.slice(0), r;
            aesAddRoundKey(s, w, 14*16);
            for (r = 13; r >= 1; r--) { aesInvShiftRows(s); aesInvSubBytes(s); aesAddRoundKey(s, w, r*16); aesInvMixColumns(s); }
            aesInvShiftRows(s); aesInvSubBytes(s); aesAddRoundKey(s, w, 0);
            return s;
        }

        // ---------- UTF-8 ----------
        function utf8Encode(str) {
            var out = [], i, c;
            for (i = 0; i < str.length; i++) {
                c = str.charCodeAt(i);
                if (c < 0x80) out.push(c);
                else if (c < 0x800) out.push(0xc0|(c>>6), 0x80|(c&0x3f));
                else if (c >= 0xd800 && c <= 0xdbff) {
                    var h = c, l = str.charCodeAt(++i), cp = 0x10000 + ((h-0xd800)<<10) + (l-0xdc00);
                    out.push(0xf0|(cp>>18), 0x80|((cp>>12)&0x3f), 0x80|((cp>>6)&0x3f), 0x80|(cp&0x3f));
                } else out.push(0xe0|(c>>12), 0x80|((c>>6)&0x3f), 0x80|(c&0x3f));
            }
            return out;
        }
        function utf8Decode(bytes) {
            var out = "", i = 0, b, b2, b3, b4, cp;
            while (i < bytes.length) {
                b = bytes[i++];
                if (b < 0x80) out += String.fromCharCode(b);
                else if ((b & 0xe0) === 0xc0) {
                    b2 = bytes[i++]; if ((b2 & 0xc0) !== 0x80) throw "bad utf8";
                    cp = ((b & 0x1f) << 6) | (b2 & 0x3f); if (cp < 0x80) throw "bad utf8";
                    out += String.fromCharCode(cp);
                } else if ((b & 0xf0) === 0xe0) {
                    b2 = bytes[i++]; b3 = bytes[i++];
                    if ((b2 & 0xc0) !== 0x80 || (b3 & 0xc0) !== 0x80) throw "bad utf8";
                    cp = ((b & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f); if (cp < 0x800) throw "bad utf8";
                    out += String.fromCharCode(cp);
                } else if ((b & 0xf8) === 0xf0) {
                    b2 = bytes[i++]; b3 = bytes[i++]; b4 = bytes[i++];
                    if ((b2 & 0xc0) !== 0x80 || (b3 & 0xc0) !== 0x80 || (b4 & 0xc0) !== 0x80) throw "bad utf8";
                    cp = ((b & 0x07) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f);
                    if (cp < 0x10000 || cp > 0x10ffff) throw "bad utf8";
                    cp -= 0x10000; out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
                } else throw "bad utf8";
            }
            return out;
        }

        // ---------- Base64 ----------
        var B64CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        function b64Encode(bytes) {
            var out = "", i, n, rem;
            for (i = 0; i + 2 < bytes.length; i += 3) {
                n = (bytes[i] << 16) | (bytes[i+1] << 8) | bytes[i+2];
                out += B64CHARS[(n>>18)&63] + B64CHARS[(n>>12)&63] + B64CHARS[(n>>6)&63] + B64CHARS[n&63];
            }
            rem = bytes.length - i;
            if (rem === 1) { n = bytes[i] << 16; out += B64CHARS[(n>>18)&63] + B64CHARS[(n>>12)&63] + "=="; }
            else if (rem === 2) { n = (bytes[i] << 16) | (bytes[i+1] << 8); out += B64CHARS[(n>>18)&63] + B64CHARS[(n>>12)&63] + B64CHARS[(n>>6)&63] + "="; }
            return out;
        }
        function b64DecodeToBytes(s) {
            s = ("" + s).replace(/\s+/g, "");
            if (/[^A-Za-z0-9+\/=]/.test(s)) throw "bad base64";
            if (s.length % 4 !== 0) throw "bad base64";
            var out = [], i, c0, c1, c2, c3, n;
            for (i = 0; i < s.length; i += 4) {
                c0 = B64CHARS.indexOf(s.charAt(i)); c1 = B64CHARS.indexOf(s.charAt(i+1));
                c2 = s.charAt(i+2) === "=" ? 0 : B64CHARS.indexOf(s.charAt(i+2));
                c3 = s.charAt(i+3) === "=" ? 0 : B64CHARS.indexOf(s.charAt(i+3));
                if (c0 < 0 || c1 < 0 || c2 < 0 || c3 < 0) throw "bad base64";
                n = (c0 << 18) | (c1 << 12) | (c2 << 6) | c3;
                out.push((n >> 16) & 0xff);
                if (s.charAt(i+2) !== "=") out.push((n >> 8) & 0xff);
                if (s.charAt(i+3) !== "=") out.push(n & 0xff);
            }
            return out;
        }

        // ---------- PKCS7 ----------
        function pkcs7Pad(b) { var p = 16 - (b.length % 16), i; for (i = 0; i < p; i++) b.push(p); return b; }
        function pkcs7Unpad(b) {
            if (b.length === 0 || b.length % 16 !== 0) throw "bad padding";
            var p = b[b.length-1], i;
            if (p < 1 || p > 16) throw "bad padding";
            for (i = 0; i < p; i++) if (b[b.length-1-i] !== p) throw "bad padding";
            return b.slice(0, b.length - p);
        }

        // ---------- Ultra 加解密（与原版兼容） ----------
        function ultraKeyBytes() { var k = "hk6666666109"; while (k.length < 32) k += "0"; return utf8Encode(k); }
        var _ULTRA_W = null;
        function ultraRoundKeys() { if (!_ULTRA_W) _ULTRA_W = aesKeyExpand256(ultraKeyBytes()); return _ULTRA_W; }
        function ultraEncrypt(text) {
            var b = pkcs7Pad(utf8Encode("" + text)), w = ultraRoundKeys(), out = [], i, j, blk;
            for (i = 0; i < b.length; i += 16) { blk = aesEncryptBlock(b.slice(i, i+16), w); for (j = 0; j < 16; j++) out.push(blk[j]); }
            return b64Encode(out);
        }
        function ultraDecrypt(b64) {
            var b = b64DecodeToBytes(b64);
            if (b.length === 0 || b.length % 16 !== 0) throw "bad data";
            var w = ultraRoundKeys(), out = [], i, j, blk;
            for (i = 0; i < b.length; i += 16) { blk = aesDecryptBlock(b.slice(i, i+16), w); for (j = 0; j < 16; j++) out.push(blk[j]); }
            return utf8Decode(pkcs7Unpad(out));
        }

        // ---------- 业务逻辑 ----------
        function ultraEncryptAll(code) {
            // 与海阔 开发者模式→生成加密代码 完全一致：只剥掉开头的 js: 及一个换行
            var body = ("" + code).replace(/^js:(\r\n|\n|\r)?/, "");
            if (/^\s*evalPrivateJS\(['"][^"']+['"]\);?\s*$/.test(body)) return { skip: true };
            return { text: "js:\nevalPrivateJS(\"" + ultraEncrypt(body) + "\");" };
        }
        function ultraDecryptAll(code) {
            var ok = 0, fail = 0, guard = 0, cur = "" + code;
            var failedSet = {};
            while (guard < 10) {
                guard++;
                var re = /evalPrivateJS\(['"]([^"']+)['"]\);?/g, out = "", last = 0, m, okThisPass = 0;
                while ((m = re.exec(cur))) {
                    out += cur.slice(last, m.index);
                    try { out += ultraDecrypt(m[1]); ok++; okThisPass++; }
                    catch (e) { out += m[0]; if (!failedSet[m[1]]) { failedSet[m[1]] = 1; fail++; } }
                    last = m.index + m[0].length;
                }
                if (okThisPass === 0) break;
                out += cur.slice(last);
                if (out === cur) break;
                cur = out;
            }
            if (ok === 0) {
                try { var dec = ultraDecrypt(cur.trim()); if (dec && dec.length > 0) return { text: dec, ok: 1, fail: 0, raw: true }; } catch (e) {}
            }
            return { text: cur, ok: ok, fail: fail };
        }
        var code = getMyVar("plain") || getMyVar("cipher") || "";
        if (!code.trim()) return "toast://内容为空，无法导入";
        code = code.trim();
        var ruleText = null;
        // 情形1: 完整分享文本 …￥home_rule_v2￥base64://@标题@<b64>
        var p1 = code.indexOf('base64://@');
        if (p1 >= 0) {
            var rest = code.slice(p1 + 'base64://@'.length);
            var at = rest.lastIndexOf('@');
            if (at <= 0) return "toast://分享文本格式不正确";
            try {
                var js1 = utf8Decode(b64DecodeToBytes(rest.slice(at + 1)));
                JSON.parse(js1);
                ruleText = "海阔视界￥home_rule￥" + js1;
            } catch (e) { return "toast://分享文本解析失败"; }
        }
        // 情形2: 裸 ￥home_rule_v2￥base64://<b64>
        if (ruleText == null) {
            var p2 = code.indexOf('￥home_rule_v2￥base64://');
            if (p2 >= 0) {
                try {
                    var js2 = utf8Decode(b64DecodeToBytes(code.slice(p2 + '￥home_rule_v2￥base64://'.length)));
                    JSON.parse(js2);
                    ruleText = "海阔视界￥home_rule￥" + js2;
                } catch (e) { return "toast://分享文本解析失败"; }
            }
        }
        // 情形3: 明文规则（含老式分享包装）：取最后一个 ￥home_rule￥ 起的内容
        if (ruleText == null) {
            var hp = code.lastIndexOf('￥home_rule￥');
            if (hp >= 0 && /^海阔视界/.test(code)) ruleText = "海阔视界" + code.slice(hp);
        }
        // 情形4: hiker:// 链接
        if (ruleText == null && /^hiker:\/\//.test(code)) {
            ruleText = "海阔视界首页频道规则￥home_rule_url￥" + code;
        }
        // 情形5: 裸规则 JSON
        if (ruleText == null && /^\{[\s\S]*\}$/.test(code)) {
            try { JSON.parse(code); ruleText = "海阔视界￥home_rule￥" + code; }
            catch (e) { return "toast://内容不是有效的规则JSON"; }
        }
        if (ruleText == null) return "toast://内容不是有效的规则格式";
        return "rule://" + b64Encode(utf8Encode(ruleText));
    }),
    col_type: "text_2"
});

setResult(d);


}
