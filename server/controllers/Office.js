import db from '../models/db';
import Validations from './Validations';

const viewResult = (req, res) => {
  const result = Validations.validateId(req.params.officeId);

  if (result.error) {
    return res.json({
      status: 400,
      error: `${result.error.details[0].context.value} is an invalid value`,
    });
  }

  const officeId = parseInt(req.params.officeId, 10);

  const query = {
    text: `SELECT
      candidateid,
      COUNT (candidateid)
      FROM
      votes
      WHERE officeid=$1
      GROUP BY
      candidateid`,
    values: [officeId],
  };

  db.client.query(query, (err, result) => {
    if (err) {
      return res.json({
        status: 400,
        message: 'Data cannot be retrieved',
      });
    }

    if (result.rowCount === 0) {
      return res.json({
        status: 404,
        message: `Office with ID ${officeId} not found`,
      });
    }

    const voteCasted = result.rows;
    const electionResult = [];

    for (let i = 0; i < voteCasted.length; i++) {
      electionResult.push({
        office: officeId,
        candidate: voteCasted[i].candidateid,
        result: parseInt(voteCasted[i].count, 10),
      });
    }

    return res.json({
      status: 200,
      data: electionResult,
    });
  });
};

const Results = {
  viewResult,
};

export default Results;
