// STRING 匹配到第一个数据
export function strMatchFirst(str, matchPattern) {
    if (str == null) {
        return null;
    }
    if (matchPattern == null) {
        return str;
    }
    let strData = str + ""
    let result = strData.match(matchPattern)
    if (result != null) {
        return result[0];
    }
    return null;
}

// STRING 匹配到第二个数据
function strMatchSecond(str, matchPattern) {
    if (str == null) {
        return null;
    }
    if (matchPattern == null) {
        return str;
    }
    let result = String(str).match(matchPattern)
    if (result != null && result.length > 1) {
        return result[1];
    }
    return null;
}

// KEY `IND_rela_tena_id` (`rela_tena_id`) USING BTREE COMMENT '租户id索引' -> rela_tena_id
export function strIndexKeys(str) {

    const regex_index_key = /\(`.*`\)/g
    let result = strMatchFirst(str, regex_index_key)
    let symbol_start = "(`"
    let symbol_end = "`)"
    if (result != null) {
        return result.substr(result.indexOf(symbol_start) + 2, result.lastIndexOf(symbol_end) - 2)
    }
    return null
}

// 根据正则模型逐个匹配，返回第一个匹配值
export function strAnyMatchFirst(str, matchPatterns) {

    if (str == null) {
        return null;
    }
    if (matchPatterns == null) {
        return str;
    }
    let strData = str + ""
    matchPatterns.forEach(e => {
        strData = strMatchFirst(strData, e)
    });
    return strData;
}

// 小分号的内容 `abc` -> abc
export function strValueFirstXfh(str) {
    const regex_field_name = /`\w+`/g
    return strCommentDescFirst(str, [regex_field_name], "`")
}

// 获取 COMMENT 'abc' --> abc
export function strCommentDescFirstDyh(str, matchPatterns) {
    return strCommentDescFirst(str, matchPatterns, "'")
}

// 获取 COMMENT 'abd' -> abd
function strCommentDescFirst(str, matchPatterns, symbol) {

    if (str == null || matchPatterns == null) {
        return null;
    }
    let desc = String(strAnyMatchFirst(str, matchPatterns))
    if (desc != null && symbol != null) {
        return desc.substr(desc.indexOf(symbol) + 1, desc.lastIndexOf(symbol) - 1)
    }
    return null;
}
