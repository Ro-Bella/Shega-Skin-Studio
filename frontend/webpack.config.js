module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  // ... ሌሎች የ webpack ቅንብሮች
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // .js ወይም .jsx ላይ እንዲሰራ
        exclude: /node_modules/, // የ node_modules ፎልደርን እንዳይነካ
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/, // .css ፋይሎችን ለመያዝ
        use: ['style-loader', 'css-loader'], // style-loader እና css-loaderን ተጠቀም
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ]
  }
  // ...
};
