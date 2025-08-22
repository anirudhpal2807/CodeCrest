const axios = require('axios');


const getLanguageById = (lang)=>{

    const language = {
        "c++":54,
        "java":62,
        "javascript":63
    }


    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions)=>{

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error('Judge0 API Error:', error.response?.data || error.message);
		
		// Handle rate limiting
		if (error.response?.status === 429) {
			throw new Error('Judge0 API rate limit exceeded. Please try again in a few minutes.');
		}
		
		// Handle other API errors
		if (error.response?.status >= 400) {
			throw new Error('Judge0 API service temporarily unavailable. Please try again later.');
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

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error('Judge0 API Error:', error.response?.data || error.message);
		
		// Handle rate limiting
		if (error.response?.status === 429) {
			throw new Error('Judge0 API rate limit exceeded. Please try again in a few minutes.');
		}
		
		// Handle other API errors
		if (error.response?.status >= 400) {
			throw new Error('Judge0 API service temporarily unavailable. Please try again later.');
		}
		
		throw new Error('Failed to get results from Judge0. Please try again.');
	}
}


 while(true){

 const result =  await fetchData();

 // Check if result and result.submissions exist
 if (!result || !result.submissions) {
   throw new Error('Invalid response from Judge0 API. Please try again.');
 }

  const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

  if(IsResultObtained)
    return result.submissions;

  
  await waiting(1000);
}



}


module.exports = {getLanguageById,submitBatch,submitToken};








// 


