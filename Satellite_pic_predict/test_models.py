import os
import torch
import pickle
from PIL import Image
import torchvision.transforms as transforms
from torchvision import models
import glob

# 测试配置
MODEL_PATHS = [
    "Satellite_pic_predict/satellite_model.pkl",
    "Satellite_pic_predict/efficientnet_model.pkl"
]
IMAGE_FOLDER = "Satellite_pic_predict/image"  # 图片文件夹路径
RISK_CATEGORIES = ["Non-burnable", "Low", "Moderate", "High"]

# 检查是否可以使用CUDA
if torch.cuda.is_available():
    device = torch.device("cuda")
    print(f"使用CUDA: {torch.cuda.get_device_name(0)}")
else:
    device = torch.device("cpu")
    print("使用CPU")

# 图像预处理函数
def preprocess_image(image_path):
    try:
        # 读取图像
        img = Image.open(image_path).convert('RGB')
        
        # 定义预处理变换
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # 应用变换
        img_tensor = transform(img).unsqueeze(0)  # 添加批次维度
        # 移动到正确的设备
        img_tensor = img_tensor.to(device)
        return img_tensor, True
    except Exception as e:
        print(f"处理图像 {image_path} 时出错: {e}")
        return None, False

# 加载模型函数
def load_model(model_path):
    print(f"\n尝试加载模型: {model_path}")
    
    try:
        # 尝试使用pickle加载
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print(f"使用pickle成功加载模型 {model_path}")
        # 确保模型在正确的设备上
        model = model.to(device)
        return model, True
    except Exception as pickle_error:
        print(f"使用pickle加载失败: {pickle_error}")
        
        try:
            # 尝试使用torch.load加载，并指定map_location到正确的设备
            model = torch.load(model_path, map_location=device, weights_only=False)
            print(f"使用torch.load成功加载模型 {model_path}")
            # 确保模型在正确的设备上
            model = model.to(device)
            return model, True
        except Exception as torch_error:
            print(f"使用torch.load加载失败: {torch_error}")
            
            return None, False

# 获取图像列表
def get_image_files():
    extensions = ['*.jpg', '*.jpeg', '*.png', '*.bmp', '*.tiff']
    image_files = []
    
    for ext in extensions:
        image_files.extend(glob.glob(os.path.join(IMAGE_FOLDER, ext)))
    
    return image_files

# 主测试函数
def test_models():
    # 检查图像文件夹是否存在
    if not os.path.exists(IMAGE_FOLDER):
        print(f"图像文件夹 {IMAGE_FOLDER} 不存在!")
        return
    
    # 获取图像文件列表
    image_files = get_image_files()
    if not image_files:
        print(f"在 {IMAGE_FOLDER} 文件夹中没有找到图像文件!")
        return
    
    print(f"找到 {len(image_files)} 个图像文件")
    
    # 测试每个模型
    for model_path in MODEL_PATHS:
        # 加载模型
        model, model_loaded = load_model(model_path)
        if not model_loaded:
            print(f"无法加载模型 {model_path}，跳过测试")
            continue
        
        # 设置为评估模式
        model.eval()
        
        print(f"\n使用模型 {model_path} 测试图像:")
        
        # 处理每个图像
        for img_path in image_files:
            # 预处理图像
            img_tensor, success = preprocess_image(img_path)
            if not success:
                continue
            
            try:
                # 执行预测
                with torch.no_grad():
                    outputs = model(img_tensor)
                    
                    # 获取预测结果
                    probs = torch.nn.functional.softmax(outputs, dim=1)
                    confidence, predicted_idx = torch.max(probs, 1)
                    
                    # 获取预测类别
                    predicted_class = predicted_idx.item()
                    confidence_value = confidence.item()
                    
                    # 显示结果
                    if predicted_class < len(RISK_CATEGORIES):
                        predicted_label = RISK_CATEGORIES[predicted_class]
                    else:
                        predicted_label = f"未知类别 ({predicted_class})"
                    
                    print(f"图像: {os.path.basename(img_path)}, 预测: {predicted_label}, 置信度: {confidence_value:.4f}")
            
            except Exception as e:
                print(f"预测图像 {img_path} 时出错: {e}")

if __name__ == "__main__":
    test_models() 