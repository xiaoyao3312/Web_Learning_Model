# config.py
class Config:
    """通用配置基類"""
    SECRET_KEY = 'hard-to-guess-string' # Flask 安全相關的密鑰
    # ... 其他通用配置

class DevelopmentConfig(Config):
    """開發環境配置"""
    DEBUG = True  # 開啟調試模式
    PORT = 5000   # 開發時使用的端口號

class ProductionConfig(Config):
    """生產環境配置"""
    DEBUG = False
    PORT = 80
    # ... 生產環境專用的配置