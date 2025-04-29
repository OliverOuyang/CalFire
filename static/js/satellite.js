/**
 * 卫星图像分析功能
 */
document.addEventListener('DOMContentLoaded', function() {
    // 核心DOM元素
    const uploadArea = document.getElementById('satellite-upload-area');
    const fileInput = document.getElementById('satellite-upload');
    const previewImage = document.getElementById('satellite-preview');
    const previewContainer = document.getElementById('satellite-preview-container');
    const uploadButton = document.getElementById('upload-satellite');
    const analyzeButton = document.getElementById('analyze-satellite');
    const loadingIndicator = document.getElementById('satellite-loading');
    const resultsContainer = document.getElementById('satellite-results');
    const fireDetectionStatus = document.getElementById('fire-detection-status');
    const confidenceValue = document.getElementById('confidence-value');
    const deleteImageButton = document.getElementById('delete-satellite-image');

    // 检查DOM元素是否存在
    console.log("DOM元素检查:");
    console.log("- upload-area:", !!uploadArea);
    console.log("- file-input:", !!fileInput);
    console.log("- preview-image:", !!previewImage);
    console.log("- preview-container:", !!previewContainer);
    console.log("- upload-button:", !!uploadButton);
    console.log("- analyze-button:", !!analyzeButton);
    console.log("- loading-indicator:", !!loadingIndicator);
    console.log("- results-container:", !!resultsContainer);
    console.log("- fire-detection-status:", !!fireDetectionStatus);
    console.log("- confidence-value:", !!confidenceValue);
    console.log("- delete-image-button:", !!deleteImageButton);

    // 处理状态
    let isProcessing = false;
    let currentFileId = null;

    // 错误消息容器
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert alert-danger mt-2 d-none';
    errorContainer.id = 'satellite-error';
    
    if (previewContainer && previewContainer.parentNode) {
        previewContainer.parentNode.insertBefore(errorContainer, previewContainer.nextSibling);
    }

    // 错误显示函数
    function showError(message) {
        console.error("错误:", message);
        errorContainer.textContent = message;
        errorContainer.classList.remove('d-none');
        setTimeout(() => errorContainer.classList.add('d-none'), 5000);
    }

    // 文件拖放与选择
    if (uploadArea) {
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelection(e.dataTransfer.files[0]);
            }
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) {
                handleFileSelection(fileInput.files[0]);
            }
        });
    }

    // 按钮事件
    if (uploadButton) {
        uploadButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (isProcessing) {
                return showError('请等待，正在处理请求...');
            }
            if (!fileInput.files.length) {
                return showError('请先选择一个图像文件');
            }
            uploadImage();
        });
    }
    
    if (analyzeButton) {
        analyzeButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (isProcessing) {
                return showError('请等待，正在处理请求...');
            }
            if (!currentFileId) {
                return showError('请先上传图像');
            }
            analyzeImage();
        });
    }

    // 删除图片按钮事件
    if (deleteImageButton) {
        deleteImageButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 重置文件输入
            if (fileInput) {
                fileInput.value = '';
            }
            
            // 隐藏预览，显示上传区域
            if (previewContainer) {
                previewContainer.classList.add('d-none');
            }
            if (uploadArea) {
                uploadArea.classList.remove('d-none');
            }
            
            // 重置状态
            currentFileId = null;
            
            // 禁用分析按钮
            if (analyzeButton) {
                analyzeButton.disabled = true;
            }
            
            // 隐藏结果
            if (resultsContainer) {
                resultsContainer.classList.add('d-none');
            }
            
            console.log("图片已删除");
        });
    }

    // 文件选择处理
    function handleFileSelection(file) {
        console.log("选择文件:", file.name);
        const validTypes = ['image/jpeg', 'image/png', 'image/tiff'];
        
        if (!validTypes.includes(file.type)) {
            return showError('请选择有效的图像文件 (JPEG, PNG 或 TIFF)');
        }
        
        if (analyzeButton) {
            analyzeButton.disabled = true;
        }
        
        currentFileId = null;
        
        // 显示预览
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            uploadArea.classList.add('d-none');
            previewContainer.classList.remove('d-none');
            
            // 隐藏之前的结果
            if (resultsContainer) {
                resultsContainer.classList.add('d-none');
            }
        };
        reader.readAsDataURL(file);
    }

    // 上传图像
    function uploadImage() {
        console.log("开始上传图像");
        const file = fileInput.files[0];
        
        if (!file) {
            return showError('未选择文件');
        }
        
        isProcessing = true;
        
        if (loadingIndicator) {
            loadingIndicator.classList.remove('d-none');
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        fetch('/api/satellite/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log("上传响应状态:", response.status);
            if (!response.ok) {
                throw new Error(`上传失败: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("上传成功, 文件ID:", data.file_id);
            
            if (loadingIndicator) {
                loadingIndicator.classList.add('d-none');
            }
            
            currentFileId = data.file_id;
            
            if (analyzeButton) {
                analyzeButton.disabled = false;
            }
            
            isProcessing = false;
        })
        .catch(error => {
            console.error("上传错误:", error);
            
            if (loadingIndicator) {
                loadingIndicator.classList.add('d-none');
            }
            
            showError(`上传失败: ${error.message}`);
            isProcessing = false;
        });
    }

    // 分析图像
    function analyzeImage() {
        console.log("开始分析图像, 文件ID:", currentFileId);
        
        if (!currentFileId) {
            return showError('未上传图像');
        }
        
        isProcessing = true;
        
        if (loadingIndicator) {
            loadingIndicator.classList.remove('d-none');
        }
        
        // 隐藏之前的结果
        if (resultsContainer) {
            resultsContainer.classList.add('d-none');
        }
        
        const formData = new FormData();
        formData.append('file_id', currentFileId);
        
        fetch('/api/satellite/analyze', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log("分析响应状态:", response.status);
            if (!response.ok) {
                throw new Error(`分析失败: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("分析结果:", data);
            
            if (loadingIndicator) {
                loadingIndicator.classList.add('d-none');
            }
            
            displayResults(data);
            isProcessing = false;
        })
        .catch(error => {
            console.error("分析错误:", error);
            
            if (loadingIndicator) {
                loadingIndicator.classList.add('d-none');
            }
            
            showError(`分析失败: ${error.message}`);
            isProcessing = false;
        });
    }

    // 显示结果
    function displayResults(data) {
        console.log("显示结果:", data);
        
        try {
            // 显示结果容器
            if (resultsContainer) {
                resultsContainer.classList.remove('d-none');
                resultsContainer.style.display = 'block';
            }
            
            // 提取预测数据
            const predictedClass = data.predicted_class || 'Unknown';
            const confidence = data.confidence || 0;
            
            console.log("解析的结果 - 类别:", predictedClass, "置信度:", confidence);
            
            // 显示火灾风险类别
            if (fireDetectionStatus) {
                const detectionTextElement = fireDetectionStatus.querySelector('.detection-text');
                
                if (detectionTextElement) {
                    // 清除之前的类
                    detectionTextElement.classList.remove('text-success', 'text-warning', 'text-danger', 'text-secondary');
                    
                    // 更新文本
                    detectionTextElement.textContent = predictedClass.toUpperCase();
                    
                    // 根据风险级别设置颜色
                    switch(predictedClass.toLowerCase()) {
                        case 'high':
                            detectionTextElement.classList.add('text-danger');
                            break;
                        case 'moderate':
                            detectionTextElement.classList.add('text-warning');
                            break;
                        case 'low':
                            detectionTextElement.classList.add('text-success');
                            break;
                        case 'non-burnable':
                            detectionTextElement.classList.add('text-secondary');
                            break;
                        default:
                            detectionTextElement.classList.add('text-secondary');
                    }
                } else {
                    // 如果找不到.detection-text元素，直接设置父元素
                    const riskClass = getRiskClass(predictedClass);
                    fireDetectionStatus.innerHTML = `<h3 class="detection-text ${riskClass}">${predictedClass.toUpperCase()}</h3>`;
                }
            }
            
            // 显示置信度
            if (confidenceValue) {
                const confidencePercent = Math.round(confidence * 100);
                confidenceValue.textContent = `${confidencePercent}%`;
                
                // 根据置信度设置颜色
                confidenceValue.classList.remove('text-success', 'text-warning', 'text-danger');
                
                if (confidencePercent >= 75) {
                    confidenceValue.classList.add('text-success');
                } else if (confidencePercent >= 50) {
                    confidenceValue.classList.add('text-warning');
                } else {
                    confidenceValue.classList.add('text-danger');
                }
            }
        } catch (error) {
            console.error("显示结果时出错:", error);
            showError("显示结果时出错: " + error.message);
        }
    }

    // 获取风险级别对应的CSS类
    function getRiskClass(risk) {
        switch(risk.toLowerCase()) {
            case 'high': return 'text-danger';
            case 'moderate': return 'text-warning';
            case 'low': return 'text-success';
            case 'non-burnable': return 'text-secondary';
            default: return 'text-secondary';
        }
    }
});
