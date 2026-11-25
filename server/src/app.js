const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const registerEventHandlers = require('./events/handlers');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

registerEventHandlers();

app.use(helmet());
app.use(cors({ origin: config.clientUrl }));
app.use(express.json());
if (config.env !== 'test') app.use(morgan('dev'));

app.use('/api', require('./routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
