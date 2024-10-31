from enum import Enum, auto
# NOTE: after updating this file, run python syncErrors.py to sync with errorCodes.ts

class ErrorRsp(Enum):
    OK = 1000
    ERR_PARAM = auto()
    ERR_PARAM_DUP = auto()
    ERR_PARAM_EMAIL = auto()
    ERR_PARAM_PWD = auto()
    ERR_PARAM_PHONE = auto()
    ERR_NOT_FOUND = auto()
    ERR = auto()
