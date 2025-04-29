from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import torch
import pickle
from PIL import Image
import io
import os
from torchvision import transforms
import pathlib

app = FastAPI()

# 获取当前文件的绝对路径的目录
BASE_DIR = pathlib.Path(__file__).parent.absolute()

# 定义模型路径 - 使用绝对路径
MODEL_PATH = os.path.join(BASE_DIR, "efficientnet_model.pkl")

# 类别名称
RISK_CATEGORIES = ["Non-burnable", "Low", "Moderate", "High"]

# 检查是否可用CUDA
if torch.cuda.is_available():
    device = torch.device("cuda")
    print(f"CUDA is available. Using GPU: {torch.cuda.get_device_name(0)}")
else:
    device = torch.device("cpu")
    print("CUDA is not available. Using CPU.")

print(f"Using device: {device}")

# 图像转换
img_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# 加载模型 - 使用与test_models.py相同的方法
def load_model():
    print(f"Attempting to load model: {MODEL_PATH}")
    
    try:
        # 尝试使用pickle加载
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        print(f"Successfully loaded model using pickle")
        
        # 确保模型在正确的设备上
        model = model.to(device)
        model.eval()
        return model
    except Exception as pickle_error:
        print(f"Failed to load with pickle: {pickle_error}")
        
        try:
            # 尝试使用torch.load加载
            model = torch.load(MODEL_PATH, map_location=device, weights_only=False)
            print(f"Successfully loaded model using torch.load")
            
            # 确保模型在正确的设备上
            model = model.to(device)
            model.eval()
            return model
        except Exception as torch_error:
            print(f"Failed to load with torch.load: {torch_error}")
            raise RuntimeError(f"Could not load model: {torch_error}")

# 加载模型
model = load_model()

class ImagePrediction(BaseModel):
    predicted_class: str
    confidence: float

@app.get("/")
def read_root():
    return {"message": "Satellite Image Fire Risk Prediction API is running"}

# 直接从字节数据预测的函数 - 可以被导入
async def predict_image_from_bytes(image_bytes):
    """
    从图像字节数据预测火灾风险
    
    Args:
        image_bytes: 图像的二进制数据
        
    Returns:
        ImagePrediction: 包含预测类别和置信度的对象
    """
    print(f"predict_image_from_bytes function called")
    
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        print(f"Successfully opened image, size: {img.size}")
    except Exception as e:
        print(f"Error opening image: {e}")
        raise ValueError("Invalid image file")
    
    # 转换图像并移动到相应设备
    x = img_transform(img).unsqueeze(0).to(device)
    print(f"Image transformed and moved to device: {device}")
    
    try:
        with torch.no_grad():
            # 如果使用CUDA，设置计时器
            if device.type == 'cuda':
                start = torch.cuda.Event(enable_timing=True)
                end = torch.cuda.Event(enable_timing=True)
                start.record()
            
            # 执行模型推理
            print("Running model inference...")
            outputs = model(x)
            probs = torch.nn.functional.softmax(outputs, dim=1)
            conf, idx = torch.max(probs, 1)
            
            # 如果使用CUDA，计算推理时间
            if device.type == 'cuda':
                end.record()
                torch.cuda.synchronize()
                inference_time = start.elapsed_time(end)
                print(f"Inference time: {inference_time:.2f} ms")
        
        # 获取预测结果
        predicted_class = RISK_CATEGORIES[idx.item()]
        confidence = round(conf.item(), 4)
        
        print(f"Prediction result - Class: {predicted_class}, Confidence: {confidence}")
        
        # 返回预测结果
        result = ImagePrediction(
            predicted_class=predicted_class,
            confidence=confidence
        )
        
        print(f"Returning result: {result}")
        return result
        
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise ValueError(f"Error during prediction: {str(e)}")

@app.post("/predict_image")
async def predict_image(file: UploadFile = File(...)):
    print(f"predict_image function called with file: {file.filename}")
    
    # 读取上传的文件
    contents = await file.read()
    
    # 使用共享的预测函数
    return await predict_image_from_bytes(contents)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)