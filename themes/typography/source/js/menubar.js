document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toc-link").forEach(item => {
        const spanContent = item.querySelector(".toc-text")?.textContent || "default-value";
        item.setAttribute("href", "#"+spanContent); // Add your custom attribute here
    });
    document.querySelectorAll(".toc-number").forEach(element => {
        element.remove(); // 直接删除该元素
    });

});



// File: toc.js
document.addEventListener('DOMContentLoaded', function() {
    // ================= 配置参数 =================
    const DEBUG_MODE = true; // 控制调试信息输出
    const SCROLL_OFFSET = 20; // 导航栏偏移补偿
    const ACTIVATION_BUFFER = 50; // 提前激活缓冲像素
    const SMOOTH_SCROLL = true; // 是否启用平滑滚动

    // ================= 元素选择 =================
    const tocLinks = Array.from(document.querySelectorAll('.toc-link'));
    const headings = Array.from(document.querySelectorAll(
        'h1 span[id], h2 span[id], h3 span[id], h4 span[id], h5 span[id], h6 span[id]'
    ));
    const nav = document.querySelector('#site-nav');
    const tocContainer = document.getElementById('toc');

    // ================= 状态变量 =================
    let headingPositions = [];

    // ================= 核心函数 =================
    function log(...args) {
        DEBUG_MODE && console.log('[TOC]', ...args);
    }

    function calculatePositions() {
        const navHeight = nav ? nav.offsetHeight : 0;
        const globalOffset = navHeight + SCROLL_OFFSET;

        headingPositions = headings.map(span => {
            const rect = span.getBoundingClientRect();
            return {
                element: span,
                top: rect.top + window.scrollY - globalOffset
            };
        }).sort((a, b) => a.top - b.top);

        log('标题位置更新:', headingPositions.map(h => ({
            id: h.element.id,
            top: Math.round(h.top)
        })));
    }

    function activateCurrentItem() {
        const currentScroll = window.scrollY || window.pageYOffset;
        let activeHeading = null;

        // 检测激活标题
        for (const item of headingPositions) {
            if (currentScroll >= item.top - ACTIVATION_BUFFER) {
                activeHeading = item.element;
            } else {
                break;
            }
        }

        // 顶部强制激活
        if (currentScroll <= ACTIVATION_BUFFER && headingPositions[0]) {
            activeHeading = headingPositions[0].element;
            log('强制激活首个标题');
        }

        // 更新激活状态
        let activeLink = null;
        tocLinks.forEach(link => {
            const span = link.querySelector('span.toc-text');
            const isActive = span && activeHeading &&
                link.getAttribute('href') === `#${activeHeading.id}`;

            if (isActive) {
                span.classList.add('active');
                activeLink = link;
            } else {
                span?.classList.remove('active');
            }
        });

        // 执行居中滚动
        if (activeLink && tocContainer) {
            const containerHeight = tocContainer.clientHeight;
            const linkTop = activeLink.offsetTop;
            const linkHeight = activeLink.offsetHeight;

            const targetScroll = linkTop - (containerHeight - linkHeight) / 2;

            tocContainer.scrollTo({
                top: targetScroll,
                behavior: SMOOTH_SCROLL ? 'smooth' : 'auto'
            });

            log('居中滚动执行:', {
                target: activeHeading.id,
                position: Math.round(targetScroll)
            });
        }
    }

    // ================= 事件处理 =================
    const throttledUpdate = throttle(() => {
        calculatePositions();
        activateCurrentItem();
    }, 100);

    // 初始化
    calculatePositions();
    activateCurrentItem();

    // 事件监听
    window.addEventListener('scroll', throttledUpdate);
    window.addEventListener('resize', throttledUpdate);

    // ================= 工具函数 =================
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
});