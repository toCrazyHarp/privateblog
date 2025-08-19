// XMU群组页面交互功能

function copyToClipboard(text) {
    // 更严格的检查：确保 navigator.clipboard 存在且 writeText 方法可用
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function() {
            showTooltip('已复制群号: ' + text);
        }).catch(function(err) {
            console.warn('现代 clipboard API 失败，使用备用方案:', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        // 如果不支持现代 API，直接使用备用方案
        console.log('使用备用复制方案');
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    // 创建临时文本区域
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 设置样式使其不可见但仍然可以被选中
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    textArea.setAttribute('readonly', '');
    textArea.setAttribute('aria-hidden', 'true');
    
    // 添加到页面
    document.body.appendChild(textArea);
    
    try {
        // 选中文本
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, text.length);
        
        // 尝试复制
        const successful = document.execCommand('copy');
        
        if (successful) {
            showTooltip('已复制群号: ' + text);
            console.log('备用方案复制成功:', text);
        } else {
            showTooltip('复制失败，请手动复制群号: ' + text);
            console.warn('备用方案复制失败');
        }
    } catch (err) {
        console.error('备用复制方法失败:', err);
        showTooltip('复制失败，群号: ' + text + '，请手动复制');
        
        // 最后的手段：尝试选中文本让用户手动复制
        try {
            textArea.select();
            alert('自动复制失败，已选中群号: ' + text + '\n请按 Ctrl+C (或 Cmd+C) 手动复制');
        } catch (selectErr) {
            console.error('选中文本也失败了:', selectErr);
            alert('复制功能不可用，群号为: ' + text);
        }
    } finally {
        // 清理临时元素
        document.body.removeChild(textArea);
    }
}

function showTooltip(message = '已复制到剪贴板') {
    const tooltip = document.getElementById('copyTooltip');
    if (tooltip) {
        tooltip.textContent = message;
        tooltip.classList.add('show');
        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 3000); // 延长显示时间到 3 秒
    } else {
        // 如果提示框元素不存在，使用浏览器原生提示
        console.log(message);
    }
}

// 添加一个简单的测试函数
function testCopyFunction() {
    console.log('测试复制功能环境:');
    console.log('navigator.clipboard 是否存在:', !!navigator.clipboard);
    console.log('navigator.clipboard.writeText 是否存在:', !!(navigator.clipboard && navigator.clipboard.writeText));
    console.log('window.isSecureContext:', !!window.isSecureContext);
    console.log('document.execCommand 是否支持 copy:', document.queryCommandSupported && document.queryCommandSupported('copy'));
}

// 修改页面布局：移除侧边栏限制，让页面占满宽度
document.addEventListener('DOMContentLoaded', function() {
    // 测试复制功能环境
    testCopyFunction();
    
    // 使用 setTimeout 确保在所有其他脚本执行完后再运行
    setTimeout(function() {
        // 查找包含 col-sm-9 的最外层容器
        const mainContainer = document.querySelector('.col-sm-9');
        if (mainContainer) {
            // 移除 col-sm-9 类
            mainContainer.classList.remove('col-sm-9');
            // 添加 col-sm-12 类，让内容占满宽度
            mainContainer.classList.add('col-sm-12');
            
            console.log('页面布局已调整：从 col-sm-9 改为 col-sm-12');
        } else {
            // 如果没找到，可能是类名不同，尝试其他选择器
            const alternatives = [
                '.col-md-9',
                '.col-lg-9', 
                '.col-9',
                '#main-container',
                '.main-container'
            ];
            
            for (let selector of alternatives) {
                const container = document.querySelector(selector);
                if (container) {
                    // 移除所有可能的 9 列类
                    container.classList.remove('col-sm-9', 'col-md-9', 'col-lg-9', 'col-9');
                    // 添加 12 列类
                    container.classList.add('col-sm-12', 'col-md-12', 'col-lg-12', 'col-12');
                    console.log(`页面布局已调整：找到容器 ${selector}，已设置为全宽`);
                    break;
                }
            }
        }
    }, 100); // 延迟 100ms 执行，确保在其他脚本之后
    
    // 为移动端添加触摸反馈
    const groupNumbers = document.querySelectorAll('.group-number');
    groupNumbers.forEach(num => {
        num.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        num.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// 备用方案：如果 DOMContentLoaded 已经触发，使用 window.onload
if (document.readyState === 'loading') {
    // 文档仍在加载中，使用 DOMContentLoaded
    console.log('使用 DOMContentLoaded 事件');
} else {
    // 文档已经加载完成，立即执行
    console.log('文档已加载，立即执行布局调整');
    setTimeout(function() {
        const mainContainer = document.querySelector('.col-sm-9') || 
                             document.querySelector('.col-md-9') || 
                             document.querySelector('#main-container');
        if (mainContainer) {
            mainContainer.classList.remove('col-sm-9', 'col-md-9', 'col-lg-9');
            mainContainer.classList.add('col-sm-12', 'col-md-12', 'col-lg-12');
            console.log('备用方案：页面布局已调整为全宽');
        }
    }, 50);
}

// 最终保障：使用 window.onload 确保在所有资源加载完后再执行一次
window.addEventListener('load', function() {
    setTimeout(function() {
        console.log('window.onload 触发，执行最终的布局检查');
        const mainContainer = document.querySelector('.col-sm-9') || 
                             document.querySelector('.col-md-9') || 
                             document.querySelector('.col-lg-9') ||
                             document.querySelector('#main-container') ||
                             document.querySelector('.main-container');
        
        if (mainContainer) {
            // 确保移除所有可能的 9 列类
            mainContainer.classList.remove('col-sm-9', 'col-md-9', 'col-lg-9', 'col-9');
            // 确保添加所有 12 列类
            mainContainer.classList.add('col-sm-12', 'col-md-12', 'col-lg-12', 'col-12');
            console.log('最终保障：页面布局已确保为全宽');
        }
    }, 200); // 延迟 200ms，确保在所有其他脚本执行完后
});