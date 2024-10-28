export function getHeaders(token: string, themeId: string): { [key: string]: string } {
    return {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9,ru;q=0.8',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        priority: 'u=1, i',
        'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest',
        cookie: `PHPSESSID=${token}`,
        Referer: `https://flow-dbb1.contobox.com/themesv30/edit.html?id=${themeId}`,
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    }
}
