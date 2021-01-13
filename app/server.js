const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
var favicon = require('serve-favicon');

dotenv.config();

const port = process.env["REACT_APP_EXPRESS_PORT"];
const buildFolder = './build';
const { REACT_APP_AF_BACKEND_URL, REACT_APP_STRIPE_PUBLISHABLE_KEY, REACT_APP_PLAID_CLIENT_ID, REACT_APP_PLAID_SECRET, REACT_APP_PLAID_PUBLIC_KEY } = process.env;

// treat the index.html as a template and substitute the value
// at runtime
// app.use('/favicon.ico', express.static('images/favicon.ico'));
app.set('views', path.join(__dirname, buildFolder));
app.engine('html', require('ejs').renderFile);
app.use(
  '/static',
  express.static(path.join(__dirname, `${buildFolder}/static`)),
);

app.get('/', function(req, res) {
  res.render('index.html', { REACT_APP_AF_BACKEND_URL, REACT_APP_STRIPE_PUBLISHABLE_KEY, REACT_APP_PLAID_CLIENT_ID, REACT_APP_PLAID_SECRET, REACT_APP_PLAID_PUBLIC_KEY });
});
app.listen(port, () => console.log(`Affordable frontend app listening on port ${port}!`));