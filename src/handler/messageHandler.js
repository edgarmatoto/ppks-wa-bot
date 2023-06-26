const DatabaseService = require('../service/DatabaseService');

async function handleMessage(client, message) {
  const body = message.body.toLowerCase();

  const greetingKeywords = ["hi", "hello", "halo", 'hai', 'helo', 'p', 'menu', '/menu', 'layanan'];
  const serviceOptions = [
    "pengaduan laporan kekerasan seksual.",
    "bimbingan konseling dengan satgas ppks.",
    "saran dan tips untuk menghindari kekerasan seksual.",
    "FAQ seputar kekerasan seksual.",
  ];

  //  handle message
  if (greetingKeywords.includes(body)) {
    const contact = await message.getContact();
    const nama = contact.pushname;

    message.react('👍');
    client.sendMessage(message.from, `Halo ${nama}! Selamat datang di layanan *Penanganan dan Pengaduan Pelecehan Seksual* :).\n\nKami siap membantu Anda untuk menemukan informasi dan sumber daya yang Anda butuhkan untuk mengatasi situasi yang mungkin Anda alami.\n\nDapatkan informasi mengenai PPKS melalui website kami: https://ppks-web.vercel.app/`);
    client.sendMessage(message.from, `Silahkan pilih layanan yang anda butuhkan:\n\n${serviceOptions.map((option, index) => `${index + 1}. ${option}`).join("\n")}`);
  } else if (body.startsWith('1')) { // pengaduan laporan kekerasan seksual.
    message.react('👍');
    message.reply(`Untuk melakukan pelaporan, silakan ketik '/lapor' di kolom pesan dilanjutkan dengan deskripsi kejadian anda.\n\nAnda dapat melihat contoh laporan dengan membalas pesan ini dengan */contoh*.`);
  } else if (body.startsWith('/contoh')) {
    message.react('👍');
    message.reply(`_Contoh:_ /lapor Saya, Lorem Ipsum, melaporkan bahwa saya telah mengalami pelecehan seksual oleh seseorang pria yang saya tidak kenal. Kejadian ini terjadi pada hari senin tanggal 12 Mei 2023 di lingkungan kampus XYZ.\n(Deskripsi kejadian)...`);
  } else if (body.startsWith('/lapor')) {
    const databaseService = new DatabaseService();
    const contact = await message.getContact();
    const nama = contact.pushname;
    const kontak = contact.number;
    const deskripsi = body.slice(7);

    await databaseService.addReport({ nama, kontak, deskripsi });

    message.react('👍');
    message.reply(`Terima kasih ${nama}, laporan anda telah dimasukkan ke dalam data satgas PPKS.\n\nJika Anda bersedia, *kami sangat-sangat menyarankan Anda untuk melakukan konseling dengan Satgas PPKS* untuk mendapatkan dukungan dan bimbingan lebih lanjut\n\nKami memastikan bahwa *semua informasi yang Anda berikan akan dijaga kerahasiaannya*. Kami berkomitmen untuk memberikan dukungan dan bimbingan dalam setiap tahap proses pengaduan dan akan memastikan bahwa Anda merasa aman dan terlindungi.`);
  } else if (body.startsWith('2')) { // bimbingan konseling dengan satgas ppks.
    let adminNumber = process.env.PPKS_CONTACT;
    adminNumber = adminNumber.includes('@c.us') ? adminNumber : `${adminNumber}@c.us`;

    const contact = await message.getContact();
    const nama = contact.pushname;
    const kontak = contact.number;

    const messageToAdmin = `Halo Tim Pusat Pelayanan Kekerasan Seksual (PPKS),\n\nSaya ingin memberitahukan bahwa ada seseorang yang mengungkapkan keinginan untuk melakukan bimbingan konseling terkait kekerasan seksual. Berikut adalah rincian informasinya:\n\nNama: ${nama}\nKontak: ${kontak}\nKeinginan: Bimbingan Konseling\n\nMohon segera menghubungi orang tersebut untuk memberikan panduan lebih lanjut dan menjadwalkan sesi konseling. Pastikan memberikan dukungan yang sesuai, menjaga kerahasiaan informasi pribadi mereka, dan menyediakan lingkungan yang aman untuk berbagi.`;

    const chat = await message.getChat();
    chat.sendSeen();

    client.sendMessage(adminNumber, messageToAdmin);

    message.react('👍');
    message.reply(`Terima kasih telah bersedia melakukan konseling. Kami menghargai langkah yang Anda ambil untuk mencari bantuan dan mendapatkan dukungan yang Anda butuhkan. Tim Pusat Pelayanan Kekerasan Seksual (PPKS) akan segera menghubungi Anda.\n\nAnda tidak sendiri dalam perjalanan ini. Kami berkomitmen untuk memberikan dukungan yang aman, rahasia, dan mendukung Anda dalam pemulihan.`);
  } else if (body.startsWith('3')) { // saran dan tips untuk menghindari kekerasan seksual.
    const tipsList = [
      "*Waspadai lingkungan sekitar Anda.* Selalu perhatikan lingkungan Anda dan hindari tempat-tempat yang tidak aman atau terpencil, terutama pada malam hari.",
      "*Pelajari tanda-tanda kekerasan seksual.* Ada beberapa tanda-tanda kekerasan seksual yang perlu Anda ketahui, seperti pergaulan yang terlalu intens, permintaan seksual yang tidak diinginkan, dan ancaman atau kekerasan.",
      "*Percayalah pada insting Anda.* Jangan abaikan perasaan Anda jika Anda merasa tidak nyaman dengan situasi atau orang tertentu. Percayalah pada insting Anda dan segera lakukan tindakan yang tepat untuk menjaga keselamatan Anda.",
      "*Hindari minuman beralkohol yang berlebihan.* Minuman beralkohol dapat membuat Anda kehilangan kewaspadaan dan membuat Anda lebih rentan menjadi korban kekerasan seksual. Jangan minum terlalu banyak dan selalu waspadai minuman Anda.",
      "*Miliki teman yang bisa dipercaya.* Selalu berpergian bersama teman atau kelompok yang bisa dipercaya dan yang dapat membantu Anda dalam situasi yang tidak aman.",
      "*Laporkan kejadian kekerasan seksual.* Jangan ragu untuk melapor jika Anda menjadi korban kekerasan seksual. Berbicaralah dengan seseorang yang bisa dipercaya, seperti keluarga atau teman, atau laporkan kejadian tersebut ke polisi atau lembaga terkait.",
    ];

    message.react('👍');
    message.reply(`Berikut adalah beberapa saran dan tips yang dapat membantu Anda menghindari kekerasan seksual:\n\n${tipsList.map((option, index) => `${index + 1}. ${option}`).join("\n\n")}\n\nDapatkan informasi mengenai PPKS melalui website kami: https://ppks-web.vercel.app/`);
  } else if (body.startsWith('4')) { // FAQ seputar kekerasan seksual.
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const faqList = [
      "Apa itu kekerasan seksual?",
      "Apa saja jenis-jenis pelecehan seksual?",
      "Apa dampak dari kekerasan seksual?",
    ];

    message.react('👍');
    message.reply(`Daftar FAQ seputar pelecehan seksual:\n\n${faqList.map((option, index) => `${alphabet[index]}. ${option}`).join("\n")}`);
    client.sendMessage(message.from, `Silahkan pilih daftar FAQ. Contoh "a."`);
  } else if (body.startsWith('a.')) {
    const databaseService = new DatabaseService();
    const topic = 'definisi';
    const answer = await databaseService.getAnswerByTopic(topic);

    message.react('👍');
    message.reply(answer);
  } else if (body.startsWith('b.')) {
    const databaseService = new DatabaseService();
    const topic = 'jenis';
    const answer = await databaseService.getAnswerByTopic(topic);

    message.react('👍');
    message.reply(answer);
  } else if (body.startsWith('c.')) {
    const databaseService = new DatabaseService();
    const topic = 'dampak';
    const answer = await databaseService.getAnswerByTopic(topic);

    message.react('👍');
    message.reply(answer);
  }
}
module.exports = handleMessage;
