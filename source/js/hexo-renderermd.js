// markdown-it-config.js
module.exports = (md) => {
    md.use(require('markdown-it-container'), 'card', {
        validate: (params) => {
            return params.trim().match(/^card\s*(?:\[([^\]]*)\]\((.*?)\))?\s*$/);
        },
        render: (tokens, idx) => {
            try {
                const params = tokens[idx].info.trim();
                const match = params.match(/^card\s*(?:\[([^\]]*)\]\((.*?)\))?\s*$/);

                if (tokens[idx].nesting === 1) {
                    // 解析参数
                    const title = (match && match[1]) ? match[1].trim() : '默认标题';
                    const image = (match && match[2]) ? match[2].trim() : '';

                    // 构建 HTML 结构
                    let html = '<div class="card">';
                    html += '<div class="card-header">'; // 新增的统一容器

                    if (image) {
                        html += `
                                <img class="card-image" src="${image}" alt="${title}">`;
                    }

                    html += `
                        <h3 class="card-title">${title}</h3>
                    </div>`; // 关闭 card-header

                    html += '<div class="card-content">'; // 内容区域
                    return html;

                } else {
                    // 结束标签
                    return '</div></div>'; // 关闭 card-content 和 card
                }
            } catch (err) {
                console.error('Card render error:', err);
                return '<div class="card-error">⚠️ 渲染卡片失败</div>';
            }
        }
    });
};