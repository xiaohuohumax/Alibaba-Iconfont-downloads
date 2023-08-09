/* 
 * 阿里巴巴矢量图标库 批量下载脚本
 * 2020.09.20 01:38.00
 * 使用方法: 
 *  1.打开图包
 *  2.控制台添加此脚本
 *  3.自动开始下载[注意：请勿关闭此页面]
*/
(async function () {
    // ===========================  设置 ===========================
    let loadMax = 20; // 每次下载数量上限 注意：最大20个
    let timeout = 20; // 下载时间间隔 s
    let downloadKind = 'png'; // 下载类型 png eps svg
    // =========================== /设置 ===========================
    // 将图标添加到购物车
    function addShopList(list) {
        for (const val of list) {
            val.click();
        }
    }
    // 休眠
    function sleep(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, time * 1000);
        })
    }
    // 图标分组 [[],[]]
    function iconGroups(list) {
        let group = [], res = [];
        list.forEach(val => {
            group.push(val);
            if (group.length == loadMax) {
                res.push(group);
                group = [];
            }
        });
        res.push(group);
        return res.filter(val => val.length > 0);
    }
    // 清除商店
    function removeShopList() {
        let btn = document.querySelector('.btn-clean-all');
        btn ? btn.click() : '';
    }
    // 获取 png 下载按钮 attr 默认 mx-click 值 png downIcon('png') eps downIcon('eps') svg downIcon('svg')  
    function download(kind = 'png') {
        let btnList = document.querySelectorAll('.btn-normal');
        for (const val of btnList) {
            if (val.getAttribute("mx-click").trim() == `downIcon('${kind}')`) {
                return val.click();
            }
        }
    }
    //开始
    removeShopList();
    let iconList = document.querySelectorAll('.icon-gouwuche1');
    let index = 0, listGroup = iconGroups(iconList);
    for (const list of listGroup) {
        addShopList(list); // 添加到商店
        // await sleep(1); // 暂停
        console.log(`正在下载${++index}/${listGroup.length}`);
        download(downloadKind); // 下载
        // await sleep(1); // 暂停
        removeShopList(); // 清除
        await sleep(timeout); // 暂停2秒
    }
    console.log(`已经全部下载完了哟~~~`);
})()
