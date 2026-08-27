import base64, sys
content = base64.b64decode(sys.argv[1]).decode("utf-8")
open(sys.argv[2], "w", encoding="utf-8").write(content)
print("Wrote", len(content), "chars")
