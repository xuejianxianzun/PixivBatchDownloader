# Privacy Policy for Powerful Pixiv Downloader

Last updated: 2026-09-04

Powerful Pixiv Downloader (hereinafter referred to as "this extension") is an open-source browser extension that helps users batch-download artworks on the pixiv.net website. The source code of this extension is fully public, and you can view and review it yourself in the GitHub repository (<https://github.com/xuejianxianzun/PixivBatchDownloader>).

This policy explains: which websites this extension accesses, what data it stores locally, which browser permissions it uses, and how to delete the related data. **In short: this extension does not collect, store, or upload any personal information; it does not make requests to any third-party websites; and it contains no advertising, statistics, or tracking code.**

## 1. Data collection and usage

This extension does **not collect any personal information**, including but not limited to: name, email address, account password, browsing history, device information, location information, etc.

- This extension contains no statistics, analytics, or tracking code;
- This extension does not serve advertisements;
- This extension does not track any of the user's activities;
- This extension will not send any data to any server other than pixiv and its related domains.

## 2. Scope of network requests

This extension only runs on, and makes network requests to, the following pixiv-related websites. All requests occur on pixiv pages and are triggered by your actions:

| Domain | Purpose |
| --- | --- |
| `www.pixiv.net` | Fetching artwork lists, artwork information, download links and other data; submitting actions you actively perform, such as bookmarking or liking |
| `www.pixivision.net` | Fetching artworks in pixivision feature pages |
| `i.pximg.net` / `s.pximg.net` | The actual download addresses of resources such as images |

Other than the pixiv-family domains listed above, this extension does **not make requests to any other websites** (for example, it does not request any update-check server and does not call any third-party API). Links such as sponsorship and help documentation that you see in this extension's interface are ordinary hyperlinks, and will only open in your browser when you actively click them.

## 3. Local storage

This extension stores necessary data **in your own browser locally**, and does not upload it to any server. It mainly includes:

- **Settings**: the configuration options you make in the settings panel;
- **Download task records**: data related to batch download tasks;
- **Token cache**: see the "Pixiv token" section below;
- **Temporary cache**: for example, tag list cache, word replacement list, version information, etc., used for the normal functioning of features;
- **Custom background images**: if you use the custom background feature, the images are stored in the browser's IndexedDB, and are used only for local display.

All of the above data is stored locally. After uninstalling this extension, the data saved by the extension itself will be cleared (see the "Data deletion" section).

## 4. Cookies

- The pixiv website uses cookies to save information such as login state;
- This extension does **not create, modify, read, or store** cookies;
- When this extension sends requests within pixiv pages, cookies are **automatically attached** by the browser according to the same-origin policy, and this extension does not access their content.

## 5. Pixiv token

- pixiv generates a request token for each page, and some network requests need to carry it;
- This extension obtains the token from the pixiv page and caches it in the browser's local storage (localStorage) under the pixiv domain, for use in subsequent requests;
- The token is only used in requests made to pixiv.net, and will **never be sent to any website other than pixiv**;
- To clear this cache, you can run "Reset Settings" in the extension's settings, or clear the site data of the pixiv website.

## 6. Browser permissions

This extension requests the following browser permissions for the purposes described below:

| Permission | Purpose |
| --- | --- |
| `downloads` | Saving the artworks you selected to your local disk |
| `storage` | Saving settings and download task records locally |
| `webRequest`, `declarativeNetRequestWithHostAccess` | Adjusting request headers (such as Referer) only within the scope of pixiv's image domain (pximg.net), so that images can be downloaded directly; it does not read or modify any request content |

## 7. Third-party sharing

- This extension does **not share data with any third party**, nor does it **sell any data**;
- This extension contains no third-party SDKs;
- All processing by this extension is done locally on your machine.

## 8. Data deletion and user rights

You can delete the data produced by this extension at any time in the following ways:

1. Run "Reset Settings" in the extension's settings panel to clear the settings and cache saved by the extension;
2. Uninstall this extension from your browser's extension management page;
3. Clear the site data of the pixiv website (www.pixiv.net) to remove caches such as the token stored under that domain.

Since this extension does not upload data to any server, there is no data stored on a server that you would need to request deletion of.

## 9. Disclaimer and compliance

- This extension is a download tool; the user is solely responsible for the downloading behavior and the downloaded content;
- Please comply with pixiv's Terms of Service and respect the copyright of illustrators/authors. Downloaded content should only be used for legal purposes such as personal study and appreciation. Please do not use it for commercial purposes or redistribute it without authorization;
- This extension is open-source, free software provided "as is", and shall not be liable for any consequences arising from its use.

## 10. Policy updates and contact

- This policy may be updated as the extension's features change; after each update, the date will be noted in this document;
- If you have any questions about this policy or this extension's privacy practices, you are welcome to raise them via GitHub Issues: <https://github.com/xuejianxianzun/PixivBatchDownloader/issues>.
