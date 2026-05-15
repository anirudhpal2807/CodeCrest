const axios = require('axios');

function assertJudge0Configured() {
  const key = process.env.JUDGE0_KEY;
  if (!key || !String(key).trim()) {
    throw new Error(
      'Judge0 API key is missing. Add JUDGE0_KEY to backend/.env (RapidAPI key for judge0-ce).'
    );
  }
}

/** Judge0 rejects some plain strings (e.g. problem I/O with special chars); batch + poll need base64. */
function toB64Utf8(val) {
  return Buffer.from(String(val ?? ''), 'utf8').toString('base64');
}

function fromB64Utf8(val) {
  if (val == null || val === '') return val;
  try {
    return Buffer.from(String(val), 'base64').toString('utf8');
  } catch {
    return String(val);
  }
}

/** Judge0 C++ (GCC) compiles submission as one TU — LeetCode-style stubs often omit `#include`. */
const JUDGE0_LANGUAGE_CPP = 54;

function ensureJudge0CppExecutableSource(source_code) {
  const s = String(source_code ?? '');
  if (!s.trim()) return s;
  if (/#include\s*[</"]/.test(s)) return s;
  return (
    `#include <vector>\n` +
    `#include <string>\n` +
    `#include <algorithm>\n` +
    `#include <iostream>\n` +
    `#include <sstream>\n` +
    `using namespace std;\n\n` +
    s
  );
}

/** Stub has `class Solution` but no linker entry — synthesize stdin driver for common LC array shape. */
function cppNeedsSyntheticMain(src) {
  const s = String(src);
  if (!/\bclass\s+Solution\b/.test(s)) return false;
  return !/\bint\s+main\s*\(/.test(s);
}

/**
 * First `vector<int> name(vector<int>& param)` in file (many CodeCrest / LC array problems match this).
 * @returns {string|null}
 */
function detectCppVectorIntUnaryMethodName(src) {
  const re =
    /\bvector\s*<\s*int\s*>\s*([a-zA-Z_]\w*)\s*\(\s*vector\s*<\s*int\s*>\s*&\s*[a-zA-Z_]\w*\s*\)/g;
  const names = [];
  let m;
  while ((m = re.exec(src)) !== null) names.push(m[1]);
  if (names.length === 0) return null;
  const preferOrder = ['plusOne', 'rotate', 'maxSubArray'];
  for (const p of preferOrder) if (names.includes(p)) return p;
  return names[0];
}

/** @param {string} methodName — validated [a-zA-Z_]\w* */
function cppLeetSyntheticMainSnippet(methodName) {
  return (
    `\n#line 200000001\n` +
    `static std::vector<int> cc_parse_leet_int_vector_line(const std::string& line) {\n` +
    `  std::vector<int> out;\n` +
    `  const size_t lb = line.find('[');\n` +
    `  const size_t rb = line.rfind(']');\n` +
    `  if (lb == std::string::npos || rb == std::string::npos || rb <= lb) return out;\n` +
    `  std::string inner = line.substr(lb + 1, rb - lb - 1);\n` +
    `  std::string token;\n` +
    `  for (size_t i = 0; i <= inner.size(); ++i) {\n` +
    `    const bool end = i == inner.size();\n` +
    `    const char ch = end ? ',' : inner[i];\n` +
    `    if (!end && ((ch >= '0' && ch <= '9') || ch == '-')) token.push_back(ch);\n` +
    `    else if (!token.empty()) {\n` +
    `      out.push_back(std::stoi(token));\n` +
    `      token.clear();\n` +
    `    }\n` +
    `  }\n` +
    `  return out;\n` +
    `}\n\n` +
    `static void cc_print_vec_no_spaces(std::ostream& os, const std::vector<int>& v) {\n` +
    `  os << '[';\n` +
    `  for (size_t i = 0; i < v.size(); ++i) {\n` +
    `    if (i) os << ',';\n` +
    `    os << v[i];\n` +
    `  }\n` +
    `  os << ']' << std::flush;\n` +
    `}\n\n` +
    `int main() {\n` +
    `  std::ios::sync_with_stdio(false);\n` +
    `  std::cin.tie(nullptr);\n` +
    `  std::string line;\n` +
    `  if (!std::getline(std::cin, line)) return 0;\n` +
    `  std::vector<int> digits = cc_parse_leet_int_vector_line(line);\n` +
    `  Solution solver;\n` +
    `  std::vector<int> ans = solver.` +
    methodName +
    `(digits);\n` +
    `  cc_print_vec_no_spaces(std::cout, ans);\n` +
    `  std::cout << std::endl;\n` +
    `  return 0;\n` +
    `}\n`
  );
}

function prependSyntheticCppJudgeHeaders(src) {
  const need = [
    ['string', '#include <string>'],
    ['vector', '#include <vector>'],
    ['iostream', '#include <iostream>'],
    ['sstream', '#include <sstream>'],
    ['algorithm', '#include <algorithm>'],
  ];
  const lines = [];
  for (const [name, line] of need) {
    const re = new RegExp(`#include\\s*[<"]${name}\\b`);
    if (!re.test(src)) lines.push(line);
  }
  if (!lines.length) return src;
  return lines.join('\n') + '\n' + src;
}

function finalizeJudge0CppSubmissionSource(source_code) {
  let s = ensureJudge0CppExecutableSource(source_code);
  if (!cppNeedsSyntheticMain(s)) return s;
  const rawName = detectCppVectorIntUnaryMethodName(s);
  if (!rawName || !/^[a-zA-Z_]\w*$/.test(rawName)) return s;

  s = prependSyntheticCppJudgeHeaders(s);

  return s + cppLeetSyntheticMainSnippet(rawName);
}

function normalizeJudge0SubmissionSource(sub) {
  if (!sub || sub.language_id !== JUDGE0_LANGUAGE_CPP) return sub.source_code;
  return finalizeJudge0CppSubmissionSource(sub.source_code);
}

function encodeSubmissionsForJudge0(submissions) {
  return submissions.map((s) => ({
    ...s,
    source_code: toB64Utf8(normalizeJudge0SubmissionSource(s)),
    stdin: toB64Utf8(s.stdin),
    expected_output: toB64Utf8(s.expected_output),
  }));
}

function decodeJudge0SubmissionRow(sub) {
  if (!sub || typeof sub !== 'object') return sub;
  return {
    ...sub,
    source_code:
      sub.source_code != null ? fromB64Utf8(sub.source_code) : sub.source_code,
    stdin: sub.stdin != null ? fromB64Utf8(sub.stdin) : sub.stdin,
    expected_output:
      sub.expected_output != null
        ? fromB64Utf8(sub.expected_output)
        : sub.expected_output,
    stdout: sub.stdout != null ? fromB64Utf8(sub.stdout) : sub.stdout,
    stderr: sub.stderr != null ? fromB64Utf8(sub.stderr) : sub.stderr,
    compile_output:
      sub.compile_output != null
        ? fromB64Utf8(sub.compile_output)
        : sub.compile_output,
    message: sub.message != null ? fromB64Utf8(sub.message) : sub.message,
  };
}


const getLanguageById = (lang)=>{

    const language = {
        "c++":54,
        "java":62,
        "javascript":63
    }


    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions)=>{

assertJudge0Configured();

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'true'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions: encodeSubmissionsForJudge0(submissions),
  },
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error('Judge0 API Error:', error.response?.status, error.response?.data || error.message);
		
		// Handle rate limiting
		if (error.response?.status === 429) {
			throw new Error('Judge0 API rate limit exceeded. Please try again in a few minutes.');
		}

		if (error.response?.status === 401 || error.response?.status === 403) {
			throw new Error('Judge0 API rejected the request (invalid or expired JUDGE0_KEY / RapidAPI subscription).');
		}
		
		// Handle other API errors
		if (error.response?.status >= 400) {
			const data = error.response?.data;
			const detail =
				typeof data === 'object' && data != null && data.error != null
					? String(data.error)
					: typeof data === 'string'
						? data
						: '';
			throw new Error(
				detail ? `Judge0: ${detail}` : 'Judge0 API service temporarily unavailable. Please try again later.'
			);
		}
		
		throw new Error('Failed to submit code to Judge0. Please try again.');
	}
}

 return await fetchData();

}


const waiting = async(timer)=>{
  return new Promise(resolve => setTimeout(resolve, timer));
}

// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const submitToken = async(resultToken)=>{
  const maxAttempts = 30; // Maximum 30 seconds timeout
  let attempts = 0;

  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(","),
      base64_encoded: 'true',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_KEY,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  async function fetchData() {
    try {
      assertJudge0Configured();
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error('Judge0 API Error:', error.response?.status, error.response?.data || error.message);
      
      // Handle rate limiting
      if (error.response?.status === 429) {
        throw new Error('Judge0 API rate limit exceeded. Please try again in a few minutes.');
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Judge0 API rejected the request (invalid or expired JUDGE0_KEY / RapidAPI subscription).');
      }
      
      // Handle other API errors
      if (error.response?.status >= 400) {
        const data = error.response?.data;
        const detail =
          typeof data === 'object' && data != null && data.error != null
            ? String(data.error)
            : typeof data === 'string'
              ? data
              : '';
        throw new Error(
          detail ? `Judge0: ${detail}` : 'Judge0 API service temporarily unavailable. Please try again later.'
        );
      }
      
      throw new Error('Failed to get results from Judge0. Please try again.');
    }
  }

  while(attempts < maxAttempts){
    try {
      const result = await fetchData();

      // Check if result and result.submissions exist
      if (!result || !result.submissions) {
        throw new Error('Invalid response from Judge0 API. Please try again.');
      }

      const IsResultObtained = result.submissions.every((r)=>r.status_id>2);

      if(IsResultObtained) {
        return result.submissions.map(decodeJudge0SubmissionRow);
      }

      attempts++;
      await waiting(1000);
    } catch (error) {
      // If it's an API error, throw it immediately (includes Judge0: … from RapidAPI body)
      const msg = error.message || '';
      if (
        msg.includes('Judge0 API') ||
        msg.startsWith('Judge0:') ||
        msg.includes('rate limit') ||
        msg.includes('service temporarily unavailable') ||
        msg.includes('Invalid response from Judge0')
      ) {
        throw error;
      }
      
      // For other errors, continue polling but increment attempts
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error('Code execution timeout. Please try again with simpler code.');
      }
      await waiting(1000);
    }
  }

  throw new Error('Code execution timeout. Please try again with simpler code.');
}


module.exports = {getLanguageById,submitBatch,submitToken};








// 


