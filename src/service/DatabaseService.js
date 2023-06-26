const { Pool } = require('pg');

class DatabaseService {
  constructor() {
    this.pool = new Pool();
  }

  async addReport(userInformation) {
    const { nama, kontak, deskripsi } = userInformation;
    const query = {
      text: 'INSERT INTO laporan(nama, kontak, deskripsi) values($1, $2, $3)',
      values: [nama, kontak, deskripsi],
    };

    await this.pool.query(query);
  }

  async getAnswerByTopic(topic) {
    const query = {
      text: 'SELECT deskripsi FROM faq WHERE topik = $1',
      values: [topic],
    };

    const result = await this.pool.query(query);
    const answer = result.rows[0].deskripsi;

    return answer;
  }
}

module.exports = DatabaseService;
