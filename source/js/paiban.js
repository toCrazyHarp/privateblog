document.addEventListener("DOMContentLoaded", function() {
    // 获取指定类的元素
    const targetElement = document.querySelector('.pages-format');

    if (targetElement) {
        // 获取该元素内的所有 p 元素
        const paragraphs = targetElement.getElementsByTagName('p');

        // 定义一个函数来在 br 标签后添加 nbsp
        function addNbspAfterBr(element) {
            // 遍历元素的所有子节点
            Array.from(element.childNodes).forEach(childNode => {
                if (childNode.nodeType === Node.ELEMENT_NODE && childNode.tagName.toLowerCase() === 'br') {
                    // 创建一个文本节点，包含十个 nbsp
                    const nbspText = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0');
                    // 在 br 标签后插入文本节点
                    childNode.parentNode.insertBefore(nbspText, childNode.nextSibling);
                } else if (childNode.nodeType === Node.TEXT_NODE || childNode.nodeType === Node.ELEMENT_NODE) {
                    // 如果子节点是文本节点或元素节点，则递归处理
                    addNbspAfterBr(childNode);
                }
            });
        }
        function addNbspAtStart(element) {
            // 创建一个文本节点，包含十个 nbsp
            const nbspText = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0');
            // 在 p 元素的最前插入文本节点
            element.insertBefore(nbspText, element.firstChild);
        }
        // 遍历每个 p 元素，并应用函数
        Array.from(paragraphs).forEach(paragraph => {
            addNbspAfterBr(paragraph);
            addNbspAtStart(paragraph);
        });
    }
});