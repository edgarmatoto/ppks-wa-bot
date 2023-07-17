const { Pool } = require('pg');

class DatabaseService {
  constructor() {
    this._pool = new Pool();
  }

  async addReport(userInformation) {
    const { userName, userNumber, reportDescription } = userInformation;

    if (reportDescription.split(' ').length < 10) {
      throw new Error('Laporan tidak diproses. Masukkan laporan minimal 10 kata.');
    }

    const query = {
      text: 'INSERT INTO report(name, phone_number, description) values($1, $2, $3)',
      values: [userName, userNumber, reportDescription],
    };

    await this._pool.query(query);
  }

  async getAnswerByTopic(topic) {
    const query = {
      text: 'SELECT description FROM faq WHERE topic = $1',
      values: [topic],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return "Maaf, pertanyaan belum tersedia.";
    }

    const answer = result.rows[0].description;
    return answer;
  }

  async ValidateReportTimeDiff(userNumber) {
    const query = {
      text: 'SELECT created_at FROM report WHERE phone_number = $1 ORDER BY created_at DESC',
      values: [userNumber],
    };
    const result = await this._pool.query(query);

    if (result.rowCount) {
      const currentTimeInMiliSeconds = new Date().getTime();
      const reportTimeInMiliSeconds = new Date(result.rows[0].created_at).getTime();

      const timeDiff = Number(currentTimeInMiliSeconds) - Number(reportTimeInMiliSeconds);
      if (timeDiff < 10000) {
        throw new Error('Mohon tunggu beberapa saat untuk mengirim laporan kembali.');
      }
    }
  }
}

module.exports = DatabaseService;
