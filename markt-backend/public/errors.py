from enum import Enum, auto

class ErrorRsp(Enum):
    OK = 1000
    ERR_PARAM = auto()
    ERR_NOT_FOUND = auto()
    ERR = auto()
