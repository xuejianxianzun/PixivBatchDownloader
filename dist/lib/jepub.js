// https://github.com/lelinhtinh/jEpub
// 修改原始文件，移除对 ejs.js 的依赖，以在普通网页和扩展程序中使用。
// 具体就是把所有的 ejs.render 和 ejs.compile 调用改为自行处理

const usedForPixiv = true

function createTitlePage (data) {
	const createTags = function (tags) {
		// 从原模板的设计来看，tags 有可能是字符串数组，也有可能是组合好的 html 字符串
		// 不过 demo 里是 html 字符串，所以不清楚何时会是字符串数组
		if (Array.isArray(tags) && tags.length) {
			const array = tags.map(str => `<code>${str}</code>`)
			return array.join(', ')
		}
		return `<code>${tags}</code>`
	}

	const temp = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${data.i18n.code}">

<head>
	<title>${data.i18n.info}</title>
	<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
</head>

<body>
	<div id="title-page">
		<h1 class="title">${data.title}</h1>
		<h2 class="subtitle"></h2>
		<h3 class="author">${data.author}</h3>
		<h4 class="publisher">${data.publisher}</h4>
	</div>
    
        <div class="part-title-wrap">
            <p>${createTags(data.tags)}</p>
        </div>
    
    
        <div class="ugc">
          ${data.description || ''}
        </div>
    
</body>

</html>`
	return temp
}

function createFrontCover (data) {
	const temp = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${data.i18n.code}">

<head>
	<title>${data.i18n.cover}</title>
	<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
</head>

<body>
	<div id="cover-image">
		<img src="${data.cover.path.replace('OEBPS/', '')}" alt="${data.i18n.cover}" />
	</div>
</body>

</html>
`
	return temp
}

function createNotes (data) {
	const temp = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${data.i18n.code}">

<head>
	<title>${data.i18n.note}</title>
	<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
</head>

<body>
	<div id="notes-page">
		<div class="ugc">
            ${data.notes}
		</div>
	</div>
</body>

</html>
`
	return temp
}

function createPage (data) {
	const createContent = function (content) {
		// 从原模板的设计来看，content 有可能是字符串数组，也有可能是包含了 html 标签的字符串
		if (Array.isArray(content) && content.length) {
			const array = content.map(str => `<p class="indent">${str}</p>`)
			return array.join('\n')
		}
		return content
	}

	const temp = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${data.i18n.code}">

<head>
	<title>${data.title}</title>
	<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
	<style>
	img {max-width: 100vw;}
	</style>
</head>

<body>
	<div class="chapter type-1">
		<div class="chapter-title-wrap">
			<h2 class="chapter-title">${data.title}</h2>
		</div>
		<div class="ugc chapter-ugc">
            ${createContent(data.content)}
		</div>
	</div>
</body>

</html>
`
	return temp
}

function createBookOpf (data) {
	const createTags = function (tags) {
		if (Array.isArray(tags) && tags.length) {
			const array = tags.map(tag => `<dc:subject>${tag}</dc:subject>`)
			return array.join('\n')
		}

		return ''
	}


	/** 根据 pages 数量循环生成带序号的字符串，如： */
	// <item id="page-0" href="OEBPS/page-0.html" media-type="application/xhtml+xml" />
	// <item id="page-1" href="OEBPS/page-1.html" media-type="application/xhtml+xml" />
	const pagesStr = function (pages, template) {
		const result = []
		for (let index = 0; index < pages.length; index++) {
			result.push(template.replaceAll('${index}', index))
		}
		return result.join('\n')
	}

	const imagesStr = function (images) {
		const result = []
		for (const [name, value] of Object.entries(images)) {
			result.push(`<item id="${name}" href="OEBPS/${value.path}" media-type="${value.type}" />`)
		}
		return result.join('\n')
	}

	const temp = `<?xml version="1.0" encoding="UTF-8" ?>
<package version="2.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="PrimaryID">

	<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
		<dc:title>${data.title}</dc:title>
		<dc:language>${data.i18n.code}</dc:language>
		<dc:identifier id="PrimaryID" opf:scheme="${data.uuid.scheme}">${data.uuid.id}</dc:identifier>
		<dc:date opf:event="publication">${data.date}</dc:date>
		<dc:description>${data.description || ''}</dc:description>
		<dc:creator opf:role="aut">${data.author}</dc:creator>
		<dc:publisher>${data.publisher}</dc:publisher>
		${data.cover ? '<meta name="cover" content="cover-image" />' : ''}
		${createTags(data.tags)}
	</metadata>

	<manifest>
	${data.cover ?
			'<item id="front-cover" href="OEBPS/front-cover.html" media-type="application/xhtml+xml" />'
			: ''
		}
		<item id="title-page" href="OEBPS/title-page.html" media-type="application/xhtml+xml" />
	${data.notes ?
		'<item id="notes" href="OEBPS/notes.html" media-type="application/xhtml+xml" />' : ''
		}
		<item id="table-of-contents" href="OEBPS/table-of-contents.html" media-type="application/xhtml+xml" />
		${pagesStr(data.pages, '<item id="page-${index}" href="OEBPS/page-${index}.html" media-type="application/xhtml+xml" />')}
				${data.cover ?
			`<item id="cover-image" href="${data.cover.path}" media-type="${data.cover.type}" properties="cover-image" />`
			: ''
		}
		<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />
		${imagesStr(data.images)}
	</manifest>

	<spine toc="ncx">
	${data.cover ?
			'<itemref idref="front-cover" linear="no" />'
			: ''
		}
		<itemref idref="title-page" linear="yes" />
		<itemref idref="table-of-contents" linear="yes" />
		${pagesStr(data.pages, '<itemref idref="page-${index}" linear="yes" />')}
	${data.notes ?
			'<itemref idref="notes" linear="yes" />'
			: ''
		}
	</spine>

	<guide>
	${data.cover ?
			`<reference type="cover" title="${data.i18n.cover}" href="OEBPS/front-cover.html" />`
			: ''
		}
		<reference type="toc" title="${data.i18n.toc}" href="OEBPS/table-of-contents.html" />
	</guide>

</package>
`

	return temp
}

function createTOC (data) {
	const pageList = function (pages) {
		const array = pages.map((title, index) => {
			return `
			<li class="chaptertype-1">
					<a href="page-${index}.html">
							<span class="toc-chapter-title">${title}</span>
					</a>
			</li>`
		})
		return array.join('\n')
	}

	const temp = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${data.i18n.code}">

<head>
	<title>${data.i18n.toc}</title>
	<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
</head>

<body>
	<div id="toc">
		<h1>${data.i18n.toc}</h1>
		<ul>
			${pageList(data.pages)}
		</ul>
	</div>
</body>

</html>
`

	return temp
}

function createTOC_ncx (data) {
	const pageNav = function (pages) {
		const array = pages.map((title, index) => {
			return `
			<navPoint id="page-${index}" playOrder="${index + 3}">
                <navLabel>
                    <text>${title}</text>
                </navLabel>
                <content src="OEBPS/page-${index}.html" />
            </navPoint>`
		})
		return array.join('\n')
	}
	const temp = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">

<ncx version="2005-1" xml:lang="${data.i18n.code}" xmlns="http://www.daisy.org/z3986/2005/ncx/">
	<head>
		<meta name="dtb:uid" content="${data.uuid.id}" />
		<meta name="dtb:depth" content="2" />
		<meta name="dtb:totalPageCount" content="0" />
		<meta name="dtb:maxPageNumber" content="0" />
	</head>

	<docTitle>
		<text>${data.title}</text>
	</docTitle>

	<docAuthor>
		<text>${data.author}</text>
	</docAuthor>

	<navMap>
		<navPoint id="title-page" playOrder="1">
			<navLabel>
				<text>${data.i18n.info}</text>
			</navLabel>
			<content src="OEBPS/title-page.html" />
		</navPoint>
		<navPoint id="table-of-contents" playOrder="2">
			<navLabel>
				<text>${data.i18n.toc}</text>
			</navLabel>
			<content src="OEBPS/table-of-contents.html" />
		</navPoint>
				${pageNav(data.pages)}
				${data.notes ? `
					<navPoint id="notes-page" playOrder="2">
                <navLabel>
                    <text>${data.i18n.note}</text>
                </navLabel>
                <content src="OEBPS/notes.html" />
            </navPoint>`
			: ''}
	</navMap>
</ncx>
`

	return temp
}

(function webpackUniversalModuleDefinition (root, factory) {
	if (typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if (typeof define === 'function' && define.amd)
		define("jEpub", [], factory);
	else if (typeof exports === 'object')
		exports["jEpub"] = factory();
	else
		root["jEpub"] = factory();
})(self, () => {
	return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/***/ ((module) => {

					function _interopRequireDefault (obj) {
						return obj && obj.__esModule ? obj : {
							"default": obj
						};
					}

					module.exports = _interopRequireDefault;

					/***/
				}),

/***/ "./node_modules/@babel/runtime/helpers/interopRequireWildcard.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireWildcard.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

					var _typeof = __webpack_require__(/*! ../helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");

					function _getRequireWildcardCache () {
						if (typeof WeakMap !== "function") return null;
						var cache = new WeakMap();

						_getRequireWildcardCache = function _getRequireWildcardCache () {
							return cache;
						};

						return cache;
					}

					function _interopRequireWildcard (obj) {
						if (obj && obj.__esModule) {
							return obj;
						}

						if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
							return {
								"default": obj
							};
						}

						var cache = _getRequireWildcardCache();

						if (cache && cache.has(obj)) {
							return cache.get(obj);
						}

						var newObj = {};
						var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

						for (var key in obj) {
							if (Object.prototype.hasOwnProperty.call(obj, key)) {
								var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

								if (desc && (desc.get || desc.set)) {
									Object.defineProperty(newObj, key, desc);
								} else {
									newObj[key] = obj[key];
								}
							}
						}

						newObj["default"] = obj;

						if (cache) {
							cache.set(obj, newObj);
						}

						return newObj;
					}

					module.exports = _interopRequireWildcard;

					/***/
				}),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/***/ ((module) => {

					function _typeof (obj) {
						"@babel/helpers - typeof";

						if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
							module.exports = _typeof = function _typeof (obj) {
								return typeof obj;
							};
						} else {
							module.exports = _typeof = function _typeof (obj) {
								return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
							};
						}

						return _typeof(obj);
					}

					module.exports = _typeof;

					/***/
				}),

/***/ "./src/jepub.js":
/*!**********************!*\
  !*** ./src/jepub.js ***!
  \**********************/
/***/ ((module, exports, __webpack_require__) => {

					"use strict";


					var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

					var _interopRequireWildcard = __webpack_require__(/*! @babel/runtime/helpers/interopRequireWildcard */ "./node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

					Object.defineProperty(exports, "__esModule", ({
						value: true
					}));
					exports["default"] = void 0;

					var utils = _interopRequireWildcard(__webpack_require__(/*! ./utils */ "./src/utils.js"));

					var _imageType = _interopRequireDefault(__webpack_require__(/*! image-type */ "./node_modules/image-type/index.js"));

					var _i18n = _interopRequireDefault(__webpack_require__(/*! ./i18n.json */ "./src/i18n.json"));

					var _container = _interopRequireDefault(__webpack_require__(/*! ./tpl/epub/META-INF/container.xml */ "./src/tpl/epub/META-INF/container.xml"));

					var _frontCover = _interopRequireDefault(__webpack_require__(/*! ./tpl/epub/OEBPS/front-cover.html */ "./src/tpl/epub/OEBPS/front-cover.html.ejs"));

					var _notes = _interopRequireDefault(__webpack_require__(/*! ./tpl/epub/OEBPS/notes.html */ "./src/tpl/epub/OEBPS/notes.html.ejs"));

					var _page = _interopRequireDefault(__webpack_require__(/*! ./tpl/epub/OEBPS/page.html */ "./src/tpl/epub/OEBPS/page.html.ejs"));

					var _tableOfContents = _interopRequireDefault(__webpack_require__(/*! ./tpl/epub/OEBPS/table-of-contents.html */ "./src/tpl/epub/OEBPS/table-of-contents.html.ejs"));

					var _titlePage = _interopRequireDefault(__webpack_require__(/*! ./tpl/epub/OEBPS/title-page.html */ "./src/tpl/epub/OEBPS/title-page.html.ejs"));

					var _book = _interopRequireDefault(__webpack_require__(/*! ./tpl/epub/book.opf */ "./src/tpl/epub/book.opf.ejs"));

					var _mimetype = _interopRequireDefault(__webpack_require__(/*! ./tpl/epub/mimetype */ "./src/tpl/epub/mimetype"));

					var _toc = _interopRequireDefault(__webpack_require__(/*! ./tpl/epub/toc.ncx */ "./src/tpl/epub/toc.ncx.ejs"));

					class jEpub {
						constructor() {
							this._I18n = {};
							this._Info = {};
							this._Uuid = {};
							this._Date = null;
							this._Cover = null;
							this._Pages = [];
							this._Images = [];
							this._Zip = {};
						}

						init (details) {
							if (details instanceof JSZip) {
								this._Zip = details;
								return this;
							}

							this._Info = Object.assign({}, {
								i18n: 'en',
								title: 'undefined',
								author: 'undefined',
								publisher: 'undefined',
								description: '',
								tags: []
							}, details);

							// 用于 Pixiv 时，我传入了自定义的 i18n 配置信息。将其添加到原有的 i18n 配置里
							if(usedForPixiv && details.i18n_config){
								_i18n.default[details.i18n] = details.i18n_config
							}

							this._Uuid = {
								scheme: 'uuid',
								id: utils.uuidv4()
							};
							this._Date = utils.getISODate();
							if (!_i18n.default[this._Info.i18n]) throw "Unknown Language: ".concat(this._Info.i18n);
							this._I18n = _i18n.default[this._Info.i18n];
							this._Zip = new JSZip();

							this._Zip.file('mimetype', _mimetype.default);

							this._Zip.file('META-INF/container.xml', _container.default);

							this._Zip.file('OEBPS/title-page.html', createTitlePage({
								i18n: this._I18n,
								title: this._Info.title,
								author: this._Info.author,
								publisher: this._Info.publisher,
								description: utils.parseDOM(this._Info.description),
								tags: this._Info.tags
							}));

							return this;
						}

						static html2text (html, noBr = false) {
							return utils.html2text(html, noBr);
						}

						date (date) {
							if (date instanceof Date) {
								this._Date = utils.getISODate(date);
								return this;
							} else {
								throw 'Date object is not valid';
							}
						}

						uuid (id) {
							if (utils.isEmpty(id)) {
								throw 'UUID value is empty';
							} else {
								let scheme = 'uuid';
								if (utils.validateUrl(id)) scheme = 'URI';
								this._Uuid = {
									scheme: scheme,
									id: id
								};
								return this;
							}
						}

						cover (data) {
							let ext, mime;

							if (data instanceof Blob) {
								mime = data.type;
								ext = utils.mime2ext(mime);
							} else if (data instanceof ArrayBuffer) {
								ext = (0, _imageType.default)(new Uint8Array(data));

								if (ext) {
									mime = ext.mime;
									ext = utils.mime2ext(mime);
								}
							} else {
								throw 'Cover data is not valid';
							}

							if (!ext) throw 'Cover data is not allowed';
							this._Cover = {
								type: mime,
								path: "OEBPS/cover-image.".concat(ext)
							};

							this._Zip.file(this._Cover.path, data);

							this._Zip.file('OEBPS/front-cover.html', createFrontCover({
								i18n: this._I18n,
								cover: this._Cover
							}));

							return this;
						}

						image (data, name) {
							let ext, mime;

							if (data instanceof Blob) {
								mime = data.type;
								ext = utils.mime2ext(mime);
							} else if (data instanceof ArrayBuffer) {
								ext = (0, _imageType.default)(new Uint8Array(data));
								mime = ext.mime;
								if (ext) ext = utils.mime2ext(mime);
							} else {
								throw 'Image data is not valid';
							}

							if (!ext) throw 'Image data is not allowed';
							const filePath = "assets/".concat(name, ".").concat(ext);
							this._Images[name] = {
								type: mime,
								path: filePath
							};

							this._Zip.file("OEBPS/".concat(filePath), data);

							return this;
						}

						notes (content) {
							if (utils.isEmpty(content)) {
								throw 'Notes is empty';
							} else {
								this._Zip.file('OEBPS/notes.html', createNotes({
									i18n: this._I18n,
									notes: utils.parseDOM(content)
								}));

								return this;
							}
						}

						add (title, content, index = this._Pages.length) {
							if (utils.isEmpty(title)) {
								throw 'Title is empty';
							} else if (utils.isEmpty(content)) {
								throw "Content of ".concat(title, " is empty");
							} else {
								if (!usedForPixiv && !Array.isArray(content)) {
									// 替换 image 标记为 img 标签
									// content 是文章页面的字符串，其中的图片内容是这样的标记：
									// <%= image['lorem-ipsum'] %>
									// 注意：这种标记是 jepub 的 demo 里的，但 pixiv 小说里面是不同的标记，我自行处理了，所以不需要在这里处理

									// 'lorem-ipsum' 是某个图片对象的 key
									// this._Images 是个类数组对象，在数组里用 key 保存每个图像的数据，例如：
									let _ImagesExample = []
									_ImagesExample["lorem-ipsum"] = {
										"type": "image/jpeg",
										"path": "assets/lorem-ipsum.jpg"
									}

									for (const [key, data] of Object.entries(this._Images)) {
										// key: "lorem-ipsum"
										// data: {type: 'image/jpeg', path: 'assets/lorem-ipsum.jpg'}
										const flag = `<%= image['${key}'] %>`
										const imgTag = `<img src="${data.path || 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='}" alt="image ${key}"></img>`
										content = content.replaceAll(flag, imgTag)
									}

									content = utils.parseDOM(content);
								}

								this._Zip.file("OEBPS/page-".concat(index, ".html"), createPage({
									i18n: this._I18n,
									title: title,
									content: content
								}));

								this._Pages[index] = title;
								return this;
							}
						}

						generate (type = 'blob', onUpdate) {
							if (!JSZip.support[type]) throw "This browser does not support ".concat(type);

							let notes = this._Zip.file('OEBPS/notes.html');

							notes = !notes ? false : true;

							this._Zip.file('book.opf', createBookOpf({
								i18n: this._I18n,
								uuid: this._Uuid,
								date: this._Date,
								title: this._Info.title,
								author: this._Info.author,
								publisher: this._Info.publisher,
								description: utils.html2text(this._Info.description, true),
								tags: this._Info.tags,
								cover: this._Cover,
								pages: this._Pages,
								notes: notes,
								images: this._Images
							}));

							this._Zip.file('OEBPS/table-of-contents.html', createTOC({
								i18n: this._I18n,
								pages: this._Pages
							}));

							this._Zip.file('toc.ncx', createTOC_ncx({
								i18n: this._I18n,
								uuid: this._Uuid,
								title: this._Info.title,
								author: this._Info.author,
								pages: this._Pages,
								notes: notes
							}));

							return this._Zip.generateAsync({
								type: type,
								mimeType: _mimetype.default,
								compression: 'DEFLATE',
								compressionOptions: {
									level: 9
								}
							}, onUpdate);
						}

					}

					exports["default"] = jEpub;
					module.exports = exports["default"];

					/***/
				}),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

					"use strict";


					Object.defineProperty(exports, "__esModule", ({
						value: true
					}));
					exports.uuidv4 = uuidv4;
					exports.isObject = isObject;
					exports.isEmpty = isEmpty;
					exports.getISODate = getISODate;
					exports.parseDOM = parseDOM;
					exports.html2text = html2text;
					exports.validateUrl = validateUrl;
					exports.mime2ext = mime2ext;

					/**
					 * Generates a UUID
					 * @see https://stackoverflow.com/a/2117523
					 * @returns {string} uuid
					 */
					function uuidv4 () {
						return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
					}
					/**
					 * Checks if a value is object
					 * @see https://stackoverflow.com/a/14706877
					 * @returns {boolean}
					 */


					function isObject (obj) {
						const type = typeof obj;
						return type === 'function' || type === 'object' && !!obj;
					}
					/**
					 * Checks if a value is empty
					 * @returns {boolean}
					 */


					function isEmpty (val) {
						if (val === null) {
							return true;
						} else if (typeof val === 'string') {
							return !val.trim();
						}

						return false;
					}
					/**
					 * Get current moment in ISO format
					 * @param {Object} date
					 * @returns {string} ISO date
					 */


					function getISODate (date = new Date()) {
						return date.toISOString();
					}
					/**
					 * Convert convert HTML to valid XHTML
					 * @param {String} html
					 * @param {String} outText return as plain text
					 */


					function parseDOM (html, outText = false) {
						let doc = new DOMParser().parseFromString("<!doctype html><body>".concat(html), 'text/html');
						if (outText) return doc.body.textContent.trim();
						doc = new XMLSerializer().serializeToString(doc.body);
						doc = doc.replace(/(^<body\s?[^>]*>|<\/body>$)/g, '');
						return doc;
					}
					/**
					 * Convert HTML to plain text
					 * @param {String} html
					 */


					function html2text (html, noBr = false) {
						html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
						html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
						html = html.replace(/<\/(div|p|li|dd|h[1-6])>/gi, '\n');
						html = html.replace(/<(br|hr)\s*[/]?>/gi, '\n');
						html = html.replace(/<li>/ig, '+ ');
						html = html.replace(/<[^>]+>/g, '');
						html = html.replace(/\n{3,}/g, '\n\n');
						html = parseDOM(html, true);
						if (noBr) html = html.replace(/\n+/g, ' ');
						return html;
					}
					/**
					 * @see https://gist.github.com/dperini/729294
					 * @param {String} value
					 */


					function validateUrl (value) {
						return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
					}
					/**
					 * Convert MIME type to extension
					 * @param {String} mime
					 */


					function mime2ext (mime) {
						let ext = null;

						switch (mime) {
							case 'image/jpg':
							case 'image/jpeg':
								ext = 'jpg';
								break;

							case 'image/svg+xml':
								ext = 'svg';
								break;

							case 'image/gif':
							case 'image/apng':
							case 'image/png':
							case 'image/webp':
							case 'image/bmp':
								ext = mime.split('/')[1];
								break;

							default:
								ext = null;
								break;
						}

						return ext;
					} // TODO: kepub
					// Wrap text, image <span class="koboSpan" id="kobo.{para:số thứ tự đoạn văn, bắt đầu bằng 1}.{seg: số thứ tự cụm bị wrap, bắt đầu bằng 1}">text</span>
					// https://github.com/pgaskin/kepubify/blob/871aa0bb2047b5ba171bc608024bdb180cb29d70/kepub/transform.go#L173
					//UnescapeString
					// var htmlEscaper = strings.NewReplacer(
					// 	`&`, "&amp;",
					// 	`'`, "&#39;", // "&#39;" is shorter than "&apos;" and apos was not in HTML until HTML5.
					// 	`<`, "&lt;",
					// 	`>`, "&gt;",
					// 	`"`, "&#34;", // "&#34;" is shorter than "&quot;".
					// )

					/***/
				}),

/***/ "./node_modules/file-type/index.js":
/*!*****************************************!*\
  !*** ./node_modules/file-type/index.js ***!
  \*****************************************/
/***/ ((module) => {

					"use strict";

					const toBytes = s => [...s].map(c => c.charCodeAt(0));
					const xpiZipFilename = toBytes('META-INF/mozilla.rsa');
					const oxmlContentTypes = toBytes('[Content_Types].xml');
					const oxmlRels = toBytes('_rels/.rels');

					function readUInt64LE (buf, offset = 0) {
						let n = buf[offset];
						let mul = 1;
						let i = 0;
						while (++i < 8) {
							mul *= 0x100;
							n += buf[offset + i] * mul;
						}

						return n;
					}

					const fileType = input => {
						if (!(input instanceof Uint8Array || input instanceof ArrayBuffer || Buffer.isBuffer(input))) {
							throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`Buffer\` or \`ArrayBuffer\`, got \`${typeof input}\``);
						}

						const buf = input instanceof Uint8Array ? input : new Uint8Array(input);

						if (!(buf && buf.length > 1)) {
							return null;
						}

						const check = (header, options) => {
							options = Object.assign({
								offset: 0
							}, options);

							for (let i = 0; i < header.length; i++) {
								// If a bitmask is set
								if (options.mask) {
									// If header doesn't equal `buf` with bits masked off
									if (header[i] !== (options.mask[i] & buf[i + options.offset])) {
										return false;
									}
								} else if (header[i] !== buf[i + options.offset]) {
									return false;
								}
							}

							return true;
						};

						const checkString = (header, options) => check(toBytes(header), options);

						if (check([0xFF, 0xD8, 0xFF])) {
							return {
								ext: 'jpg',
								mime: 'image/jpeg'
							};
						}

						if (check([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
							return {
								ext: 'png',
								mime: 'image/png'
							};
						}

						if (check([0x47, 0x49, 0x46])) {
							return {
								ext: 'gif',
								mime: 'image/gif'
							};
						}

						if (check([0x57, 0x45, 0x42, 0x50], { offset: 8 })) {
							return {
								ext: 'webp',
								mime: 'image/webp'
							};
						}

						if (check([0x46, 0x4C, 0x49, 0x46])) {
							return {
								ext: 'flif',
								mime: 'image/flif'
							};
						}

						// Needs to be before `tif` check
						if (
							(check([0x49, 0x49, 0x2A, 0x0]) || check([0x4D, 0x4D, 0x0, 0x2A])) &&
							check([0x43, 0x52], { offset: 8 })
						) {
							return {
								ext: 'cr2',
								mime: 'image/x-canon-cr2'
							};
						}

						if (
							check([0x49, 0x49, 0x2A, 0x0]) ||
							check([0x4D, 0x4D, 0x0, 0x2A])
						) {
							return {
								ext: 'tif',
								mime: 'image/tiff'
							};
						}

						if (check([0x42, 0x4D])) {
							return {
								ext: 'bmp',
								mime: 'image/bmp'
							};
						}

						if (check([0x49, 0x49, 0xBC])) {
							return {
								ext: 'jxr',
								mime: 'image/vnd.ms-photo'
							};
						}

						if (check([0x38, 0x42, 0x50, 0x53])) {
							return {
								ext: 'psd',
								mime: 'image/vnd.adobe.photoshop'
							};
						}

						// Zip-based file formats
						// Need to be before the `zip` check
						if (check([0x50, 0x4B, 0x3, 0x4])) {
							if (
								check([0x6D, 0x69, 0x6D, 0x65, 0x74, 0x79, 0x70, 0x65, 0x61, 0x70, 0x70, 0x6C, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6F, 0x6E, 0x2F, 0x65, 0x70, 0x75, 0x62, 0x2B, 0x7A, 0x69, 0x70], { offset: 30 })
							) {
								return {
									ext: 'epub',
									mime: 'application/epub+zip'
								};
							}

							// Assumes signed `.xpi` from addons.mozilla.org
							if (check(xpiZipFilename, { offset: 30 })) {
								return {
									ext: 'xpi',
									mime: 'application/x-xpinstall'
								};
							}

							if (checkString('mimetypeapplication/vnd.oasis.opendocument.text', { offset: 30 })) {
								return {
									ext: 'odt',
									mime: 'application/vnd.oasis.opendocument.text'
								};
							}

							if (checkString('mimetypeapplication/vnd.oasis.opendocument.spreadsheet', { offset: 30 })) {
								return {
									ext: 'ods',
									mime: 'application/vnd.oasis.opendocument.spreadsheet'
								};
							}

							if (checkString('mimetypeapplication/vnd.oasis.opendocument.presentation', { offset: 30 })) {
								return {
									ext: 'odp',
									mime: 'application/vnd.oasis.opendocument.presentation'
								};
							}

							// The docx, xlsx and pptx file types extend the Office Open XML file format:
							// https://en.wikipedia.org/wiki/Office_Open_XML_file_formats
							// We look for:
							// - one entry named '[Content_Types].xml' or '_rels/.rels',
							// - one entry indicating specific type of file.
							// MS Office, OpenOffice and LibreOffice may put the parts in different order, so the check should not rely on it.
							const findNextZipHeaderIndex = (arr, startAt = 0) => arr.findIndex((el, i, arr) => i >= startAt && arr[i] === 0x50 && arr[i + 1] === 0x4B && arr[i + 2] === 0x3 && arr[i + 3] === 0x4);

							let zipHeaderIndex = 0; // The first zip header was already found at index 0
							let oxmlFound = false;
							let type = null;

							do {
								const offset = zipHeaderIndex + 30;

								if (!oxmlFound) {
									oxmlFound = (check(oxmlContentTypes, { offset }) || check(oxmlRels, { offset }));
								}

								if (!type) {
									if (checkString('word/', { offset })) {
										type = {
											ext: 'docx',
											mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
										};
									} else if (checkString('ppt/', { offset })) {
										type = {
											ext: 'pptx',
											mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
										};
									} else if (checkString('xl/', { offset })) {
										type = {
											ext: 'xlsx',
											mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
										};
									}
								}

								if (oxmlFound && type) {
									return type;
								}

								zipHeaderIndex = findNextZipHeaderIndex(buf, offset);
							} while (zipHeaderIndex >= 0);

							// No more zip parts available in the buffer, but maybe we are almost certain about the type?
							if (type) {
								return type;
							}
						}

						if (
							check([0x50, 0x4B]) &&
							(buf[2] === 0x3 || buf[2] === 0x5 || buf[2] === 0x7) &&
							(buf[3] === 0x4 || buf[3] === 0x6 || buf[3] === 0x8)
						) {
							return {
								ext: 'zip',
								mime: 'application/zip'
							};
						}

						if (check([0x75, 0x73, 0x74, 0x61, 0x72], { offset: 257 })) {
							return {
								ext: 'tar',
								mime: 'application/x-tar'
							};
						}

						if (
							check([0x52, 0x61, 0x72, 0x21, 0x1A, 0x7]) &&
							(buf[6] === 0x0 || buf[6] === 0x1)
						) {
							return {
								ext: 'rar',
								mime: 'application/x-rar-compressed'
							};
						}

						if (check([0x1F, 0x8B, 0x8])) {
							return {
								ext: 'gz',
								mime: 'application/gzip'
							};
						}

						if (check([0x42, 0x5A, 0x68])) {
							return {
								ext: 'bz2',
								mime: 'application/x-bzip2'
							};
						}

						if (check([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C])) {
							return {
								ext: '7z',
								mime: 'application/x-7z-compressed'
							};
						}

						if (check([0x78, 0x01])) {
							return {
								ext: 'dmg',
								mime: 'application/x-apple-diskimage'
							};
						}

						if (check([0x33, 0x67, 0x70, 0x35]) || // 3gp5
							(
								check([0x0, 0x0, 0x0]) && check([0x66, 0x74, 0x79, 0x70], { offset: 4 }) &&
								(
									check([0x6D, 0x70, 0x34, 0x31], { offset: 8 }) || // MP41
									check([0x6D, 0x70, 0x34, 0x32], { offset: 8 }) || // MP42
									check([0x69, 0x73, 0x6F, 0x6D], { offset: 8 }) || // ISOM
									check([0x69, 0x73, 0x6F, 0x32], { offset: 8 }) || // ISO2
									check([0x6D, 0x6D, 0x70, 0x34], { offset: 8 }) || // MMP4
									check([0x4D, 0x34, 0x56], { offset: 8 }) || // M4V
									check([0x64, 0x61, 0x73, 0x68], { offset: 8 }) // DASH
								)
							)) {
							return {
								ext: 'mp4',
								mime: 'video/mp4'
							};
						}

						if (check([0x4D, 0x54, 0x68, 0x64])) {
							return {
								ext: 'mid',
								mime: 'audio/midi'
							};
						}

						// https://github.com/threatstack/libmagic/blob/master/magic/Magdir/matroska
						if (check([0x1A, 0x45, 0xDF, 0xA3])) {
							const sliced = buf.subarray(4, 4 + 4096);
							const idPos = sliced.findIndex((el, i, arr) => arr[i] === 0x42 && arr[i + 1] === 0x82);

							if (idPos !== -1) {
								const docTypePos = idPos + 3;
								const findDocType = type => [...type].every((c, i) => sliced[docTypePos + i] === c.charCodeAt(0));

								if (findDocType('matroska')) {
									return {
										ext: 'mkv',
										mime: 'video/x-matroska'
									};
								}

								if (findDocType('webm')) {
									return {
										ext: 'webm',
										mime: 'video/webm'
									};
								}
							}
						}

						if (check([0x0, 0x0, 0x0, 0x14, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20]) ||
							check([0x66, 0x72, 0x65, 0x65], { offset: 4 }) || // Type: `free`
							check([0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20], { offset: 4 }) ||
							check([0x6D, 0x64, 0x61, 0x74], { offset: 4 }) || // MJPEG
							check([0x6D, 0x6F, 0x6F, 0x76], { offset: 4 }) || // Type: `moov`
							check([0x77, 0x69, 0x64, 0x65], { offset: 4 })) {
							return {
								ext: 'mov',
								mime: 'video/quicktime'
							};
						}

						// RIFF file format which might be AVI, WAV, QCP, etc
						if (check([0x52, 0x49, 0x46, 0x46])) {
							if (check([0x41, 0x56, 0x49], { offset: 8 })) {
								return {
									ext: 'avi',
									mime: 'video/vnd.avi'
								};
							}

							if (check([0x57, 0x41, 0x56, 0x45], { offset: 8 })) {
								return {
									ext: 'wav',
									mime: 'audio/vnd.wave'
								};
							}

							// QLCM, QCP file
							if (check([0x51, 0x4C, 0x43, 0x4D], { offset: 8 })) {
								return {
									ext: 'qcp',
									mime: 'audio/qcelp'
								};
							}
						}

						// ASF_Header_Object first 80 bytes
						if (check([0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11, 0xA6, 0xD9])) {
							// Search for header should be in first 1KB of file.

							let offset = 30;
							do {
								const objectSize = readUInt64LE(buf, offset + 16);
								if (check([0x91, 0x07, 0xDC, 0xB7, 0xB7, 0xA9, 0xCF, 0x11, 0x8E, 0xE6, 0x00, 0xC0, 0x0C, 0x20, 0x53, 0x65], { offset })) {
									// Sync on Stream-Properties-Object (B7DC0791-A9B7-11CF-8EE6-00C00C205365)
									if (check([0x40, 0x9E, 0x69, 0xF8, 0x4D, 0x5B, 0xCF, 0x11, 0xA8, 0xFD, 0x00, 0x80, 0x5F, 0x5C, 0x44, 0x2B], { offset: offset + 24 })) {
										// Found audio:
										return {
											ext: 'wma',
											mime: 'audio/x-ms-wma'
										};
									}

									if (check([0xC0, 0xEF, 0x19, 0xBC, 0x4D, 0x5B, 0xCF, 0x11, 0xA8, 0xFD, 0x00, 0x80, 0x5F, 0x5C, 0x44, 0x2B], { offset: offset + 24 })) {
										// Found video:
										return {
											ext: 'wmv',
											mime: 'video/x-ms-asf'
										};
									}

									break;
								}

								offset += objectSize;
							} while (offset + 24 <= buf.length);

							// Default to ASF generic extension
							return {
								ext: 'asf',
								mime: 'application/vnd.ms-asf'
							};
						}

						if (
							check([0x0, 0x0, 0x1, 0xBA]) ||
							check([0x0, 0x0, 0x1, 0xB3])
						) {
							return {
								ext: 'mpg',
								mime: 'video/mpeg'
							};
						}

						if (check([0x66, 0x74, 0x79, 0x70, 0x33, 0x67], { offset: 4 })) {
							return {
								ext: '3gp',
								mime: 'video/3gpp'
							};
						}

						// Check for MPEG header at different starting offsets
						for (let start = 0; start < 2 && start < (buf.length - 16); start++) {
							if (
								check([0x49, 0x44, 0x33], { offset: start }) || // ID3 header
								check([0xFF, 0xE2], { offset: start, mask: [0xFF, 0xE2] }) // MPEG 1 or 2 Layer 3 header
							) {
								return {
									ext: 'mp3',
									mime: 'audio/mpeg'
								};
							}

							if (
								check([0xFF, 0xE4], { offset: start, mask: [0xFF, 0xE4] }) // MPEG 1 or 2 Layer 2 header
							) {
								return {
									ext: 'mp2',
									mime: 'audio/mpeg'
								};
							}

							if (
								check([0xFF, 0xF8], { offset: start, mask: [0xFF, 0xFC] }) // MPEG 2 layer 0 using ADTS
							) {
								return {
									ext: 'mp2',
									mime: 'audio/mpeg'
								};
							}

							if (
								check([0xFF, 0xF0], { offset: start, mask: [0xFF, 0xFC] }) // MPEG 4 layer 0 using ADTS
							) {
								return {
									ext: 'mp4',
									mime: 'audio/mpeg'
								};
							}
						}

						if (
							check([0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x41], { offset: 4 })
						) {
							return { // MPEG-4 layer 3 (audio)
								ext: 'm4a',
								mime: 'audio/mp4' // RFC 4337
							};
						}

						// Needs to be before `ogg` check
						if (check([0x4F, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64], { offset: 28 })) {
							return {
								ext: 'opus',
								mime: 'audio/opus'
							};
						}

						// If 'OggS' in first  bytes, then OGG container
						if (check([0x4F, 0x67, 0x67, 0x53])) {
							// This is a OGG container

							// If ' theora' in header.
							if (check([0x80, 0x74, 0x68, 0x65, 0x6F, 0x72, 0x61], { offset: 28 })) {
								return {
									ext: 'ogv',
									mime: 'video/ogg'
								};
							}

							// If '\x01video' in header.
							if (check([0x01, 0x76, 0x69, 0x64, 0x65, 0x6F, 0x00], { offset: 28 })) {
								return {
									ext: 'ogm',
									mime: 'video/ogg'
								};
							}

							// If ' FLAC' in header  https://xiph.org/flac/faq.html
							if (check([0x7F, 0x46, 0x4C, 0x41, 0x43], { offset: 28 })) {
								return {
									ext: 'oga',
									mime: 'audio/ogg'
								};
							}

							// 'Speex  ' in header https://en.wikipedia.org/wiki/Speex
							if (check([0x53, 0x70, 0x65, 0x65, 0x78, 0x20, 0x20], { offset: 28 })) {
								return {
									ext: 'spx',
									mime: 'audio/ogg'
								};
							}

							// If '\x01vorbis' in header
							if (check([0x01, 0x76, 0x6F, 0x72, 0x62, 0x69, 0x73], { offset: 28 })) {
								return {
									ext: 'ogg',
									mime: 'audio/ogg'
								};
							}

							// Default OGG container https://www.iana.org/assignments/media-types/application/ogg
							return {
								ext: 'ogx',
								mime: 'application/ogg'
							};
						}

						if (check([0x66, 0x4C, 0x61, 0x43])) {
							return {
								ext: 'flac',
								mime: 'audio/x-flac'
							};
						}

						if (check([0x4D, 0x41, 0x43, 0x20])) { // 'MAC '
							return {
								ext: 'ape',
								mime: 'audio/ape'
							};
						}

						if (check([0x77, 0x76, 0x70, 0x6B])) { // 'wvpk'
							return {
								ext: 'wv',
								mime: 'audio/wavpack'
							};
						}

						if (check([0x23, 0x21, 0x41, 0x4D, 0x52, 0x0A])) {
							return {
								ext: 'amr',
								mime: 'audio/amr'
							};
						}

						if (check([0x25, 0x50, 0x44, 0x46])) {
							return {
								ext: 'pdf',
								mime: 'application/pdf'
							};
						}

						if (check([0x4D, 0x5A])) {
							return {
								ext: 'exe',
								mime: 'application/x-msdownload'
							};
						}

						if (
							(buf[0] === 0x43 || buf[0] === 0x46) &&
							check([0x57, 0x53], { offset: 1 })
						) {
							return {
								ext: 'swf',
								mime: 'application/x-shockwave-flash'
							};
						}

						if (check([0x7B, 0x5C, 0x72, 0x74, 0x66])) {
							return {
								ext: 'rtf',
								mime: 'application/rtf'
							};
						}

						if (check([0x00, 0x61, 0x73, 0x6D])) {
							return {
								ext: 'wasm',
								mime: 'application/wasm'
							};
						}

						if (
							check([0x77, 0x4F, 0x46, 0x46]) &&
							(
								check([0x00, 0x01, 0x00, 0x00], { offset: 4 }) ||
								check([0x4F, 0x54, 0x54, 0x4F], { offset: 4 })
							)
						) {
							return {
								ext: 'woff',
								mime: 'font/woff'
							};
						}

						if (
							check([0x77, 0x4F, 0x46, 0x32]) &&
							(
								check([0x00, 0x01, 0x00, 0x00], { offset: 4 }) ||
								check([0x4F, 0x54, 0x54, 0x4F], { offset: 4 })
							)
						) {
							return {
								ext: 'woff2',
								mime: 'font/woff2'
							};
						}

						if (
							check([0x4C, 0x50], { offset: 34 }) &&
							(
								check([0x00, 0x00, 0x01], { offset: 8 }) ||
								check([0x01, 0x00, 0x02], { offset: 8 }) ||
								check([0x02, 0x00, 0x02], { offset: 8 })
							)
						) {
							return {
								ext: 'eot',
								mime: 'application/vnd.ms-fontobject'
							};
						}

						if (check([0x00, 0x01, 0x00, 0x00, 0x00])) {
							return {
								ext: 'ttf',
								mime: 'font/ttf'
							};
						}

						if (check([0x4F, 0x54, 0x54, 0x4F, 0x00])) {
							return {
								ext: 'otf',
								mime: 'font/otf'
							};
						}

						if (check([0x00, 0x00, 0x01, 0x00])) {
							return {
								ext: 'ico',
								mime: 'image/x-icon'
							};
						}

						if (check([0x00, 0x00, 0x02, 0x00])) {
							return {
								ext: 'cur',
								mime: 'image/x-icon'
							};
						}

						if (check([0x46, 0x4C, 0x56, 0x01])) {
							return {
								ext: 'flv',
								mime: 'video/x-flv'
							};
						}

						if (check([0x25, 0x21])) {
							return {
								ext: 'ps',
								mime: 'application/postscript'
							};
						}

						if (check([0xFD, 0x37, 0x7A, 0x58, 0x5A, 0x00])) {
							return {
								ext: 'xz',
								mime: 'application/x-xz'
							};
						}

						if (check([0x53, 0x51, 0x4C, 0x69])) {
							return {
								ext: 'sqlite',
								mime: 'application/x-sqlite3'
							};
						}

						if (check([0x4E, 0x45, 0x53, 0x1A])) {
							return {
								ext: 'nes',
								mime: 'application/x-nintendo-nes-rom'
							};
						}

						if (check([0x43, 0x72, 0x32, 0x34])) {
							return {
								ext: 'crx',
								mime: 'application/x-google-chrome-extension'
							};
						}

						if (
							check([0x4D, 0x53, 0x43, 0x46]) ||
							check([0x49, 0x53, 0x63, 0x28])
						) {
							return {
								ext: 'cab',
								mime: 'application/vnd.ms-cab-compressed'
							};
						}

						// Needs to be before `ar` check
						if (check([0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E, 0x0A, 0x64, 0x65, 0x62, 0x69, 0x61, 0x6E, 0x2D, 0x62, 0x69, 0x6E, 0x61, 0x72, 0x79])) {
							return {
								ext: 'deb',
								mime: 'application/x-deb'
							};
						}

						if (check([0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E])) {
							return {
								ext: 'ar',
								mime: 'application/x-unix-archive'
							};
						}

						if (check([0xED, 0xAB, 0xEE, 0xDB])) {
							return {
								ext: 'rpm',
								mime: 'application/x-rpm'
							};
						}

						if (
							check([0x1F, 0xA0]) ||
							check([0x1F, 0x9D])
						) {
							return {
								ext: 'Z',
								mime: 'application/x-compress'
							};
						}

						if (check([0x4C, 0x5A, 0x49, 0x50])) {
							return {
								ext: 'lz',
								mime: 'application/x-lzip'
							};
						}

						if (check([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1])) {
							return {
								ext: 'msi',
								mime: 'application/x-msi'
							};
						}

						if (check([0x06, 0x0E, 0x2B, 0x34, 0x02, 0x05, 0x01, 0x01, 0x0D, 0x01, 0x02, 0x01, 0x01, 0x02])) {
							return {
								ext: 'mxf',
								mime: 'application/mxf'
							};
						}

						if (check([0x47], { offset: 4 }) && (check([0x47], { offset: 192 }) || check([0x47], { offset: 196 }))) {
							return {
								ext: 'mts',
								mime: 'video/mp2t'
							};
						}

						if (check([0x42, 0x4C, 0x45, 0x4E, 0x44, 0x45, 0x52])) {
							return {
								ext: 'blend',
								mime: 'application/x-blender'
							};
						}

						if (check([0x42, 0x50, 0x47, 0xFB])) {
							return {
								ext: 'bpg',
								mime: 'image/bpg'
							};
						}

						if (check([0x00, 0x00, 0x00, 0x0C, 0x6A, 0x50, 0x20, 0x20, 0x0D, 0x0A, 0x87, 0x0A])) {
							// JPEG-2000 family

							if (check([0x6A, 0x70, 0x32, 0x20], { offset: 20 })) {
								return {
									ext: 'jp2',
									mime: 'image/jp2'
								};
							}

							if (check([0x6A, 0x70, 0x78, 0x20], { offset: 20 })) {
								return {
									ext: 'jpx',
									mime: 'image/jpx'
								};
							}

							if (check([0x6A, 0x70, 0x6D, 0x20], { offset: 20 })) {
								return {
									ext: 'jpm',
									mime: 'image/jpm'
								};
							}

							if (check([0x6D, 0x6A, 0x70, 0x32], { offset: 20 })) {
								return {
									ext: 'mj2',
									mime: 'image/mj2'
								};
							}
						}

						if (check([0x46, 0x4F, 0x52, 0x4D])) {
							return {
								ext: 'aif',
								mime: 'audio/aiff'
							};
						}

						if (checkString('<?xml ')) {
							return {
								ext: 'xml',
								mime: 'application/xml'
							};
						}

						if (check([0x42, 0x4F, 0x4F, 0x4B, 0x4D, 0x4F, 0x42, 0x49], { offset: 60 })) {
							return {
								ext: 'mobi',
								mime: 'application/x-mobipocket-ebook'
							};
						}

						// File Type Box (https://en.wikipedia.org/wiki/ISO_base_media_file_format)
						if (check([0x66, 0x74, 0x79, 0x70], { offset: 4 })) {
							if (check([0x6D, 0x69, 0x66, 0x31], { offset: 8 })) {
								return {
									ext: 'heic',
									mime: 'image/heif'
								};
							}

							if (check([0x6D, 0x73, 0x66, 0x31], { offset: 8 })) {
								return {
									ext: 'heic',
									mime: 'image/heif-sequence'
								};
							}

							if (check([0x68, 0x65, 0x69, 0x63], { offset: 8 }) || check([0x68, 0x65, 0x69, 0x78], { offset: 8 })) {
								return {
									ext: 'heic',
									mime: 'image/heic'
								};
							}

							if (check([0x68, 0x65, 0x76, 0x63], { offset: 8 }) || check([0x68, 0x65, 0x76, 0x78], { offset: 8 })) {
								return {
									ext: 'heic',
									mime: 'image/heic-sequence'
								};
							}
						}

						if (check([0xAB, 0x4B, 0x54, 0x58, 0x20, 0x31, 0x31, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A])) {
							return {
								ext: 'ktx',
								mime: 'image/ktx'
							};
						}

						if (check([0x44, 0x49, 0x43, 0x4D], { offset: 128 })) {
							return {
								ext: 'dcm',
								mime: 'application/dicom'
							};
						}

						// Musepack, SV7
						if (check([0x4D, 0x50, 0x2B])) {
							return {
								ext: 'mpc',
								mime: 'audio/x-musepack'
							};
						}

						// Musepack, SV8
						if (check([0x4D, 0x50, 0x43, 0x4B])) {
							return {
								ext: 'mpc',
								mime: 'audio/x-musepack'
							};
						}

						if (check([0x42, 0x45, 0x47, 0x49, 0x4E, 0x3A])) {
							return {
								ext: 'ics',
								mime: 'text/calendar'
							};
						}

						if (check([0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00])) {
							return {
								ext: 'glb',
								mime: 'model/gltf-binary'
							};
						}

						if (check([0xD4, 0xC3, 0xB2, 0xA1]) || check([0xA1, 0xB2, 0xC3, 0xD4])) {
							return {
								ext: 'pcap',
								mime: 'application/vnd.tcpdump.pcap'
							};
						}

						return null;
					};

					module.exports = fileType;
					// TODO: Remove this for the next major release
					module.exports["default"] = fileType;

					Object.defineProperty(fileType, 'minimumBytes', { value: 4100 });

					module.exports.stream = readableStream => new Promise((resolve, reject) => {
						// Using `eval` to work around issues when bundling with Webpack
						const stream = eval('require')('stream'); // eslint-disable-line no-eval

						readableStream.once('readable', () => {
							const pass = new stream.PassThrough();
							const chunk = readableStream.read(module.exports.minimumBytes) || readableStream.read();
							try {
								pass.fileType = fileType(chunk);
							} catch (error) {
								reject(error);
							}

							readableStream.unshift(chunk);

							if (stream.pipeline) {
								resolve(stream.pipeline(readableStream, pass, () => { }));
							} else {
								resolve(readableStream.pipe(pass));
							}
						});
					});


					/***/
				}),

/***/ "./node_modules/image-type/index.js":
/*!******************************************!*\
  !*** ./node_modules/image-type/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

					"use strict";

					const fileType = __webpack_require__(/*! file-type */ "./node_modules/file-type/index.js");

					const imageExts = new Set([
						'jpg',
						'png',
						'gif',
						'webp',
						'flif',
						'cr2',
						'tif',
						'bmp',
						'jxr',
						'psd',
						'ico',
						'bpg',
						'jp2',
						'jpm',
						'jpx',
						'heic',
						'cur',
						'dcm'
					]);

					const imageType = input => {
						const ret = fileType(input);
						return imageExts.has(ret && ret.ext) ? ret : null;
					};

					module.exports = imageType;
					// TODO: Remove this for the next major release
					module.exports["default"] = imageType;

					Object.defineProperty(imageType, 'minimumBytes', { value: fileType.minimumBytes });


					/***/
				}),

/***/ "./src/tpl/epub/META-INF/container.xml":
/*!*********************************************!*\
  !*** ./src/tpl/epub/META-INF/container.xml ***!
  \*********************************************/
/***/ ((module) => {

					module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<container version=\"1.0\" xmlns=\"urn:oasis:names:tc:opendocument:xmlns:container\">\n\t<rootfiles>\n\t\t<rootfile full-path=\"book.opf\" media-type=\"application/oebps-package+xml\" />\n\t</rootfiles>\n</container>"

					/***/
				}),

/***/ "./src/tpl/epub/OEBPS/front-cover.html.ejs":
/*!*************************************************!*\
  !*** ./src/tpl/epub/OEBPS/front-cover.html.ejs ***!
  \*************************************************/
/***/ ((module) => {

					module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"<%= i18n.code %>\">\n\n<head>\n\t<title><%= i18n.cover %></title>\n\t<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\" />\n</head>\n\n<body>\n\t<div id=\"cover-image\">\n\t\t<img src=\"../<%= cover.path %>\" alt=\"<%= i18n.cover %>\" />\n\t</div>\n</body>\n\n</html>\n"

					/***/
				}),

/***/ "./src/tpl/epub/OEBPS/notes.html.ejs":
/*!*******************************************!*\
  !*** ./src/tpl/epub/OEBPS/notes.html.ejs ***!
  \*******************************************/
/***/ ((module) => {

					module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"<%= i18n.code %>\">\n\n<head>\n\t<title><%= i18n.note %></title>\n\t<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\" />\n</head>\n\n<body>\n\t<div id=\"notes-page\">\n\t\t<div class=\"ugc\">\n            <%- notes %>\n\t\t</div>\n\t</div>\n</body>\n\n</html>\n"

					/***/
				}),

/***/ "./src/tpl/epub/OEBPS/page.html.ejs":
/*!******************************************!*\
  !*** ./src/tpl/epub/OEBPS/page.html.ejs ***!
  \******************************************/
/***/ ((module) => {

					module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"<%= i18n.code %>\">\n\n<head>\n\t<title><%= title %></title>\n\t<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\" />\n</head>\n\n<body>\n\t<div class=\"chapter type-1\">\n\t\t<div class=\"chapter-title-wrap\">\n\t\t\t<h2 class=\"chapter-title\"><%= title %></h2>\n\t\t</div>\n\t\t<div class=\"ugc chapter-ugc\">\n            <% if (Array.isArray(content)) { %>\n                <% content.forEach(item => { %>\n                    <p class=\"indent\"><%= item %></p>\n                <% }); %>\n            <% } else { %>\n                <%- content %>\n            <% } %>\n\t\t</div>\n\t</div>\n</body>\n\n</html>\n"

					/***/
				}),

/***/ "./src/tpl/epub/OEBPS/table-of-contents.html.ejs":
/*!*******************************************************!*\
  !*** ./src/tpl/epub/OEBPS/table-of-contents.html.ejs ***!
  \*******************************************************/
/***/ ((module) => {

					module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"<%= i18n.code %>\">\n\n<head>\n\t<title><%= i18n.toc %></title>\n\t<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\" />\n</head>\n\n<body>\n\t<div id=\"toc\">\n\t\t<h1><%= i18n.toc %></h1>\n\t\t<ul>\n            <% pages.forEach((title, index) => { %>\n                <li class=\"chaptertype-1\">\n                    <a href=\"page-<%= index %>.html\">\n                        <span class=\"toc-chapter-title\"><%= title %></span>\n                    </a>\n                </li>\n            <% }); %>\n\t\t</ul>\n\t</div>\n</body>\n\n</html>\n"

					/***/
				}),

/***/ "./src/tpl/epub/OEBPS/title-page.html.ejs":
/*!************************************************!*\
  !*** ./src/tpl/epub/OEBPS/title-page.html.ejs ***!
  \************************************************/
/***/ ((module) => {

					module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"<%= i18n.code %>\">\n\n<head>\n\t<title><%= i18n.info %></title>\n\t<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\" />\n</head>\n\n<body>\n\t<div id=\"title-page\">\n\t\t<h1 class=\"title\"><%= title %></h1>\n\t\t<h2 class=\"subtitle\"></h2>\n\t\t<h3 class=\"author\"><%= author %></h3>\n\t\t<h4 class=\"publisher\"><%= publisher %></h4>\n\t</div>\n    <% if (Array.isArray(tags) && tags.length) { %>\n        <div class=\"part-title-wrap\">\n            <% tags = tags.join('</code>, <code>'); %>\n            <code><%- tags %></code>\n        </div>\n    <% } %>\n    <% if (description) { %>\n        <div class=\"ugc\">\n            <%- description %>\n        </div>\n    <% } %>\n</body>\n\n</html>\n"

					/***/
				}),

/***/ "./src/tpl/epub/book.opf.ejs":
/*!***********************************!*\
  !*** ./src/tpl/epub/book.opf.ejs ***!
  \***********************************/
/***/ ((module) => {

					module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<package version=\"2.0\" xmlns=\"http://www.idpf.org/2007/opf\" unique-identifier=\"PrimaryID\">\n\n\t<metadata xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:opf=\"http://www.idpf.org/2007/opf\">\n\t\t<dc:title><%= title %></dc:title>\n\t\t<dc:language><%= i18n.code %></dc:language>\n\t\t<dc:identifier id=\"PrimaryID\" opf:scheme=\"<%= uuid.scheme %>\"><%= uuid.id %></dc:identifier>\n        <dc:date opf:event=\"publication\"><%= date %></dc:date>\n        <% if (description) { %>\n\t\t    <dc:description><%= description %></dc:description>\n        <% } %>\n\t\t<dc:creator opf:role=\"aut\"><%= author %></dc:creator>\n\t\t<dc:publisher><%= publisher %></dc:publisher>\n        <% if (cover) { %>\n\t\t    <meta name=\"cover\" content=\"cover-image\" />\n        <% } %>\n        <% if (Array.isArray(tags) && tags.length) tags.forEach(tag => { %>\n            <dc:subject><%= tag %></dc:subject>\n        <% }); %>\n\t</metadata>\n\n\t<manifest>\n        <% if (cover) { %>\n\t\t    <item id=\"front-cover\" href=\"OEBPS/front-cover.html\" media-type=\"application/xhtml+xml\" />\n        <% } %>\n\t\t<item id=\"title-page\" href=\"OEBPS/title-page.html\" media-type=\"application/xhtml+xml\" />\n\t\t<item id=\"notes\" href=\"OEBPS/notes.html\" media-type=\"application/xhtml+xml\" />\n\t\t<item id=\"table-of-contents\" href=\"OEBPS/table-of-contents.html\" media-type=\"application/xhtml+xml\" />\n        <% pages.forEach((page, index) => { %>\n            <item id=\"page-<%= index %>\" href=\"OEBPS/page-<%= index %>.html\" media-type=\"application/xhtml+xml\" />\n        <% }); %>\n        <% if (cover) { %>\n\t\t    <item id=\"cover-image\" href=\"<%= cover.path %>\" media-type=\"<%= cover.type %>\" properties=\"cover-image\" />\n        <% } %>\n\t\t<item id=\"ncx\" href=\"toc.ncx\" media-type=\"application/x-dtbncx+xml\" />\n        <% Object.keys(images).forEach(name => { %>\n            <item id=\"<%= name %>\" href=\"OEBPS/<%= images[name].path %>\" media-type=\"<%= images[name].type %>\" />\n        <% }); %>\n\t</manifest>\n\n\t<spine toc=\"ncx\">\n        <% if (cover) { %>\n\t\t    <itemref idref=\"front-cover\" linear=\"no\" />\n        <% } %>\n\t\t<itemref idref=\"title-page\" linear=\"yes\" />\n\t\t<itemref idref=\"table-of-contents\" linear=\"yes\" />\n        <% pages.forEach((page, index) => { %>\n            <itemref idref=\"page-<%= index %>\" linear=\"yes\" />\n        <% }); %>\n        <% if (notes) { %>\n            <itemref idref=\"notes\" linear=\"yes\" />\n        <% } %>\n\t</spine>\n\n\t<guide>\n        <% if (cover) { %>\n\t\t    <reference type=\"cover\" title=\"<%= i18n.cover %>\" href=\"OEBPS/front-cover.html\" />\n        <% } %>\n\t\t<reference type=\"toc\" title=\"<%= i18n.toc %>\" href=\"OEBPS/table-of-contents.html\" />\n\t</guide>\n\n</package>\n"

					/***/
				}),

/***/ "./src/tpl/epub/mimetype":
/*!*******************************!*\
  !*** ./src/tpl/epub/mimetype ***!
  \*******************************/
/***/ ((module) => {

					module.exports = "application/epub+zip"

					/***/
				}),

/***/ "./src/tpl/epub/toc.ncx.ejs":
/*!**********************************!*\
  !*** ./src/tpl/epub/toc.ncx.ejs ***!
  \**********************************/
/***/ ((module) => {

					module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE ncx PUBLIC \"-//NISO//DTD ncx 2005-1//EN\" \"http://www.daisy.org/z3986/2005/ncx-2005-1.dtd\">\n\n<ncx version=\"2005-1\" xml:lang=\"<%= i18n.code %>\" xmlns=\"http://www.daisy.org/z3986/2005/ncx/\">\n\t<head>\n\t\t<meta name=\"dtb:uid\" content=\"<%= uuid.id %>\" />\n\t\t<meta name=\"dtb:depth\" content=\"2\" />\n\t\t<meta name=\"dtb:totalPageCount\" content=\"0\" />\n\t\t<meta name=\"dtb:maxPageNumber\" content=\"0\" />\n\t</head>\n\n\t<docTitle>\n\t\t<text><%= title %></text>\n\t</docTitle>\n\n\t<docAuthor>\n\t\t<text><%= author %></text>\n\t</docAuthor>\n\n\t<navMap>\n\t\t<navPoint id=\"title-page\" playOrder=\"1\">\n\t\t\t<navLabel>\n\t\t\t\t<text><%= i18n.info %></text>\n\t\t\t</navLabel>\n\t\t\t<content src=\"OEBPS/title-page.html\" />\n\t\t</navPoint>\n\t\t<navPoint id=\"table-of-contents\" playOrder=\"2\">\n\t\t\t<navLabel>\n\t\t\t\t<text><%= i18n.toc %></text>\n\t\t\t</navLabel>\n\t\t\t<content src=\"OEBPS/table-of-contents.html\" />\n\t\t</navPoint>\n        <% pages.forEach((title, index) => { %>\n            <navPoint id=\"page-<%= index %>\" playOrder=\"<%= (index + 3) %>\">\n                <navLabel>\n                    <text><%= title %></text>\n                </navLabel>\n                <content src=\"OEBPS/page-<%= index %>.html\" />\n            </navPoint>\n        <% }); %>\n        <% if (notes) { %>\n            <navPoint id=\"notes-page\" playOrder=\"2\">\n                <navLabel>\n                    <text><%= i18n.note %></text>\n                </navLabel>\n                <content src=\"OEBPS/notes.html\" />\n            </navPoint>\n        <% } %>\n\t</navMap>\n</ncx>\n"

					/***/
				}),

/***/ "./src/i18n.json":
/*!***********************!*\
  !*** ./src/i18n.json ***!
  \***********************/
/***/ ((module) => {

					"use strict";
					module.exports = JSON.parse('{"en":{"code":"en","cover":"Cover","toc":"Table of Contents","info":"Information","note":"Notes"},"vi":{"code":"vi","cover":"Bìa sách","toc":"Mục lục","info":"Giới thiệu","note":"Ghi chú"},"hi":{"code":"hi","cover":"आवरण","toc":"विषय - सूची","info":"जानकारी","note":"टिप्पणियाँ"}}');

					/***/
				})

			/******/
		});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__ (moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
				/******/
			}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
				/******/
			};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
			/******/
		}
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/jepub.js");
/******/
/******/ 	return __webpack_exports__;
		/******/
	})()
		;
});
//# sourceMappingURL=jepub.js.map