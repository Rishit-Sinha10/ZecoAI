const templates = [
  {
    id: "vanilla-js",
    name: "Vanilla JavaScript",
    description: "Plain HTML/CSS/JS starter with a clean project structure.",
    icon: "JS",
    color: "#fbbf24",
    language: "JavaScript",
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>Vanilla JS App</title>\n  <link rel="stylesheet" href="css/style.css" />\n</head>\n<body>\n  <div id="app">\n    <header>\n      <h1>My App</h1>\n      <nav>\n        <button id="theme-toggle">Toggle Theme</button>\n      </nav>\n    </header>\n    <main>\n      <div id="counter">\n        <p>Count: <span id="count">0</span></p>\n        <button id="increment">+1</button>\n        <button id="decrement">-1</button>\n        <button id="reset">Reset</button>\n      </div>\n    </main>\n  </div>\n  <script src="js/app.js"></script>\n</body>\n</html>`,
        isMain: true,
      },
      {
        name: "css/style.css",
        content: `* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  background-color: #f5f5f5;\n  color: #333;\n  min-height: 100vh;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n#app {\n  text-align: center;\n  padding: 2rem;\n}\n\nheader {\n  margin-bottom: 2rem;\n}\n\nheader h1 {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n\n#counter {\n  background: white;\n  padding: 2rem;\n  border-radius: 12px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n}\n\n#count {\n  font-size: 3rem;\n  font-weight: bold;\n  display: block;\n  margin: 1rem 0;\n}\n\nbutton {\n  padding: 0.5rem 1.5rem;\n  margin: 0.25rem;\n  border: none;\n  border-radius: 6px;\n  background: #333;\n  color: white;\n  font-size: 1rem;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n\nbutton:hover {\n  background: #555;\n}\n\n#increment { background: #10b981; }\n#decrement { background: #ef4444; }\n#reset { background: #6b7280; }`,
      },
      {
        name: "js/app.js",
        content: `// Vanilla JS Counter App\nconst countEl = document.getElementById("count");\nconst incrementBtn = document.getElementById("increment");\nconst decrementBtn = document.getElementById("decrement");\nconst resetBtn = document.getElementById("reset");\n\nlet count = 0;\n\nfunction updateDisplay() {\n  countEl.textContent = count;\n}\n\nincrementBtn.addEventListener("click", () => {\n  count++;\n  updateDisplay();\n});\n\ndecrementBtn.addEventListener("click", () => {\n  count--;\n  updateDisplay();\n});\n\nresetBtn.addEventListener("click", () => {\n  count = 0;\n  updateDisplay();\n});\n\nconsole.log("App initialized!");`,
      },
      {
        name: "js/utils.js",
        content: `// Utility functions\nexport function debounce(fn, delay = 300) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}\n\nexport function formatNumber(n) {\n  return new Intl.NumberFormat().format(n);\n}\n\nexport function randomId() {\n  return Math.random().toString(36).slice(2, 9);\n}`,
      },
      {
        name: "README.md",
        content: `# Vanilla JS Starter\n\nA clean starter project with HTML, CSS, and vanilla JavaScript.\n\n## Structure\n\n\`\`\`\nproject/\n  index.html\n  css/\n    style.css\n  js/\n    app.js\n    utils.js\n  README.md\n\`\`\`\n\n## Getting Started\n\n1. Open \`index.html\` in your browser\n2. Or use a local server:\n\n\`\`\`bash\nnpx serve .\n# or\npython -m http.server 8000\n\`\`\`\n\n## Features\n\n- Counter app with increment/decrement\n- Clean CSS with modern styling\n- Modular JS with utility functions`,
      },
    ],
  },
  {
    id: "python-script",
    name: "Python Script",
    description: "Multi-file Python project with modules, testing, and CLI.",
    icon: "PY",
    color: "#3776ab",
    language: "Python",
    files: [
      {
        name: "main.py",
        content: `#!/usr/bin/env python3\n"""Main entry point for the application."""\n\nfrom src.calculator import Calculator\nfrom src.logger import Logger\n\ndef main():\n    logger = Logger("app")\n    calc = Calculator()\n\n    logger.info("Application started")\n\n    # Demo calculations\n    a, b = 10, 5\n    print(f"\\n--- Calculator Demo ---")\n    print(f"{a} + {b} = {calc.add(a, b)}")\n    print(f"{a} - {b} = {calc.subtract(a, b)}")\n    print(f"{a} * {b} = {calc.multiply(a, b)}")\n    print(f"{a} / {b} = {calc.divide(a, b)}")\n    print(f"{a} ^ 2 = {calc.power(a, 2)}")\n    print(f"sqrt({a}) = {calc.sqrt(a)}")\n\n    logger.info("Calculations complete")\n\nif __name__ == "__main__":\n    main()`,
        isMain: true,
      },
      {
        name: "src/__init__.py",
        content: `"""Source package."""\n`,
      },
      {
        name: "src/calculator.py",
        content: `"""Calculator module with basic math operations."""\n\nimport math\nfrom typing import Union\n\nNumber = Union[int, float]\n\nclass Calculator:\n    """A simple calculator class with common operations."""\n\n    def __init__(self):\n        self.history: list[str] = []\n\n    def add(self, a: Number, b: Number) -> Number:\n        result = a + b\n        self.history.append(f"{a} + {b} = {result}")\n        return result\n\n    def subtract(self, a: Number, b: Number) -> Number:\n        result = a - b\n        self.history.append(f"{a} - {b} = {result}")\n        return result\n\n    def multiply(self, a: Number, b: Number) -> Number:\n        result = a * b\n        self.history.append(f"{a} * {b} = {result}")\n        return result\n\n    def divide(self, a: Number, b: Number) -> float:\n        if b == 0:\n            raise ValueError("Cannot divide by zero")\n        result = a / b\n        self.history.append(f"{a} / {b} = {result}")\n        return result\n\n    def power(self, a: Number, b: Number) -> Number:\n        result = a ** b\n        self.history.append(f"{a} ^ {b} = {result}")\n        return result\n\n    def sqrt(self, a: Number) -> float:\n        if a < 0:\n            raise ValueError("Cannot compute square root of negative number")\n        result = math.sqrt(a)\n        self.history.append(f"sqrt({a}) = {result}")\n        return result\n\n    def get_history(self) -> list[str]:\n        return self.history.copy()\n\n    def clear_history(self) -> None:\n        self.history.clear()`,
      },
      {
        name: "src/logger.py",
        content: `"""Simple logging module."""\n\nfrom datetime import datetime\nfrom typing import Optional\n\nclass Logger:\n    """Lightweight logger for console output."""\n\n    COLORS = {\n        "DEBUG": "\\033[36m",\n        "INFO": "\\033[32m",\n        "WARNING": "\\033[33m",\n        "ERROR": "\\033[31m",\n        "RESET": "\\033[0m",\n    }\n\n    def __init__(self, name: str, level: str = "DEBUG"):\n        self.name = name\n        self.level = level.upper()\n\n    def _log(self, level: str, message: str) -> None:\n        if self._should_log(level):\n            timestamp = datetime.now().strftime("%H:%M:%S")\n            color = self.COLORS.get(level, "")\n            reset = self.COLORS["RESET"]\n            print(f"{color}[{timestamp}] {level}: [{self.name}] {message}{reset}")\n\n    def _should_log(self, level: str) -> bool:\n        levels = ["DEBUG", "INFO", "WARNING", "ERROR"]\n        return levels.index(level) >= levels.index(self.level)\n\n    def debug(self, message: str) -> None:\n        self._log("DEBUG", message)\n\n    def info(self, message: str) -> None:\n        self._log("INFO", message)\n\n    def warning(self, message: str) -> None:\n        self._log("WARNING", message)\n\n    def error(self, message: str) -> None:\n        self._log("ERROR", message)`,
      },
      {
        name: "tests/test_calculator.py",
        content: `"""Tests for the Calculator module."""\n\nimport sys\nimport os\nsys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))\n\nfrom src.calculator import Calculator\n\ndef test_add():\n    calc = Calculator()\n    assert calc.add(2, 3) == 5\n    assert calc.add(-1, 1) == 0\n    assert calc.add(0, 0) == 0\n    print("  [PASS] test_add")\n\ndef test_subtract():\n    calc = Calculator()\n    assert calc.subtract(5, 3) == 2\n    assert calc.subtract(0, 5) == -5\n    print("  [PASS] test_subtract")\n\ndef test_multiply():\n    calc = Calculator()\n    assert calc.multiply(3, 4) == 12\n    assert calc.multiply(0, 100) == 0\n    print("  [PASS] test_multiply")\n\ndef test_divide():\n    calc = Calculator()\n    assert calc.divide(10, 2) == 5.0\n    assert calc.divide(7, 2) == 3.5\n    try:\n        calc.divide(1, 0)\n        assert False, "Should have raised ValueError"\n    except ValueError:\n        pass\n    print("  [PASS] test_divide")\n\ndef test_history():\n    calc = Calculator()\n    calc.add(1, 2)\n    calc.subtract(5, 3)\n    assert len(calc.get_history()) == 2\n    calc.clear_history()\n    assert len(calc.get_history()) == 0\n    print("  [PASS] test_history")\n\nif __name__ == "__main__":\n    print("\\nRunning tests...")\n    test_add()\n    test_subtract()\n    test_multiply()\n    test_divide()\n    test_history()\n    print("\\nAll tests passed!\\n")`,
      },
      {
        name: "README.md",
        content: `# Python Script Starter\n\nA multi-file Python project with modules, classes, and tests.\n\n## Structure\n\n\`\`\`\nproject/\n  main.py              # Entry point\n  src/\n    __init__.py\n    calculator.py       # Calculator class\n    logger.py           # Logger class\n  tests/\n    test_calculator.py  # Unit tests\n  README.md\n\`\`\`\n\n## Running\n\n\`\`\`bash\npython main.py\n\`\`\`\n\n## Testing\n\n\`\`\`bash\npython tests/test_calculator.py\n\`\`\`\n\n## Features\n\n- Calculator class with history tracking\n- Colored logger output\n- Unit tests\n- Type hints`,
      },
    ],
  },
];

export default templates;
