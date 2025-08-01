// ==================================================================
//
//          🎉 Gemini AI 编程康复训练营 - 前端练习最终版 🎉
//
// ==================================================================

// ------------------------------------------------------------------
// **第一部分：建立与后端同学的沟通渠道 (模拟API)**
// ------------------------------------------------------------------
// 在真实世界里，前端需要向后端请求数据。我们用这个函数来模拟这个过程。
// 它接受一个“回调函数”作为参数，这是JavaScript异步编程的基石。
function fetchFilesFromBackend(callback) {
    console.log("正在向服务器发送请求，请稍候...");

    // 这是一个虚拟的后端数据库，存放着我们的文件信息。
    const backendData = [
        "项目计划书.docx",
        "团队周报.xlsx",
        "新功能设计稿.pdf",
        "会议纪要.txt",
        "系统架构图.png",
        "用户反馈.md"
    ];

    // `setTimeout` 用来模拟网络延迟。1.5秒后，我们假装收到了服务器的响应。
    setTimeout(function() {
        console.log("服务器响应成功，数据已获取！");
        // 当数据到达时，我们调用传进来的`callback`函数，并将数据作为礼物送回给它。
        callback(backendData);
    }, 1500);
}

// ------------------------------------------------------------------
// **第二部分：认识我们在HTML世界里的朋友们 (DOM获取)**
// ------------------------------------------------------------------
// 我们需要先拿到HTML页面上各个元素的“遥控器”，才能操作它们。
const searchInput = document.getElementById("searchInput");         // 用户的输入框
const searchButton = document.getElementById("searchButton");       // “搜索”按钮
const exactMatchCheckbox = document.getElementById("exactMatchCheckbox"); // “精确匹配”复选框
const resultsDiv = document.getElementById("results");              // 用于展示结果的区域

// ------------------------------------------------------------------
// **第三部分：核心业务逻辑 - “搜索”功能**
// ------------------------------------------------------------------
// 这是当用户点击“搜索”按钮时，我们要执行的一系列操作。
function handleSearch() {

    // 1. 获取用户的输入，并用`.trim()`去掉前后可能存在的无用空格。
    const keyword = searchInput.value.trim();

    // 2. 友好地提示用户，我们正在努力工作中。
    resultsDiv.innerHTML = "<p class='loading'>🔍 正在努力搜索中，请稍等...</p>";

    // 3. 调用我们之前定义的函数，向“后端”请求数据。
    //    注意，我们将一个匿名函数作为`callback`传了进去。这个函数定义了“拿到数据后该做什么”。
    fetchFilesFromBackend(function(files) {
        
        // 4. 使用`.filter()`方法，从所有文件中筛选出符合条件的文件。
        const foundFiles = files.filter(function(fileName) {
            const isExactMatch = exactMatchCheckbox.checked;
            const lowerCaseFileName = fileName.toLowerCase();
            const lowerCaseKeyword = keyword.toLowerCase();

            if (isExactMatch) {
                return lowerCaseFileName === lowerCaseKeyword;
            } else {
                return lowerCaseFileName.includes(lowerCaseKeyword);
            }
        });

        // 5. 清空之前的“正在搜索”提示。
        resultsDiv.innerHTML = "";

        // 6. 检查是否找到了文件。
        if (foundFiles.length > 0) {
            // **✨ 动态UI渲染的魔法 ✨**
            // a. 使用`.map()`方法，将每个文件名“映射”或“转换”成一段HTML代码。
            const htmlStringArray = foundFiles.map(function(fileName) {
                let icon = "📄"; // 默认图标
                if (fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.endsWith('.xlsx')) {
                    icon = "📕";
                } else if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
                    icon = "🖼️";
                } else if (fileName.endsWith('.md')) {
                    icon = "🌐";
                }

                // b. 使用模板字符串（反引号 `` ` ``）来优雅地构建HTML结构。
                //    我们还在按钮上添加了`data-filename`属性，这是一个非常重要的技巧，
                //    它允许我们在HTML元素上“藏”一些数据，方便以后使用。
                return `
                    <div class="file-item">
                        <span>${icon} ${fileName}</span>
                        <button class="delete-btn" data-filename="${fileName}">删除</button>
                    </div>
                `;
            });

            // c. 使用`.join('')`将HTML片段数组拼接成一个完整的字符串，并更新到页面上。
            resultsDiv.innerHTML = htmlStringArray.join('');
        } else {
            // 7. 如果没找到文件，也要给用户一个明确的反馈。
            resultsDiv.innerHTML = "<p class='no-results'>🤷‍♂️ 抱歉，没有找到匹配的文件。</p>";
        }
    });
}

// ------------------------------------------------------------------
// **第四部分：让按钮和世界互动起来 (事件监听)**
// ------------------------------------------------------------------

// 1. 为“搜索”按钮绑定一个点击事件监听器。
searchButton.addEventListener("click", handleSearch);

// 2. **✨ 事件委托 (Event Delegation) 的最佳实践 ✨**
//    我们不给每个“删除”按钮单独绑定事件，而是监听它们的父容器`resultsDiv`。
//    这更高效，且对未来动态添加的元素同样有效。
resultsDiv.addEventListener('click', function(event) {
    // `event.target` 指向用户具体点击的那个元素。
    const clickedElement = event.target;

    // 我们只关心是不是点击了拥有`delete-btn`类的按钮。
    if (clickedElement.classList.contains('delete-btn')) {
        
        // a. 从按钮的`data-filename`属性中，取回我们之前存好的文件名。
        const fileNameToDelete = clickedElement.dataset.filename;
        
        // b. 使用`.closest('.file-item')`找到并移除整个文件项，实现页面上的即时删除效果。
        const itemToRemove = clickedElement.closest('.file-item');
        if (itemToRemove) {
            itemToRemove.remove();
        }

        // c. 在控制台模拟对后端的API调用，这为我们下一步学习后端知识做好了铺垫。
        console.log(`模拟API调用：请求删除文件 -> ${fileNameToDelete}`);
    }
});

console.log("前端应用已准备就绪，等待用户操作...");
