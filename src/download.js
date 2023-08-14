/* 
 * 阿里巴巴矢量图标库 批量下载脚本
*/
// ===========================  设置 ===========================
const conf = {
    // 每次下载个数 最大100
    everyTimeCount: 100,
    // 下载时间间隔 秒
    downloadInterval: 5,
    // 下载格式 png | svg | ai
    downloadType: 'png',
    // 图标颜色(单色图标可用) 例如: #F56C6C
    iconColor: "",
    // 图标尺寸
    iconSize: 400,
    // 提示消息结束后显示时长秒
    logShowTime: 10
}
// =========================== /设置 ===========================

const typeMap = {
    png: 'png',
    ai: 'eps',
    svg: 'svg'
}

// 搜寻dom
const q = selectors => document.querySelector(selectors);
const qa = selectors => document.querySelectorAll(selectors);

// 清空商店
const clearShop = () => q('.car-header .btn-clean-all')?.click();
// 添加到商店
const joinShop = iconList => iconList.forEach(item => item.click());
// 获取全部加入商店按钮
const getAllJoinShopBtns = () => Array.from(qa(".collection-detail .icon-gouwuche1"));
// 设置图标下载颜色
const setColor = color => q(`input[mx-keydown="changeColor()"]`).value = color;
// 设置尺寸
const setSize = size => q('#J_size_pick_wrap>input').value = size;
// 选择类型并下载
const selectTypeAndDownLoad = type => q(`.car-manage-bottom>span[mx-click="downIcon('${type}')"]`).click();
// 下载商店图标
function downloadShop() {
    // 设置颜色
    conf.iconColor || setColor(conf.iconColor);
    // 设置尺寸
    conf.iconSize || setSize(conf.iconSize);
    // 选择类型并下载
    selectTypeAndDownLoad(typeMap[conf.downloadType.toLocaleLowerCase()]);
}
// 消息显示模块
function getPrintBody() {
    const printBodyId = "__tag_script_iconfont_print__";
    let body = q(`#${printBodyId}`);
    if (body == null) {
        body = document.createElement('div')
        body.id = printBodyId;
        document.body.appendChild(body);
        body.style.position = 'fixed';
        body.style.top = '1rem';
        body.style.right = '1rem';
        body.style.zIndex = 9999999;
        body.style.backgroundColor = '#000000';
        body.style.padding = '0.25rem 1rem';
        body.style.fontSize = '20px';
        body.style.fontWeight = '900';
        body.style.color = '#F56C6C';
        body.style.borderRadius = "8px";
        body.style.visibility = 'hidden'
    }
    return body;
}

const printBody = getPrintBody();

// 显示消息
const printLog = log => printBody.innerText = log;

let logTimeout = null;

// 下载
async function startDownload(downloadList, level, downloadCount) {
    const nowFlag = `[已下载:${level}|总数:${Math.ceil(downloadCount / conf.everyTimeCount)}|总图标数:${downloadCount}|单次数:${conf.everyTimeCount}|间隔:${conf.downloadInterval}秒]`
    printLog(`${nowFlag}正则下载中!!!`)
    const nowDownLoad = downloadList.splice(0, conf.everyTimeCount);
    // 加入商店
    joinShop(nowDownLoad);
    // 下载商店
    downloadShop();
    // 清空商店
    clearShop();

    if (downloadList.length != 0) {
        printLog(`${nowFlag}等待下载中!!!`);
        setTimeout(() => startDownload(downloadList, ++level, downloadCount), conf.downloadInterval * 1000);
    } else {
        // 完成
        window[downloadFlagName] = false;
        printLog("全部图标下载完成!!!");
        logTimeout = setTimeout(() => printBody.style.visibility = 'hidden', conf.logShowTime * 1000);
    }
}

// 全局标识(防止同时多次下载)
const downloadFlagName = '__tag_script_iconfont__';
const downloadFlag = window[downloadFlagName];

if (downloadFlag === true) {
    // 正在下载
    alert("已经在下载中!!!")
} else {
    printBody.style.visibility = 'visible';

    clearTimeout(logTimeout);
    // 未下载|下载完成
    window[downloadFlagName] = true;
    printLog("开始下载!!!");

    clearShop();
    const downloadList = getAllJoinShopBtns();
    // 开始下载
    startDownload(downloadList, 1, downloadList.length);
}
