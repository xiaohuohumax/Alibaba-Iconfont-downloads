(() => {
  // src/download.js
  var conf = {
    // 每次下载个数 最大100
    everyTimeCount: 100,
    // 下载时间间隔 秒
    downloadInterval: 5,
    // 下载格式 png | svg | ai
    downloadType: "png",
    // 图标颜色(单色图标可用) 例如: #F56C6C
    iconColor: "",
    // 图标尺寸
    iconSize: 400,
    // 提示消息结束后显示时长秒
    logShowTime: 10
  };
  var typeMap = {
    png: "png",
    ai: "eps",
    svg: "svg"
  };
  var q = (selectors) => document.querySelector(selectors);
  var qa = (selectors) => document.querySelectorAll(selectors);
  var clearShop = () => q(".car-header .btn-clean-all")?.click();
  var joinShop = (iconList) => iconList.forEach((item) => item.click());
  var getAllJoinShopBtns = () => Array.from(qa(".collection-detail .icon-gouwuche1"));
  var setColor = (color) => q(`input[mx-keydown="changeColor()"]`).value = color;
  var setSize = (size) => q("#J_size_pick_wrap>input").value = size;
  var selectTypeAndDownLoad = (type) => q(`.car-manage-bottom>span[mx-click="downIcon('${type}')"]`).click();
  function downloadShop() {
    conf.iconColor || setColor(conf.iconColor);
    conf.iconSize || setSize(conf.iconSize);
    selectTypeAndDownLoad(typeMap[conf.downloadType.toLocaleLowerCase()]);
  }
  function getPrintBody() {
    const printBodyId = "__tag_script_iconfont_print__";
    let body = q(`#${printBodyId}`);
    if (body == null) {
      body = document.createElement("div");
      body.id = printBodyId;
      document.body.appendChild(body);
      body.style.position = "fixed";
      body.style.top = "1rem";
      body.style.right = "1rem";
      body.style.zIndex = 9999999;
      body.style.backgroundColor = "#000000";
      body.style.padding = "0.25rem 1rem";
      body.style.fontSize = "20px";
      body.style.fontWeight = "900";
      body.style.color = "#F56C6C";
      body.style.borderRadius = "8px";
      body.style.visibility = "hidden";
    }
    return body;
  }
  var printBody = getPrintBody();
  var printLog = (log) => printBody.innerText = log;
  var logTimeout = null;
  async function startDownload(downloadList, level, downloadCount) {
    const nowFlag = `[\u5DF2\u4E0B\u8F7D:${level}|\u603B\u6570:${Math.ceil(downloadCount / conf.everyTimeCount)}|\u603B\u56FE\u6807\u6570:${downloadCount}|\u5355\u6B21\u6570:${conf.everyTimeCount}|\u95F4\u9694:${conf.downloadInterval}\u79D2]`;
    printLog(`${nowFlag}\u6B63\u5219\u4E0B\u8F7D\u4E2D!!!`);
    const nowDownLoad = downloadList.splice(0, conf.everyTimeCount);
    joinShop(nowDownLoad);
    downloadShop();
    clearShop();
    if (downloadList.length != 0) {
      printLog(`${nowFlag}\u7B49\u5F85\u4E0B\u8F7D\u4E2D!!!`);
      setTimeout(() => startDownload(downloadList, ++level, downloadCount), conf.downloadInterval * 1e3);
    } else {
      window[downloadFlagName] = false;
      printLog("\u5168\u90E8\u56FE\u6807\u4E0B\u8F7D\u5B8C\u6210!!!");
      logTimeout = setTimeout(() => printBody.style.visibility = "hidden", conf.logShowTime * 1e3);
    }
  }
  var downloadFlagName = "__tag_script_iconfont__";
  var downloadFlag = window[downloadFlagName];
  if (downloadFlag === true) {
    alert("\u5DF2\u7ECF\u5728\u4E0B\u8F7D\u4E2D!!!");
  } else {
    printBody.style.visibility = "visible";
    clearTimeout(logTimeout);
    window[downloadFlagName] = true;
    printLog("\u5F00\u59CB\u4E0B\u8F7D!!!");
    clearShop();
    const downloadList = getAllJoinShopBtns();
    startDownload(downloadList, 1, downloadList.length);
  }
})();
