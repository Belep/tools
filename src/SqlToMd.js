
import React, { Component } from 'react';
import { Input, Button, Row, Col } from 'antd';
import { strIndexKeys, strAnyMatchFirst, strCommentDescFirstDyh, strValueFirstXfh } from './util/MatchUtil.js'
import './App.css'
const { TextArea } = Input;

class SqlToMd extends Component {

    constructor() {
        super()
        this.state = {
            leftWidth: '45%', centerWidth: '10%', rightWidth: '45%',
            peddingRow: 30, resultRow: 30,
            createSql: "",
            resultText: "",
        }
    }

    doParseText = (sql) => {

        if (sql == null) {
            return
        }
        // 建表语句开始
        const regex_creat_table = /CREATE\s+TABLE+/gi
        // 建表语句结束
        const regex_creat_table_finish = /ENGINE|InnoDB/gi
        // 表中文描述
        const regex_table_comment = /COMMENT\s*=\s*'.*'/gi
        // 表字段描述
        const regex_field_comment = /COMMENT\s*'.*'/gi
        // 字段名称
        const regex_field_name = /`.*`/g
        // 单引号数据
        const regex_dyh = /'.*'/g
        // 全字符，数字字母下划线
        const regex_char = /\w+/g
        // 字段非空判断
        const regex_not_null = /.*NOT\s+NULL.*/gi
        // 主键匹配
        const regex_primary_key = /\s*PRIMARY\s+KEY.*/i
        // 索引匹配
        const regex_index_key = RegExp(/^\s*KEY\s+/i)
        // 回车换行
        const crlf = "\n"
        // md表头描述
        const mdTableHeadDesc = "|序号|名称|中文名/英文名|类型|是否为空|主/外建|备注| \n|----|----|---------|----|----|----|----|\n"

        // 表英文名
        let tableEnglishName = ""
        let tabelChineseDesc = ""
        // 开始：create tabel 结束：包含
        let sqlStart = false
        let sqlEnd = false
        // 行数
        let rowNum = 0
        // md文档表 描述
        let mdAllText = ""
        // 主键和索引描述
        let pkIndexKeyJoin = ""
        // 字段所有结果
        let rowJoinResult = ""
        // 遍历每行数据，解析
        String(sql).split(crlf).forEach(e => {

            if (e == null) {
                return;
            }
            // 如果是 create table语句，取表名
            if (regex_creat_table.test(e) == true) {
                sqlStart = true;
                sqlEnd = false;
                tableEnglishName = strAnyMatchFirst(e, [regex_field_name, regex_char])
                return;
            }
            // 建表语句结束,同时拼接所有数据
            if (regex_creat_table_finish.test(e) == true) {
                sqlEnd = true;
                sqlStart = false
                tabelChineseDesc = String(strCommentDescFirstDyh(e, [regex_table_comment, regex_dyh]))
                let mdTableDesc = "#### " + tabelChineseDesc + "(" + tableEnglishName + ")" + crlf + crlf;
                // 所有数据
                mdAllText = mdAllText + mdTableDesc + rowJoinResult + crlf + "注：" + crlf + pkIndexKeyJoin + crlf;
                // 设置数据
                this.setState({ resultText: mdAllText })
                // 初始化值
                pkIndexKeyJoin = ""; rowJoinResult = ""
            }
            // 如果字段不在 CREATE TABLE 和 ENGINE之间跳出
            if (!sqlStart || sqlEnd) {
                rowNum = 0;
                return;
            }

            // 匹配索引以及主键描述，并拼接描述
            if (regex_primary_key.test(e)) {
                // 主键
                pkIndexKeyJoin = pkIndexKeyJoin + "主键：" + strValueFirstXfh(e) + ";" + crlf;
            }else if (regex_index_key.test(e)) {
                // 索引
                let indexDesc = strCommentDescFirstDyh(e, [regex_field_comment, regex_dyh])
                let indexKeyName = strValueFirstXfh(e);
                let indexKeys = strIndexKeys(e)
                pkIndexKeyJoin = pkIndexKeyJoin + "索引：" + indexDesc + "(" + indexKeyName + ")，字段：(" + indexKeys + ")" + ";" + crlf
            } else {
                // 匹配字段描述
                rowNum++;
                if (rowNum == 1) {
                    rowJoinResult = mdTableHeadDesc;
                }
                // 根据空格拆分，利用位置确认数据
                let rowSplitData = e.trim().split(/[\s]/);
                let fieldType = rowSplitData[1];
                let fieldKey = strValueFirstXfh(e);
                let fieldDesc = strCommentDescFirstDyh(e, [regex_field_comment, regex_dyh])
                let isNotNull = regex_not_null.test(e);
                // 拼接
                rowJoinResult = rowJoinResult + "|" + rowNum + "|" + fieldKey + "|" + fieldDesc + "|" + fieldType + "|" + (isNotNull ? "是" : "否") + "|" + "|" + "|" + crlf;
            }
        })
    }

    doSqlChange = (sql) => {
        this.setState({ createSql: sql })
    }

    render() {
        return (
            <div>
                {/* 一行三列 */}
                <Row justify="center">
                    <Col style={{ width: this.state.leftWidth }}>
                        <Row >
                            <Button type="text" style={{ width: '80%', fontWeight: "bold" }}>数据库建表语句</Button>
                        </Row>
                        <Row>
                            <TextArea
                                style={{ width: '100%', resize: 'none' }}
                                placeholder="数据库中的建表语句，支持多条"
                                showCount
                                rows={this.state.peddingRow}
                                onChange={e => this.doSqlChange(e.target.value)}
                            />
                        </Row>
                    </Col>
                    <Col style={{ width: this.state.centerWidth }}>
                        <Row align="middle" justify="center" style={{ height: "100%" }}>
                            <Button
                                type="primary"
                                style={{ width: '85%', fontWeight: "bold" }}
                                onClick={() => this.doParseText(this.state.createSql)}
                            >&gt;&gt; 转换 &gt;&gt;</Button>
                        </Row>
                    </Col>
                    <Col style={{ width: this.state.rightWidth }}>
                        <Row align="middle" justify="center" style={{ height: "30px" }}>
                            <Button type="text" style={{ fontWeight: "bold" }}>结果</Button>
                        </Row>
                        <Row style={{ height: "100%" }}>
                            <TextArea
                                value={this.state.resultText}
                                style={{ width: '100%', overflow: 'auto', resize: 'none' }}
                                placeholder="转换结果"
                                align='center'
                                rows={this.state.resultRow}
                                showCount
                            />
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SqlToMd;