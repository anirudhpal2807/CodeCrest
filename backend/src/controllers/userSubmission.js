const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

const submitCode = async (req,res)=>{
   
    // 
    try{
      
       const userId = req.result._id;
       const problemId = req.params.id;

       let {code,language} = req.body;

      if(!userId||!code||!problemId||!language)
        return res.status(400).send("Some field missing");
      

      if(language==='cpp')
        language='c++'
      
      console.log(language);
      
    //    Fetch the problem from database
       const problem =  await Problem.findById(problemId);
    //    testcases(Hidden)
      if(!problem){
        return res.status(404).send("Problem not found");
      }
    
    //   Kya apne submission store kar du pehle....
    const submittedResult = await Submission.create({
          userId,
          problemId,
          code,
          language,
          status:'pending',
          testCasesTotal:(problem.hiddenTestCases ? problem.hiddenTestCases.length : 0)
     })

    //    Judge0 code ko submit karna hai
    let testResult = [];
    if(Array.isArray(problem.hiddenTestCases) && problem.hiddenTestCases.length>0){
      try {
        const languageId = getLanguageById(language);
       
        const submissions = problem.hiddenTestCases.map((testcase)=>({
            source_code:code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);
        
        const resultToken = submitResult.map((value)=> value.token);

        testResult = await submitToken(resultToken);
      } catch (error) {
        console.error('Judge0 submission error:', error.message);
        
        let statusCode = 503;
        let errorMessage = 'Code execution service is temporarily unavailable. Please try again later.';
        
        if (error.message.includes('rate limit')) {
          statusCode = 429;
          errorMessage = 'Rate limit exceeded. Please wait a few minutes before trying again.';
        } else if (error.message.includes('timeout')) {
          statusCode = 408;
          errorMessage = 'Code execution timeout. Please try with simpler code or try again later.';
        } else if (error.message.includes('API service temporarily unavailable')) {
          statusCode = 503;
          errorMessage = 'Code execution service is temporarily unavailable. Please try again later.';
        }
        
        // Update submission with error status
        submittedResult.status = 'error';
        submittedResult.errorMessage = error.message;
        await submittedResult.save();
        
        return res.status(statusCode).json({
          accepted: false,
          error: error.message,
          message: errorMessage
        });
      }
    }
    

    // submittedResult ko update karo
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;


    if(Array.isArray(testResult)){
      for(const test of testResult){
          if(test.status_id==3){
             testCasesPassed++;
             runtime = runtime+parseFloat(test.time)
             memory = Math.max(memory,test.memory);
          }else{
            if(test.status_id==4){
              status = 'error'
              errorMessage = test.stderr
            }
            else{
              status = 'wrong'
              errorMessage = test.stderr
            }
          }
      }
    }


    // Store the result in Database in Submission
    submittedResult.status   = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();
    
    // ProblemId ko insert karenge userSchema ke problemSolved mein if it is not persent there.
    
    // req.result == user Information

    if(!req.result.problemSolved.includes(problemId)){
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }
    
    const accepted = (status == 'accepted')
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });
       
    }
    catch(err){
      res.status(500).send("Internal Server Error "+ err);
    }
}


const runCode = async(req,res)=>{
    
     // 
     try{
      const userId = req.result._id;
      const problemId = req.params.id;

      let {code,language} = req.body;

     if(!userId||!code||!problemId||!language)
       return res.status(400).send("Some field missing");

  //    Fetch the problem from database
     const problem =  await Problem.findById(problemId);
     
     if(!problem){
       return res.status(404).json({
         success: false,
         error: "Problem not found",
         message: "The requested problem does not exist."
       });
     }
     
  //    testcases(Hidden)
     if(language==='cpp')
       language='c++'

  //    Judge0 code ko submit karna hai

  const languageId = getLanguageById(language);
  
  if(!languageId){
    return res.status(400).json({
      success: false,
      error: "Unsupported language",
      message: `Language '${language}' is not supported.`
    });
  }

  console.log('Problem visibleTestCases:', problem.visibleTestCases);
  console.log('Language:', language, 'LanguageId:', languageId);

  const submissions = (problem.visibleTestCases || []).map((testcase)=>({
      source_code:code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
  }));
  
  console.log('Submissions array length:', submissions.length);

  let submitResult = [];
  let resultToken = [];
  let testResult = [];

  if (submissions.length > 0) {
    try {
      console.log('Submitting to Judge0...');
      submitResult = await submitBatch(submissions);
      console.log('Judge0 submission result:', submitResult);
      
      resultToken = Array.isArray(submitResult) ? submitResult.map((value)=> value.token) : [];
      console.log('Result tokens:', resultToken);
      
      if(resultToken.length > 0) {
        console.log('Polling for results...');
        testResult = await submitToken(resultToken);
        console.log('Test results:', testResult);
      }
    } catch (error) {
      console.error('Judge0 run code error:', error.message);
      
      let statusCode = 503;
      let errorMessage = 'Code execution service is temporarily unavailable. Please try again later.';
      
      if (error.message.includes('rate limit')) {
        statusCode = 429;
        errorMessage = 'Rate limit exceeded. Please wait a few minutes before trying again.';
      } else if (error.message.includes('timeout')) {
        statusCode = 408;
        errorMessage = 'Code execution timeout. Please try with simpler code or try again later.';
      } else if (error.message.includes('API service temporarily unavailable')) {
        statusCode = 503;
        errorMessage = 'Code execution service is temporarily unavailable. Please try again later.';
      }
      
      return res.status(statusCode).json({
        success: false,
        error: error.message,
        message: errorMessage
      });
    }
  } else {
    console.log('No test cases found for this problem');
    return res.status(400).json({
      success: false,
      error: "No test cases",
      message: "This problem has no visible test cases to run against."
    });
  }

   let testCasesPassed = 0;
   let runtime = 0;
   let memory = 0;
   let status = true;
   let errorMessage = null;

   for(const test of testResult){
       if(test.status_id==3){
          testCasesPassed++;
          runtime = runtime+parseFloat(test.time)
          memory = Math.max(memory,test.memory);
       }else{
         if(test.status_id==4){
           status = false
           errorMessage = test.stderr
         }
         else{
           status = false
           errorMessage = test.stderr
         }
       }
   }

  
  
  res.status(201).json({
   success:status,
   testCases: testResult,
   runtime,
   memory
  });
     
  }
  catch(err){
    res.status(500).send("Internal Server Error "+ err);
  }
}


module.exports = {submitCode,runCode};



//     language_id: 54,
//     stdin: '2 3',
//     expected_output: '5',
//     stdout: '5',
//     status_id: 3,
//     created_at: '2025-05-12T16:47:37.239Z',
//     finished_at: '2025-05-12T16:47:37.695Z',
//     time: '0.002',
//     memory: 904,
//     stderr: null,
//     token: '611405fa-4f31-44a6-99c8-6f407bc14e73',


// User.findByIdUpdate({
// })

//const user =  User.findById(id)
// user.firstName = "Mohit";
// await user.save();