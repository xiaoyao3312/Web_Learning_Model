# config.py

class Config:
    """通用配置基類"""
    SECRET_KEY = 'hard-to-guess-string'
    
    # --- AI/專案相關配置 ---
    GEMINI_MODEL = 'gemini-2.5-flash'
    API_KEY_ENV_VAR = 'GEMINI_API_KEY' # 從環境變數獲取金鑰的名稱
    
    # 資源路徑
    MODEL_DATA_PATH = './data/models' 
    CODE_FILES_PATH = './projects/code'

class DevelopmentConfig(Config):
    """開發環境配置"""
    DEBUG = True  # 開啟調試模式
    PORT = 5000   # 開發時使用的端口號
    # 可以在這裡添加只有開發環境才需要的特定路徑或調試設置

class ProductionConfig(Config):
    """生產環境配置"""
    DEBUG = False
    PORT = 80
    # 確保生產環境使用 HTTPS 和其他安全措施
    # SESSION_COOKIE_SECURE = True
    # 如果路徑不同，可以在這裡覆蓋 MODEL_DATA_PATH 等
    # MODEL_DATA_PATH = '/var/www/my_app/models'