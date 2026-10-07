# File Checksum Tool · 文件校验工具 · 檔案校驗工具

Generate checksums and verify received files in your browser. Available in **English, 简体中文 and 繁體中文**.

- Generate a SHA-256 checksum for each file; copy values or download a checksum list.
- Verify files against existing SHA-256 or SHA-512 lists, including BagIt payload and tag manifests.
- Distinguish matching content, different content, missing paths, unrecorded files and read failures.
- Download JSON reports or CSV details.
- Files are processed locally in a worker. No file upload, account, server, external font, CDN or analytics is required.

## Use online or offline

Open the published GitHub Pages website, or download `index.html` and open it in a current Chrome, Edge, Firefox or Safari browser. All application code is embedded in that file. Once downloaded, the tool works offline without a VPN or network connection.

GitHub Pages is a public hosting service; availability on a particular network is outside this project's control. Offline use provides a network-independent fallback.

## 核验完整保存包

1. 解压原始 ZIP，保留目录结构与原始文件名。
2. 选择“核验文件”，再选择包含 `data` 和清单的最外层文件夹。
3. 网页自动识别根目录下的清单；也可以手动提供原有清单。
4. 查看结果并下载报告。

请勿将保存包中的文件逐个选入：普通文件选择器不保留目录路径，可能同时出现“未找到文件”和“清单未记录”。这些状态本身不代表文件内容已损坏。

请使用发送或保存前留下的清单。检查前重新生成清单，无法证明文件相较于过去是否改变。

## 核驗完整保存套件

先解壓縮 ZIP，保留目錄結構及原始檔案名稱，再選擇包含 `data` 與清單的最外層資料夾。逐一選擇檔案會遺失目錄路徑。請使用傳送或保存前留下的原有清單。

## Verification scope

- Input files have no extension filter: video, audio, images, documents and other binary files can be checked without being decoded or played.
- Lists must be UTF-8 text using SHA-256 or SHA-512. Each list is limited to 10 MiB. The tool rejects unsupported or malformed lists and duplicate paths instead of silently skipping them.
- Paths match exactly and are case-sensitive. Generated lists use two spaces between checksum and path, with BagIt escaping for `%`, CR and LF in paths.
- The page displays up to 200 result entries; downloaded lists and reports include all entries.
- Files are read in 1 MiB chunks. There is no configured media-file size cap; practical limits depend on the browser and device.
- ZIP archives are not extracted by this tool. It can checksum the ZIP itself, or check its contents after you extract it.
- This is a checksum comparison tool, **not a complete BagIt validator**. It does not validate provenance, accurate descriptions, rights or archival accession decisions.
- Matching checksums rely on a trustworthy original list. Uncovered manifest files are explicitly reported as unverified.
- Language preference is the only value saved in local storage. Selected files, paths, checksums and reports are held only in memory. Clipboard copying may be restricted by browsers when opening a local file; values can always be selected and copied manually.

## Publish with GitHub Pages

1. Put this repository's files in a **public** GitHub repository.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**, branch **main**, folder **/(root)**, then save.
4. Open the published URL shown by GitHub after deployment completes.

The repository root contains `index.html` and `.nojekyll`. No build service, paid plan or user login is required to use the published app.

## Development

`page.html`, `style.css`, `translations.json`, `app.js` and `core.js` contain the editable source. The committed `index.html` is the standalone distribution.

```sh
node build.cjs
node check-workflow.cjs
node check.cjs
```

No dependency installation is needed. `check.cjs` compares SHA-256/SHA-512 with Node's crypto implementation and includes a 513 MiB SHA-256 test. The workflow test exercises the real embedded worker source, checksum generation, verification, failure states and all three languages in a lightweight DOM harness.

The embedded hash.js 1.1.7 dependency has a narrowly scoped padding fix to preserve the full message bit length above 512 MiB. Third-party notices are in `THIRD_PARTY_LICENSES.txt` and embedded in the distributed HTML.

## License

MIT. See `LICENSE` and `THIRD_PARTY_LICENSES.txt`.

Format reference: [BagIt — RFC 8493](https://www.rfc-editor.org/rfc/rfc8493.html).
