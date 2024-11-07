# sync errors.py with errorCodes.ts
from errors import ErrorRsp

def generate_ts_enum():
    with open('../../markt-frontend/src/errorCodes.ts', 'w') as f:
        f.write("export enum ErrorRsp {\n")
        for error in ErrorRsp:
            f.write(f"    {error.name} = {error.value},\n")
        f.write("}\n")

if __name__ == "__main__":
    generate_ts_enum()