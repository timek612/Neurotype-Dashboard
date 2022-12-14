import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import csvDownload from 'json-to-csv-export'
import './ResearcherTeamView.css'
import PieChart1 from '../PatientDetailCharts/PatientDetailRecentChart'
import PieChart2 from '../PatientDetailCharts/PatientDetailAverageChart'

function ResearcherTeamView() {
  const dispatch = useDispatch()

  const params = useParams()
  // for use of ID's in the url
  const patients = useSelector((store) => store.patients)
  // all patients for a certain clinician 
  const processedData = useSelector((store) => store.patientData.recentProcessedData)
  // patients most recent session data
  let recentSessionData;
  let averageSessionData;
  const averagePatientData = useSelector((store) => store.patientData.averagePatientProcessedData)
  // patient average data
  const patientAllSessionData = useSelector((store) => store.patientData.allPatientSessions)
  // all this patients sessions

  const [patientId, setPatientId] = useState(' ')

  if (patientAllSessionData) {
    for (let session of patientAllSessionData) {
      session = {
        id: session.session_id,
        modit_id: session.modit_id,
        drugs: session.proportionOfGazeTimeOnDrugs,
        noDrugs: session.proportionOfGazeTimeOnNonDrugs,
        back: session.proportionOfGazeTimeOnBack
      }
      patientAllSessionData.session = session
    }
  }
  // this if statement runs when patientAllSessionData exists in this component
  // it was meant to change the key: values of each object in this array, but I couldn't get it to work
  // its strictly for the export of the patient data, to make it more clean

  if (processedData) {//if statement to set create the object recentSessionData once processed data exists 
    recentSessionData = {
      id: processedData.session_id,
      modit_id: processedData.modit_id,
      drugs: processedData.proportionOfGazeTimeOnDrugs * 100,
      nonDugs: processedData.proportionOfGazeTimeOnNonDrugs * 100,
      back: processedData.proportionOfGazeTimeOnBack * 100
    }
  }

  if (averagePatientData && processedData) {
       // if averagePatientData and processedData exist in this component, averageSessionData object is created
    // this is purely for export 
    averageSessionData = {
      id: processedData.modit_id,
      drugs: averagePatientData.drugs * 100,
      noDrugs: Math.round(averagePatientData.noDrugs * 100),
      back: averagePatientData.back * 100
    }
  }

  useEffect(() => {
    dispatch({
      type: 'FETCH_TEAM_PATIENTS',
      payload: params.id,
    })
  }, [])

  const dataToConvert = {
    data: patientAllSessionData,
    filename: 'Patient sessions',
    delimiter: ',',
    headers: [
      'Session ID',
      'Modit ID',
      '% time on drugs',
      '% time on controlled',
      '% time on neither',

    ],
  }
  //export for recent session data

  const dataToConvert2 = {
    data: [averageSessionData],
    filename: 'Patient average data',
    delimiter: ',',
    headers: [
      'Modit ID',
      '% time on drugs',
      '% time on controlled',
      '% time on neither',
    ]
  }
  //export for average session data

  const getPatientData = () => {
    event.preventDefault()
    dispatch({
      type: 'FETCH_PATIENT_ALL_DATA',
      payload: patientId,
    })
  }

  //this function sends the id of the selected user to be deleted to the deactivatePatient() function in the patient.saga file. It then calls getPatientData() which will clear the display until a new patient is selected.
  const deletePatient = () => {
    if (
      confirm(
        "This will render patient's data inaccessible. Contact an admin to restore.",
      )
    ) {
      dispatch({
        type: 'DELETE_PATIENT',
        payload: processedData.id,
      })
      getPatientData()
    } else {
      return
    }
  }

  const exportJsonData = () => {
    csvDownload(dataToConvert)
    csvDownload(dataToConvert2)
  }
  // the function that exports the data. imported at the top of this component

  return (
    <div className="flex flex-wrap justify-center">
      <div className="basis-1/2 flex justify-center">
        <select
          onChange={(event) => setPatientId(event.target.value)}
          name="patient"
          id="patientSelect"
          className="text-center w-auto h-auto m-2 border-gray-900 rounded-lg shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        >
          <option value="initial">Select A Patient</option>

          {patients.map((patient) => {
            // loops over all the institutions and displays them as options
            if (patient.is_active === true) {
              return (
                <option key={patient.id} value={patient.modit_id}>
                  {patient.first_name} {patient.last_name}
                </option>
              )
            }
          })}
        </select>
        <button
          className="m-2 rounded-lg bg-gray-500 text-white text-md leading-normal uppercase shadow-md hover:bg-gray-550 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-650 active:shadow-lg transition duration-150 ease-in-out p-2 w-auto h-auto"
          onClick={getPatientData}
        >
          Get Data
        </button>
      </div>

      <div className="basis-1/2 flex justify-center">
        <button
          className="m-2 rounded-lg bg-gray-500 text-white text-md leading-normal uppercase shadow-md hover:bg-gray-550 hover:shadow-lg focus:bg-gray-550 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-650 active:shadow-lg transition duration-150 ease-in-out p-2 w-auto h-auto"
          onClick={deletePatient}
        >
          Delete Patient
        </button>
      </div>
      <div className=" basis-1/2">
        <div className="m-8 flex flex-col items-center block rounded-lg shadow-lg bg-gray-100 w-auto">
          {processedData && processedData.is_active === true && <PieChart1 />}
        </div>
      </div>

      <div className=" basis-1/2">
        <div className="m-8 flex flex-col items-center block rounded-lg shadow-lg bg-gray-100 w-auto">
          {processedData && processedData.is_active === true && <PieChart2 />}
        </div>

      </div>
      <div>
        <button
          className="m-2 rounded-lg bg-gray-500 text-white text-md leading-normal uppercase shadow-md hover:bg-gray-550 hover:shadow-lg focus:bg-gray-550 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-650 active:shadow-lg transition duration-150 ease-in-out p-2 w-auto h-auto"
          onClick={() => exportJsonData()}
        >
          Export
        </button>
      </div>

    </div>
  )
}

export default ResearcherTeamView
