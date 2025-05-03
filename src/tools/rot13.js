## 프로젝트: txtwizard.net

**목표:** 텍스트를 ROT13 방식으로 암호화/복호화하는 기능 추가

**출력:** UTF-8 텍스트

**파일 경로:** `src/tools/rot13.js`

**코드:**

```javascript
// src/tools/rot13.js

function rot13(text) {
  return text.replace(/[a-zA-Z]/g, function(char) {
    const charCode = char.charCodeAt(0);
    const base = (charCode >= 65 && charCode <= 90) ? 65 : 97;
    return String.fromCharCode(base + (charCode - base + 13) % 26);
  });
}

// Test function (optional, but recommended)
function testRot13() {
  const input = "Hello, World!";
  const encrypted = rot13(input);
  const decrypted = rot13(encrypted);

  console.log("Input:", input);
  console.log("Encrypted:", encrypted);
  console.log("Decrypted:", decrypted);

  if (input === decrypted) {
    console.log("ROT13 test passed!");
  } else {
    console.error("ROT13 test failed!");
  }
}

// You can uncomment this line to run the test when the script loads
// testRot13();

// Export the function for use in other modules (if needed)
export { rot13 };
```

**HTML (예시, 해당 파일에 포함될 필요는 없지만 사용법을 보여줍니다.):**

```html
<!DOCTYPE html>
<html>
<head>
  <title>ROT13 Encoder/Decoder</title>
  <meta charset="UTF-8">
</head>
<body>

  <h1>ROT13 Encoder/Decoder</h1>

  <textarea id="inputTextArea" rows="4" cols="50"></textarea>
  <br>
  <button onclick="encodeDecode()">Encode/Decode</button>
  <br>
  <textarea id="outputTextArea" rows="4" cols="50" readonly></textarea>

  <script src="src/tools/rot13.js" type="module"></script>
  <script>
    import { rot13 } from './src/tools/rot13.js'; // Adjust path if needed

    function encodeDecode() {
      const inputText = document.getElementById("inputTextArea").value;
      const outputText = rot13(inputText);
      document.getElementById("outputTextArea").value = outputText;
    }
  </script>

</body>
</html>
```

**설명:**

1. **`rot13(text)` 함수:**
   - 입력된 `text`를 받아 각 문자를 순회합니다.
   - `/[a-zA-Z]/g` 정규 표현식은 모든 영어 알파벳 (대소문자)을 찾습니다.
   - 각 문자에 대해 다음을 수행합니다.
     - `charCodeAt(0)`을 사용하여 문자의 ASCII 코드를 가져옵니다.
     - `base` 변수를 사용하여 대문자 (65) 또는 소문자 (97)의 시작 ASCII 값을 결정합니다.
     - ROT13 암호화를 수행합니다: `(charCode - base + 13) % 26`.  이것은 문자의 ASCII 코드를 0-25 범위로 이동시키고, 13을 더한 다음, 26 (알파벳의 문자 수)으로 나눈 나머지를 취합니다. 이것은 알파벳을 "순환"시키는 효과를 냅니다.
     - `String.fromCharCode()`를 사용하여 암호화된 ASCII 코드를 다시 문자로 변환합니다.
   - 모든 문자를 암호화/복호화한 후 결과 문자열을 반환합니다.

2. **`testRot13()` 함수 (선택 사항):**
   - ROT13 함수를 테스트하기 위한 간단한 함수입니다.
   - "Hello, World!"를 암호화하고 다시 복호화하여 원래 문자열과 일치하는지 확인합니다.
   - 개발 중에 유용하며, 나중에 제거하거나 주석 처리할 수 있습니다.

3. **HTML (예시):**
   - 간단한 HTML 페이지입니다.
   - 두 개의 `<textarea>` 요소가 있습니다: 하나는 입력을 받고, 다른 하나는 출력을 표시합니다.
   - `<button>` 요소를 클릭하면 `encodeDecode()` 함수가 실행됩니다.
   - JavaScript 코드는 다음과 같습니다.
     - `rot13.js` 파일을 모듈로 가져옵니다 (ES Modules).
     - `encodeDecode()` 함수는 입력 텍스트를 가져와 `rot13()` 함수에 전달하고, 결과를 출력 텍스트 영역에 표시합니다.

**구현 방법:**

1. `src/tools/rot13.js` 파일에 위의 JavaScript 코드를 저장합니다.
2. HTML 파일 (예: `index.html`)을 만들고 위의 HTML 코드를 저장합니다. 필요에 따라 파일 경로를 조정합니다.
3. HTML 파일을 웹 브라우저에서 엽니다.
4. 텍스트 상자에 텍스트를 입력하고 "Encode/Decode" 버튼을 클릭하여 결과를 확인합니다.

**참고 사항:**

* UTF-8 인코딩은 HTML 파일의 `<meta charset="UTF-8">` 태그를 통해 설정됩니다. JavaScript 코드는 자동으로 UTF-8을 처리합니다.
* 코드는 가능한 한 간단하게 유지되었습니다.  더 복잡한 기능을 추가하려면 코드를 수정할 수 있습니다.
* 실제 `txtwizard.net` 프로젝트에 통합할 때는 프로젝트 구조에 맞게 파일 경로와 JavaScript 모듈 가져오기를 조정해야 합니다.
* 테스트 코드를 포함하면 구현의 정확성을 검증하는 데 도움이 됩니다.
* 이 코드는 ROT13 암호화를 지원하지 않는 문자는 변경하지 않습니다 (예: 숫자, 공백, 특수 문자). 필요에 따라 이 동작을 수정할 수 있습니다.
* 보안상의 이유로 ROT13은 진정한 암호화가 아닙니다.  단순히 텍스트를 난독화하는 데 사용됩니다.

이 답변이 txtwizard.net 프로젝트에 ROT13 기능을 추가하는 데 도움이 되기를 바랍니다.  궁금한 점이 있으면 언제든지 질문하세요.
