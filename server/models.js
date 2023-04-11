const db = require('./db');

module.exports.getQuestions = (req) => {
  // console.log(req.query);
  const params = req.query;

  const queryString = params.product_id === undefined ?
  `SELECT * FROM questions LIMIT 1;`
  :
  `SELECT
  json_agg(
    json_build_object(
      'question_id', questions.id,
      'question_body', questions.body,
      'question_date', to_timestamp(questions.date_written/1000),
      'asker_name', questions.asker_name,
      'question_helpfulness', questions.helpful,
      'reported', questions.reported
    )
  )
  AS results
  FROM questions
  WHERE product_id = ${params.product_id}
  LIMIT ${params.count};`;

  return db.any(queryString);
};

module.exports.getAnswers = (req) => {
  // console.log(req.params);
  // const x = [1, 2, 3];
  // 'photos', ${x} /* only gives first element */
  const queryString = req.params.question_id === undefined ?
  ``
  :
  `SELECT
  json_object_agg(
    answers.id,
    json_build_object(
      'id', answers.id,
      'body', answers.body,
      'date', to_timestamp(answers.date_written/1000),
      'answerer_name', answers.answerer_name,
      'helpfulness', answers.helpful
    )
  )
  AS answers
  FROM answers
  WHERE answers.question_id = ${req.params.question_id}
  LIMIT 2;`;

  return db.any(queryString);
}

// from Markus:
// const arrayForBatch = () => ({
//   method:'GET',
//   url: `http://localhost:3000/api/qa/questions?product_id=${Math.ceil(Math.random() * 1000011)}`,
//   params:{
//     tags:{
//       name: 'PostsQuestionURL'
//     }
//   }
// })

// const makeBatch = (n) => (
//   Array(n).fill('').map(() => (
//     arrayForBatch()
//   )))