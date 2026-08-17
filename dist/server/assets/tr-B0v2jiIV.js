import { i as buildFormatLongFn, n as buildMatchFn, r as buildLocalizeFn, t as buildMatchPatternFn } from "./buildMatchPatternFn-DBctcWqV.js";
//#region node_modules/date-fns/locale/tr/_lib/formatDistance.js
var formatDistanceLocale = {
	lessThanXSeconds: {
		one: "bir saniyeden az",
		other: "{{count}} saniyeden az"
	},
	xSeconds: {
		one: "1 saniye",
		other: "{{count}} saniye"
	},
	halfAMinute: "yarım dakika",
	lessThanXMinutes: {
		one: "bir dakikadan az",
		other: "{{count}} dakikadan az"
	},
	xMinutes: {
		one: "1 dakika",
		other: "{{count}} dakika"
	},
	aboutXHours: {
		one: "yaklaşık 1 saat",
		other: "yaklaşık {{count}} saat"
	},
	xHours: {
		one: "1 saat",
		other: "{{count}} saat"
	},
	xDays: {
		one: "1 gün",
		other: "{{count}} gün"
	},
	aboutXWeeks: {
		one: "yaklaşık 1 hafta",
		other: "yaklaşık {{count}} hafta"
	},
	xWeeks: {
		one: "1 hafta",
		other: "{{count}} hafta"
	},
	aboutXMonths: {
		one: "yaklaşık 1 ay",
		other: "yaklaşık {{count}} ay"
	},
	xMonths: {
		one: "1 ay",
		other: "{{count}} ay"
	},
	aboutXYears: {
		one: "yaklaşık 1 yıl",
		other: "yaklaşık {{count}} yıl"
	},
	xYears: {
		one: "1 yıl",
		other: "{{count}} yıl"
	},
	overXYears: {
		one: "1 yıldan fazla",
		other: "{{count}} yıldan fazla"
	},
	almostXYears: {
		one: "neredeyse 1 yıl",
		other: "neredeyse {{count}} yıl"
	}
};
var formatDistance = (token, count, options) => {
	let result;
	const tokenValue = formatDistanceLocale[token];
	if (typeof tokenValue === "string") result = tokenValue;
	else if (count === 1) result = tokenValue.one;
	else result = tokenValue.other.replace("{{count}}", count.toString());
	if (options?.addSuffix) if (options.comparison && options.comparison > 0) return result + " sonra";
	else return result + " önce";
	return result;
};
var formatLong = {
	date: buildFormatLongFn({
		formats: {
			full: "d MMMM y EEEE",
			long: "d MMMM y",
			medium: "d MMM y",
			short: "dd.MM.yyyy"
		},
		defaultWidth: "full"
	}),
	time: buildFormatLongFn({
		formats: {
			full: "HH:mm:ss zzzz",
			long: "HH:mm:ss z",
			medium: "HH:mm:ss",
			short: "HH:mm"
		},
		defaultWidth: "full"
	}),
	dateTime: buildFormatLongFn({
		formats: {
			full: "{{date}} 'saat' {{time}}",
			long: "{{date}} 'saat' {{time}}",
			medium: "{{date}}, {{time}}",
			short: "{{date}}, {{time}}"
		},
		defaultWidth: "full"
	})
};
//#endregion
//#region node_modules/date-fns/locale/tr/_lib/formatRelative.js
var formatRelativeLocale = {
	lastWeek: "'geçen hafta' eeee 'saat' p",
	yesterday: "'dün saat' p",
	today: "'bugün saat' p",
	tomorrow: "'yarın saat' p",
	nextWeek: "eeee 'saat' p",
	other: "P"
};
var formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
//#endregion
//#region node_modules/date-fns/locale/tr/_lib/localize.js
var eraValues = {
	narrow: ["MÖ", "MS"],
	abbreviated: ["MÖ", "MS"],
	wide: ["Milattan Önce", "Milattan Sonra"]
};
var quarterValues = {
	narrow: [
		"1",
		"2",
		"3",
		"4"
	],
	abbreviated: [
		"1Ç",
		"2Ç",
		"3Ç",
		"4Ç"
	],
	wide: [
		"İlk çeyrek",
		"İkinci Çeyrek",
		"Üçüncü çeyrek",
		"Son çeyrek"
	]
};
var monthValues = {
	narrow: [
		"O",
		"Ş",
		"M",
		"N",
		"M",
		"H",
		"T",
		"A",
		"E",
		"E",
		"K",
		"A"
	],
	abbreviated: [
		"Oca",
		"Şub",
		"Mar",
		"Nis",
		"May",
		"Haz",
		"Tem",
		"Ağu",
		"Eyl",
		"Eki",
		"Kas",
		"Ara"
	],
	wide: [
		"Ocak",
		"Şubat",
		"Mart",
		"Nisan",
		"Mayıs",
		"Haziran",
		"Temmuz",
		"Ağustos",
		"Eylül",
		"Ekim",
		"Kasım",
		"Aralık"
	]
};
var dayValues = {
	narrow: [
		"P",
		"P",
		"S",
		"Ç",
		"P",
		"C",
		"C"
	],
	short: [
		"Pz",
		"Pt",
		"Sa",
		"Ça",
		"Pe",
		"Cu",
		"Ct"
	],
	abbreviated: [
		"Paz",
		"Pzt",
		"Sal",
		"Çar",
		"Per",
		"Cum",
		"Cts"
	],
	wide: [
		"Pazar",
		"Pazartesi",
		"Salı",
		"Çarşamba",
		"Perşembe",
		"Cuma",
		"Cumartesi"
	]
};
var dayPeriodValues = {
	narrow: {
		am: "öö",
		pm: "ös",
		midnight: "gy",
		noon: "ö",
		morning: "sa",
		afternoon: "ös",
		evening: "ak",
		night: "ge"
	},
	abbreviated: {
		am: "ÖÖ",
		pm: "ÖS",
		midnight: "gece yarısı",
		noon: "öğle",
		morning: "sabah",
		afternoon: "öğleden sonra",
		evening: "akşam",
		night: "gece"
	},
	wide: {
		am: "Ö.Ö.",
		pm: "Ö.S.",
		midnight: "gece yarısı",
		noon: "öğle",
		morning: "sabah",
		afternoon: "öğleden sonra",
		evening: "akşam",
		night: "gece"
	}
};
var formattingDayPeriodValues = {
	narrow: {
		am: "öö",
		pm: "ös",
		midnight: "gy",
		noon: "ö",
		morning: "sa",
		afternoon: "ös",
		evening: "ak",
		night: "ge"
	},
	abbreviated: {
		am: "ÖÖ",
		pm: "ÖS",
		midnight: "gece yarısı",
		noon: "öğlen",
		morning: "sabahleyin",
		afternoon: "öğleden sonra",
		evening: "akşamleyin",
		night: "geceleyin"
	},
	wide: {
		am: "ö.ö.",
		pm: "ö.s.",
		midnight: "gece yarısı",
		noon: "öğlen",
		morning: "sabahleyin",
		afternoon: "öğleden sonra",
		evening: "akşamleyin",
		night: "geceleyin"
	}
};
var ordinalNumber = (dirtyNumber, _options) => {
	return Number(dirtyNumber) + ".";
};
//#endregion
//#region node_modules/date-fns/locale/tr.js
/**
* @category Locales
* @summary Turkish locale.
* @language Turkish
* @iso-639-2 tur
* @author Alpcan Aydın [@alpcanaydin](https://github.com/alpcanaydin)
* @author Berkay Sargın [@berkaey](https://github.com/berkaey)
* @author Fatih Bulut [@bulutfatih](https://github.com/bulutfatih)
* @author Ismail Demirbilek [@dbtek](https://github.com/dbtek)
* @author İsmail Kayar [@ikayar](https://github.com/ikayar)
*
*
*/
var tr = {
	code: "tr",
	formatDistance,
	formatLong,
	formatRelative,
	localize: {
		ordinalNumber,
		era: buildLocalizeFn({
			values: eraValues,
			defaultWidth: "wide"
		}),
		quarter: buildLocalizeFn({
			values: quarterValues,
			defaultWidth: "wide",
			argumentCallback: (quarter) => Number(quarter) - 1
		}),
		month: buildLocalizeFn({
			values: monthValues,
			defaultWidth: "wide"
		}),
		day: buildLocalizeFn({
			values: dayValues,
			defaultWidth: "wide"
		}),
		dayPeriod: buildLocalizeFn({
			values: dayPeriodValues,
			defaultWidth: "wide",
			formattingValues: formattingDayPeriodValues,
			defaultFormattingWidth: "wide"
		})
	},
	match: {
		ordinalNumber: buildMatchPatternFn({
			matchPattern: /^(\d+)(\.)?/i,
			parsePattern: /\d+/i,
			valueCallback: function(value) {
				return parseInt(value, 10);
			}
		}),
		era: buildMatchFn({
			matchPatterns: {
				narrow: /^(mö|ms)/i,
				abbreviated: /^(mö|ms)/i,
				wide: /^(milattan önce|milattan sonra)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [/(^mö|^milattan önce)/i, /(^ms|^milattan sonra)/i] },
			defaultParseWidth: "any"
		}),
		quarter: buildMatchFn({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^[1234]ç/i,
				wide: /^((i|İ)lk|(i|İ)kinci|üçüncü|son) çeyrek/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [
					/1/i,
					/2/i,
					/3/i,
					/4/i
				],
				abbreviated: [
					/1ç/i,
					/2ç/i,
					/3ç/i,
					/4ç/i
				],
				wide: [
					/^(i|İ)lk çeyrek/i,
					/(i|İ)kinci çeyrek/i,
					/üçüncü çeyrek/i,
					/son çeyrek/i
				]
			},
			defaultParseWidth: "any",
			valueCallback: (index) => index + 1
		}),
		month: buildMatchFn({
			matchPatterns: {
				narrow: /^[oşmnhtaek]/i,
				abbreviated: /^(oca|şub|mar|nis|may|haz|tem|ağu|eyl|eki|kas|ara)/i,
				wide: /^(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^o/i,
					/^ş/i,
					/^m/i,
					/^n/i,
					/^m/i,
					/^h/i,
					/^t/i,
					/^a/i,
					/^e/i,
					/^e/i,
					/^k/i,
					/^a/i
				],
				any: [
					/^o/i,
					/^ş/i,
					/^mar/i,
					/^n/i,
					/^may/i,
					/^h/i,
					/^t/i,
					/^ağ/i,
					/^ey/i,
					/^ek/i,
					/^k/i,
					/^ar/i
				]
			},
			defaultParseWidth: "any"
		}),
		day: buildMatchFn({
			matchPatterns: {
				narrow: /^[psçc]/i,
				short: /^(pz|pt|sa|ça|pe|cu|ct)/i,
				abbreviated: /^(paz|pzt|sal|çar|per|cum|cts)/i,
				wide: /^(pazar(?!tesi)|pazartesi|salı|çarşamba|perşembe|cuma(?!rtesi)|cumartesi)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^p/i,
					/^p/i,
					/^s/i,
					/^ç/i,
					/^p/i,
					/^c/i,
					/^c/i
				],
				any: [
					/^pz/i,
					/^pt/i,
					/^sa/i,
					/^ça/i,
					/^pe/i,
					/^cu/i,
					/^ct/i
				],
				wide: [
					/^pazar(?!tesi)/i,
					/^pazartesi/i,
					/^salı/i,
					/^çarşamba/i,
					/^perşembe/i,
					/^cuma(?!rtesi)/i,
					/^cumartesi/i
				]
			},
			defaultParseWidth: "any"
		}),
		dayPeriod: buildMatchFn({
			matchPatterns: {
				narrow: /^(öö|ös|gy|ö|sa|ös|ak|ge)/i,
				any: /^(ö\.?\s?[ös]\.?|öğleden sonra|gece yarısı|öğle|(sabah|öğ|akşam|gece)(leyin))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: { any: {
				am: /^ö\.?ö\.?/i,
				pm: /^ö\.?s\.?/i,
				midnight: /^(gy|gece yarısı)/i,
				noon: /^öğ/i,
				morning: /^sa/i,
				afternoon: /^öğleden sonra/i,
				evening: /^ak/i,
				night: /^ge/i
			} },
			defaultParseWidth: "any"
		})
	},
	options: {
		weekStartsOn: 1,
		firstWeekContainsDate: 1
	}
};
//#endregion
export { tr as default, tr };
