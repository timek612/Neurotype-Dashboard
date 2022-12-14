const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const patientRouter = require('./routes/patient.router');
const institutionsRouter = require('./routes/institutions.router');
const dataRouter = require('./routes/data.router')
const selectedUserRouter = require('./routes/selectedUser.router');
const manageAccountsRouter = require('./routes/manage_accounts.router');
const approveUsersRouter = require('./routes/approve_users.router');
const researcherRouter = require('./routes/researcher.router');
const moditRouter = require('./routes/modit.router');


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/patient', patientRouter);
app.use('/api/institutions', institutionsRouter);
app.use('/api/data', dataRouter);
app.use('/api/selectedUser', selectedUserRouter);
app.use('/api/manageAccounts', manageAccountsRouter);
app.use('/api/approveUsers', approveUsersRouter);
app.use('/api/researcher', researcherRouter);
app.use('/api/modit', moditRouter)

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
