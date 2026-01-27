const notFound = (req, res, next) => { // 404 ስህተት ለመከላከል
  const error = new Error(`Not Found - ${req.originalUrl}`); // የማይገኝ ስህተት መልእክት መፍጠር
  res.status(404); // 404 ማለት ነው
  next(error); // ወደ ቀጣይ ሚድልዌር ማስተላለፍ
};

const errorHandler = (err, req, res) => { // አጠቃላይ ስህተት ለመከላከል
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // 200 ከሆነ 500 ለመሆን ማድረግ
  res.status(statusCode); // ስህተት ሁኔታ መደበያ
  res.json({ // ስህተት መልእክት እንዲመልስ
    message: err.message,   // የስህተት መልእክት
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // በምርት ሁኔታ የስታክ መረጃ አይታይም
  });
};

module.exports = { notFound, errorHandler }; // ሌሎች ፋይሎች ውስጥ ለመጠቀም ማስተናገድ