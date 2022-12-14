import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "REGISTER" actions
function* registerUser(action) {
  try {
    // clear any existing error on the registration page
    yield put({ type: 'CLEAR_REGISTRATION_ERROR' });

    // passes the username and password from the payload to the server
    yield axios.post('/api/user/register', action.payload);

    // automatically log a user in after registration
    if (action.payload.is_approved === false) {
      console.log("they can't login yet");
      yield put({ type: 'LOGIN_FAILED_USER_NOT_APPROVED' });
      // with this statement, user is registered a step before, but will not be logged in
      // user is sent back to login screen 
    }
    else {
      yield put({ type: 'LOGIN', payload: { username: action.payload.credentials.username, password: action.payload.credentials.password}});

    // set to 'login' mode so they see the login screen
    // after registration or after they log out
    yield put({ type: 'SET_TO_LOGIN_MODE' });
    }
    
  } catch (error) {
    console.log('Error with user registration:', error);
    yield put({ type: 'REGISTRATION_FAILED' });
  }
}

function* fetchInstitutions() {
  try{
    let response = yield axios.get('/api/user/institutions')
    yield put({type: 'STORE_INSTITUTIONS', payload: response.data})
  }
  catch {
    console.log('REGISTRATION SAGA: error in retrieving institutions');
  }
}

function* registrationSaga() {
  yield takeLatest('REGISTER', registerUser);
  yield takeEvery('FETCH_INSTITUTIONS_FOR_REGISTRATION', fetchInstitutions);
}

export default registrationSaga;
