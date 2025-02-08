import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClipboardList, User, User as UserMd, Calendar, Plus, Trash2, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import styles from './MedicalPrescription.module.css';

const MedicalPrescription = () => {
  const { storeId } = useParams();
  const [medicineStatus, setMedicineStatus] = useState([
    { medicine: "Paracetamol 500mg", available: true, price: 5.99 },
    { medicine: "Amoxicillin 250mg", available: false, price: 12.99 },
    // Add more medicines as needed
  ]);

  const prescription = {
    patient: { name: "John Doe", _id: "123" },
    doctor: { name: "Dr. Smith", _id: "456" },
    issuedAt: new Date(),
    medications: [
      { medicine: "Paracetamol 500mg", dosage: "1-0-1", duration: "5 days" },
      { medicine: "Amoxicillin 250mg", dosage: "1-1-1", duration: "7 days" },
    ],
    remarks: "Take medicines after meals"
  };

  const totalAmount = medicineStatus
    .filter(m => m.available)
    .reduce((sum, m) => sum + m.price, 0);

  const handlePayment = () => {
    // Implement payment gateway integration
    alert("Redirecting to payment gateway...");
  };

  return (
    <div className={styles.container}>
      <div className={styles.prescriptionCard}>
        <div className={styles.header}>
          <ClipboardList className="w-8 h-8 text-[#6dc7d1]" />
          <h1>Prescription Details</h1>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <User className="w-5 h-5 text-[#6dc7d1]" />
            <div>
              <h3>Patient</h3>
              <p>{prescription.patient.name}</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <UserMd className="w-5 h-5 text-[#6dc7d1]" />
            <div>
              <h3>Doctor</h3>
              <p>{prescription.doctor.name}</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Calendar className="w-5 h-5 text-[#6dc7d1]" />
            <div>
              <h3>Issue Date</h3>
              <p>{prescription.issuedAt.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className={styles.medicationsSection}>
          <h2>Prescribed Medications</h2>
          <div className={styles.medicationsList}>
            {prescription.medications.map((med, index) => (
              <div key={index} className={styles.medicationItem}>
                <div className={styles.medicationInfo}>
                  <h3>{med.medicine}</h3>
                  <p>Dosage: {med.dosage}</p>
                  <p>Duration: {med.duration}</p>
                </div>
                <div className={styles.medicationStatus}>
                  {medicineStatus.find(m => m.medicine === med.medicine)?.available ? (
                    <div className={styles.available}>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Available</span>
                    </div>
                  ) : (
                    <div className={styles.unavailable}>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {prescription.remarks && (
          <div className={styles.remarksSection}>
            <h2>Remarks</h2>
            <p>{prescription.remarks}</p>
          </div>
        )}

        <div className={styles.totalSection}>
          <h2>Total Amount</h2>
          <p className={styles.amount}>${totalAmount.toFixed(2)}</p>
        </div>

        <button 
          onClick={handlePayment}
          className={styles.paymentButton}
          disabled={totalAmount === 0}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default MedicalPrescription;