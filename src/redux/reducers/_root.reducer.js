import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import institution from './institution.reducer';
import patients from './patients.reducer';
import patientData from './patient_data.reducer'
import selectedUser from './selectedUser.reducer';
import institutions from './institution.reducer';
import activeInstitution from './activeInstitution.reducer';
import usersToManage from './manage_users.reducer.js';
import researcher from './researcher.reducer'



// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  institution,
  patients,
  patientData,
  institutions,
  activeInstitution,
  selectedUser,
  usersToManage,
  researcher,
});

export default rootReducer;
