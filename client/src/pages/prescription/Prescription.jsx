<<<<<<< HEAD
import React, { useState } from "react";
import { PlusCircle, Trash2, FileText } from "lucide-react";
import styles from "./Prescription.module.css";
=======
import  { useState } from 'react';
import { PlusCircle, Trash2, FileText } from 'lucide-react';
import styles from './Prescription.module.css';
>>>>>>> 3b4e6e65681484947bad7f28da560d117db320bb

const Prescriptions = () => {
  const [medications, setMedications] = useState([
    { medicine: "", dosage: "", duration: "" },
  ]);

  const [formData, setFormData] = useState({
<<<<<<< HEAD
    patient: "",
    doctor: "",
    remarks: "",
=======
    patient: '',
    doctor: ''
>>>>>>> 3b4e6e65681484947bad7f28da560d117db320bb
  });

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { medicine: "", dosage: "", duration: "" },
    ]);
  };

  const handleRemoveMedication = (index) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = medications.map((medication, i) => {
      if (i === index) {
        return { ...medication, [field]: value };
      }
      return medication;
    });
    setMedications(newMedications);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ ...formData, medications });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <FileText className={styles.headerIcon} size={32} />
          <h1>New Prescription</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.medicationsSection}>
            <h2>Medications</h2>
            {medications.map((medication, index) => (
              <div key={index} className={styles.medicationRow}>
                <div className={styles.medicationInputs}>
                  <input
                    type="text"
                    value={medication.medicine}
                    onChange={(e) =>
                      handleMedicationChange(index, "medicine", e.target.value)
                    }
                    placeholder="Medicine name"
                    required
                  />
                  <input
                    type="text"
                    value={medication.dosage}
                    onChange={(e) =>
                      handleMedicationChange(index, "dosage", e.target.value)
                    }
                    placeholder="Dosage"
                    required
                  />
                  <input
                    type="text"
                    value={medication.duration}
                    onChange={(e) =>
                      handleMedicationChange(index, "duration", e.target.value)
                    }
                    placeholder="Duration"
                    required
                  />
                </div>
                {medications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(index)}
                    className={styles.removeButton}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddMedication}
              className={styles.addButton}
            >
              <PlusCircle size={18} />
              Add Medication
            </button>
          </div>

          <div className={styles.remarksSection}>
            <label htmlFor="remarks"></label>
            <textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              placeholder="Add any additional notes or remarks"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Create Prescription
          </button>
        </form>
      </div>
    </div>
  );
};

export default Prescriptions;
